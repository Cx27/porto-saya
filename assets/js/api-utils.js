// === api-utils.js ===

/**
 * Ambil informasi perangkat & sistem dari browser
 */
export function getDeviceInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const screenRes = `${screen.width}x${screen.height}`;
    const language = navigator.language;
    return {
        userAgent: ua,
        platform: platform,
        screen: screenRes,
        language: language,
        os: detectOS()
    };
}

function detectOS() {
    const { userAgent, platform } = navigator;
    if (/Win/.test(platform)) return "Windows";
    if (/Mac/.test(platform)) return "macOS";
    if (/Linux/.test(platform)) return "Linux";
    if (/Android/.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
    return "Unknown";
}

/**
 * Ambil IP publik dan lokasi
 */
export async function getIPInfo() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to fetch IP info");
        const data = await res.json();
        return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            org: data.org,
            latitude: data.latitude,
            longitude: data.longitude
        };
    } catch (e) {
        return { error: e.message };
    }
}

/**
 * Dummy Whois lookup dengan API publik
 */
export async function whoisLookup(query) {
    try {
        const res = await fetch(`https://ipapi.co/${query}/json/`);
        if (!res.ok) throw new Error("Gagal fetch WHOIS");
        const data = await res.json();
        return data;
    } catch (e) {
        return { error: e.message };
    }
}


// =================================================================
// === FUNGSI BARU YANG DITAMBAHKAN UNTUK MENDAPATKAN IP PRIVAT ===
// =================================================================

/**
 * Mencoba mengambil IP Privat pengguna menggunakan trik WebRTC.
 * @returns {Promise<string>} Sebuah Promise yang akan resolve dengan IP Privat atau reject dengan error.
 */
export function getPrivateIP() {
    return new Promise((resolve, reject) => {
        try {
            // Membuat koneksi WebRTC palsu
            const pc = new RTCPeerConnection({ iceServers: [] });
            
            // Membuat data channel dummy untuk memicu proses
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));

            // Mendengarkan event 'onicecandidate' yang akan membocorkan IP
            pc.onicecandidate = (e) => {
                if (!e || !e.candidate || !e.candidate.candidate) {
                    return;
                }

                // Menggunakan Regex untuk menemukan semua alamat IP di dalam string kandidat
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
                const foundIPs = e.candidate.candidate.match(ipRegex);

                if (foundIPs) {
                    // Cari IP pertama yang cocok dengan rentang alamat IP Privat
                    const privateIP = foundIPs.find(ip => 
                        ip.startsWith('192.168.') || 
                        ip.startsWith('10.') || 
                        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) // Regex untuk 172.16.0.0 - 172.31.255.255
                    );

                    if (privateIP) {
                        pc.onicecandidate = null; // Hentikan pencarian setelah ditemukan
                        resolve(privateIP);      // Kirim hasilnya
                    }
                }
            };
            
            // Timeout jika tidak berhasil menemukan dalam 2 detik
            setTimeout(() => {
                reject(new Error('Timeout atau diblokir oleh browser/ekstensi.'));
            }, 2000);

        } catch (error) {
            reject(error); // Tangani error jika WebRTC tidak didukung
        }
    });
}