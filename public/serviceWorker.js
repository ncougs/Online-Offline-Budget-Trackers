const static = 'budget-tracker';
const assets = ['index.html', 'styles.css', 'index.js'];

self.addEventListener('install', (installEvent) => {
	installEvent.waitUntil(
		caches.open(static).then((cache) => {
			cache.addAll(assets);
		})
	);
});

addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response; // if valid response is found in cache return it
			} else {
				return fetch(event.request) //fetch from internet
					.then(function (res) {
						return caches.open(static).then(function (cache) {
							cache.put(event.request.url, res.clone()); //save the response for future
							return res; // return the fetched data
						});
					})
					.catch(function (err) {
						// fallback mechanism
						return caches.open(static).then(function (cache) {
							return cache.match('index.html');
						});
					});
			}
		})
	);
});
