firebase.initializeApp(window.firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
let html5QrCode;
let rating = 0;


auth.onAuthStateChanged(function(user){

if(!user){
window.location.href="login.html";
}

});


const fileInput = document.getElementById("qrFile");

window.addEventListener("load", () => {

    html5QrCode = new Html5Qrcode("reader");

});

window.addEventListener("DOMContentLoaded", () => {

  const stars = document.querySelectorAll("#stars span");
  stars.forEach(star => {

  star.addEventListener("click", () => {

  rating = star.dataset.value;

  stars.forEach(s => s.classList.remove("active"));
  for(let i=0;i<rating;i++){
  stars[i].classList.add("active");
}

});

});

});



//  Scan using camera

function startCamera(){

    document.getElementById("reader").style.display = "block";

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        decodedText => {

            document.getElementById("productId").value = decodedText;

            html5QrCode.stop();

        }
    );

}


//  Upload QR image
window.addEventListener("load", () => {

    const fileInput = document.getElementById("qrFile");

    fileInput.addEventListener("change", e => {

        if (e.target.files.length === 0) return;

        const imageFile = e.target.files[0];

        html5QrCode.scanFile(imageFile, true)
            .then(decodedText => {

                document.getElementById("productId").value = decodedText;
                console.log("QR decoded:", decodedText);

            })
            .catch(err => {
                console.log("QR scan failed", err);
                alert("Could not read QR code");
            });

    });

});



// 📝 Submit Review
function submitReview(){

    const productId = document.getElementById("productId").value;
    const reviewText = document.getElementById("reviewText").value;

    if(!productId || !reviewText || rating === 0){
        alert("Please complete all fields");
        return;
    }

    db.collection("reviews").add({

        productId: productId,
        reviewText: reviewText,
        rating: rating,
        userEmail: auth.currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()

    })
    .then(() => {

        alert("Review submitted successfully");

        document.getElementById("productId").value = "";
        document.getElementById("reviewText").value = "";

        rating = 0;
        
       const stary = document.querySelectorAll("#stars span");
        stary.forEach(s => s.classList.remove("active"));

    })
    .catch(error => {

        console.log(error);
        //alert("Error submitting review");

    });

}


// Logout
function logout(){
    auth.signOut().then(()=>{
        window.location.href = "login.html";
    });
}