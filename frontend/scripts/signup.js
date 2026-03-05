// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlu9ctyW7loHals1u18osXSz-QyNfnB_k",
  authDomain: "veritas-revi.firebaseapp.com",
  projectId: "veritas-revi",
  appId: "1:556623032885:web:e42be35612adeacac6f77c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();


// SIGNUP FUNCTION
function signup(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const status = document.getElementById("status");

    if(email === "" || password === "" || confirmPassword === ""){
        status.innerText = "Please fill all fields.";
        status.style.color = "red";
        return;
    }

    if(password !== confirmPassword){
        status.innerText = "Passwords do not match.";
        status.style.color = "red";
        return;
    }

    auth.createUserWithEmailAndPassword(email,password)
    .then((userCredential)=>{

        status.innerText = "Account created successfully!";
        status.style.color = "lightgreen";

        setTimeout(()=>{
            window.location.href="login.html";
        },1000);

    })
    .catch((error)=>{

        status.innerText = error.message;
        status.style.color = "red";

    });

}


// GO BACK TO LOGIN
function goToLogin(){

    window.location.href="login.html";

}