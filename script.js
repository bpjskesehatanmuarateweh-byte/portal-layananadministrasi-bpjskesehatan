document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('serviceDropdown');
    const detail = document.getElementById('serviceDetail');
    let allServices = [];

    async function loadServices() {
        try {
            const response = await fetch('data/services.json'); // langsung ke folder data
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            allServices = await response.json();
            console.log('Services loaded:', allServices.length);
            populateDropdown(allServices);
        } catch (err) {
            console.error("Gagal memuat services.json:", err);
            detail.innerHTML = '<p>Data layanan tidak dapat dimuat.</p>';
        }
    }


    function populateDropdown(services) {
        services.forEach(service => {
            const name = service.jenis_layanan || service.jenis_layayanan || (`Layanan ${service.id}`);
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = name;
            dropdown.appendChild(option);
        });
    }

    function displayServiceDetail(service) {
        detail.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'service-card';

        const name = service.jenis_layanan || service.jenis_layayanan || (`Layanan ${service.id}`);
        const berkas = Array.isArray(service.berkas) ? service.berkas : [];
        const kelas = Array.isArray(service.kelas_dan_iuran) ? service.kelas_dan_iuran : (Array.isArray(service.kelasdaniuran) ? service.kelasdaniuran : []);
        const kanal = Array.isArray(service.kanal_layanan) ? service.kanal_layanan : [];

        const berkasHtml = berkas.length ? `<ul>${berkas.map(b => `<li>${b}</li>`).join('')}</ul>` : '<ul><li>Tidak ada berkas yang disebutkan.</li></ul>';
        const kelasHtml = kelas.length ? `<h4>Kelas dan Iuran:</h4><ul>${kelas.map(k => `<li>${k}</li>`).join('')}</ul>` : '';

        let kanalHtml = '<h4>Kanal Layanan:</h4>';
        if (kanal.length) {
            kanalHtml += '<ul>';
            kanal.forEach(k => {
                if (k.includes('Pandawa')) {
                    kanalHtml += `<li><a href="https://wa.me/628118165165?text=halo" target="_blank" rel="noopener noreferrer">Pandawa (WhatsApp) <span class="link-klik">⇦ Klik di sini</span></a></li>`;
                } else if (k.toLowerCase().includes('care center')) {
                    kanalHtml += `<li><a href="tel:021165">Care Center 165 <span class="link-klik"> ⇦ Klik di sini</span></a></li>`;
                } else if (k.includes('Aplikasi Mobile JKN')) {
                    kanalHtml += `<li>
                        <span class="mobile-jkn-toggle" data-service-id="${service.id}">Aplikasi Mobile JKN</span>
                        <div class="mobile-jkn-options" id="mobile-jkn-options-${service.id}">
                            <a href="https://apps.apple.com/id/app/mobile-jkn/id1237601115" target="_blank" rel="noopener noreferrer">
                                Unduh untuk iOS <span class="link-klik">⇦ Klik di sini</span>
                            </a>
                            <a href="https://play.google.com/store/apps/details?id=app.bpjs.mobile&hl=id&pli=1" target="_blank" rel="noopener noreferrer">
                                Unduh untuk Android <span class="link-klik">⇦ Klik di sini</span>
                            </a>
                        </div>
                    </li>`;
                } else {
                    kanalHtml += `<li><span class="kanal-text-normal">${k}</span></li>`;
                }
            });

            kanalHtml += '</ul>';
        } else {
            kanalHtml += '<ul><li>Tidak ada kanal layanan yang disebutkan.</li></ul>';
        }

        card.innerHTML = `<h3>${name}</h3>
            <h4>Berkas yang Dibutuhkan:</h4>
            ${berkasHtml}
            ${kelasHtml}
            ${kanalHtml}
        `;
        detail.appendChild(card);
    }

    // Event delegation for toggles and preventing default on placeholder links
    document.getElementById('serviceDetail').addEventListener('click', function (e) {
        const toggle = e.target.closest('.mobile-jkn-toggle');
        if (toggle) {
            const serviceId = toggle.dataset.serviceId;
            const optionsDiv = document.getElementById(`mobile-jkn-options-${serviceId}`);
            if (optionsDiv) {
                optionsDiv.classList.toggle('show');
                toggle.classList.toggle('active');
            }
            return;
        }

        const anchor = e.target.closest('a[href="javascript:void(0)"], a[href="#"]');
        if (anchor) {
            e.preventDefault();
            return;
        }
    });

    dropdown.addEventListener('change', () => {
        const val = dropdown.value;
        if (!val) {
            detail.innerHTML = '';
            return;
        }
        const selected = allServices.find(s => String(s.id) === String(val));
        if (selected) {
            displayServiceDetail(selected);
        } else {
            detail.innerHTML = '<p>Data layanan tidak ditemukan.</p>';
        }
    });

    loadServices();
});


