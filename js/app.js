// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.log('service worker not registered', err));
}

function getBooksFromDB() {
    return new Promise(function (resolve, reject) {
        var open = indexedDB.open("MyDatabase", 5);
        var getBooks;
        open.onupgradeneeded = function () {
            var db = open.result;
            var store = db.createObjectStore("BookObjectStore", { keyPath: "id" });
        };
        open.onsuccess = function () {
            // Start a new transaction
            var db = open.result;
            var tx = db.transaction("BookObjectStore", "readonly");
            var store = tx.objectStore("BookObjectStore");

            getBooks = store.getAll();

            getBooks.onsuccess = function () {
                console.log("book result", getBooks.result);
                resolve(getBooks.result);
            };

            // Close the db when the transaction is done
            tx.oncomplete = function () {
                db.close();
            };
        };
    });
}

async function getBooks() {
    if (navigator.onLine) {
        console.log("getting data online");
        let url = 'https://glibrary-api.staging-gi.web.id/api/Books';
        try {
            let res = await fetch(url);
            let resJson = await res.json();
            storeToDB(resJson);
            return await resJson;
        } catch (error) {
            console.log(error);
        }
    } else {
        alert('anda sedang membuka website dalam versi offline');
        console.log("getting data offline");
        var hasil = await getBooksFromDB()
            .then((result) => {
                console.log("Resultnya", result);
                return result;
            });
        return hasil;
    }
}

function storeToDB(books) {
    console.log('storeToDb', books);

    // Open (or create) the database
    var open = indexedDB.open("MyDatabase", 5);

    // Create the schema
    open.onupgradeneeded = function () {
        var db = open.result;
        var store = db.createObjectStore("BookObjectStore", { keyPath: "id" });
    };

    open.onsuccess = function () {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("BookObjectStore", "readwrite");
        var store = tx.objectStore("BookObjectStore");

        console.log("onsuccess storeDb");
        for (i = 0; i < books.length; i++) {
            books[i]['status'] = "Registered";
            console.log(books[i]);
            store.put(books[i]);
        }

        // Close the db when the transaction is done
        tx.oncomplete = function () {
            db.close();
        };
    };
}

function postBookToDb({
    title, synopsis, cover, releaseDate,
    author, genre, totalPage
}) {
    console.log("postBookToDb");
    // Open (or create) the database
    var open = indexedDB.open("MyDatabase", 5);

    // Create the schema
    open.onupgradeneeded = function () {
        var db = open.result;
        var store = db.createObjectStore("BookObjectStore", { keyPath: "id" });
    };

    open.onsuccess = function () {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("BookObjectStore", "readwrite");
        var store = tx.objectStore("BookObjectStore");

        store.put({
            "id": Date.now(),
            "title": title,
            "synopsis": synopsis,
            "cover": cover,
            "releaseDate": releaseDate,
            "author": author,
            "genre": genre,
            "totalPage": totalPage,
            "status": "Pending"
        });

        // Close the db when the transaction is done
        tx.oncomplete = function () {
            db.close();
        };
    };

    return {
        "id": 99,
        "title": title,
        "synopsis": synopsis,
        "cover": cover,
        "releaseDate": releaseDate,
        "author": author,
        "genre": genre,
        "totalPage": totalPage,
        "status": "Pending"
    };
}

async function postBooks({
    title, synopsis, cover, releaseDate,
    author, genre, totalPage
}) {
    if (navigator.onLine) {
        let url = 'https://glibrary-api.staging-gi.web.id/api/Books';
        try {
            let page = parseInt(totalPage, 10);
            console.log(totalPage);
            console.log(page);
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, synopsis, cover, releaseDate, author, genre, totalPage: parseInt(totalPage, 10) })
            });
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    } else {
        return await postBookToDb({
            title, synopsis, cover, releaseDate,
            author, genre, totalPage
        });
    }

}