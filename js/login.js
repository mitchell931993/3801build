/* unused code */
var token;
		if(sessionStorage.getItem("token") != null){
			token = sessionStorage.getItem("token");
		}
		if(document.getElementById("spark-login")){
		sparkLogin(function(data) {
			console.log(data);
			console.log(data.access_token);
			token = data.access_token;
			sessionStorage.setItem("token", token);
			window.location = "main.html";
		});

}
