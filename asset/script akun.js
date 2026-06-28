// ============================================
// AKUN POS - VUE.JS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    const { createApp, ref, computed } = Vue;

    const app = createApp({
        setup() {
            // ============================================
            // STATE
            // ============================================
            const navOpen = ref(false);
            const activeTab = ref('daftar');
            const modalTambahOpen = ref(false);

            // ============================================
            // USER DATA
            // ============================================
            const userData = ref({
                nama: 'Guest',
                username: '',
                role: '',
                shift: '',
                email: '',
                status: ''
            });

            try {
                const savedUser = localStorage.getItem('userData');
                if (savedUser) {
                    userData.value = JSON.parse(savedUser);
                } else {
                    window.location.href = 'login.html';
                }
            } catch (e) {
                window.location.href = 'login.html';
            }

            // ============================================
            // TABS
            // ============================================
            const tabs = ref([
                { id: 'daftar', name: 'Daftar Akun' },
                { id: 'closing', name: 'Closing Kasir' }
            ]);

            // ============================================
            // USERS (Database)
            // ============================================
            const users = ref([
                { id: 1, nama: 'Admin POS', username: 'admin', password: 'secret', role: 'Admin', shift: '-', status: 'Aktif' },
                { id: 2, nama: 'Andi Kasir', username: 'kasir1', password: 'secret', role: 'Kasir', shift: 'Shift 1 (09:00-15:00)', status: 'Aktif' },
                { id: 3, nama: 'Budi Kasir', username: 'kasir2', password: 'secret', role: 'Kasir', shift: 'Shift 2 (15:00-21:00)', status: 'Aktif' }
            ]);

            // ============================================
            // FORM TAMBAH
            // ============================================
            const formTambah = ref({
                nama: '',
                username: '',
                password: '',
                role: 'Kasir',
                shift: 'Shift 1 (09:00-15:00)'
            });

            // ============================================
            // CLOSING DATA (Per Metode Pembayaran)
            // ============================================
            const closingItems = ref([
                { metode: 'Cash', total: 350000 },
                { metode: 'QRIS', total: 200000 },
                { metode: 'Debit', total: 134000 }
            ]);

            // ============================================
            // COMPUTED - Total per Metode
            // ============================================
            const totalCash = computed(() => {
                const item = closingItems.value.find(i => i.metode === 'Cash');
                return item ? item.total : 0;
            });

            const totalQRIS = computed(() => {
                const item = closingItems.value.find(i => i.metode === 'QRIS');
                return item ? item.total : 0;
            });

            const totalDebit = computed(() => {
                const item = closingItems.value.find(i => i.metode === 'Debit');
                return item ? item.total : 0;
            });

            const totalPendapatan = computed(() => {
                return closingItems.value.reduce((sum, item) => sum + item.total, 0);
            });

            // ============================================
            // FORMAT HARGA
            // ============================================
            function formatHarga(value) {
                return 'Rp' + value.toLocaleString('id-ID');
            }

            // ============================================
            // TOGGLE NAV
            // ============================================
            function toggleNav() {
                navOpen.value = !navOpen.value;
            }

            // ============================================
            // MODAL TAMBAH
            // ============================================
            function openModalTambah() {
                formTambah.value = { nama: '', username: '', password: '', role: 'Kasir', shift: 'Shift 1 (09:00-15:00)' };
                modalTambahOpen.value = true;
            }

            function tambahAkun() {
                const { nama, username, password, role, shift } = formTambah.value;
                if (!nama || !username || !password) {
                    alert('Semua field harus diisi!');
                    return;
                }

                const exist = users.value.find(u => u.username === username);
                if (exist) {
                    alert('Username sudah digunakan!');
                    return;
                }

                users.value.push({
                    id: Date.now(),
                    nama,
                    username,
                    password,
                    role,
                    shift: role === 'Kasir' ? shift : '-',
                    status: 'Aktif'
                });

                modalTambahOpen.value = false;
                alert('Akun berhasil ditambahkan!');
            }

            // ============================================
            // HAPUS AKUN
            // ============================================
            function hapusAkun(id) {
                if (confirm('Yakin ingin menghapus akun ini?')) {
                    users.value = users.value.filter(u => u.id !== id);
                    alert('Akun berhasil dihapus!');
                }
            }

            // ============================================
            // CETAK CLOSING (Ringkasan Metode Pembayaran)
            // ============================================
            function cetakClosing() {
                if (closingItems.value.length === 0) {
                    alert('Belum ada transaksi di shift ini!');
                    return;
                }

                const printWindow = window.open('', '_blank', 'width=500,height=600');
                if (!printWindow) {
                    alert('Popup diblokir! Izinkan popup.');
                    return;
                }

                let metodeHtml = '';
                closingItems.value.forEach(item => {
                    metodeHtml += `
                        <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #ddd;">
                            <span>${item.metode}</span>
                            <span>${formatHarga(item.total)}</span>
                        </div>
                    `;
                });

                const printHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Closing Kasir</title>
                        <style>
                            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 350px; margin: auto; }
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
                            <div class="divider"></div>
                            <div class="row"><span class="label">Kasir</span><span>${userData.value.nama}</span></div>
                            <div class="row"><span class="label">Shift</span><span>${userData.value.shift || 'Shift 1'}</span></div>
                            <div class="row"><span class="label">Tanggal</span><span>${new Date().toLocaleDateString('id-ID')}</span></div>
                            <div class="divider"></div>
                            ${metodeHtml}
                            <div class="divider"></div>
                            <div class="row total"><span>TOTAL</span><span>${formatHarga(totalPendapatan.value)}</span></div>
                            <div class="divider"></div>
                            <div class="footer">Terima kasih</div>
                            <div class="footer" style="font-size:10px;">Dicetak: ${new Date().toLocaleString('id-ID')}</div>
                        </div>
                        <script>setTimeout(() => window.print(), 500);<\/script>
                    </body>
                    </html>
                `;

                printWindow.document.write(printHTML);
                printWindow.document.close();
            }

            // ============================================
            // LOGOUT
            // ============================================
            function logout() {
                if (userData.value.role === 'Kasir' && closingItems.value.length > 0) {
                    if (!confirm('Anda belum melakukan closing shift. Lanjutkan logout tanpa closing?')) {
                        return;
                    }
                }

                if (confirm('Yakin ingin logout?')) {
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                }
            }

            // ============================================
            // RETURN
            // ============================================
            return {
                navOpen,
                activeTab,
                tabs,
                userData,
                users,
                modalTambahOpen,
                formTambah,
                closingItems,
                totalCash,
                totalQRIS,
                totalDebit,
                totalPendapatan,
                formatHarga,
                toggleNav,
                openModalTambah,
                tambahAkun,
                hapusAkun,
                cetakClosing,
                logout
            };
        }
    });

    app.mount('#app');
    console.log('✅ Akun POS siap!');
});