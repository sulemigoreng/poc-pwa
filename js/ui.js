var btn_add = document.getElementById("btn-add");
btn_add.addEventListener("click", () => {

});

async function renderBooks() {
    console.log('rendering books');
    let books = await getBooks();
    console.log(books);
    let html = '';
    books.forEach(book => {
        let htmlBook = `<div class="item mt-4">
                            <div class="gg-book-cover">
                                <img src="img/2767052 1.png" />
                            </div>
                            <div class="w-100 mt-2 gg-book-judul" style="font-weight:bold;font-size: 1.2rem;">${book.title}</div>
                            <div class="w-100 gg-penulis">${book.author}</div>
                        </div>`;
        html += htmlBook;
    });

    var bookList = document.getElementById("book-list");
    bookList.innerHTML = html;
}

renderBooks();