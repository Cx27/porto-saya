document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================================
    // === BAGIAN INI TIDAK DISENTUH SAMA SEKALI ===
    // ====================================================
    
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

    function themeToggle() {
        const themeToggleButton = document.getElementById('theme-toggle');
        if (!themeToggleButton || !document.body.id) return;
        const pageId = document.body.id.replace('page-', '');
        const storageKey = `theme-${pageId}`;
        const sunIcon = `<i data-lucide="sun"></i>`;
        const moonIcon = `<i data-lucide="moon"></i>`;
        if (localStorage.getItem(storageKey) === 'light') {
            document.body.classList.add('light-mode');
            themeToggleButton.innerHTML = moonIcon;
        } else {
            document.body.classList.remove('light-mode');
            themeToggleButton.innerHTML = sunIcon;
        }
        lucide.createIcons();
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
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

    function pageTransition() {
        const transitionLinks = document.querySelectorAll('a[href*=".html"]');
        const transitioner = document.getElementById('page-transitioner');
        const bubble = document.getElementById('transition-bubble');
        if (!transitioner || !bubble) return;
        transitionLinks.forEach(link => {
            if (link.hostname === window.location.hostname && link.pathname !== window.location.pathname) {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    const targetUrl = this.href;
                    const destinationPage = targetUrl.includes('tools.html') ? 'tools' : 'index';
                    const destinationStorageKey = `theme-${destinationPage}`;
                    const destinationTheme = localStorage.getItem(destinationStorageKey) || 'dark';
                    const lightColor = '#f4f4f9';
                    const darkColor = '#121212';
                    const bubbleColor = destinationTheme === 'light' ? lightColor : darkColor;
                    bubble.style.backgroundColor = bubbleColor;
                    transitioner.classList.add('is-active');
                    bubble.style.left = `${event.clientX}px`;
                    bubble.style.top = `${event.clientY}px`;
                    bubble.classList.add('is-expanding');
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 700);
                });
            }
        });
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                transitioner.classList.remove('is-active');
                bubble.classList.remove('is-expanding');
            }
        });
    }

    function initEncoderDecoderTool() {
        const modal = document.getElementById('encoder-decoder-modal');
        const openBtn = document.getElementById('open-encoder-decoder');
        const closeBtn = document.getElementById('close-encoder-decoder');
        
        if (!modal || !openBtn || !closeBtn) return;

        const input = document.getElementById('encoder-input');
        const output = document.getElementById('encoder-output');
        const typeSelect = document.getElementById('encoder-type');
        const swapBtn = document.getElementById('swap-io');
        const copyBtn = modal.querySelector('.btn-copy');

        async function process() {
            const operation = typeSelect.value;
            const text = input.value;
            if (!text) {
                output.value = '';
                return;
            }
            let result = '';

            try {
                switch (operation) {
                    case 'encode-base64': result = btoa(unescape(encodeURIComponent(text))); break;
                    case 'decode-base64': result = decodeURIComponent(escape(atob(text))); break;
                    case 'encode-url': result = encodeURIComponent(text); break;
                    case 'decode-url': result = decodeURIComponent(text); break;
                    case 'hash-sha256':
                        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                        const hashArray = Array.from(new Uint8Array(hashBuffer));
                        result = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                        break;
                    case 'case-upper': result = text.toUpperCase(); break;
                    case 'case-lower': result = text.toLowerCase(); break;
                    default: result = 'Operasi tidak valid';
                }
            } catch (e) { result = `Error: ${e.message}`; }
            output.value = result;
        }

        openBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('visible'); });
        closeBtn.addEventListener('click', () => modal.classList.remove('visible'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('visible'); });
        input.addEventListener('input', process);
        typeSelect.addEventListener('change', process);
        swapBtn.addEventListener('click', () => {
            if (output.value.startsWith('Error:')) return;
            [input.value, output.value] = [output.value, input.value];
            process();
        });
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(output.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Disalin!';
                setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
            });
        });
    }

    async function initTerminal() {
        const { terminalCommands } = await import('./terminal-commands.js');
        const container = document.getElementById('terminal-container');
        const openBtn = document.getElementById('open-terminal');
        const closeBtn = document.getElementById('close-terminal');
        const output = document.getElementById('terminal-output');
        const input = document.getElementById('terminal-input');
        // 'terminalBody' tidak lagi digunakan untuk scrolling, tapi tetap sebagai referensi jika perlu
        const terminalBody = document.getElementById('terminal-body'); 
        
        if (!container || !openBtn || !closeBtn) return;
        
        let commandHistory = [];
        let historyIndex = -1;
        let isExecuting = false;

        const welcomeMessage = `CxZ Virtual Terminal v2.0\n(c) 2025 CxZ Corporation.\nKetik "help" untuk memulai.`;

        openBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            container.classList.add('visible'); 
            if (output.innerHTML === '') {
                output.innerHTML = `<div>${welcomeMessage.replace(/\n/g, '<br>')}</div>`;
            }
            input.focus();
        });
        closeBtn.addEventListener('click', () => container.classList.remove('visible'));
        
        input.addEventListener('keydown', async (e) => {
            if (isExecuting) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    input.value = '';
                }
            }
            
            if (e.key === 'Enter' && input.value.trim() !== '') {
                isExecuting = true;
                const commandLine = input.value.trim();
                
                if (commandHistory[0] !== commandLine) {
                    commandHistory.unshift(commandLine);
                }
                historyIndex = -1;
                input.value = '';

                if (commandLine.toLowerCase() === 'clear') {
                    output.innerHTML = '';
                    isExecuting = false;
                    return; 
                }
                
                const [command, ...args] = commandLine.split(' ');
                const promptHtml = `<div><span class="prompt">guest@cxz.me:~$</span> <span>${commandLine}</span></div>`;
                output.insertAdjacentHTML('beforeend', promptHtml);
                
                const cmdFunction = terminalCommands[command.toLowerCase()];
                if (cmdFunction) {
                    try {
                        const result = await cmdFunction.call(terminalCommands, args, commandHistory);
                        if (result) {
                           output.insertAdjacentHTML('beforeend', `<div>${result}</div>`);
                        }
                    } catch (err) {
                        output.insertAdjacentHTML('beforeend', `<div class="error">Script error: ${err.message}</div>`);
                    }
                } else {
                    output.insertAdjacentHTML('beforeend', `<div class="error">command not found: ${command}</div>`);
                }
                
                // === PERBAIKAN FINAL AUTO-SCROLL ===
                // Scroll elemen #terminal-output, bukan #terminal-body
                output.scrollTop = output.scrollHeight; 
                
                isExecuting = false;
            }
        });
    }
    
    // ==========================================
    // === MEMANGGIL SEMUA FUNGSI (BAGIAN UTAMA) ===
    // ==========================================
    
    handleScroll();
    updateActiveLink();
    themeToggle();
    pageTransition();
    
    if (document.body.id === 'page-index') {
        typingEffect();
        handleContactForm();
        handleContactModal();
    } else if (document.body.id === 'page-tools') {
        initEncoderDecoderTool();
        initTerminal();
    }

    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveLink();
    });
});