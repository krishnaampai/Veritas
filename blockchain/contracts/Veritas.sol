// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract Veritas {

    //  Manufacturer struct and mapping

    struct Manufacturer {
        string name;
        string license;
        bool verified;
    }

    mapping(address => Manufacturer) public manufacturers;

    constructor() {
        manufacturers[0x0e0Be0fcF62E3640E929dE169dA648C8cDC36365] =
            Manufacturer("Nike Pvt Ltd", "LIC12345", true);

        manufacturers[0xd53e1df641e50c7f274ac300d95D82063A7c3371] =
            Manufacturer("Adidas Manufacturing", "LIC67890", true);

        manufacturers[0x9876543210987654321098765432109876543210] =
            Manufacturer("Puma Industries", "LIC54321", true);
    }

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
        emit ProductAdded(_productId, msg.sender);

        ownershipHistory[_productId].push(
         OwnershipRecord({
        owner: msg.sender,
        timestamp: block.timestamp
        })
        );
    }


function transferOwnership(
    uint256 _productId,
    address _newOwner
) public onlyOwner(_productId) {
    require(_newOwner != address(0), "Invalid new owner");

    products[_productId].currentOwner = _newOwner;
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
}