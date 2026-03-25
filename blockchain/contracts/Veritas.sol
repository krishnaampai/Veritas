// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract Veritas {

    //  Manufacturer struct and mapping

    struct Manufacturer {
        address wallet;
        string name;
        string license;
        bool verified;
    }


    constructor() {
        // admins[0xE93Ae5b48474E823b7464d30532BfdDC903D8f30] = "Admin1";
        admins[0xE93Ae5b48474E823b7464d30532BfdDC903D8f30] = "Admin2";
        seller["Ashok"]=0x9579B2241AEEfF56B774437Bb7a1739d26Aced20;
        seller["Ravi"]=0x1f49268bf903F0b5174e1D57ad39A1fAa6be68Ac;
        seller["Suresh"]=0x68AAD3dD7245367D404e08A43E38Fc4cd8567687;
        seller["Max"]=0xFC42861a89EB8caDe813ad971b7307D9a3cA6774;
         seller["Paul"]=0x928fDBA7Cb15a97f35ec8196211e9BbF3D6b6963;
    }

    mapping(address => Manufacturer) public manufacturers;
    mapping(address => string) public admins;
    mapping(string => address) public seller;


    /*constructor() {
        manufacturers[0x0e0Be0fcF62E3640E929dE169dA648C8cDC36365] =
            Manufacturer("Nike Pvt Ltd", "LIC12345", true);

        manufacturers[0xd53e1df641e50c7f274ac300d95D82063A7c3371] =
            Manufacturer("Adidas Manufacturing", "LIC67890", true);

        manufacturers[0x9876543210987654321098765432109876543210] =
            Manufacturer("Puma Industries", "LIC54321", true);

         manufacturers[0xF0188CCf02342Ca26FE055Fe0faCd57338e0324e] =
            Manufacturer("Casio Pvt Ltd", "LIC1679", true);

        
    }*/

    modifier onlyVerifiedManufacturer() {
        require(manufacturers[msg.sender].verified, "Not a verified manufacturer");
        _;
    }

    struct Product {
        uint256 productId;
        address manufacturer;
        address currentOwner;
        string metadata;
        bool exists;
    }

    mapping(uint256 => Product) internal products;

     struct OwnershipRecord {
        address owner;
        uint256 timestamp;
    }


    mapping(uint256 => OwnershipRecord[]) internal ownershipHistory;
    mapping(address => uint256[]) internal productList;
    uint256[] public allProductIds;


    function addProduct(
        uint256 _productId,
        string memory _metadata
    ) public onlyVerifiedManufacturer {   
        require(!products[_productId].exists, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            metadata: _metadata,
            exists: true
        });
        allProductIds.push(_productId);
        emit ProductAdded(_productId, msg.sender);
        productList[msg.sender].push(_productId);

        ownershipHistory[_productId].push(
         OwnershipRecord({
        owner: msg.sender,
        timestamp: block.timestamp
        })
        );
        
    }
    
    function addManufacturer(
        address _wallet,
        string memory _name,
        string memory _license
    ) public {
        require(bytes(admins[msg.sender]).length > 0, "Only admins can add manufacturers");
        require(!manufacturers[_wallet].verified, "Manufacturer already exists");

        manufacturers[_wallet] = Manufacturer({
            wallet: _wallet,
            name: _name,
            license: _license,
            verified: true
        });
    }
    

    function getAllProductIds() public view returns (uint256[] memory) {
        return allProductIds;
    }


function transferOwnership(
    uint256 _productId,
    address _newOwner
) public onlyOwner(_productId) {
    require(_newOwner != address(0), "Invalid new owner");

    products[_productId].currentOwner = _newOwner;
    productList[_newOwner].push(_productId);
    emit OwnershipTransferred(_productId, msg.sender, _newOwner);

    ownershipHistory[_productId].push(
    OwnershipRecord({
        owner: _newOwner,
        timestamp: block.timestamp
    })
);
}


   
    event ProductAdded(
        uint256 productId,
        address manufacturer
    );

    event OwnershipTransferred(
        uint256 productId,
        address from,
        address to
    );

    modifier onlyOwner(uint256 _productId) {
       require(products[_productId].exists, "Product does not exist");
       require(products[_productId].currentOwner == msg.sender, "Not current owner");
        _;
    }

    function getProductHistory(
        uint256 _productId
    ) public view returns (OwnershipRecord[] memory) {
        require(products[_productId].exists, "Product does not exist");
        return ownershipHistory[_productId];
    }

    function verifyProduct(
        uint256 _productId
    ) public view returns (
        address manufacturer,
        address currentOwner,
        bool valid
    ) {
        if (!products[_productId].exists) {
            return (address(0), address(0), false);
        }

        Product memory p = products[_productId];
        return (p.manufacturer, p.currentOwner, true);
    }

    //get manufacturer details

    function getManufacturer(address wallet)
        public
        view
        returns (string memory name, string memory license, bool verified)
    {
        Manufacturer memory m = manufacturers[wallet];
        return (m.name, m.license, m.verified);
    }

    function getProduct(uint256 id)
        public
        view
        returns(address manufacturer, address owner, string memory metadata)
        {
            Product memory p = products[id];
            return (p.manufacturer, p.currentOwner, p.metadata);
        }

    function getProductsByOwner(address owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return productList[owner];
    }

    function getSeller(string memory name) public view returns (address) {
        return seller[name];
    }
}