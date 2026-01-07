// hamburger menu
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("menuOverlay");

    menu.classList.toggle("translate-x-full");
    overlay.classList.toggle("hidden");
}

// animasi teks hero
window.addEventListener("load", () => {
    document.querySelectorAll(".hero-text").forEach((el, i) => {
        setTimeout(() => {
            el.classList.remove("opacity-0", "translate-y-10");
            el.classList.add("transition-all", "duration-700");
        }, i * 150);
    });
});

const btnHomePage = document.getElementById('btnHomePage');
const btnHomePage2 = document.getElementById('btnHomePage2');
const homePage = document.getElementById('homePage');
const headerPage = document.getElementById('headerPage');
const footerPage = document.getElementById('footerPage');

// fungsi membuka home page
btnHomePage.addEventListener('click', () => {
    homePage.classList.remove('hidden');    
    footerPage.classList.remove('hidden');
});

btnHomePage2.addEventListener('click', () => {
    homePage.classList.remove('hidden');    
    footerPage.classList.remove('hidden');
});

const session = JSON.parse(sessionStorage.getItem("sessionLogin"));
const riwayatSection = document.getElementById("riwayatSection");
const riwayatList = document.getElementById("riwayatList");

// menampilkan riwayat peminjaman
if (session) {
    riwayatSection.classList.remove("hidden");

    const dataPinjam =
        JSON.parse(localStorage.getItem("dataPinjam")) || [];

    const riwayatUser = dataPinjam.filter(
        p => p.email === session.email
    );

    if (riwayatUser.length === 0) {
        riwayatList.innerHTML = `
            <p class="text-white">Belum ada riwayat peminjaman</p>
        `;
    } else {
        riwayatUser.forEach(p => {
            const denda = hitungDenda(p.tanggalPinjam, p.batasHari);

            riwayatList.innerHTML += `
                <div class="bg-white shadow rounded-xl p-3 md:p-5 w-auto">
                    <img src="${p.image}" class="w-24 h-32 m-2 object-cover rounded-md">
                    <h3 class="font-bold text-lg">${p.buku}</h3>
                    <p>Peminjam: ${p.username}</p>
                    <p>Waktu Peminjaman: ${formatTanggal(p.tanggalPinjam)}</p>
                    <p>Batas Peminjaman: ${p.batasHari} hari</p>

                    <p class="font-semibold mt-2">
                        Status:
                        <span class="${
                            p.status === "Dipinjam"
                                ? "text-red-600"
                                : "text-green-600"
                        }">${p.status}</span>
                    </p>

                    ${
                        denda > 0
                            ? `<p class="text-red-600 mt-2">Denda: Rp ${denda}</p>`
                            : `<p class="text-green-600 mt-2">Tidak ada denda</p>`
                    }

                    <div class="flex gap-3 mt-4">
                        ${
                            p.status === "Dipinjam"
                                ? `<button onclick="kembalikanBuku('${p.tanggalPinjam}')"
                                        class="bg-green-800 hover:bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 
                                        rounded transition-all duration-300"> Return Book
                                    </button>`
                                : ""
                        }

                        <button onclick="hapusRiwayat('${p.tanggalPinjam}')"
                            class="bg-red-800 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 
                            rounded transition-all duration-300"> Delete
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

// format tanggal
function formatTanggal(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID");
}

// fungsi kembalikan buku
function kembalikanBuku(tanggalPinjam) {
    let dataPinjam =
        JSON.parse(localStorage.getItem("dataPinjam")) || [];
    let dataBuku = JSON.parse(localStorage.getItem("books")) || [];

    dataPinjam = dataPinjam.map(p => {
        if (p.tanggalPinjam === tanggalPinjam) {
            p.status = "Dikembalikan";

            // cari buku dan kembalikan stok
            const buku = dataBuku.find(b => b.title === p.buku);
            if (buku) { buku.stok++; }
        }
        return p;
    });

    localStorage.setItem("dataPinjam", JSON.stringify(dataPinjam));
    localStorage.setItem("books", JSON.stringify(dataBuku));
    showAlert("Kembalikan Buku Berhasil", "Buku berhasil dikembalikan", "success");
    setTimeout(() => location.reload(), 1000);
}

// fungsi hitung denda
function hitungDenda(tanggalPinjam, batasHari) {
    const tarif = 500;

    const sekarang = new Date();
    const pinjam = new Date(tanggalPinjam);

    const batas = new Date(pinjam);
    batas.setDate(batas.getDate() + batasHari);

    if (sekarang <= batas) return 0;

    const selisihHari = Math.ceil(
        (sekarang - batas) / (1000 * 60 * 60 * 24)
    );

    return selisihHari * tarif;
}

// fungsi alert
function showAlert(title, message, type = "error") {
    const alertBox = document.getElementById("alertBox");
    if (!alertBox) return;

    alertTitle.innerText = title;
    alertMessage.innerText = message;

    alertTitle.className =
        "text-xl font-bold mb-3 " +
        (type === "success" ? "text-green-600" : "text-red-600");

    alertBox.classList.remove("hidden");
    alertBox.classList.add("flex");
    alertBox.classList.add("items-center", "justify-center");
}

function closeAlert() {
    const alertBox = document.getElementById("alertBox");
    alertBox.classList.add("hidden");
    alertBox.classList.remove("flex");
}

// fungsi hapus riwayat
function hapusRiwayat(tanggalPinjam) {
    const yakin = confirm("Yakin ingin menghapus riwayat ini?");
    if (!yakin) return;

    let dataPinjam =
        JSON.parse(localStorage.getItem("dataPinjam")) || [];
    let dataBuku = JSON.parse(localStorage.getItem("books")) || [];

    const riwayatDihapus = dataPinjam.find(p => p.tanggalPinjam === tanggalPinjam);

    if (riwayatDihapus && riwayatDihapus.status !== "Dikembalikan") {
        const buku = dataBuku.find(b => b.title === riwayatDihapus.buku);
        if (buku) {
            buku.stok++;
        }
    }

    dataPinjam = dataPinjam.filter(
        p => p.tanggalPinjam !== tanggalPinjam
    );

    localStorage.setItem("dataPinjam", JSON.stringify(dataPinjam));
    localStorage.setItem("books", JSON.stringify(dataBuku));
    showAlert("Hapus Riwayat Berhasil", "Riwayat berhasil dihapus", "success");
    setTimeout(() => location.reload(), 1000);
}

function logout() {
    localStorage.removeItem("sessionLogin");
    showAlert("Logout Berhasil", "Anda telah logout.", "success");
    setTimeout(() => location.reload(), 1000);
};