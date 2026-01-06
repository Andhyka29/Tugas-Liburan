const listBuku = document.getElementById("bookList");

const prepareBook =   
    [{
            id: 1,
            title: "Tentang Kamu",
            author: "Tere Liye",
            image: "images/tentangKamu.jpg",
            description: "Novel kehidupan",
            stok: 5
        },
        {
            id: 2,
            title: "Atomic Habbits",
            author: "James Clear",
            image: "images/atomicHabbits.jpg",
            description: "Buku pengembangan diri",
            stok: 5
        },
        {
            id: 3,
            title: "Psychology of Money",
            author: "Morgan Housel",
            image: "images/psychologyMoney.jpg",
            description: "Buku pengembangan diri",
            stok: 5
        },
        {
            id: 4,
            title: "Filosofi Teras",
            author: "Henry Manampiring",
            image: "images/filosofiTeras.jpg",
            description: "Buku filosofi",
            stok: 5
        },
    ];

let books = [];
const dataBuku = localStorage.getItem("books");
    if (dataBuku) {
        books = JSON.parse(dataBuku);
    } else {
        books = prepareBook;
    }

localStorage.setItem("books", JSON.stringify(books));

if (books.length === 0) {
    listBuku.innerHTML =
        "<p class='text-gray-500'>Belum ada buku.</p>";
}

books.forEach((buku) => {
    listBuku.innerHTML += `
    <a href="pinjamBuku.html?id=${buku.id}">
        <div class="bg-white aspect-[3/4] rounded-xl shadow-lg shadow-gray-900 hover:scale-105 transition">
            <img src="${buku.image}" class="h-96 w-full object-cover rounded-t-xl">
            <div class="p-4">
                <h3 class="font-bold text-lg">${buku.title}</h3>
                <p class="text-sm text-gray-600">${buku.author}</p>
                <p class="mt-2">${buku.description}</p>
                <p class="mt-2">Stok: ${buku.stok}</p>
            </div>
        </div>
    </a>
    `;
});

// books.forEach((buku, index) => {
//     listBuku.innerHTML += `
//     <a href="pinjamBuku.html?id=${prepareBook[index].id}">
//         <div class="bg-white aspect-[3/4] rounded-xl shadow-lg shadow-gray-900 hover:scale-105 transition">
//             <img src="${prepareBook[index].image}" class="h-96 w-full object-cover rounded-t-xl">
//             <div class="p-4">
//                 <h3 class="font-bold text-lg">${prepareBook[index].title}</h3>
//                 <p class="text-sm text-gray-600">${prepareBook[index].author}</p>
//                 <p class="mt-2">${prepareBook[index].description}</p>
//                 <p class="mt-2">Stok: ${prepareBook[index].stok}</p>
//             </div>
//         </div>
//     </a>
//     `;
// });


