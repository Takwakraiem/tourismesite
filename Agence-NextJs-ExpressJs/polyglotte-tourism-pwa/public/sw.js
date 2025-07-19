// const CACHE_NAME = "polyglotte-tourism-v1"
// const urlsToCache = [
//   "/",
//   "/countries",
//   "/home/tunisia",
//   "/home/morocco",
//   "/home/maghreb",
//   "/admin",
// ]

// self.addEventListener("install", (event) => {
//   event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
// })

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         return response
//       }
//       return fetch(event.request)
//     }),
//   )
// })

// self.addEventListener("push", (event) => {
//   if (event.data) {
//     const data = event.data.json()
//     const options = {
//       body: data.body,
//       icon: "/icon-192x192.png",
//       badge: "/icon-192x192.png",
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: "2",
//       },
//       actions: [
//         {
//           action: "explore",
//           title: "Voir les détails",
//           icon: "/icon-192x192.png",
//         },
//         {
//           action: "close",
//           title: "Fermer",
//           icon: "/icon-192x192.png",
//         },
//       ],
//     }
//     event.waitUntil(self.registration.showNotification(data.title, options))
//   }
// })

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close()

//   if (event.action === "explore") {
//     event.waitUntil(clients.openWindow("/"))
//   } else if (event.action === "close") {
//     // Just close the notification
//   } else {
//     event.waitUntil(clients.openWindow("/"))
//   }
// })
