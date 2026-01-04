document.addEventListener("DOMContentLoaded", () => {
    // ambil id buku dari URL
    const params = new URLSearchParams(window.location.search);
    const bukuId = params.get("id");

    // ambil data buku dari localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // cari buku sesuai id
    const bukuDipilih = books.find(b => b.id == bukuId);

    if (!bukuDipilih) {
        alert("Buku tidak ditemukan");
        window.location.href = "index.html";
    }

    // fungsi alert
    function showAlert(title, message, type = "error") {
        const alertTitle = document.getElementById("alertTitle");
        const alertMessage = document.getElementById("alertMessage");

        const alertBox = document.getElementById("alertBox");
        if (!alertBox) return;

        alertTitle.innerText = title;
        alertMessage.innerText = message;

        alertTitle.className =
            "text-xl font-bold mb-3 " +
            (type === "success" ? "text-green-600" : "text-red-600");

        alertBox.classList.remove("hidden");
        alertBox.classList.add("flex","items-center","justify-center");
    }

    window.closeAlert = function () {
        document.getElementById("alertBox").classList.add("hidden");
    };

    const usernameInput = document.getElementById("usernamePeminjam");
    const emailInput    = document.getElementById("emailPeminjam");
    const batasSelect   = document.getElementById("borrowBatasHari");
    const btnSubmit     = document.getElementById("submitPinjam");

    // tampilkan info buku
    document.getElementById("infoBuku").classList.remove("hidden");
    document.getElementById("imgBuku").src = bukuDipilih.image;
    document.getElementById("judulBuku").innerText = bukuDipilih.title;
    document.getElementById("deskripsiBuku").innerText = bukuDipilih.description;

    // isi otomatis nama buku ke input
    const bukuInput = document.getElementById("namaBuku");
    bukuInput.value = bukuDipilih.title;
    bukuInput.disabled = true;


    // event submit pinjam
    document.getElementById("pinjamForm")
        .addEventListener("submit", (e) => {
        e.preventDefault();

        const session = JSON.parse(localStorage.getItem("sessionLogin"));

        if (!session) {
            showAlert("Akses Ditolak", "Silakan login terlebih dahulu", "error");
            setTimeout(() => location.href = "login.html", 3000);
            return;
        }

        if (!batasSelect.value) {
            showAlert("Gagal", "Harap pilih batas peminjaman", "error");
            return;
        }
        // ambil data pinjam dari localStorage  
        const databuku = localStorage.getItem("dataPinjam");
        let DATA_PINJAM = [];
        if (databuku) {
            DATA_PINJAM = JSON.parse(databuku);
        } 

        const pinjam = {
            username: session.username,
            email: session.email,

            bukuId: bukuDipilih.id,
            buku: bukuDipilih.title,
            image: bukuDipilih.image,
            deskripsi: bukuDipilih.description,

            tanggalPinjam: "2025-02-08",
            batasHari: parseInt(batasSelect.value),
            status: "Dipinjam"
        };

        DATA_PINJAM.push(pinjam);
        localStorage.setItem("dataPinjam", JSON.stringify(DATA_PINJAM));

        showAlert("Berhasil", "Buku berhasil dipinjam", "success");

        setTimeout(() => location.href = "index.html", 2000);
    });
});
