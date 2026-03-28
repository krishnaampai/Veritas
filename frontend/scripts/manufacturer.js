firebase.initializeApp(window.firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentAccount = null;
let web3;
let contract;

const contractAddress = window.ENV.CONTRACT_ADDRESS;

const connectBtn = document.getElementById("connectBtn");
const addProductBtn = document.getElementById("addProductBtn");
const walletAddressDiv = document.getElementById("walletAddress");
const verificationStatusDiv = document.getElementById("verificationStatus");
const productSection = document.getElementById("productSection");
const productssection = document.getElementById("products-section");
const addSellerBtn = document.getElementById("addSellerBtn");
const modal = document.getElementById("sellerModal");
const closeBtn = document.getElementById("closeModalBtn");
const submitSellerBtn = document.getElementById("submitSellerBtn");


connectBtn.addEventListener("click", connectWallet);
addProductBtn.addEventListener("click", addProduct);
submitSellerBtn.addEventListener("click", addSeller);

async function connectWallet() 
{
    console.log("Hello");

    if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
    }

    await ethereum.request({ method: "eth_requestAccounts" });

    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];
    console.log(currentAccount);
    addSellerBtn.style.display = "block";

    walletAddressDiv.innerText =
        "Connected Wallet: " + currentAccount;

    // Load ABI from JSON file
    const response = await fetch("../../blockchain/build/contracts/Veritas.json");
    const data = await response.json();

    contract = new web3.eth.Contract(
        data.abi,
        contractAddress
    );

    

    productSection.classList.remove("hidden");
    productssection.classList.remove("hidden");

    await loadMyProducts();
}

async function addProduct() {

    if (!currentAccount) {
        alert("Connect wallet first");
        return;
    }

    const productName =
        document.getElementById("productName").value;

    const serialNumber =
        document.getElementById("serialNumber").value;

    const description =
        document.getElementById("description").value;

    const metadata = productName + " | " + description;

    try {


        await contract.methods
            .addProduct(serialNumber, metadata)
            .send({ from: currentAccount });

        alert("✅ Product Added to Blockchain!");
        generateQR(serialNumber);
        console.log("Generating QR for:", serialNumber);
        await loadMyProducts();
        console.log("Now verifying from blockchain...");

        const result = await contract.methods
            .verifyProduct(serialNumber)
            .call();

        console.log(result);

    } catch (error) {
        console.log(error);
        alert("Transaction failed");
    }
}
function generateQR(productId) {

    const qrSection = document.getElementById("qrSection");
    const canvas = document.getElementById("qrCanvas");

    const qrData = productId.toString();   

    console.log("QR content:", qrData, "type:", typeof qrData); 

    qrSection.style.display = "block";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    QRCode.toCanvas(canvas, qrData, {
        width: 350,
        margin: 4,
        color: {
            dark: "#000000",
            light: "#ffffff"
        }
    }, function (error) {
        if (error) console.error(error);
    });
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

    const products = await contract.methods
        .getProductsByOwner(currentAccount)
        .call();

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

addSellerBtn.onclick = () => {
    modal.classList.remove("hidden");
};

// close
closeBtn.onclick = () => {
    modal.classList.add("hidden");
};

async function addSeller(){
    const address = document.getElementById("sellerAddress").value;
    const name = document.getElementById("sellerName").value;

    if (!address || !name) {
        alert("Fill all fields");
        return;
    }

    if (!web3.utils.isAddress(address)) {
        alert("Invalid address");
        return;
    }

    if (address === "0x0000000000000000000000000000000000000000") 
        {
        alert("Zero address not allowed");
        return;
    }

    try {

        await contract.methods
            .addSeller(name, address)
            .send({ from: currentAccount });

        alert("✅ Seller added successfully");

        //modal.classList.add("hidden");

        // clear fields
        document.getElementById("sellerAddress").value = "";
        document.getElementById("sellerName").value = "";

    } catch (err) {
        console.error(err);
        alert("❌ Transaction failed");
    }
}

