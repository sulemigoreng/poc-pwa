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