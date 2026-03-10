// timeline
async function loadOwnershipHistory(productId) {

    const history = await contract.methods
        .getProductHistory(productId)
        .call();

    renderTimeline(history, productId);
}
// const dummyHistory = [
//   {
//     owner: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
//     timestamp: 1719900000
//   },
//   {
//     owner: "0x4B0897b0513fdc7C541B6d9D7E929C4e5364D2dB",
//     timestamp: 1719903600
//   },
//   {
//     owner: "0x583031D1113aD414F02576BD6afaBfb302140225",
//     timestamp: 1719907200
//   }
// ];

// const entityDetails = {
//   "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318": {
//       name: "Nike Pvt Ltd",
//       role: "Manufacturer"
//   },

//   "0x4B0897b0513fdc7C541B6d9D7E929C4e5364D2dB": {
//       name: "ABC Distributors",
//       role: "Seller"
//   },

//   "0x583031D1113aD414F02576BD6afaBfb302140225": {
//       name: "XYZ Retail Store",
//       role: "Seller"
//   }
// };

function shorten(addr) {
  return addr.slice(0,6) + "..." + addr.slice(-4);
}

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleString();
}

async function renderTimeline(history,productId){

    const timeline = document.getElementById("timeline");
    timeline.innerHTML = "";
    document.getElementById("timelineTitle").innerText =
    "Ownership Timeline for Product #" + productId;

    const ownerCache = {};

    // collect unique owners
    const owners = [...new Set(history.map(h => h.owner))];

    // fetch manufacturer info once
    for(const owner of owners){

        try{
            const m = await contract.methods
                .getManufacturer(owner)
                .call();

            ownerCache[owner] = m;

        } catch(e){
            ownerCache[owner] = null;
        }
    }

    // now render timeline
    for(let i = 0; i < history.length; i++){

        const record = history[i];
        const owner = record.owner;

        let name = "Owner";
        let role = "Owner";

        const details = ownerCache[owner];

        if(details && details.verified){
            name = details.name;
            role = "Manufacturer";
        }

        if(i === history.length - 1){
            role = "Current Owner";
        }

        const item = document.createElement("div");
        item.className = "timeline-item";

        item.innerHTML = `<div>
            <h3> Product No.${productId}</h3>
            <div class="timeline-dot"></div>

            <div class="timeline-content">
                <div class="timeline-label">${role}</div>
                <div class="wallet">${name}</div>
                <div class="wallet">${shorten(owner)}</div>
                <div class="time">${formatTime(record.timestamp)}</div>
            </div></div>
        `;

        timeline.appendChild(item);
    }
}

async function showProduct(productId){

    const result = await contract.methods
        .verifyProduct(productId)
        .call();

    if(!result.valid){
        alert("Product not found");
        return;
    }

    // show manufacturer and owner info if needed
    console.log("Manufacturer:", result.manufacturer);
    console.log("Current Owner:", result.currentOwner);

    // load timeline
    loadOwnershipHistory(productId);
    loadReviews(productId);
}