let web3;
let contract;
let account;

const contractAddress = window.ENV.CONTRACT_ADDRESS;

const form = document.getElementById("manufacturerForm");
const status = document.getElementById("statusfield");
const adminCard = document.getElementById("admin-card");
connectBtn.addEventListener("click", connectWallet);
const walletAddressDiv = document.getElementById("walletAddress");


async function connectWallet() {
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

    // Load contract
    const response = await fetch("../../blockchain/build/contracts/Veritas.json");
    const data = await response.json();

    contract = new web3.eth.Contract(
        data.abi,
        contractAddress
    );

    const isAdmin = await contract.methods
        .isAdmin(currentAccount)
        .call();

    console.log("Is Admin:", isAdmin);

    if (isAdmin) {
        adminCard.classList.remove("hidden");
    } else {
        alert("Access denied: Not an admin");
        adminCard.classList.add("hidden");
    }
}

async function init() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            account = accounts[0];

            const response = await fetch("../../blockchain/build/contracts/Veritas.json");
            const data = await response.json();

            contract = new web3.eth.Contract(
                data.abi,
                contractAddress
                );

        } catch (error) {
            console.error("User denied access");
        }
    } else {
        alert("Please install MetaMask");
    }
        window.ethereum.on('accountsChanged', (accounts) => {
        account = accounts[0];
        console.log("Account changed:", account);
    });
}

init();


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });
    account = accounts[0];

    console.log("Using account:", account);

    const wallet = document.getElementById("wallet").value.trim();
    const name = document.getElementById("name").value.trim();
    const license = document.getElementById("license").value.trim();
    console.log("Hello");

    // Validation
    if (!web3.utils.isAddress(wallet)) {
        showStatus("Invalid wallet address");
        return;
    }

    if (!name || !license||!wallet) {
        showStatus("All fields are required");
        return;
    }

    try {
        showStatus("Processing transaction...");

        // 🔗 Smart contract call
        await contract.methods
            .addManufacturer(wallet, name, license)
            .send({ from: account });

        showStatus("✅ Manufacturer added successfully!");
        form.reset();

    } catch (error) {
        console.error(error);

        // Better error message
        if (error.message.includes("Only admins")) {
            showStatus("❌ Only admin can perform this action");
        } else {
            showStatus("❌ Transaction failed");
        }
    }
});

// 🎯 Helper function
function showStatus(message) {
    status.innerText = message;
}