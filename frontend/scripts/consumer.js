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

            resultDiv.innerText =
                "✅ Product is Genuine\n"

        } else {

            resultDiv.innerText =
                "❌ Product Not Found or Invalid";
        }

    } catch (error) {

        console.log(error);
        resultDiv.innerText = "Error verifying product";
    }
}