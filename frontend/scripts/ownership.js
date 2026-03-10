async function transfer(productId)
{
    console.log("Hello");
    const container = document.getElementById("transferSection");

    container.innerHTML = `
        <div class="transfer-card">

            <h3>Transfer Ownership</h3>

            <form id="transferForm">

                <div class="form-group">
                    <label>New Owner Name</label>
                    <input 
                        type="text" 
                        id="newOwnerName"
                        placeholder="Enter name of new owner"
                        required
                    >
                </div>

                <div class="transfer-buttons">
                    <button type="submit" class="transfer-btn">
                        Transfer
                    </button>

                    <button type="button" id="cancelTransfer" class="cancel-btn">
                        Cancel
                    </button>
                </div>

            </form>

        </div>
    `;

    const form = document.getElementById("transferForm");

    form.onsubmit = async function(e)
    {
        e.preventDefault();

        const ownerName = document.getElementById("newOwnerName").value;

        if(!ownerName){
            alert("Please enter a valid owner name");
            return;
        }

        try{

            // 🔹 Get address from mapping
            const ownerAddress = await contract.methods
                .seller(ownerName)
                .call();

            if(ownerAddress === "0x0000000000000000000000000000000000000000"){
                alert("Seller not found");
                return;
            }

            // 🔹 Call transferOwnership with address
            await contract.methods
                .transferOwnership(productId, ownerAddress)
                .send({ from: currentAccount });

            alert("Ownership transferred successfully");

            container.innerHTML = "";

        }catch(error){

            console.error("Transfer failed:", error);
            alert("Error transferring ownership");
        }
    };

    document.getElementById("cancelTransfer").onclick = function(){
        container.innerHTML = "";
    };
}