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
