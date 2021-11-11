<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<script src="https://www.gstatic.com/firebasejs/5.5.9/firebase.js"></script>
</head>
<body>
<form action="/v2">
<input id="token" name="token">
<button>전송</button>
</form>


<script>
let personalToken;

var firebaseConfig = {
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

messaging.requestPermission()
.then(function(){
    console.log("Have permission");
    return messaging.getToken();
})
.then(function(token){
	personalToken = token;
	document.querySelector('#token').value = token;
	
	fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
           "Content-type" : "application/json",
           "Authorization" : "key=AAAAIAXxoak:APA91bGuubBZCHfvSSPN_yw8rEfhumhgpTP6X4rjERJs_tqyI-pNwknvKEJJc4twQ0AOAfVhANoIed06cawuXlV_P8koCT6tmHQy6zwbmeVvppHFt_7--bIyN4rinKlfBN_O4lV8_63X",
        },
        body: JSON.stringify({
           notification: {
              body : '집에보내줘!',
              title : '호에엥',
           },
           to: '${token}'
        }),
     })
     .then((response) => response.json())
     .then((data) => console.log(data));

	
    console.log(token);
})
.catch(function(arr){
    console.log("Error Occured");
});

</script>
</body>
</html>