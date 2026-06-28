// ============================================
// SCRIPT KASIR POS - VUE.JS
// ============================================

const { createApp, ref, computed } = Vue;

const app = createApp({
    setup() {
        // ============================================
        // DATA USER (dari akun.js / localStorage)
        // ============================================
        const userData = ref({
            nama: 'Admin POS',
            username: 'admin',
            role: 'Admin',
            shift: 'Shift 1 (09:00-15:00)'
        });

        // Coba ambil dari localStorage (jika ada)
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            try {
                userData.value = JSON.parse(savedUser);
            } catch (e) {
                console.log('Gagal load user data');
            }
        }

        // ============================================
        // STATE
        // ============================================
        const navOpen = ref(false);
        const cart = ref([]);
        const customerName = ref('');
        const selectedMeja = ref('');
        const mejaPopupOpen = ref(false);
        const activeCategory = ref('makanan');
        const currentPage = ref('cart');
        const paymentMethod = ref('');
        const nominal = ref('');
        const transactionCounter = ref(1);

        // Categories
        const categories = ref([
            {
                id: 'makanan',
                name: 'Makanan',
                icon: 'fa-solid fa-bowl-food',
                activeClass: 'bg-orange-500 text-white ring-2 ring-orange-300 ring-offset-2',
                inactiveClass: 'bg-gray-200 text-gray-700 hover:bg-orange-100',
                priceClass: 'text-orange-600'
            },
            {
                id: 'minuman',
                name: 'Minuman',
                icon: 'fa-solid fa-glass-water',
                activeClass: 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-2',
                inactiveClass: 'bg-gray-200 text-gray-700 hover:bg-blue-100',
                priceClass: 'text-blue-600'
            },
            {
                id: 'snack',
                name: 'Snack',
                icon: 'fa-solid fa-cookie-bite',
                activeClass: 'bg-purple-500 text-white ring-2 ring-purple-300 ring-offset-2',
                inactiveClass: 'bg-gray-200 text-gray-700 hover:bg-purple-100',
                priceClass: 'text-purple-600'
            }
        ]);

        // Menu Data
        const menuData = ref([
            // Makanan
            { nama: 'Mie Kuah', harga: 20000, kategori: 'makanan', gambar: 'asset/img/mie kuah.jpg' },
            { nama: 'Sate', harga: 20000, kategori: 'makanan', gambar: 'asset/img/sate.jpg' },
            { nama: 'Nasi Ayam', harga: 22000, kategori: 'makanan', gambar: 'asset/img/nasi ayam.jpg' },
            { nama: 'Salted Egg Chicken Rice', harga: 22000, kategori: 'makanan', gambar: 'asset/img/salted egg.jpg' },
            { nama: 'Nasi Goreng', harga: 20000, kategori: 'makanan', gambar: 'asset/img/nasi goreng.jpg' },
            { nama: 'Laksa', harga: 23000, kategori: 'makanan', gambar: 'asset/img/laksa.jpg' },
            // Minuman
            { nama: 'Teh', harga: 4000, kategori: 'minuman', gambar: 'asset/img/teh.jpg' },
            { nama: 'Lemon Tea', harga: 5000, kategori: 'minuman', gambar: 'asset/img/lemon tea.jpg' },
            { nama: 'Jus Mangga', harga: 10000, kategori: 'minuman', gambar: 'asset/img/jus mangga.jpg' },
            { nama: 'Squash Lemon', harga: 15000, kategori: 'minuman', gambar: 'asset/img/squash lemon.jpg' },
            { nama: 'Kopi', harga: 20000, kategori: 'minuman', gambar: 'asset/img/coffe.jpg' },
            { nama: 'Es Cendol', harga: 20000, kategori: 'minuman', gambar: 'asset/img/es cendol.jpg' },
            // Snack
            { nama: 'Biskuit', harga: 20000, kategori: 'snack', gambar: 'asset/img/biskuit.jpg' },
            { nama: 'Donat', harga: 20000, kategori: 'snack', gambar: 'asset/img/donat.jpg' },
            { nama: 'Pancake', harga: 25000, kategori: 'snack', gambar: 'asset/img/pancaake.jpg' },
            { nama: 'French Fries', harga: 15000, kategori: 'snack', gambar: 'asset/img/french fries.jpg' },
            { nama: 'Pisang Goreng', harga: 20000, kategori: 'snack', gambar: 'asset/img/pisang goreng.jpg' },
            { nama: 'Roti Strawberry', harga: 22000, kategori: 'snack', gambar: 'asset/img/roti strawberry.jpg' }
        ]);

        // ============================================
        // COMPUTED
        // ============================================
        const transactionId = computed(() => {
            return `TRX${String(transactionCounter.value).padStart(3, '0')}`;
        });

        const tanggal = computed(() => {
            const now = new Date();
            return now.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        });

        const totalBelanja = computed(() => {
            return cart.value.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        });

        const kembalian = computed(() => {
            if (paymentMethod.value !== 'cash') return 'Rp 0';
            const total = totalBelanja.value;
            const bayar = parseInt(nominal.value.replace(/[^0-9]/g, '')) || 0;
            const kembali = bayar - total;
            if (kembali < 0) return 'Rp 0 (Kurang)';
            return `Rp ${kembali.toLocaleString('id-ID')}`;
        });

        const hitungKembalianNota = computed(() => {
            const total = totalBelanja.value;
            const bayar = parseInt(nominal.value.replace(/[^0-9]/g, '')) || 0;
            return bayar - total;
        });

        // ============================================
        // FORMAT HARGA
        // ============================================
        function formatHarga(value) {
            if (value === undefined || value === null) return 'Rp0';
            return `Rp${value.toLocaleString('id-ID')}`;
        }

        // ============================================
        // METHODS
        // ============================================
        function toggleNav() {
            navOpen.value = !navOpen.value;
        }

        function getMenuByCategory(kategori) {
            return menuData.value.filter(item => item.kategori === kategori);
        }

        function tambahKeranjang(item) {
            const existing = cart.value.find(i => i.nama === item.nama);
            if (existing) {
                existing.qty++;
            } else {
                cart.value.push({
                    nama: item.nama,
                    harga: item.harga,
                    qty: 1,
                    gambar: item.gambar
                });
            }
        }

        function hapusItem(index) {
            cart.value.splice(index, 1);
        }

        function toggleMejaPopup() {
            mejaPopupOpen.value = !mejaPopupOpen.value;
        }

        function pilihMeja(meja) {
            selectedMeja.value = meja;
            mejaPopupOpen.value = false;
        }

        function showPayment() {
            if (cart.value.length === 0) {
                alert('Keranjang masih kosong!');
                return;
            }
            if (!customerName.value.trim()) {
                alert('Silakan isi nama customer terlebih dahulu!');
                return;
            }
            if (!selectedMeja.value) {
                alert('Silakan pilih nomor meja terlebih dahulu!');
                return;
            }
            currentPage.value = 'payment';
        }

        function changePayment() {
            nominal.value = '';
        }

        function formatHargaNominal() {
            let value = nominal.value.replace(/[^0-9]/g, '');
            if (value) {
                nominal.value = 'Rp' + parseInt(value).toLocaleString('id-ID');
            } else {
                nominal.value = '';
            }
        }

        function confirmPayment() {
            if (!paymentMethod.value) {
                alert('Pilih metode pembayaran!');
                return;
            }

            const bayar = parseInt(nominal.value.replace(/[^0-9]/g, '')) || 0;
            if (bayar === 0) {
                alert('Masukkan nominal pembayaran!');
                return;
            }

            if (paymentMethod.value === 'cash' && bayar < totalBelanja.value) {
                alert('Nominal pembayaran kurang dari total tagihan!');
                return;
            }

            transactionCounter.value++;
            currentPage.value = 'nota';
        }

        function transaksiBaru() {
            cart.value = [];
            customerName.value = '';
            selectedMeja.value = '';
            paymentMethod.value = '';
            nominal.value = '';
            currentPage.value = 'cart';
        }

        function cetakNota() {
            // ✅ Menampilkan nama kasir/admin di nota
            const notaHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Nota Pembayaran</title>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; max-width: 320px; margin: auto; }
                        .nota { border: 1px dashed #999; padding: 15px; }
                        h2 { text-align: center; margin: 0; font-size: 18px; }
                        .sub { text-align: center; font-size: 11px; color: #666; }
                        .divider { border-top: 1px dashed #999; margin: 8px 0; }
                        .row { display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; }
                        .label { color: #666; }
                        .total { font-size: 16px; font-weight: bold; }
                        .footer { text-align: center; font-size: 11px; color: #888; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="nota">
                        <h2>POS</h2>
                        <p class="sub">Rumah Makan Enak</p>
                        <p class="sub">Jl. Makan Enak No. 123</p>
                        <p class="sub">Telp: +62 453-125-345</p>
                        <div class="divider"></div>
                        <div class="row"><span class="label">ID</span><span>${transactionId.value}</span></div>
                        <div class="row"><span class="label">Tanggal</span><span>${tanggal.value}</span></div>
                        <div class="row"><span class="label">Customer</span><span>${customerName.value || '-'}</span></div>
                        <div class="row"><span class="label">Meja</span><span>${selectedMeja.value || '-'}</span></div>
                        <div class="row"><span class="label">Kasir</span><span>${userData.value.nama}</span></div>
                        <div class="divider"></div>
                        ${cart.value.map(item => `
                            <div class="row">
                                <span>${item.nama} x${item.qty}</span>
                                <span>${formatHarga(item.harga * item.qty)}</span>
                            </div>
                        `).join('')}
                        <div class="divider"></div>
                        <div class="row total"><span>TOTAL</span><span>${formatHarga(totalBelanja.value)}</span></div>
                        ${paymentMethod.value === 'cash' ? `
                            <div class="row"><span class="label">Kembalian</span><span>${formatHarga(hitungKembalianNota.value)}</span></div>
                        ` : ''}
                        <div class="divider"></div>
                        <div class="footer">Metode: ${paymentMethod.value.toUpperCase()}</div>
                        <div class="footer">Terima kasih</div>
                        <div class="footer" style="font-size:10px;">Dicetak: ${new Date().toLocaleString('id-ID')}</div>
                    </div>
                    <script>
                        setTimeout(function() { window.print(); }, 500);
                    <\/script>
                </body>
                </html>
            `;

            const printWindow = window.open('', '_blank', 'width=400,height=600');
            if (!printWindow) {
                alert('Popup diblokir! Izinkan popup.');
                return;
            }
            printWindow.document.write(notaHTML);
            printWindow.document.close();
        }

        // ============================================
        // RETURN
        // ============================================
        return {
            // Data
            userData,
            cart,
            customerName,
            selectedMeja,
            mejaPopupOpen,
            activeCategory,
            currentPage,
            paymentMethod,
            nominal,
            transactionCounter,
            categories,
            menuData,
            navOpen,

            // Computed
            transactionId,
            tanggal,
            totalBelanja,
            kembalian,
            hitungKembalianNota,

            // Methods
            formatHarga,
            toggleNav,
            getMenuByCategory,
            tambahKeranjang,
            hapusItem,
            toggleMejaPopup,
            pilihMeja,
            showPayment,
            changePayment,
            formatHargaNominal,
            confirmPayment,
            transaksiBaru,
            cetakNota
        };
    }
});

app.mount('#app');

console.log('✅ Kasir POS (Vue.js) siap!');