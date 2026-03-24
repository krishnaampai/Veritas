firebase.initializeApp(window.firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let web3;
let contract;

const contractAddress = window.ENV.CONTRACT_ADDRESS;
console.log(window.ENV);

const verifyBtn = document.getElementById("verify");
const resultDiv = document.getElementById("result");

verifyBtn.addEventListener("click",verifyProduct );

window.addEventListener("load", initialize);

async function initialize() {

    try {

        web3 = new Web3("http://127.0.0.1:7545");

        // Load ABI from JSON file
        const response = await fetch("../../blockchain/build/contracts/Veritas.json");
        const data = await response.json();

        contract = new web3.eth.Contract(
            data.abi,
            contractAddress
        );

        console.log("Consumer page initialized");

    } catch (error) {
        console.log(error);
    }
}

async function verifyProduct() {

    const productId =
        document.getElementById("serialInput").value;

    if (!productId) {
        resultDiv.innerText = "Enter Product ID";
        return;
    }

    try {

        const result = await contract.methods
            .verifyProduct(productId)
            .call();

        if (result.valid) {

            resultDiv.innerText = "✅ Product is Genuine";

            loadOwnershipHistory(productId);

        } else {

            resultDiv.innerText =
                "❌ Product Not Found or Invalid";
        }

    } catch (error) {

        console.log(error);
        resultDiv.innerText = "Error verifying product";
    }
}

function goToReview() {
    window.location.href = "login.html";
}
let html5QrCode;

const fileInput = document.getElementById("qr-input-file");

window.addEventListener("load", () => {

    html5QrCode = new Html5Qrcode("reader");

});

document.getElementById("startScan").addEventListener("click", startCamera);

function startCamera(){
    document.getElementById("reader").style.display = "block";

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {

            console.log("QR decoded:", decodedText);

            document.getElementById("serialInput").value = decodedText;

            verifyProduct();

            html5QrCode.stop();

        },
        (errorMessage) => {
            // ignore scan errors
        }
    );

}

fileInput.addEventListener("change", e => {

    if (e.target.files.length === 0) return;

    const imageFile = e.target.files[0];

    html5QrCode.scanFile(imageFile, true)
        .then(decodedText => {

            console.log("QR decoded:", decodedText);
            document.getElementById("serialInput").value = decodedText;

            verifyProduct();

        })
        .catch(err => {
            console.log("QR scan failed", err);
            alert("Could not read QR code");
        });

});

document.getElementById("searchBtn").addEventListener("click", searchProducts);

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

async function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    const section = document.getElementById("searchResultsSection");

    if (!query) {
        alert("Enter something to search");
        return;
    }

    resultsDiv.innerHTML = "Searching...";
    section.style.display = "block";

    try {
        const ids = await contract.methods.getAllProductIds().call();

        let resultsHTML = "";

        for (let id of ids) {
            const product = await contract.methods.getProduct(id).call();
            const words = query.split(" ");
            const matches = words.every(word => product.metadata.toLowerCase().includes(word));

            if (matches) {
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
                resultsHTML += `
                    <div class="search-card" onclick="selectProduct(${id})">
                        <p><strong>${product.metadata}</strong></p>
                        <p>ID: ${id}</p>
                        <div class="product-rating">
                            <span class="stars">${generateStars(avgRating)}</span>
                            <span class="rating-text">
                                ${reviews.length ? avgRating + " (" + reviews.length + ")" : "No rating yet"}
                            </span>
                        </div>
                    </div>
                `;
            }
        }

        resultsDiv.innerHTML = resultsHTML || "No products found.";

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "Error searching products.";
    }
}

function selectProduct(id) {
    document.getElementById("serialInput").value = id;

    // Optional smooth scroll
    document.getElementById("serialInput").scrollIntoView({
        behavior: "smooth"
    });

    // Optional auto verify (recommended 🔥)
    verifyProduct();
}