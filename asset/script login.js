// ============================================
// LOGIN POS - VUE.JS
// ============================================

// Tunggu DOM siap
document.addEventListener('DOMContentLoaded', function () {

    const { createApp, ref } = Vue;

    const app = createApp({
        setup() {
            // ============================================
            // STATE
            // ============================================
            const form = ref({
                username: '',
                password: ''
            });
            const loading = ref(false);
            const errorMessage = ref('');
            const successMessage = ref('');
            const showPassword = ref(false);
            const navOpen = ref(false);

            // ============================================
            // DATA USER
            // ============================================
            const users = [
                {
                    username: 'admin',
                    password: 'secret',
                    nama: 'Admin POS',
                    email: 'admin@pos.com',
                    role: 'Admin',
                    shift: '-',
                    status: 'Aktif'
                },
                {
                    username: 'kasir1',
                    password: 'secret',
                    nama: 'Andi Kasir',
                    email: 'kasir1@pos.com',
                    role: 'Kasir',
                    shift: 'Shift 1 (09:00-15:00)',
                    status: 'Aktif'
                },
                {
                    username: 'kasir2',
                    password: 'secret',
                    nama: 'Budi Kasir',
                    email: 'kasir2@pos.com',
                    role: 'Kasir',
                    shift: 'Shift 2 (15:00-21:00)',
                    status: 'Aktif'
                }
            ];

            // ============================================
            // TOGGLE NAV
            // ============================================
            function toggleNav() {
                navOpen.value = !navOpen.value;
            }

            // ============================================
            // FILL DEMO
            // ============================================
            function fillDemo(username, password) {
                form.value.username = username;
                form.value.password = password;
            }

            // ============================================
            // HANDLE LOGIN
            // ============================================
            function handleLogin() {
                errorMessage.value = '';
                successMessage.value = '';
                loading.value = true;

                setTimeout(function () {
                    try {
                        const username = form.value.username.trim();
                        const password = form.value.password.trim();

                        if (!username || !password) {
                            errorMessage.value = 'Username dan password harus diisi!';
                            loading.value = false;
                            return;
                        }

                        const user = users.find(function (u) {
                            return u.username.toLowerCase() === username.toLowerCase() &&
                                u.password === password;
                        });

                        if (!user) {
                            errorMessage.value = 'Username atau password salah!';
                            loading.value = false;
                            return;
                        }

                        successMessage.value = 'Login berhasil! Mengarahkan ke dashboard...';

                        localStorage.setItem('userData', JSON.stringify({
                            nama: user.nama,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            shift: user.shift,
                            status: user.status
                        }));

                        setTimeout(function () {
                            window.location.href = 'dashboard.html';
                        }, 1000);

                    } catch (error) {
                        errorMessage.value = 'Terjadi kesalahan: ' + error.message;
                        loading.value = false;
                    }
                }, 800);
            }

            // ============================================
            // RETURN
            // ============================================
            return {
                form,
                loading,
                errorMessage,
                successMessage,
                showPassword,
                navOpen,
                toggleNav,
                fillDemo,
                handleLogin
            };
        }
    });

    app.mount('#app');
    console.log('✅ Halaman Login siap!');
});