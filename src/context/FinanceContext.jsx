import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  dummyTransactions,
  dummyPrediction,
  dummyFinancialScore,
  dummyRecommendations,
} from '../data/dummyData';

// ═══════════ Context ═══════════
const FinanceContext = createContext(null);

// ═══════════ Action Types ═══════════
const ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_LOADING: 'SET_LOADING',
};

// ═══════════ Reducer ═══════════
function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
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
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ═══════════ Initial State ═══════════
const initialState = {
  transactions: dummyTransactions,
  prediction: dummyPrediction,
  financialScore: dummyFinancialScore,
  recommendations: dummyRecommendations,
  loading: false,
};

// ═══════════ Provider ═══════════
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
    };
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: newTransaction });
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((transaction) => {
    dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  }, []);

  // ═══════════ Computed / Summary Data ═══════════
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTransactions = state.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpending = thisMonthTransactions.reduce((sum, t) => sum + t.nominal, 0);

    // Category breakdown
    const categoryBreakdown = thisMonthTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.nominal;
      return acc;
    }, {});

    // Daily breakdown
    const dailyBreakdown = thisMonthTransactions.reduce((acc, t) => {
      const dateKey = t.date;
      acc[dateKey] = (acc[dateKey] || 0) + t.nominal;
      return acc;
    }, {});

    // Monthly breakdown (all months)
    const monthlyBreakdown = state.transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + t.nominal;
      return acc;
    }, {});

    return {
      totalSpending,
      transactionCount: thisMonthTransactions.length,
      categoryBreakdown,
      dailyBreakdown,
      monthlyBreakdown,
      avgDaily: thisMonthTransactions.length > 0
        ? totalSpending / Object.keys(dailyBreakdown).length
        : 0,
    };
  }, [state.transactions]);

  // ═══════════ Dummy AI: Predict Category ═══════════
  const predictCategory = useCallback((description) => {
    const desc = description.toLowerCase();
    if (desc.includes('makan') || desc.includes('kopi') || desc.includes('resto') || desc.includes('bakso') || desc.includes('sushi') || desc.includes('dinner') || desc.includes('sarapan') || desc.includes('kantin'))
      return 'makanan';
    if (desc.includes('gojek') || desc.includes('grab') || desc.includes('taxi') || desc.includes('bensin') || desc.includes('parkir') || desc.includes('stasiun'))
      return 'transport';
    if (desc.includes('nonton') || desc.includes('game') || desc.includes('spotify') || desc.includes('netflix') || desc.includes('bioskop'))
      return 'hiburan';
    if (desc.includes('beli') || desc.includes('baju') || desc.includes('sepatu') || desc.includes('tokopedia') || desc.includes('shopee') || desc.includes('skincare'))
      return 'belanja';
    if (desc.includes('listrik') || desc.includes('air') || desc.includes('internet') || desc.includes('kuota') || desc.includes('bayar'))
      return 'tagihan';
    if (desc.includes('buku') || desc.includes('kursus') || desc.includes('kuliah') || desc.includes('seminar'))
      return 'pendidikan';
    if (desc.includes('obat') || desc.includes('dokter') || desc.includes('gym') || desc.includes('vitamin'))
      return 'kesehatan';
    return 'lainnya';
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      summary,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      predictCategory,
    }),
    [state, summary, addTransaction, updateTransaction, deleteTransaction, predictCategory]
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
