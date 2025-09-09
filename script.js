document.addEventListener('DOMContentLoaded', () => {
    const serviceListElement = document.getElementById('serviceList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let allServices = []; // Untuk menyimpan semua data layanan

    // Fungsi untuk memuat data layanan dari JSON
    async function loadServices() {
        try {
            const response = await fetch('data/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allServices = await response.json();
            displayServices(allServices); // Tampilkan semua layanan saat pertama kali dimuat
        } catch (error) {
            console.error("Gagal memuat data layanan:", error);
            serviceListElement.innerHTML = '<p>Maaf, data layanan tidak dapat dimuat saat ini.</p>';
        }
    }

    // Fungsi untuk menampilkan layanan ke DOM
    function displayServices(servicesToDisplay) {
        serviceListElement.innerHTML = ''; // Bersihkan daftar layanan yang ada
        if (servicesToDisplay.length === 0) {
            serviceListElement.innerHTML = '<p>Tidak ada layanan yang ditemukan.</p>';
            return;
        }

        servicesToDisplay.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');

            // Pastikan properti 'berkas' dan 'kanal_layanan' ada dan merupakan array
            const berkas = Array.isArray(service.berkas) ? service.berkas : [];
            const kanalLayanan = Array.isArray(service.kanal_layanan) ? service.kanal_layanan : [];

            let berkasHtml = berkas.map(item => `<li>${item}</li>`).join('');
            let kanalHtml = kanalLayanan.map(item => `<li>${item}</li>`).join('');

            serviceCard.innerHTML = `
                <h3>${service.jenis_layanan}</h3>
                <h4>Berkas yang Dibutuhkan:</h4>
                <ul>${berkasHtml || '<li>Tidak ada berkas yang disebutkan.</li>'}</ul>
                <h4>Kanal Layanan:</h4>
                <ul>${kanalHtml || '<li>Tidak ada kanal layanan yang disebutkan.</li>'}</ul>
            `;
            serviceListElement.appendChild(serviceCard);
        });
    }

    // Fungsi untuk melakukan pencarian
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim(); // Tambahkan .trim()
        
        if (searchTerm === '') {
            displayServices(allServices); // Jika input kosong, tampilkan semua layanan
            return;
        }

        const filteredServices = allServices.filter(service => {
            // Cari di jenis layanan
            if (service.jenis_layanan && service.jenis_layanan.toLowerCase().includes(searchTerm)) {
                return true;
            }
            // Cari di berkas yang dibutuhkan
            if (Array.isArray(service.berkas) && service.berkas.some(berkasItem => berkasItem.toLowerCase().includes(searchTerm))) {
                return true;
            }
            // Cari di kanal layanan
            if (Array.isArray(service.kanal_layanan) && service.kanal_layanan.some(kanalItem => kanalItem.toLowerCase().includes(searchTerm))) {
                return true;
            }
            return false;
        });
        displayServices(filteredServices);
    }

    // Event Listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        } else {
            // Opsional: Tampilkan hasil pencarian secara real-time saat mengetik
            // performSearch(); 
        }
    });

    // Muat layanan saat halaman pertama kali dimuat
    loadServices();
});