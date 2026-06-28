// ============================================
// SCRIPT DATA MENU - VUE.JS
// ============================================

const { createApp, ref, computed } = Vue;

const app = createApp({
    setup() {
        // ============================================
        // STATE
        // ============================================
        const navOpen = ref(false);
        const currentFilter = ref('Semua');
        const filterDropdownOpen = ref(false);
        const modalOpen = ref(false);
        const modalTitle = ref('Tambah Menu');
        const editIndex = ref(null);
        const fileGambar = ref(null);

        // Form Data
        const formData = ref({
            nama: '',
            kategori: 'Makanan',
            harga: '',
            gambar: 'asset/img/default.jpg'
        });

        // Menu Data (18 items - TIDAK URUT)
        const menuData = ref([
            { no: 1, gambar: 'asset/img/mie kuah.jpg', nama: 'Mie Kuah', kategori: 'Makanan', harga: 'Rp20.000' },
            { no: 2, gambar: 'asset/img/sate.jpg', nama: 'Sate', kategori: 'Makanan', harga: 'Rp20.000' },
            { no: 3, gambar: 'asset/img/nasi ayam.jpg', nama: 'Nasi Ayam', kategori: 'Makanan', harga: 'Rp22.000' },
            { no: 4, gambar: 'asset/img/nasi goreng.jpg', nama: 'Nasi Goreng', kategori: 'Makanan', harga: 'Rp22.000' },
            { no: 5, gambar: 'asset/img/salted egg.jpg', nama: 'Salted Egg', kategori: 'Makanan', harga: 'Rp22.000' },
            { no: 6, gambar: 'asset/img/laksa.jpg', nama: 'Laksa', kategori: 'Makanan', harga: 'Rp23.000' },
            { no: 7, gambar: 'asset/img/teh.jpg', nama: 'Teh', kategori: 'Minuman', harga: 'Rp4.000' },
            { no: 8, gambar: 'asset/img/lemon tea.jpg', nama: 'Lemon Tea', kategori: 'Minuman', harga: 'Rp5.000' },
            { no: 9, gambar: 'asset/img/jus mangga.jpg', nama: 'Jus Mangga', kategori: 'Minuman', harga: 'Rp10.000' },
            { no: 10, gambar: 'asset/img/squash lemon.jpg', nama: 'Squash Lemon', kategori: 'Minuman', harga: 'Rp15.000' },
            { no: 11, gambar: 'asset/img/coffe.jpg', nama: 'Coffe', kategori: 'Minuman', harga: 'Rp20.000' },
            { no: 12, gambar: 'asset/img/es cendol.jpg', nama: 'Es Cendol', kategori: 'Minuman', harga: 'Rp20.000' },
            { no: 13, gambar: 'asset/img/biskuit.jpg', nama: 'Biskuit', kategori: 'Snack', harga: 'Rp20.000' },
            { no: 14, gambar: 'asset/img/donat.jpg', nama: 'Donat', kategori: 'Snack', harga: 'Rp20.000' },
            { no: 15, gambar: 'asset/img/pancaake.jpg', nama: 'Pancake', kategori: 'Snack', harga: 'Rp25.000' },
            { no: 16, gambar: 'asset/img/french fries.jpg', nama: 'French Fries', kategori: 'Snack', harga: 'Rp15.000' },
            { no: 17, gambar: 'asset/img/pisang goreng.jpg', nama: 'Pisang Goreng', kategori: 'Snack', harga: 'Rp20.000' },
            { no: 18, gambar: 'asset/img/roti strawberry.jpg', nama: 'Roti Strawberry', kategori: 'Snack', harga: 'Rp22.000' }
        ]);

        // ============================================
        // COMPUTED - FILTER + URUTKAN ABJAD
        // ============================================
        const filteredMenu = computed(() => {
            let data = menuData.value;

            // Filter berdasarkan kategori
            if (currentFilter.value !== 'Semua') {
                data = data.filter(item => item.kategori === currentFilter.value);
            }

            // ⭐ URUTKAN BERDASARKAN NAMA (A-Z) - Case insensitive
            return data.sort((a, b) => {
                return a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' });
            });
        });

        // ============================================
        // BADGE CLASS
        // ============================================
        function getBadgeClass(kategori) {
            if (kategori === 'Makanan') return 'badge-makanan';
            if (kategori === 'Minuman') return 'badge-minuman';
            return 'badge-snack'; // Snack = ungu
        }

        // ============================================
        // FORMAT HARGA
        // ============================================
        function formatHargaInput() {
            let value = formData.value.harga.replace(/[^0-9]/g, '');
            if (value) {
                formData.value.harga = 'Rp' + parseInt(value).toLocaleString('id-ID');
            } else {
                formData.value.harga = '';
            }
        }

        function getAngkaHarga(harga) {
            return parseInt(harga.replace(/[^0-9]/g, '')) || 0;
        }

        // ============================================
        // NAV TOGGLE
        // ============================================
        function toggleNav() {
            navOpen.value = !navOpen.value;
        }

        // ============================================
        // FILTER
        // ============================================
        function toggleFilterDropdown() {
            filterDropdownOpen.value = !filterDropdownOpen.value;
        }

        function setFilter(filter) {
            currentFilter.value = filter;
            filterDropdownOpen.value = false;
        }

        // ============================================
        // MODAL
        // ============================================
        function openModal() {
            modalTitle.value = 'Tambah Menu';
            formData.value = { nama: '', kategori: 'Makanan', harga: '', gambar: 'asset/img/default.jpg' };
            editIndex.value = null;
            fileGambar.value = null;
            modalOpen.value = true;
        }

        function closeModal() {
            modalOpen.value = false;
        }

        function handleFileUpload(event) {
            fileGambar.value = event.target.files[0];
            if (fileGambar.value) {
                formData.value.gambar = URL.createObjectURL(fileGambar.value);
            }
        }

        // ============================================
        // SIMPAN MENU
        // ============================================
        function simpanMenu() {
            const nama = formData.value.nama.trim();
            const kategori = formData.value.kategori;
            const harga = formData.value.harga;

            if (!nama) {
                alert('Nama menu harus diisi!');
                return;
            }

            const hargaAngka = getAngkaHarga(harga);
            if (hargaAngka === 0) {
                alert('Harga harus diisi!');
                return;
            }

            const hargaFormatted = 'Rp' + hargaAngka.toLocaleString('id-ID');

            const newItem = {
                no: menuData.value.length + 1,
                nama: nama,
                kategori: kategori,
                harga: hargaFormatted,
                gambar: formData.value.gambar || 'asset/img/default.jpg'
            };

            if (editIndex.value !== null) {
                // Edit
                const index = editIndex.value;
                // Cek duplikat nama (kecuali nama sendiri)
                const duplicate = menuData.value.find((item, idx) =>
                    item.nama.toLowerCase() === nama.toLowerCase() && idx !== index
                );
                if (duplicate) {
                    alert(`Menu "${nama}" sudah ada!`);
                    return;
                }
                menuData.value[index] = { ...menuData.value[index], ...newItem };
                alert('Menu berhasil diupdate!');
            } else {
                // Tambah
                const duplicate = menuData.value.find(item =>
                    item.nama.toLowerCase() === nama.toLowerCase()
                );
                if (duplicate) {
                    alert(`Menu "${nama}" sudah ada!`);
                    return;
                }
                menuData.value.push(newItem);
                alert('Menu berhasil ditambahkan!');
            }

            closeModal();
        }

        // ============================================
        // EDIT MENU
        // ============================================
        function editMenu(index) {
            // Ambil data dari filteredMenu (yang sudah urut)
            const item = filteredMenu.value[index];
            if (!item) return;

            // Cari index asli di menuData
            const originalIndex = menuData.value.findIndex(m => m.no === item.no);

            modalTitle.value = 'Edit Menu';
            formData.value = {
                nama: item.nama,
                kategori: item.kategori,
                harga: item.harga,
                gambar: item.gambar
            };
            editIndex.value = originalIndex;
            fileGambar.value = null;
            modalOpen.value = true;
        }

        // ============================================
        // HAPUS MENU
        // ============================================
        function hapusMenu(index) {
            // Ambil data dari filteredMenu (yang sudah urut)
            const item = filteredMenu.value[index];
            if (!item) return;

            if (confirm(`Yakin ingin menghapus menu "${item.nama}"?`)) {
                // Cari index asli di menuData
                const originalIndex = menuData.value.findIndex(m => m.no === item.no);
                if (originalIndex !== -1) {
                    menuData.value.splice(originalIndex, 1);
                    // Renumber
                    menuData.value.forEach((item, idx) => item.no = idx + 1);
                    alert('Menu berhasil dihapus!');
                }
            }
        }

        // ============================================
        // RETURN
        // ============================================
        return {
            navOpen,
            currentFilter,
            filterDropdownOpen,
            modalOpen,
            modalTitle,
            editIndex,
            formData,
            menuData,
            filteredMenu,
            toggleNav,
            toggleFilterDropdown,
            setFilter,
            openModal,
            closeModal,
            handleFileUpload,
            simpanMenu,
            editMenu,
            hapusMenu,
            getBadgeClass,
            formatHargaInput
        };
    }
});

app.mount('#app');

console.log('✅ Data Menu (Vue.js) siap - Urut Abjad!');