if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.log('service worker not registered', err));
}

async function getBooks() {
    let url = 'https://glibrary-api.staging-gi.web.id/api/Books';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function postBooks({
    title, synopsis, cover, releaseDate, 
    author, genre, totalPage
}) {
    let url = 'https://glibrary-api.staging-gi.web.id/api/Books';
    try {
        let page = parseInt(totalPage, 10);
        console.log(totalPage);
        console.log(page);
        let res = await fetch(url, {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, synopsis, cover, releaseDate, author, genre, totalPage:parseInt(totalPage, 10)})
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}