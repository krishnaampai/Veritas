let web3;
let contract;
let currentAccount = null;

const contractAddress = window.ENV.CONTRACT_ADDRESS;

const connectBtn = document.getElementById("connectBtn");
const walletDiv = document.getElementById("walletAddress");
const grid = document.getElementById("productGrid");

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

    loadMyProducts();
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

                <button class="transfer-btn" onclick="transfer(${id})">
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