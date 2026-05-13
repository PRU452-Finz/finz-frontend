/**
 * AI Service (Mock)
 *
 * Placeholder service — returns mock data for AI features.
 * Replace with real API calls when AI backend is ready.
 */

export const predictBalance = async (userId) => {
  // Mock: simulate API delay
  await new Promise((r) => setTimeout(r, 300));
  return {
    current_balance: 3500000,
    predicted_end_balance: 1850000,
    spent_so_far: 2360000,
    avg_per_day: 180000,
    days_remaining: 17,
    status: 'warning',
    message: 'Pengeluaranmu cukup tinggi bulan ini. Kurangi belanja hiburan untuk menjaga saldo.',
  };
};

export const getRecommendations = async (userId) => {
  await new Promise((r) => setTimeout(r, 200));
  return [
    {
      id: 1,
      title: 'Kurangi Pengeluaran Makanan',
      description: 'Pengeluaran makananmu 35% dari total. Coba meal prep di rumah untuk hemat hingga Rp500.000/bulan.',
      type: 'warning',
      icon: '🍔',
    },
    {
      id: 2,
      title: 'Mulai Investasi Kecil',
      description: 'Kamu bisa mulai investasi reksadana mulai Rp100.000. Pertimbangkan untuk alokasi 10% penghasilan.',
      type: 'tip',
      icon: '📈',
    },
    {
      id: 3,
      title: 'Buat Dana Darurat',
      description: 'Siapkan dana darurat 3-6 bulan pengeluaran. Saat ini kamu baru memiliki 1.5 bulan.',
      type: 'important',
      icon: '🛡️',
    },
  ];
};

export const getFinancialScore = async (userId) => {
  await new Promise((r) => setTimeout(r, 250));
  return {
    score: 72,
    label: 'Cukup Baik',
    components: {
      saving_ratio: 65,
      spending_consistency: 80,
      category_diversity: 70,
      bill_payment: 80,
    },
  };
};
