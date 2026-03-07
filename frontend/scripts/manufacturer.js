let currentAccount = null;
let web3;
let contract;

const contractAddress = window.env.CONTRACT_ADDRESS;

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

    verificationStatusDiv.innerText =
        "Status: Connected (Verification skipped for now)";

    productSection.classList.remove("hidden");
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

function generateQR(productId)
{

    document.getElementById("qrSection").style.display = "block";

    const canvas = document.getElementById("qrCanvas");

    QRCode.toCanvas(canvas, productId.toString(), {
        width: 200,
        color: {
            dark: "#00e6e6",
            light: "#ffffff"
        }
    }, function (error) {
        if (error) console.error(error);
    });

}