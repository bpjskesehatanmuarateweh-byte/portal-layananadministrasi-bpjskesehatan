document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('serviceDropdown');
    const detail = document.getElementById('serviceDetail');
    let allServices = [];

    // Load services.json
    async function loadServices() {
        try {
            const resp = await fetch('data/services.json');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            allServices = await resp.json();
            console.log('Loaded services.json');
            populateDropdown(allServices);
        } catch (err) {
            console.error('Gagal memuat data layanan:', err);
            detail.innerHTML = '<p>Maaf, data layanan tidak dapat dimuat saat ini.</p>';
        }
    }

    // Isi dropdown
    function populateDropdown(services) {
        services.forEach(service => {
            const name = service.jenis_layanan || service.jenis_layayanan || (`Layanan ${service.id}`);
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = name;
            dropdown.appendChild(option);
        });
    }

    // Tampilkan detail layanan
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
                    kanalHtml += `<li><a href="tel:021165">Care Center 165 <span class="link-klik">⇦ Klik di sini</span></a></li>`;
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

        // Tambahkan tombol cetak
        card.innerHTML = `
            <h3>${name}</h3>
            <h4>Berkas yang Dibutuhkan:</h4>
            ${berkasHtml}
            ${kelasHtml}
            ${kanalHtml}
            <button class="print-btn">🖨️ Cetak Persyaratan</button>
        `;
        detail.appendChild(card);

        // Event cetak
        card.querySelector('.print-btn').addEventListener('click', () => {
            printServiceCard(service);
        });
    }

    // Event delegation untuk toggle Mobile JKN
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
    });

    // Event ketika dropdown berubah
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

// Fungsi Cetak Kartu
// Fungsi Cetak Kartu (A6 + Logo BPJS Base64)
function printServiceCard(service) {
    const name = service.jenis_layanan || service.jenis_layayanan || (`Layanan ${service.id}`);
    const berkas = Array.isArray(service.berkas) ? service.berkas : [];
    const kelas = Array.isArray(service.kelas_dan_iuran) ? service.kelas_dan_iuran : [];
    const kanal = Array.isArray(service.kanal_layanan) ? service.kanal_layanan : [];

    // ✅ Logo BPJS versi Base64 (dari SVG link Wikipedia)
    const bpjsLogoBase64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODAgMTAwIj48cGF0aCBmaWxsPSIjMDA3YmZmIiBkPSJNMTg5LjcgMEM4NS4xIDAgMCAyMi40IDAgNTAuM2MwIDI3LjkgODUuMSA1MC4zIDE4OS43IDUwLjNzMTg5LjctMjIuNCAxODkuNy01MC4zQzM3OS40IDIyLjQgMjk0LjQgMCAxODkuNyAweiIvPjwvc3ZnPg==`;

    const cardContent = `
        <div class="print-card">
            <div class="print-header">
                <img src="${bpjsLogoBase64}" alt="Logo BPJS" class="logo" />
                <h2>BPJS Kesehatan</h2>
                <p>Persyaratan Layanan Administrasi Kepesertaan</p>
            </div>
            <div class="print-body">
                <h3>${name}</h3>
                <h4>Berkas yang Dibutuhkan:</h4>
                <ul>${berkas.map(b => `<li>${b}</li>`).join('')}</ul>
                ${kelas.length ? `<h4>Kelas dan Iuran:</h4><ul>${kelas.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
                <h4>Kanal Layanan:</h4>
                <ul>${kanal.map(k => `<li>${k}</li>`).join('')}</ul>
            </div>
            <div class="print-footer">
                <p>&copy; 2025 BPJS Kesehatan</p>
            </div>
        </div>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
        <head>
            <title>Cetak Kartu</title>
            <style>
                @page { size: A6; margin: 8mm; }
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                .print-card {
                    border: 2px solid #007bff;
                    border-radius: 10px;
                    padding: 12px;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;

                    display: flex;
                    flex-direction: column;
                }
                .print-header {
                    text-align: center;
                    border-bottom: 2px solid #007bff;
                    margin-bottom: 8px;
                    padding-bottom: 4px;
                }
                .print-header .logo {
                    height: 35px;
                }
                .print-header h2 {
                    margin: 4px 0 0;
                    color: #007bff;
                    font-size: 16px;
                }
                .print-header p {
                    margin: 0;
                    font-size: 11px;
                }
                .print-body {
                    flex: 1;
                }
                .print-body h3 {
                    color: #007bff;
                    margin-bottom: 5px;
                    font-size: 14px;
                    text-align: center;
                }
                .print-body h4 {
                    margin-top: 6px;
                    margin-bottom: 3px;
                    font-size: 12px;
                }
                .print-body ul {
                    margin: 0 0 6px 18px;
                    font-size: 11px;
                }
                .print-footer {
                    text-align: center;
                    font-size: 10px;
                    border-top: 1px solid #ccc;
                    padding-top: 3px;
                    margin-top: auto;
                }
            </style>
        </head>
        <body>${cardContent}</body>
        </html>
    `);
    newWindow.document.close();
    newWindow.onload = () => {
        newWindow.focus();
        newWindow.print();
    };
}
