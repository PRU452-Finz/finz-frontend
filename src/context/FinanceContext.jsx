import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  transactionAPI,
  dashboardAPI,
  predictionAPI,
  recommendationAPI,
} from '../services/api';

// ═══════════ Context ═══════════
const FinanceContext = createContext(null);

// ═══════════ Action Types ═══════════
const ACTIONS = {
  SET_TRANSACTIONS:    'SET_TRANSACTIONS',
  ADD_TRANSACTION:     'ADD_TRANSACTION',
  UPDATE_TRANSACTION:  'UPDATE_TRANSACTION',
  DELETE_TRANSACTION:  'DELETE_TRANSACTION',
  SET_SUMMARY:         'SET_SUMMARY',
  SET_PREDICTION:      'SET_PREDICTION',
  SET_FINANCIAL_SCORE: 'SET_FINANCIAL_SCORE',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_LOADING:         'SET_LOADING',
  SET_ERROR:           'SET_ERROR',
};

// ═══════════ Reducer ═══════════
function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case ACTIONS.SET_SUMMARY:
      return { ...state, summary: action.payload };
    case ACTIONS.SET_PREDICTION:
      return { ...state, prediction: action.payload };
    case ACTIONS.SET_FINANCIAL_SCORE:
      return { ...state, financialScore: action.payload };
    case ACTIONS.SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// ═══════════ Initial State ═══════════
const initialState = {
  transactions:   [],
  summary:        null,
  prediction:     null,
  financialScore: null,
  recommendations: [],
  loading:        true,
  error:          null,
};

// ═══════════ Mapping Helpers (BE snake_case → FE camelCase) ═══════════

/**
 * Map backend dashboard response ke format yang digunakan UI
 * BE: total_spending, category_breakdown, daily_breakdown, monthly_breakdown
 * FE: totalSpending, categoryBreakdown, dailyBreakdown, monthlyBreakdown
 */
const mapSummary = (data) => ({
  totalSpending:     data.total_spending,
  transactionCount:  data.transaction_count,
  avgDaily:          data.avg_daily,
  categoryBreakdown: data.category_breakdown,   // { makanan: 311000, ... }
  dailyBreakdown:    data.daily_breakdown,       // { "2026-04-01": 50000, ... }
  monthlyBreakdown:  data.monthly_breakdown,     // { "2026-04": 2360000, ... }
  period:            data.period,
});

/**
 * Map backend predict/balance response ke format yang digunakan UI
 * BE: predicted_balance (di root), detail.current_balance
 * FE: predicted_end_balance (root), current_balance (root)
 */
const mapPrediction = (data) => ({
  current_balance:       data.detail?.current_balance ?? data.current_balance ?? 0,
  predicted_end_balance: data.predicted_balance ?? 0,  // ← rename utama
  status:                data.status   || 'aman',
  message:               data.message  || '',
  spent_so_far:          data.detail?.spent_so_far   ?? 0,
  avg_per_day:           data.detail?.avg_per_day     ?? 0,
  days_remaining:        data.detail?.days_remaining  ?? 0,
});

/**
 * Map backend financial-score response ke format yang digunakan UI
 * BE: level ("Cukup Sehat"), breakdown = { saving_ratio: 53, ... }
 * FE: category (alias level), breakdown sama
 */
const mapFinancialScore = (data) => ({
  score:     data.score     ?? 0,
  level:     data.level     || '',
  category:  data.level     || '',   // alias untuk kompatibilitas
  breakdown: data.breakdown ?? {},
});

// ═══════════ Provider ═══════════
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();
  const userId = user?.id || 1;
  const userIncome = user?.monthly_income || 3_500_000;

  // ─── Fetch semua data saat pertama mount ─────────────────────────
  useEffect(() => {
    async function fetchAll() {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.SET_ERROR,   payload: null });

        // Semua fetch paralel agar lebih cepat
        const [txnResp, dashResp, scoreResp, recResp, predResp] = await Promise.all([
          transactionAPI.getAll({ user_id: userId }),
          dashboardAPI.getSummary(userId),
          recommendationAPI.getScore(userId),
          recommendationAPI.getAll(userId),
          predictionAPI.getBalance({ current_balance: userIncome, user_id: userId }),
        ]);

        dispatch({ type: ACTIONS.SET_TRANSACTIONS,    payload: txnResp.data   || [] });
        dispatch({ type: ACTIONS.SET_SUMMARY,         payload: mapSummary(dashResp.data) });
        dispatch({ type: ACTIONS.SET_FINANCIAL_SCORE, payload: mapFinancialScore(scoreResp.data) });
        dispatch({ type: ACTIONS.SET_RECOMMENDATIONS, payload: recResp.data   || [] });
        dispatch({ type: ACTIONS.SET_PREDICTION,      payload: mapPrediction(predResp.data) });

      } catch (err) {
        console.error('[FinanceContext] Gagal fetch data:', err);
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message || 'Gagal memuat data' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    }

    fetchAll();
  }, [userId, userIncome]);

  // ─── Helper: re-fetch dashboard & prediction setelah CRUD ────────
  const refreshSummaryAndPrediction = useCallback(async () => {
    try {
      const [dashResp, predResp] = await Promise.all([
        dashboardAPI.getSummary(userId),
        predictionAPI.getBalance({ current_balance: userIncome, user_id: userId }),
      ]);
      dispatch({ type: ACTIONS.SET_SUMMARY,    payload: mapSummary(dashResp.data) });
      dispatch({ type: ACTIONS.SET_PREDICTION, payload: mapPrediction(predResp.data) });
    } catch (err) {
      console.error('[FinanceContext] Gagal refresh summary:', err);
    }
  }, [userId, userIncome]);

  // ─── CRUD: Add ───────────────────────────────────────────────────
  const addTransaction = useCallback(async (formData) => {
    const resp = await transactionAPI.create({
      amount:           Number(formData.nominal ?? formData.amount),
      category:         formData.category,
      description:      formData.description || '',
      payment_method:   formData.payment_method || 'cash',
      date:             formData.date || new Date().toISOString().slice(0, 10),
      transaction_type: formData.transaction_type || 'expense',
      is_recurring:     formData.is_recurring || false,
      user_id:          userId,
    });

    const newTxn = resp.data;
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: newTxn });

    // Update chart & prediksi di background
    refreshSummaryAndPrediction();

    return newTxn;
  }, [userId, refreshSummaryAndPrediction]);

  // ─── CRUD: Update ────────────────────────────────────────────────
  const updateTransaction = useCallback(async (transaction) => {
    const resp = await transactionAPI.update(transaction.id, {
      amount:           Number(transaction.nominal ?? transaction.amount),
      category:         transaction.category,
      description:      transaction.description,
      payment_method:   transaction.payment_method,
      date:             transaction.date,
      transaction_type: transaction.transaction_type,
      is_recurring:     transaction.is_recurring,
    });

    const updated = resp.data;
    dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: updated });
    refreshSummaryAndPrediction();
    return updated;
  }, [refreshSummaryAndPrediction]);

  // ─── CRUD: Delete ────────────────────────────────────────────────
  const deleteTransaction = useCallback(async (id) => {
    await transactionAPI.delete(id);
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
    refreshSummaryAndPrediction();
  }, [refreshSummaryAndPrediction]);

  // ─── AI: Predict Category (async — panggil backend) ─────────────
  const predictCategory = useCallback(async (description) => {
    try {
      const resp = await predictionAPI.getCategory(description);
      return resp.data?.category || 'lainnya';
    } catch {
      // Fallback ke rule sederhana jika API gagal
      const desc = description.toLowerCase();
      if (desc.match(/makan|kopi|resto|bakso|warteg|sarapan|dinner/)) return 'makanan';
      if (desc.match(/gojek|grab|taxi|bensin|parkir|stasiun/))          return 'transport';
      if (desc.match(/nonton|game|spotify|netflix|bioskop/))             return 'hiburan';
      if (desc.match(/beli|baju|shopee|tokopedia|skincare/))             return 'belanja';
      if (desc.match(/listrik|air|internet|kuota|bayar/))                return 'tagihan';
      if (desc.match(/buku|kursus|kuliah|seminar/))                      return 'pendidikan';
      if (desc.match(/obat|dokter|gym|vitamin/))                         return 'kesehatan';
      return 'lainnya';
    }
  }, []);

  // ─── Expose value ────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      ...state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      predictCategory,
    }),
    [state, addTransaction, updateTransaction, deleteTransaction, predictCategory]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

// ═══════════ Hook ═══════════
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export default FinanceContext;
