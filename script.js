document.addEventListener('DOMContentLoaded', () => {
    const serviceListElement = document.getElementById('serviceList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let allServices = [];

    async function loadServices() {
        try {
            const response = await fetch('data/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allServices = await response.json();
            displayServices(allServices);
        } catch (error) {
            console.error("Gagal memuat data layanan:", error);
            serviceListElement.innerHTML = '<p>Maaf, data layanan tidak dapat dimuat saat ini.</p>';
        }
    }

    function displayServices(servicesToDisplay) {
        serviceListElement.innerHTML = '';
        if (servicesToDisplay.length === 0) {
            serviceListElement.innerHTML = '<p>Tidak ada layanan yang ditemukan.</p>';
            return;
        }

        servicesToDisplay.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');

            const berkas = Array.isArray(service.berkas) ? service.berkas : [];
            const kelasdaniuran = Array.isArray(service.kelas_dan_iuran) ? service.kelas_dan_iuran : [];
            const kanalLayanan = Array.isArray(service.kanal_layanan) ? service.kanal_layanan : [];

            let berkasHtml = berkas.map(item => `<li>${item}</li>`).join('');
            let kelasHtml = kelasdaniuran.map(item => `<li>${item}</li>`).join('');
            let kanalHtml = kanalLayanan.map(item => `<li>${item}</li>`).join('');

            serviceCard.innerHTML = `
                <h3>${service.jenis_layanan}</h3>
                <h4>Berkas yang Dibutuhkan:</h4>
                <ul>${berkasHtml || '<li>Tidak ada berkas yang disebutkan.</li>'}</ul>
                <h4>Kelas dan Iuran:</h4>
                <ul>${kelasHtml || '<li>Tidak ada kelas dan iuran yang disebutkan.</li>'}</ul>
                <h4>Kanal Layanan:</h4>
                <ul>${kanalHtml || '<li>Tidak ada kanal layanan yang disebutkan.</li>'}</ul>
            `;
            serviceListElement.appendChild(serviceCard);
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            displayServices(allServices);
            return;
        }

        const filteredServices = allServices.filter(service => {
            if (service.jenis_layanan && service.jenis_layanan.toLowerCase().includes(searchTerm)) {
                return true;
            }
            if (Array.isArray(service.berkas) && service.berkas.some(item => item.toLowerCase().includes(searchTerm))) {
                return true;
            }
            if (Array.isArray(service.kelas_dan_iuran) && service.kelas_dan_iuran.some(item => item.toLowerCase().includes(searchTerm))) {
                return true;
            }
            if (Array.isArray(service.kanal_layanan) && service.kanal_layanan.some(item => item.toLowerCase().includes(searchTerm))) {
                return true;
            }
            return false;
        });

        displayServices(filteredServices);
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    loadServices();
});
