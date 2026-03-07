// Step 1: Set up contract details
// Cleaned ABI - Note: Ensure "getProductsByOwner" is in your updated ABI from Remix
const contractABI = [
	{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
	{ "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "address", "name": "to", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" },
	{ "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "productId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "manufacturer", "type": "address" } ], "name": "ProductAdded", "type": "event" },
	{ "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" }, { "internalType": "string", "name": "_metadata", "type": "string" } ], "name": "addProduct", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
	{ "inputs": [ { "internalType": "address", "name": "wallet", "type": "address" } ], "name": "getManufacturer", "outputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "license", "type": "string" }, { "internalType": "bool", "name": "verified", "type": "bool" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" } ], "name": "getProductHistory", "outputs": [ { "components": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "internalType": "struct Veritas.OwnershipRecord[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [ { "internalType": "address", "name": "_user", "type": "address" } ], "name": "getProductsByOwner", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" }, { "internalType": "address", "name": "_newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
	{ "inputs": [ { "internalType": "uint256", "name": "_productId", "type": "uint256" } ], "name": "verifyProduct", "outputs": [ { "internalType": "address", "name": "manufacturer", "type": "address" }, { "internalType": "address", "name": "currentOwner", "type": "address" }, { "internalType": "bool", "name": "valid", "type": "bool" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "products", "outputs": [ { "internalType": "uint256", "name": "productId", "type": "uint256" }, { "internalType": "address", "name": "manufacturer", "type": "address" }, { "internalType": "address", "name": "currentOwner", "type": "address" }, { "internalType": "string", "name": "metadata", "type": "string" }, { "internalType": "bool", "name": "exists", "type": "bool" } ], "stateMutability": "view", "type": "function" }
];

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; 

let web3;
let veritasContract;
let currentAccount;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            
            // UI Check: Only update accountArea if it exists on the current page
            const accountDisp = document.getElementById('accountArea');
            if(accountDisp) accountDisp.innerText = "Wallet: " + currentAccount;
            
            veritasContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Veritas Contract Initialized");

            // Auto-fill Product ID if coming from the Inventory list via URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const idParam = urlParams.get('id');
            if (idParam && document.getElementById('productId')) {
                document.getElementById('productId').value = idParam;
            }

        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert("Please install MetaMask to use this application.");
    }
}

// --- FUNCTION 1: TRANSFER OWNERSHIP (Used in transfer.html) ---
async function handleTransfer() {
    const id = document.getElementById('productId').value;
    const recipient = document.getElementById('recipientAddress').value;
    const status = document.getElementById('status');

    if(!id || !recipient) {
        alert("Please fill in all fields.");
        return;
    }

    status.innerText = "Requesting MetaMask signature...";

    try {
        await veritasContract.methods.transferOwnership(id, recipient)
            .send({ from: currentAccount });

        status.style.color = "#00ff00";
        status.innerText = "Success! Ownership transferred to " + recipient;
    } catch (error) {
        status.style.color = "#ff4444";
        status.innerText = "Error: " + error.message;
    }
}

// --- FUNCTION 2: VIEW INVENTORY (Used in view-products.html) ---
async function fetchInventory() {
    const walletAddress = document.getElementById('searchWallet').value;
    const container = document.getElementById('inventoryContainer');
    const status = document.getElementById('status');

    if (!web3.utils.isAddress(walletAddress)) {
        alert("Please enter a valid Ethereum address");
        return;
    }

    container.innerHTML = "";
    status.innerText = "Querying blockchain...";

    try {
        // 1. Get the array of Product IDs from userInventory mapping
        const productIds = await veritasContract.methods.getProductsByOwner(walletAddress).call();

        if (productIds.length === 0) {
            status.innerText = "No products found for this wallet.";
            return;
        }

        status.innerText = `Found ${productIds.length} products:`;

        // 2. Loop through IDs to get full details from the 'products' mapping
        for (let id of productIds) {
            const product = await veritasContract.methods.products(id).call();
            
            const div = document.createElement('div');
            div.className = 'product-item';
            div.innerHTML = `
                <div class="product-details">
                    <h3>Product ID: ${id}</h3>
                    <p><strong>Metadata:</strong> ${product.metadata}</p>
                    <p><strong>Manufacturer:</strong> ${product.manufacturer}</p>
                </div>
                <button class="transfer-btn" onclick="location.href='transfer.html?id=${id}'">Transfer This Item</button>
            `;
            container.appendChild(div);
        }
    } catch (error) {
        console.error(error);
        status.innerText = "Error fetching inventory. Check console.";
    }
}

window.onload = init;