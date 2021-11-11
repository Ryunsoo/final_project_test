importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

var config = {
	apiKey: "AIzaSyAoWuQ1n9ofCzjLvW7qkx2thYixK4VCFrU",
	authDomain: "medibook-69140.firebaseapp.com",
	projectId: "medibook-69140",
	storageBucket: "medibook-69140.appspot.com",
	messagingSenderId: "137538675113",
	appId: "1:137538675113:web:bbfdce87a2c1eaefd0a4b8",
	measurementId: "G-SMD4V6S7RC"
}

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onMessage((payload) => {
	console.log("payload" + payload)
})

messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    
    return self.registration.showNotification(title, options);
});

//let self;

/*function initInSw() {
	importScripts('https://www.gstatic.com/firebasejs/5.9.2/firebase-app.js');
	importScripts('https://www.gstatic.com/firebasejs/5.9.2/firebase-messaging.js');

	let firebaseConfig = {
		apiKey: "AIzaSyAoWuQ1n9ofCzjLvW7qkx2thYixK4VCFrU",
		authDomain: "medibook-69140.firebaseapp.com",
		projectId: "medibook-69140",
		storageBucket: "medibook-69140.appspot.com",
		messagingSenderId: "137538675113",
		appId: "1:137538675113:web:bbfdce87a2c1eaefd0a4b8",
		measurementId: "G-SMD4V6S7RC"	
	};
	
	firebase.initializeApp(firebaseConfig);
	
	const messaging = firebase.messaging();
}

function onBackgroundMessage() {
  const messaging = firebase.messaging();

  // [START messaging_on_background_message]
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  // [END messaging_on_background_message]
}*/

