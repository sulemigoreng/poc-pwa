const STATIC_CACHE_NAME = 'site-static-v2';
const DYNAMIC_CACHE_NAME = 'site-dynamic-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/css/style.css',
    '/css/bootstrap.min.css',
    '/js/bootstrap.bundle.min.js',
    '/pages/fallback.html'
];

self.addEventListener('install', evt => {
    // console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log('caching shell assets');
            cache.addAll(ASSETS);
        })
    );
});
//
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
          //console.log(keys);
          return Promise.all(keys
            .filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
            .map(key => caches.delete(key))
          );
        })
      );
});

self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
          return cacheRes || fetch(evt.request).then(fetchRes => {
            return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
              limitCacheSize(DYNAMIC_CACHE_NAME, 15);
              return fetchRes;
            })
          });
        }).catch(() => {
          if(evt.request.url.indexOf('.html') > -1){
            return caches.match('/pages/fallback.html');
          } 
        })
      );
});
