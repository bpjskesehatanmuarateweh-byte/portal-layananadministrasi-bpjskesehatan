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

            let berkasHtml = berkas.length > 0 ? berkas.map(item => `<li>${item}</li>`).join('') : '<li>Tidak ada berkas yang disebutkan.</li>';
            let kelasHtml = kelasdaniuran.length > 0 ? kelasdaniuran.map(item => `<li>${item}</li>`).join('') : '<li>Tidak ada kelas dan iuran yang disebutkan.</li>';

            // Render kanal layanan dengan tautan dan toggle khusus
            let kanalHtml = '';
            if (kanalLayanan.length > 0) {
                kanalHtml += '<ul>';
                kanalLayanan.forEach(kanal => {
                    if (kanal.includes("Pandawa 08118165165 (Whatsapp)")) {
                        kanalHtml += `<li><a href="https://wa.me/628118165165?text=halo" target="_blank" rel="noopener noreferrer">Pandawa (WhatsApp)</a></li>`;
                    } else if (kanal.includes("Care Center 165")) {
                        kanalHtml += `<li><a href="tel:021165">Care Center 165</a></li>`;
                    } else if (kanal.includes("Aplikasi Mobile JKN")) {
                        kanalHtml += `
                            <li>
                                <span class="mobile-jkn-toggle" data-service-id="${service.id}">Aplikasi Mobile JKN</span>
                                <div class="mobile-jkn-options" id="mobile-jkn-options-${service.id}">
                                    <a href="https://apps.apple.com/id/app/mobile-jkn/id1237601115" target="_blank" rel="noopener noreferrer">Unduh untuk iOS</a>
                                    <a href="https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=id&pli=1" target="_blank" rel="noopener noreferrer">Unduh untuk Android</a>
                                </div>
                            </li>
                        `;
                    } else {
                        kanalHtml += `<li>${kanal}</li>`;
                    }
                });
                kanalHtml += '</ul>';
            } else {
                kanalHtml = '<ul><li>Tidak ada kanal layanan yang disebutkan.</li></ul>';
            }

            serviceCard.innerHTML = `
                <h3>${service.jenis_layanan}</h3>
                <h4>Berkas yang Dibutuhkan:</h4>
                <ul>${berkasHtml}</ul>
                <h4>Kelas dan Iuran:</h4>
                <ul>${kelasHtml}</ul>
                <h4>Kanal Layanan:</h4>
                <div class="kanal-layanan">${kanalHtml}</div>
            `;

            serviceListElement.appendChild(serviceCard);
        });

        // Pasang event listener toggle Mobile JKN setelah render
        document.querySelectorAll('.mobile-jkn-toggle').forEach(toggleElement => {
            toggleElement.addEventListener('click', function () {
                const serviceId = this.dataset.serviceId;
                const optionsDiv = document.getElementById(`mobile-jkn-options-${serviceId}`);
                if (optionsDiv) {
                    if (optionsDiv.style.display === 'block') {
                        optionsDiv.style.display = 'none';
                    } else {
                        optionsDiv.style.display = 'block';
                    }
                }
            });
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
