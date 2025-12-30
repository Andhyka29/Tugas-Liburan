// floating label form
const floatingLabelsLogin = document.querySelectorAll(".floatingLogin");
floatingLabelsLogin.forEach(label => {
    label.classList.add(
        "absolute", "left-4", "top-3", "text-gray-500", "bg-white", "px-1", "transition-all",
        "peer-placeholder-shown:top-3",
        "peer-placeholder-shown:text-base",
        "peer-focus:-top-2",
        "peer-focus:text-sm",
        "peer-focus:text-sky-800"
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

// fungsi toggle log in dan register
function toggleForm() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm.classList.contains("hidden")) {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
    }
}

// fungsi validasi email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// fungsi register 
let PENGGUNA_KEY = [];

const registerButton = document.getElementById("register");
registerButton.addEventListener("click", () => {
    const username = document.getElementById("regUsername").value;
    const noKTP = document.getElementById("regKtp").value; 
    const email = document.getElementById("regEmail").value;
    const passwordreg = document.getElementById("regPassword").value;
    const confirmPasswordreg = document.getElementById("regPassword2").value;

    // validasi nomor KTP harus 16 digit angka
    if (!/^\d{16}$/.test(noKTP)) {
        showAlert("Registrasi gagal", "Nomor KTP harus 16 digit angka ya!");
        return;
    }

    // validasi email
    if (!validateEmail(email)) {
        showAlert("Registrasi Gagal", "Email tidak valid!");
        return;
    }

    // validasi konfirmasi password
    if (passwordreg !== confirmPasswordreg) {
        showAlert("Registrasi Gagal", "Konfirmasi password tidak sesuai!");
        return;
    }

    // validasi email yang terdaftar
    const existingUser = PENGGUNA_KEY.find(p => p.email === email);
    if (existingUser) {
        showAlert("Registrasi Gagal", "Email sudah terdaftar. Silakan gunakan email lain.");
        return;
    }
    
    PENGGUNA_KEY.push({
        username,
        email,
        passwordreg,
        noKTP
    });
    
    console.log(PENGGUNA_KEY);
    localStorage.setItem("akunPengguna", JSON.stringify(PENGGUNA_KEY));

    showAlert("Registrasi Berhasil", "Akun Anda telah dibuat. Silakan login.", "success");
});

window.addEventListener('load', () => { 
    const data_akun = localStorage.getItem('akunPengguna');
    if (data_akun) {
        PENGGUNA_KEY = JSON.parse(data_akun);
    }
    console.log(PENGGUNA_KEY);
});

// validasi log in
document.getElementById("login").addEventListener('click', () => {
    const email = document.getElementById("loginEmail").value;
    const passwordlogin = document.getElementById("loginPassword").value;

    const user = PENGGUNA_KEY.find(p =>
        p.email === email && p.passwordreg === passwordlogin
    );
    
    // validasi email
    if (!validateEmail(email)) {
        showAlert("Login Gagal", "Email tidak valid!");
        return;
    }

    if (!user) {
        showAlert("Login Gagal", "Email atau password salah!");
        return; 
    }

    // simpan status login di localStorage
    localStorage.setItem("sessionLogin", JSON.stringify({
        username: user.username,
        email: user.email
    }));
    
    showAlert("Login Berhasil", "Selamat datang, " + user.username + "!", "success");
    window.location.href = "index.html";
});
