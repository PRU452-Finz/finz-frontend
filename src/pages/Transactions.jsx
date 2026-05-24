import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { CATEGORIES } from '../data/dummyData';
import { CATEGORY_EMOJIS, CATEGORY_COLORS } from '../utils/constants';
import Card from '../components/Card';
import EditTransactionModal from '../components/EditTransactionModal';
import {
  MagnifyingGlass,
  Funnel,
  Trash,
  PencilSimple,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  Receipt,
  X,
} from '@phosphor-icons/react';

const PER_PAGE = 10;

export default function Transactions() {
  const { transactions, deleteTransaction, updateTransaction, loading, error } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (dateRange.from && new Date(t.date) < new Date(dateRange.from)) return false;
      if (dateRange.to && new Date(t.date) > new Date(dateRange.to)) return false;
      return true;
    });
  }, [transactions, searchQuery, selectedCategory, dateRange]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredTransactions]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = sortedTransactions.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );
  const startItem = (safePage - 1) * PER_PAGE + 1;
  const endItem = Math.min(safePage * PER_PAGE, sortedTransactions.length);

  const totalFiltered = filteredTransactions.reduce((sum, t) => sum + (t.nominal || t.amount || 0), 0);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      // Jika halaman saat ini jadi kosong setelah hapus, kembali ke halaman sebelumnya
      const newTotal = sortedTransactions.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / PER_PAGE));
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    } catch (err) {
      console.error('[Transactions] Gagal hapus:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || dateRange.from || dateRange.to;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ─── Loading State ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '14px', color: '#5a6d99' }}>Memuat transaksi...</p>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '16px', color: '#f87171' }}>⚠️ Gagal memuat data</p>
        <p style={{ fontSize: '13px', color: '#5a6d99' }}>{error}</p>
        <p style={{ fontSize: '12px', color: '#384770' }}>Pastikan backend berjalan di port 8000</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="txn-page-header">
        <div>
          <p className="page-breadcrumb">Dashboard / Transaksi</p>
          <h1 className="page-title">Transaksi</h1>
          <p style={{ fontSize: '13px', color: '#5a6d99', marginTop: '4px' }}>
            {filteredTransactions.length} transaksi • Total {formatCurrency(totalFiltered)}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
            background: showFilters ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 22, 41, 0.6)',
            color: showFilters ? '#34d399' : '#8b9cc4',
            border: showFilters ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(30, 42, 74, 0.7)',
          }}
        >
          <Funnel size={16} weight={showFilters ? 'fill' : 'regular'} />
          Filter
          {hasActiveFilters && (
            <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={{ marginBottom: '20px' }} className="animate-fade-in-up">
          <Card>
            <div className="filter-grid">
              <div style={{ position: 'relative' }}>
                <MagnifyingGlass size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99' }} />
                <input type="text" placeholder="Cari deskripsi..." value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="form-input" style={{ paddingLeft: '36px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <select value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="form-input form-select">
                  <option value="all">Semua Kategori</option>
                  {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                </select>
                <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <CalendarBlank size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99' }} />
                <input type="date" value={dateRange.from}
                  onChange={(e) => { setDateRange({ ...dateRange, from: e.target.value }); setCurrentPage(1); }}
                  className="form-input" style={{ paddingLeft: '36px', colorScheme: 'dark' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <CalendarBlank size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6d99' }} />
                <input type="date" value={dateRange.to}
                  onChange={(e) => { setDateRange({ ...dateRange, to: e.target.value }); setCurrentPage(1); }}
                  className="form-input" style={{ paddingLeft: '36px', colorScheme: 'dark' }} />
              </div>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{
                display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '6px 12px',
                fontSize: '12px', color: '#5a6d99', background: 'none', border: 'none', cursor: 'pointer',
              }}>
                <X size={12} /> Hapus semua filter
              </button>
            )}
          </Card>
        </div>
      )}

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedTransactions.length === 0 ? (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
              <Receipt size={48} color="#1e2a4a" weight="duotone" style={{ marginBottom: '14px' }} />
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#8b9cc4' }}>Belum ada transaksi</p>
              <p style={{ fontSize: '12px', color: '#5a6d99', marginTop: '6px' }}>
                {hasActiveFilters ? 'Coba ubah filter pencarian' : 'Tambahkan transaksi pertamamu'}
              </p>
            </div>
          </Card>
        ) : (
          paginatedTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`glass-card card-pad txn-card animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
              style={{
                opacity: deletingId === transaction.id ? 0 : 0,
                transform: deletingId === transaction.id ? 'scale(0.95)' : undefined,
                transition: deletingId === transaction.id ? 'all 0.3s' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                  background: `${CATEGORY_COLORS[transaction.category]}12`,
                }}>
                  {CATEGORY_EMOJIS[transaction.category]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3, marginBottom: '4px' }}>
                    {transaction.description}
                  </p>
                  <div className="txn-card-meta">
                    <span style={{
                      padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                      textTransform: 'capitalize',
                      background: `${CATEGORY_COLORS[transaction.category]}12`,
                      color: CATEGORY_COLORS[transaction.category],
                    }}>
                      {transaction.category}
                    </span>
                    <span style={{ color: '#384770' }}>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    <span className="txn-card-method" style={{ color: '#384770' }}>•</span>
                    <span className="txn-card-method" style={{ textTransform: 'capitalize' }}>{transaction.payment_method}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <p className="txn-card-amount" style={{ color: transaction.transaction_type === 'income' ? '#10b981' : '#f87171', fontSize: '15px', fontWeight: 'bold' }}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}{formatCurrency(transaction.nominal || transaction.amount)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => setEditingTransaction(transaction)} style={{
                      padding: '6px', borderRadius: '8px', color: '#10b981',
                      background: 'rgba(16, 185, 129, 0.1)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} title="Edit">
                      <PencilSimple size={14} weight="bold" />
                    </button>
                    <button onClick={() => handleDelete(transaction.id)} style={{
                      padding: '6px', borderRadius: '8px', color: '#f87171',
                      background: 'rgba(248, 113, 113, 0.1)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} title="Hapus">
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ═══════════ Pagination ═══════════ */}
      {sortedTransactions.length > PER_PAGE && (
        <div className="pagination-bar">
          {/* Info text */}
          <p style={{ fontSize: '12px', color: '#5a6d99' }}>
            Menampilkan {startItem}–{endItem} dari {sortedTransactions.length}
          </p>

          {/* Page controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="page-btn"
              style={{ opacity: safePage === 1 ? 0.3 : 1 }}
            >
              <CaretLeft size={14} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-btn ${page === safePage ? 'page-btn-active' : ''}`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="page-btn"
              style={{ opacity: safePage === totalPages ? 0.3 : 1 }}
            >
              <CaretRight size={14} />
            </button>
          </div>
        </div>
      )}
      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={updateTransaction}
      />
    </div>
  );
}
