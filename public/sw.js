self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: data.badge || "/badge.png",
      vibrate: [100, 50, 100],
      data: data.data || {}, // Pass the actual notification data including actionUrl
      actions: data.actions || [],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log('Notification click received.');

  event.notification.close();

  // Get the notification data (including actionUrl)
  const notificationData = event.notification.data || {};

  // Check if an action button was clicked
  let urlToOpen;
  if (event.action) {
    // Action button clicked - use action-specific URL if available
    urlToOpen = notificationData[event.action + 'Url'] || notificationData.url || notificationData.actionUrl || '/';
  } else {
    // Main notification clicked - use default URL
    urlToOpen = notificationData.url || notificationData.actionUrl || '/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Check if there's already a window/tab open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        // If a window is already open, focus it and navigate to the URL
        if ('focus' in client) {
          client.focus();
          return client.navigate(urlToOpen);
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
