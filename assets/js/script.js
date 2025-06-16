document.addEventListener('DOMContentLoaded', function() {
    
    const header = document.getElementById('main-header');
    lucide.createIcons();

    function handleScroll() {
        if (window.scrollY > 50) { header.classList.add('scrolled'); } 
        else { header.classList.remove('scrolled'); }
    }

    const sections = document.querySelectorAll('.content-section, .hero-section');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
    }, observerOptions);
    sections.forEach(section => { sectionObserver.observe(section); });
    
    const navLinks = document.querySelectorAll('nav a');
    const allSections = document.querySelectorAll('main > section');
    function updateActiveLink() {
        let currentSectionId = '';
        allSections.forEach(section => {
            if (window.scrollY >= section.offsetTop - header.offsetHeight) { currentSectionId = section.getAttribute('id'); }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) { link.classList.add('active'); }
        });
    }

    function typingEffect() {
        const typedTextSpan = document.getElementById("typed-text");
        if (!typedTextSpan) return; // Hentikan jika elemen tidak ada
        // Anda bisa mengganti teks di bawah ini
        const textArray = ["CxZ", "Mahasiswa Informatika"]; 
        const typingDelay = 100, erasingDelay = 50, newTextDelay = 2000;
        let textArrayIndex = 0, charIndex = 0;
        function type() { if (charIndex < textArray[textArrayIndex].length) { typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex); charIndex++; setTimeout(type, typingDelay); } else { setTimeout(erase, newTextDelay); } }
        function erase() { if (charIndex > 0) { typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1); charIndex--; setTimeout(erase, erasingDelay); } else { textArrayIndex++; if (textArrayIndex >= textArray.length) textArrayIndex = 0; setTimeout(type, typingDelay + 1100); } }
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    function themeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle');
        const sunIcon = `<i data-lucide="sun"></i>`, moonIcon = `<i data-lucide="moon"></i>`;
        if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-mode'); themeToggleButton.innerHTML = moonIcon; } else { themeToggleButton.innerHTML = sunIcon; }
        lucide.createIcons();
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) { themeToggleButton.innerHTML = moonIcon; localStorage.setItem('theme', 'light'); } else { themeToggleButton.innerHTML = sunIcon; localStorage.setItem('theme', 'dark'); }
            lucide.createIcons();
        });
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
                if (response.ok) { status.textContent = "Terima kasih! Pesan Anda telah terkirim."; status.style.color = 'lightgreen'; form.reset(); } else { const responseData = await response.json(); if (Object.hasOwn(responseData, 'errors')) { status.textContent = responseData["errors"].map(error => error["message"]).join(", "); } else { status.textContent = "Oops! Terjadi masalah saat mengirim pesan."; } status.style.color = 'red'; }
            } catch (error) { status.textContent = "whOops! Terjadi masalah saat mengirim pesan."; status.style.color = 'red'; }
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

    handleScroll();
    updateActiveLink();
    typingEffect();
    themeToggle();
    handleContactForm();
    handleContactModal();

    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveLink();
    });
});
