let ADMIN_KEY = JSON.parse(localStorage.getItem("akunAdmin")) || [];
let BOOKS = JSON.parse(localStorage.getItem("books")) || [];

// floating label form
const floatingLabelsAdmin = document.querySelectorAll(".floatingAdmin");
floatingLabelsAdmin.forEach(label => {
    label.classList.add(
        "relative", "left-4", "top-3", "text-gray-500",
        "bg-white", "px-1", "transition-all",
    );
});

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

// fungsi validasi email
function validateEmail(emailAdmin) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAdmin);
}

// fungsi toggle log in dan register
function toggleFormAdmin() {
    const loginFormAdmin = document.getElementById("loginFormAdmin");
    const registerFormAdmin = document.getElementById("registerFormAdmin");

    if (loginFormAdmin.classList.contains("hidden")) {
        loginFormAdmin.classList.remove("hidden");
        registerFormAdmin.classList.add("hidden");
    } else {
        loginFormAdmin.classList.add("hidden");
        registerFormAdmin.classList.remove("hidden");
    }
}

// fungsi register admin
const registerButton = document.getElementById("registerAdmin");
registerButton.addEventListener("click", () => {
    const usernameAdmin = document.getElementById("regUsernameAdmin").value;
    const emailAdmin = document.getElementById("regEmailAdmin").value;
    const passwordregAdmin = document.getElementById("regPasswordAdmin").value;
    const confirmPasswordregAdmin = document.getElementById("regPassword2Admin").value;

    // validasi email
    if (!validateEmail(emailAdmin)) {
        showAlert("Registrasi Gagal", "Email tidak valid!");
        return;
    }

    // validasi konfirmasi password
    if (passwordregAdmin !== confirmPasswordregAdmin) {
        showAlert("Registrasi Gagal", "Konfirmasi password tidak sesuai!");
        return;
    }

    // validasi email yang terdaftar
    const existingUser = ADMIN_KEY.find(p => p.emailAdmin === emailAdmin);
    if (existingUser) {
        showAlert("Registrasi Gagal", "Email ini sudah terdaftar. Silakan gunakan email lain.");
        return;
    }
    
    ADMIN_KEY.push({
        usernameAdmin,
        emailAdmin,
        passwordregAdmin,
    });
    
    console.log(ADMIN_KEY);
    localStorage.setItem("akunAdmin", JSON.stringify(ADMIN_KEY));

    showAlert("Registrasi Berhasil", "Akun Admin Anda telah dibuat. Silakan login.", "success");
    toggleFormAdmin();
});

// validasi log in admin
window.addEventListener('load', () => { 
    const data_admin = localStorage.getItem('akunAdmin');
    if (data_admin) {
        ADMIN_KEY = JSON.parse(data_admin);
    }
    console.log(ADMIN_KEY);
});

// fungsi log in admin
document.getElementById("loginAdmin").addEventListener('click', () => {
    const emailAdmin = document.getElementById("loginEmailAdmin").value;
    const passwordloginAdmin = document.getElementById("loginPasswordAdmin").value;
    const dashboardAdmin = document.getElementById("dashboardAdmin");
    const formAdmin = document.getElementById("formAdmin");

    const user = ADMIN_KEY.find(p =>
        p.emailAdmin === emailAdmin && p.passwordregAdmin === passwordloginAdmin
    );

    // validasi email
    if (!validateEmail(emailAdmin)) {
        showAlert("Login Gagal", "Email tidak valid!");
        return;
    }

    if (!user) {
        showAlert("Login Gagal", "Email atau password Admin salah!");
        return; 
    }

    // simpan status login di localStorage
    localStorage.setItem("sessionLoginAdmin", JSON.stringify({
        usernameAdmin: user.usernameAdmin,
        emailAdmin: user.emailAdmin
    }));

    showAlert("Login Berhasil", "Selamat datang, " + user.usernameAdmin + "!", "success");
    dashboardAdmin.classList.remove("hidden");
    formAdmin.classList.add("hidden");
});

// fungsi tambah buku admin
const formTambahBuku = document.getElementById("formTambahBuku");
const defaultSubmit = (e) => {
    e.preventDefault();

    if (!judul.value || !penulis.value || !gambar.value || !deskripsi.value) {
        showAlert("Tambah Buku Gagal", "Isi semua field!");
        return; 
    }

    const bukuBaru = {
        id: BOOKS.length + 1,
        title: judul.value,
        author: penulis.value,
        image: gambar.value,
        description: deskripsi.value,
        stok: Number(stok.value)
    };

    BOOKS.push(bukuBaru);
    localStorage.setItem("books", JSON.stringify(BOOKS));

    adminAlert.innerText = "Buku berhasil ditambahkan";
    adminAlert.classList.remove("hidden");

    renderBukuAdmin();
    renderStatistik();
    formTambahBuku.reset();
    window.location.href = "#listBukuAdmin";
};

formTambahBuku.onsubmit = defaultSubmit;

// render buku admin
function renderBukuAdmin() {
    const list = document.getElementById("listBukuAdmin");
    list.innerHTML = "";

    BOOKS.forEach((buku, index) => {
        list.innerHTML += `
        <div class="border rounded p-4 flex gap-4 items-center">
            <img src="${buku.image}" class="w-20 h-28 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold">${buku.title}</h3>
                <p class="text-sm text-gray-600">${buku.author}</p>
            </div>
            <a href="#dashboardAdmin">
                <button onclick="editBuku(${index})"
                    class="px-3 py-1 bg-green-800 hover:bg-green-600 text-white rounded
                    transition-all duration-300"> Edit
                </button>
            </a>
            <button onclick="hapusBuku(${index})"
                class="px-3 py-1 bg-red-800 hover:bg-red-600 text-white rounded
                transition-all duration-300"> Delete
            </button>
        </div>`;
    });
}

// fungsi hapus buku admin
function hapusBuku(index) {
    const yakin = confirm("Yakin ingin menghapus buku ini?");
    if (!yakin) return;

    BOOKS.splice(index, 1);
    localStorage.setItem("books", JSON.stringify(BOOKS));
    showAlert("Hapus Buku Berhasil", "Buku berhasil dihapus", "success");

    renderBukuAdmin();
}

// fungsi edit buku admin
function editBuku(index) {
    const buku = BOOKS[index];

    judul.value = buku.title;
    penulis.value = buku.author;
    gambar.value = buku.image;
    stok.value = buku.stok;
    deskripsi.value = buku.description;

    formTambahBuku.onsubmit = (e) => {
        e.preventDefault();

        buku.title = judul.value;
        buku.author = penulis.value;
        buku.image = gambar.value;
        buku.stok = Number(stok.value);
        buku.description = deskripsi.value;

        localStorage.setItem("books", JSON.stringify(BOOKS));
        showAlert("Update Buku Berhasil", "Buku berhasil diupdate", "success");

        renderBukuAdmin();
        renderStatistik();

        adminAlert.innerText = "Buku berhasil diupdate";
        adminAlert.classList.remove("hidden");

        formTambahBuku.reset();
        formTambahBuku.onsubmit = defaultSubmit;
        window.location.href = "#listBukuAdmin";
    };
}

// fungsi reset submit
function resetSubmit() {
    formTambahBuku.onsubmit = defaultSubmit;
}

// render statistik admin
function renderStatistik() {
    const pinjaman = JSON.parse(localStorage.getItem("dataPinjam")) || [];

    document.getElementById("statBuku").innerText = BOOKS.length;
    document.getElementById("statPinjam").innerText = pinjaman.length;
    document.getElementById("statAktif").innerText =
        pinjaman.filter(p => p.status === "Dipinjam").length;
}

renderBukuAdmin();
renderStatistik();


