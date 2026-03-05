
const firebaseConfig = {
  apiKey: "AIzaSyBlu9ctyW7loHals1u18osXSz-QyNfnB_k",
  authDomain: "veritas-revi.firebaseapp.com",
  projectId: "veritas-revi",
  appId: "1:556623032885:web:e42be35612adeacac6f77c"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let rating = 0;


auth.onAuthStateChanged(function(user){

if(!user){
window.location.href="login.html";
}

});



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



function submitReview(){

const user = auth.currentUser;

const productId = document.getElementById("productId").value;
const review = document.getElementById("reviewText").value;
const status = document.getElementById("status");

if(productId=="" || review=="" || rating==0){

status.innerText="Please complete all fields.";
return;

}

db.collection("reviews").add({

productId: productId,
reviewText: review,
rating: rating,
userEmail: user.email,
timestamp: firebase.firestore.FieldValue.serverTimestamp()

})
.then(()=>{

status.innerText="Review submitted successfully!";

document.getElementById("reviewText").value="";
rating=0;
stars.forEach(s => s.classList.remove("active"));
document.getElementById("productId").value="";

})
.catch(()=>{

status.innerText="Error submitting review";

});

}



function logout(){

auth.signOut().then(()=>{
window.location.href="login.html";
});

}