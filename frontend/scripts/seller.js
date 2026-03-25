firebase.initializeApp(window.firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let web3;
let contract;
let currentAccount = null;

const contractAddress = window.ENV.CONTRACT_ADDRESS;

const connectBtn = document.getElementById("connectBtn");
const walletDiv = document.getElementById("walletAddress");
const grid = document.getElementById("productGrid");
const productssection = document.getElementById("products-section");

connectBtn.addEventListener("click", connectWallet);

async function connectWallet(){

    if(!window.ethereum){
        alert("Install MetaMask");
        return;
    }

    await ethereum.request({method:"eth_requestAccounts"});

    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];

    walletDiv.innerText = "Connected Wallet: " + currentAccount;

    const response = await fetch("../../blockchain/build/contracts/Veritas.json");
    const data = await response.json();

    contract = new web3.eth.Contract(
        data.abi,
        contractAddress
    );
        window.ethereum.on('accountsChanged', (accounts) => {
        currentAccount = accounts[0];
        walletDiv.innerText = "Connected Wallet: " + currentAccount;

        console.log("Account changed:", currentAccount);
        loadMyProducts();
    });
    productssection.classList.remove("hidden");
    loadMyProducts();
}

async function loadReviews(productId){

    document.getElementById("reviewsSection")
        .classList.remove("hidden");

    document.getElementById("reviewsTitle").innerText =
        "Reviews for Product #" + productId;

    const snapshot = await db
        .collection("reviews")
        .where("productId","==", String(productId))
        .get();

    const reviews = snapshot.docs.map(doc => doc.data());

    renderReviews(reviews);
}

function renderReviews(reviews){

    const list = document.getElementById("reviewsList");
    list.innerHTML = "";

    if(reviews.length === 0){
        list.innerHTML = "<p>No reviews yet</p>";
        return;
    }

    let total = 0;

    reviews.forEach(r => {

        total += Number(r.rating);

        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
            <div class="review-stars">${generateStars(r.rating)}</div>

            <p class="review-text">${r.reviewText}</p>

            <div class="review-meta">
                ${r.userEmail} • 
                ${r.timestamp ? r.timestamp.toDate().toLocaleDateString() : ""}
            </div>
        `;

        list.appendChild(card);

    });

    const avg = total / reviews.length;

    document.getElementById("avgRating").innerText =
        avg.toFixed(1);

    document.getElementById("reviewCount").innerText =
        reviews.length;

    document.getElementById("overallStars").innerText =
        generateStars(avg);
}


function generateStars(rating){

    let stars = "";

    for(let i=1;i<=5;i++){

        if(i <= Math.round(rating))
            stars += "⭐";
        else
            stars += " ";
    }

    return stars;
}
async function loadMyProducts() {
    console.log("Current account:", currentAccount);



    const products = await contract.methods
        .getProductsByOwner(currentAccount)
        .call();
        console.log("Products:", products);


    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    if (products.length === 0) {
        grid.innerHTML = "<p>No products yet</p>";
        return;
    }

    for (let id of products) {

        const product = await contract.methods
            .getProduct(id)
            .call();

        // get reviews for this product
        const reviewSnapshot = await db
            .collection("reviews")
            .where("productId","==", String(id))
            .get();

        const reviews = reviewSnapshot.docs.map(doc => doc.data());

        let avgRating = 0;

        if(reviews.length > 0){
            const total = reviews.reduce((sum,r)=> sum + Number(r.rating),0);
            avgRating = (total / reviews.length).toFixed(1);
        }

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
        <h3>Product #${id}</h3>

        <p>${product.metadata}</p>

        <div class="product-rating">
            <span class="stars">${generateStars(avgRating)}</span>
            <span class="rating-text">
                ${reviews.length ? avgRating + " (" + reviews.length + ")" : "No rating yet"}
            </span>
        </div>

        <div class="card-buttons">

            <button class="transfer-btn" onclick="transfer(${id})">
                Transfer Ownership
            </button>

            <button class="timeline-btn" onclick="showProduct(${id})">
                View Timeline
            </button>

            <button class="review-btn" onclick="loadReviews(${id})">
                View Reviews
            </button>

        </div>
        `;

        grid.appendChild(card);
    }
}