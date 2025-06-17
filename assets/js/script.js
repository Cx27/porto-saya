document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // === BAGIAN YANG TIDAK BERUBAH (FUNGSI ASLI) ===
    // ===============================================
    
    const header = document.getElementById('main-header');
    lucide.createIcons();

    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    const sections = document.querySelectorAll('.content-section, .hero-section');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    sections.forEach(section => { sectionObserver.observe(section); });
    
    const navLinks = document.querySelectorAll('nav a');
    const allSections = document.querySelectorAll('main > section');
    function updateActiveLink() {
        if (!allSections.length || !header) return;
        let currentSectionId = '';
        allSections.forEach(section => {
            if (window.scrollY >= section.offsetTop - header.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.hash && link.pathname === window.location.pathname) {
                 if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            }
        });
    }

    function typingEffect() {
        const typedTextSpan = document.getElementById("typed-text");
        if (!typedTextSpan) return;
        const textArray = ["CxZ", "Mahasiswa Informatika"]; 
        const typingDelay = 100, erasingDelay = 50, newTextDelay = 2000;
        let textArrayIndex = 0, charIndex = 0;
        function type() { if (charIndex < textArray[textArrayIndex].length) { typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex); charIndex++; setTimeout(type, typingDelay); } else { setTimeout(erase, newTextDelay); } }
        function erase() { if (charIndex > 0) { typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1); charIndex--; setTimeout(erase, erasingDelay); } else { textArrayIndex++; if (textArrayIndex >= textArray.length) textArrayIndex = 0; setTimeout(type, typingDelay + 1100); } }
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    function handleContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const status = document.getElementById('form-status');
        async function handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            try {
                const response = await fetch(event.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) {
                    status.textContent = "Terima kasih! Pesan Anda telah terkirim.";
                    status.style.color = 'lightgreen';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        status.textContent = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! Terjadi masalah saat mengirim pesan.";
                    }
                    status.style.color = 'red';
                }
            } catch (error) {
                status.textContent = "Oops! Terjadi masalah saat mengirim pesan.";
                status.style.color = 'red';
            }
        }
        form.addEventListener("submit", handleSubmit);
    }

    function handleContactModal() {
        const modalContainer = document.getElementById('email-modal');
        const openModalBtn = document.getElementById('email-button');
        const closeModalBtn = document.getElementById('close-modal');
        if (!modalContainer || !openModalBtn || !closeModalBtn) return;
        openModalBtn.addEventListener('click', () => { modalContainer.classList.add('visible'); });
        closeModalBtn.addEventListener('click', () => { modalContainer.classList.remove('visible'); });
        modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) { modalContainer.classList.remove('visible'); } });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalContainer.classList.contains('visible')) { modalContainer.classList.remove('visible'); } });
    }

    // ==========================================================
    // === AWAL PERUBAHAN: FUNGSI TEMA DAN TRANSISI INDEPENDEN ===
    // ==========================================================

    /**
     * Mengelola tema (terang/gelap) secara independen untuk setiap halaman.
     * Menggunakan ID dari <body> untuk membuat kunci localStorage yang unik.
     * Contoh: Halaman <body id="page-index"> akan menggunakan kunci 'theme-index'.
     */
    function themeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (!themeToggleButton || !document.body.id) return; // Keluar jika tombol atau body ID tidak ada

        // 1. Tentukan kunci penyimpanan berdasarkan ID halaman saat ini
        const pageId = document.body.id.replace('page-', ''); // 'index' atau 'tools'
        const storageKey = `theme-${pageId}`;

        const sunIcon = `<i data-lucide="sun"></i>`;
        const moonIcon = `<i data-lucide="moon"></i>`;
        
        // 2. Terapkan tema yang tersimpan saat halaman dimuat
        if (localStorage.getItem(storageKey) === 'light') {
            document.body.classList.add('light-mode');
            themeToggleButton.innerHTML = moonIcon;
        } else {
            document.body.classList.remove('light-mode');
            themeToggleButton.innerHTML = sunIcon;
        }
        lucide.createIcons(); // Perbarui ikon setelah mengubah HTML
        
        // 3. Tambahkan event listener untuk tombol
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            // 4. Simpan status baru ke kunci localStorage yang benar
            if (document.body.classList.contains('light-mode')) {
                themeToggleButton.innerHTML = moonIcon;
                localStorage.setItem(storageKey, 'light');
            } else {
                themeToggleButton.innerHTML = sunIcon;
                localStorage.setItem(storageKey, 'dark');
            }
            lucide.createIcons();
        });
    }

    /**
     * Mengelola transisi halaman dengan warna gelembung yang cerdas.
     * Warna gelembung ditentukan oleh tema halaman TUJUAN.
     */
    function pageTransition() {
        // Pilih semua tautan yang menuju ke halaman .html lain di situs yang sama
        const transitionLinks = document.querySelectorAll('a[href*=".html"]');
        const transitioner = document.getElementById('page-transitioner');
        const bubble = document.getElementById('transition-bubble');

        if (!transitioner || !bubble) return;

        transitionLinks.forEach(link => {
            // Pastikan tautan adalah internal (domain yang sama) dan bukan tautan ke halaman saat ini
            if (link.hostname === window.location.hostname && link.pathname !== window.location.pathname) {
                
                link.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    const targetUrl = this.href;

                    // 1. Tentukan halaman tujuan dari URL tautan
                    const destinationPage = targetUrl.includes('tools.html') ? 'tools' : 'index';
                    const destinationStorageKey = `theme-${destinationPage}`;
                    
                    // 2. Ambil tema halaman tujuan dari localStorage (default ke 'dark')
                    const destinationTheme = localStorage.getItem(destinationStorageKey) || 'dark';
                    
                    // 3. Tentukan warna gelembung berdasarkan tema tujuan
                    const lightColor = '#f4f4f9'; // Warna dari --bg-color di body.light-mode
                    const darkColor = '#121212';  // Warna dari --bg-color di :root
                    const bubbleColor = destinationTheme === 'light' ? lightColor : darkColor;
                    
                    // 4. Terapkan warna dan mulai animasi
                    bubble.style.backgroundColor = bubbleColor;
                    transitioner.classList.add('is-active');
                    bubble.style.left = `${event.clientX}px`;
                    bubble.style.top = `${event.clientY}px`;
                    bubble.classList.add('is-expanding');
                    
                    // 5. Arahkan ke halaman baru setelah animasi berjalan
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 700); // Durasi harus cocok dengan transisi di CSS
                });
            }
        });

        // Tangani saat pengguna menekan tombol "Back/Forward" di browser
        window.addEventListener('pageshow', function(event) {
            // Sembunyikan layer transisi jika halaman dimuat dari cache (setelah menekan 'back')
            if (event.persisted) {
                transitioner.classList.remove('is-active');
                bubble.classList.remove('is-expanding');
            }
        });
    }

    // ==========================================
    // === MEMANGGIL SEMUA FUNGSI TERMASUK YANG BARU ===
    // ==========================================
    
    handleScroll();
    updateActiveLink();
    typingEffect();
    handleContactForm();
    handleContactModal();
    
    // Panggil fungsi tema dan transisi yang baru
    themeToggle();
    pageTransition();

    // Tambahkan listener untuk scroll
    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveLink();
    });
});
