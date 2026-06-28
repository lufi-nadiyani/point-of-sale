// ============================================
// LAPORAN POS - VUE.JS
// ============================================

const { createApp, ref, computed } = Vue;

const app = createApp({
    setup() {
        // ============================================
        // STATE
        // ============================================
        const navOpen = ref(false);
        const activeTab = ref('penjualan');
        const tglMulai = ref('');
        const tglSampai = ref('');
        const tglMulaiProduk = ref('');
        const tglSampaiProduk = ref('');
        const selectedShift = ref(1);
        const now = ref('');

        // Tabs (Tanpa Ikon)
        const tabs = ref([
            { id: 'penjualan', name: 'Laporan Penjualan' },
            { id: 'produk', name: 'Menu Terlaris' }
        ]);

        // ============================================
        // DATA TRANSAKSI
        // ============================================
        const transaksiData = ref([
            {
                id: 'TRX001',
                tanggal: '24/06/2026',
                customer: 'Budi',
                items: [
                    { menu: 'Nasi Goreng', qty: 2, harga: 22000 },
                    { menu: 'Es Teh', qty: 1, harga: 4000 }
                ],
                total: 48000,
                metode: 'Cash',
                metodeClass: 'bg-green-100 text-green-700',
                status: 'Selesai',
                statusClass: 'bg-green-100 text-green-700'
            },
            {
                id: 'TRX002',
                tanggal: '24/06/2026',
                customer: 'Siti',
                items: [
                    { menu: 'Mie Kuah', qty: 1, harga: 20000 },
                    { menu: 'Lemon Tea', qty: 1, harga: 5000 }
                ],
                total: 25000,
                metode: 'QRIS',
                metodeClass: 'bg-purple-100 text-purple-700',
                status: 'Selesai',
                statusClass: 'bg-green-100 text-green-700'
            },
            {
                id: 'TRX003',
                tanggal: '24/06/2026',
                customer: 'Andi',
                items: [
                    { menu: 'Sate', qty: 2, harga: 20000 },
                    { menu: 'Nasi Ayam', qty: 1, harga: 22000 }
                ],
                total: 62000,
                metode: 'Debit',
                metodeClass: 'bg-blue-100 text-blue-700',
                status: 'Selesai',
                statusClass: 'bg-green-100 text-green-700'
            }
        ]);

        // ============================================
        // COMPUTED - FILTER TRANSAKSI
        // ============================================
        const filteredTransaksi = computed(() => {
            let data = transaksiData.value;

            if (tglMulai.value && tglSampai.value) {
                const mulai = tglMulai.value.split('-').reverse().join('/');
                const sampai = tglSampai.value.split('-').reverse().join('/');
                data = data.filter(item => {
                    return item.tanggal >= mulai && item.tanggal <= sampai;
                });
            }

            // Hitung totalQty per transaksi
            data = data.map(item => ({
                ...item,
                totalQty: item.items.reduce((sum, i) => sum + i.qty, 0),
                totalFormatted: item.total.toLocaleString('id-ID')
            }));

            return data;
        });

        const totalPenjualan = computed(() => {
            let total = 0;
            filteredTransaksi.value.forEach(item => {
                total += item.total;
            });
            return total.toLocaleString('id-ID');
        });

        const totalTransaksi = computed(() => {
            return filteredTransaksi.value.length;
        });

        const rataTransaksi = computed(() => {
            if (totalTransaksi.value === 0) return '0';
            const total = parseInt(totalPenjualan.value.replace(/\./g, ''));
            return Math.round(total / totalTransaksi.value).toLocaleString('id-ID');
        });

        // ============================================
        // DATA PRODUK TERLARIS
        // ============================================
        const produkTerlarisData = ref([
            { id: 1, nama: 'Nasi Goreng', qty: 45, total: 990000 },
            { id: 2, nama: 'Sate', qty: 38, total: 760000 },
            { id: 3, nama: 'Mie Kuah', qty: 32, total: 640000 },
            { id: 4, nama: 'Nasi Ayam', qty: 28, total: 616000 },
            { id: 5, nama: 'Es Teh', qty: 25, total: 100000 }
        ]);

        // ============================================
        // FORMAT HARGA
        // ============================================
        function formatHarga(value) {
            return 'Rp' + value.toLocaleString('id-ID');
        }

        function formatTanggal(date) {
            if (!date) return '-';
            const parts = date.split('-');
            return parts[2] + '/' + parts[1] + '/' + parts[0];
        }

        // ============================================
        // METHODS
        // ============================================
        function toggleNav() {
            navOpen.value = !navOpen.value;
        }

        function filterData() {
            // Sudah otomatis via computed
        }

        function filterProduk() {
            // Simulasi filter
            console.log('Filter produk:', tglMulaiProduk.value, tglSampaiProduk.value);
        }

        function cetakLaporanPenjualan() {
            const printWindow = window.open('', '_blank', 'width=900,height=700');
            if (!printWindow) { alert('Popup diblokir!'); return; }

            const content = document.getElementById('printLaporanPenjualan');
            const clone = content.cloneNode(true);

            const header = clone.querySelector('.print-header');
            if (header) header.style.display = 'block';

            const footer = clone.querySelector('.print-footer');
            if (footer) footer.style.display = 'block';

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Laporan Penjualan</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 30px; background: white; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background: #1f2937; color: white; }
                        .bg-green-100 { background: #dcfce7; color: #166534; }
                        .bg-purple-100 { background: #f3e8ff; color: #6b21a8; }
                        .bg-blue-100 { background: #dbeafe; color: #1e40af; }
                        .bg-gray-50 { background: #f9fafb; }
                        .print-header { text-align: center; margin-bottom: 20px; }
                        .print-footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 10px; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .text-green-600 { color: #16a34a; }
                        .font-bold { font-weight: bold; }
                    </style>
                </head>
                <body>
                    ${clone.innerHTML}
                    <script>setTimeout(() => window.print(), 500);<\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        function cetakProdukTerlaris() {
            const printWindow = window.open('', '_blank', 'width=700,height=500');
            if (!printWindow) { alert('Popup diblokir!'); return; }

            const content = document.getElementById('printProdukTerlaris');
            const clone = content.cloneNode(true);

            let rows = '';
            produkTerlarisData.value.forEach((item, index) => {
                const rankClass = index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-200' : index === 2 ? 'bg-orange-100' : 'bg-gray-100';
                rows += `
                    <tr>
                        <td style="padding:8px;border:1px solid #ddd;text-align:center;">
                            <span style="padding:3px 10px;border-radius:20px;font-size:12px;background:${index === 0 ? '#fef3c7' : index === 1 ? '#e5e7eb' : index === 2 ? '#ffedd5' : '#f3f4f6'}">${index + 1}</span>
                        </td>
                        <td style="padding:8px;border:1px solid #ddd;">${item.nama}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.qty}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:right;">${formatHarga(item.total)}</td>
                    </tr>
                `;
            });

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Menu Terlaris</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 30px; background: white; }
                        h2 { text-align: center; color: #4f46e5; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background: #1f2937; color: white; }
                        .print-footer { margin-top: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <h2>LAPORAN MENU TERLARIS</h2>
                    <hr>
                    <table>
                        <thead>
                            <tr><th>Rank</th><th>Nama Menu</th><th>Total Terjual</th><th>Total Pendapatan</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div class="print-footer">Dicetak: ${now.value}</div>
                    <script>setTimeout(() => window.print(), 500);<\/script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }

        // ============================================
        // LIFECYCLE
        // ============================================
        const d = new Date();
        now.value = d.toLocaleString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        tglMulai.value = '2026-06-01';
        tglSampai.value = '2026-06-30';
        tglMulaiProduk.value = '2026-06-01';
        tglSampaiProduk.value = '2026-06-30';

        // ============================================
        // RETURN
        // ============================================
        return {
            navOpen,
            activeTab,
            tabs,
            tglMulai,
            tglSampai,
            tglMulaiProduk,
            tglSampaiProduk,
            now,
            transaksiData,
            filteredTransaksi,
            produkTerlarisData,
            totalPenjualan,
            totalTransaksi,
            rataTransaksi,
            formatHarga,
            formatTanggal,
            toggleNav,
            filterData,
            filterProduk,
            cetakLaporanPenjualan,
            cetakProdukTerlaris
        };
    }
});

app.mount('#app');