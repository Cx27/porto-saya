// Menunggu hingga seluruh konten halaman HTML dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {
    
    const header = document.getElementById('main-header');
    
    // --- Fitur 1: Header menjadi solid saat di-scroll ---
    // Fungsi ini akan menambahkan class 'scrolled' ke header jika pengguna
    // telah menggulir halaman lebih dari 50 piksel ke bawah.
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // --- Fitur 2: Animasi fade-in untuk section saat terlihat di layar ---
    // Menggunakan Intersection Observer API untuk efisiensi.
    const sections = document.querySelectorAll('.content-section, .hero-section');

    const observerOptions = {
        root: null, // Menggunakan viewport browser sebagai area pengamatan
        rootMargin: '0px',
        threshold: 0.1 // Animasi akan terpicu jika 10% dari elemen terlihat
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen masuk ke dalam viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Hentikan pengamatan setelah animasi dijalankan sekali agar hemat resource
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Menerapkan observer ke setiap section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // --- Fitur 3: Memberi class 'active' pada link navigasi yang sesuai dengan section yang terlihat ---
    const navLinks = document.querySelectorAll('nav a');
    const allSections = document.querySelectorAll('section');

    function updateActiveLink() {
        let currentSectionId = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Cek apakah posisi scroll sudah melewati bagian atas section
            if (window.scrollY >= sectionTop - header.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Loop melalui semua link navigasi untuk mengupdate class 'active'
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Jika href dari link cocok dengan ID section yang sedang aktif
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Menambahkan event listener untuk setiap kali pengguna melakukan scroll
    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveLink();
    });

    // Jalankan sekali saat halaman pertama kali dimuat
    updateActiveLink();
});
