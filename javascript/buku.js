const listBuku = document.getElementById("bookList");

const books = JSON.parse(localStorage.getItem("books")) || [];

if (books.length === 0) {
    listBuku.innerHTML =
        "<p class='text-gray-500'>Belum ada buku.</p>";
}

books.forEach((buku, index) => {
    listBuku.innerHTML += `
    <a href="pinjamBuku.html?id=${buku.id}">
        <div class="bg-white aspect-[3/4] rounded-xl shadow-lg shadow-gray-900 hover:scale-105 transition">
            <img src="${buku.image}" class="h-96 w-full object-cover rounded-t-xl">
            <div class="p-4">
                <h3 class="font-bold text-lg">${buku.title}</h3>
                <p class="text-sm text-gray-600">${buku.author}</p>
                <p class="mt-2">${buku.description}</p>
            </div>
        </div>
    </a>
    `;
});
