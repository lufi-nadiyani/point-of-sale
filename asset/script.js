// ============================================
// DASHBOARD POS - VUE.JS
// ============================================

// Tunggu DOM siap
document.addEventListener('DOMContentLoaded', function () {

    const { createApp, ref } = Vue;

    const app = createApp({
        setup() {
            // ============================================
            // DATA USER (dari localStorage)
            // ============================================
            const userData = ref({
                nama: 'Guest',
                username: '',
                role: '',
                shift: '',
                email: '',
                status: ''
            });

            // Ambil data dari localStorage
            try {
                const savedUser = localStorage.getItem('userData');
                if (savedUser) {
                    userData.value = JSON.parse(savedUser);
                } else {
                    window.location.href = 'login.html';
                }
            } catch (e) {
                console.log('Gagal load user data');
                window.location.href = 'login.html';
            }

            // ============================================
            // DATA TRANSAKSI
            // ============================================
            const transactions = ref([
                {
                    id: 'TRX001',
                    meja: '1',
                    tanggal: '24/06/2026',
                    menu: 'Nasi Goreng',
                    qty: '2',
                    total: 'Rp40.000',
                    metode: 'QRIS',
                    status: 'Selesai',
                    statusClass: 'badge-success'
                },
                {
                    id: 'TRX002',
                    meja: '2',
                    tanggal: '24/06/2026',
                    menu: 'Es Teh',
                    qty: '1',
                    total: 'Rp5.000',
                    metode: 'Tunai',
                    status: 'Selesai',
                    statusClass: 'badge-success'
                },
                {
                    id: 'TRX003',
                    meja: '3',
                    tanggal: '24/06/2026',
                    menu: 'Mie Ayam',
                    qty: '1',
                    total: 'Rp15.000',
                    metode: 'QRIS',
                    status: 'Selesai',
                    statusClass: 'badge-success'
                }
            ]);

            // ============================================
            // STATE
            // ============================================
            const navOpen = ref(false);

            // ============================================
            // LOGOUT
            // ============================================
            function logout() {
                if (confirm('Yakin ingin logout?')) {
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                }
            }

            // ============================================
            // TOGGLE NAV
            // ============================================
            function toggleNav() {
                navOpen.value = !navOpen.value;
            }

            // ============================================
            // RETURN
            // ============================================
            return {
                userData,
                transactions,
                navOpen,
                logout,
                toggleNav
            };
        }
    });

    // Mount Vue app
    app.mount('#app');
    console.log('✅ Dashboard POS siap!');
});