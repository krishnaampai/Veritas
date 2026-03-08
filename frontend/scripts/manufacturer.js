let currentAccount = null;
let web3;
let contract;

const contractAddress = window.ENV.CONTRACT_ADDRESS;

const connectBtn = document.getElementById("connectBtn");
const addProductBtn = document.getElementById("addProductBtn");
const walletAddressDiv = document.getElementById("walletAddress");
const verificationStatusDiv = document.getElementById("verificationStatus");
const productSection = document.getElementById("productSection");

connectBtn.addEventListener("click", connectWallet);
addProductBtn.addEventListener("click", addProduct);



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

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <h3>Product #${id}</h3>

            <p>${product.metadata}</p>

            <div class="card-buttons">

                <button class="transfer-btn" data-id="${id}">
                    Transfer Ownership
                </button>

                <button class="timeline-btn" onclick="showProduct(${id})">
                    View Timeline
                </button>

            </div>
        `;

        grid.appendChild(card);
    }
}