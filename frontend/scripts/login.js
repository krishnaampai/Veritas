
firebase.initializeApp(window.firebaseConfig);

const auth = firebase.auth();



function login(){

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const status = document.getElementById("status");

    if(email === "" || password === ""){
        status.innerText = "Please enter email and password.";
        status.style.color = "red";
        return;
    }

    auth.signInWithEmailAndPassword(email,password)
    .then((userCredential)=>{

        status.innerText = "Login successful!";
        status.style.color = "green";

        
        setTimeout(()=>{
            window.location.href = "review.html";
        },1000);

    })
    .catch((error)=>{

        status.innerText = "Invalid login Credentials";
        status.style.color = "red";

    });

}



function goToSignup(){

    window.location.href = "signup.html";

}
function goToConsumer(){
    window.location.href = "consumer.html";
}