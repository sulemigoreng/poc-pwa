// Register Book
var btn_add = document.getElementById("btn-add");
var btn_close = document.getElementById("btn-close")
var title_field = document.getElementById("bookTitle");
var synopsis_field = document.getElementById("bookSynopsis");
var cover_field = document.getElementById("bookCover");
var release_field = document.getElementById("releaseDate");
var author_field = document.getElementById("bookAuthor");
var genre_field = document.getElementById("bookGenre");
var pages_field = document.getElementById("bookPages");

btn_add.addEventListener("click", () => {
    let title = title_field.value;
    let synopsis = synopsis_field.value;
    let cover = cover_field.value.split('\\').pop();
    let releaseDate = release_field.value;
    let author = author_field.value;
    let genre = genre_field.value;
    let totalPage = pages_field.value;

    if (!title) {
        alert('Harap isi title !');
    } else if (title.length < 3) {
        alert('Panjang title minimal 3 !');
    } else if (!author) {
        alert('Harap isi author !');
    } else if (author.length < 5) {
        alert('Author minimal 5 !');
    } else if (!synopsis) {
        alert('Harap isi synopsis !');
    } else if (synopsis.length < 50) {
        alert('Synopsis minimal 50 !');
    }  else if (!cover) {
        alert('Harap upload cover !');
    } else if (!releaseDate) {
        alert('Harap upload release date!');
    } else if (!genre) {
        alert('Harap pilih genre !');
    } else if (!totalPage) {
        alert('Harap isi total page dengan angka!');
    } else {
        postBooks({ title, synopsis, cover, releaseDate, author, genre, totalPage }).then(
            (response) => {
                if ('errors' in response) {
                    btn_close.click();
                    alert('Gagal meregister buku!');
                    return;
                }
                btn_close.click();
                alert('Buku berhasil diregister!');
            }
            , (error) => {
                console.log(error);
            }
        );
    }


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

// Mobile UI
var btn_nav = document.getElementById("m-nav-btn");
var btn_nav_back = document.getElementById("m-btn-back");
var m_nav = document.getElementById("m-navbar");

btn_nav.addEventListener("click", () => {
    m_nav.classList.remove("m-navbar-hide");
    m_nav.classList.add("m-navbar");
});

btn_nav_back.addEventListener("click", () => {
    m_nav.classList.remove("m-navbar");
    m_nav.classList.add("m-navbar-hide");
});

