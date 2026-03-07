// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Veritas {

    // 🔹 MANUFACTURER MANAGEMENT
    struct Manufacturer {
        string name;
        string license;
        bool verified;
    }

    mapping(address => Manufacturer) public manufacturers;

    constructor() {
        manufacturers[0x0e0Be0fcF62E3640E929dE169dA648C8cDC36365] = Manufacturer("Nike Pvt Ltd", "LIC12345", true);
        manufacturers[0xd53e1df641e50c7f274ac300d95D82063A7c3371] = Manufacturer("Adidas Manufacturing", "LIC67890", true);
        manufacturers[0x9876543210987654321098765432109876543210] = Manufacturer("Puma Industries", "LIC54321", true);
        manufacturers[0xF0188CCf02342Ca26FE055Fe0faCd57338e0324e] = Manufacturer("Casio Pvt Ltd", "LIC1679", true);
    }

    // 🔹 PRODUCT DATA STRUCTURES
    struct Product {
        uint256 productId;
        address manufacturer;
        address currentOwner;
        string metadata;
        bool exists;
    }

    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => OwnershipRecord[]) internal ownershipHistory;
    
    // Tracks current inventory for any address
    mapping(address => uint256[]) internal userInventory; 

    // 🔹 EVENTS
    event ProductAdded(uint256 productId, address manufacturer);
    event OwnershipTransferred(uint256 productId, address from, address to);

    // 🔹 MODIFIERS
    modifier onlyVerifiedManufacturer() {
        require(manufacturers[msg.sender].verified, "Not a verified manufacturer");
        _;
    }

    modifier onlyOwner(uint256 _productId) {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].currentOwner == msg.sender, "Not current owner");
        _;
    }

    // 🔹 CORE FUNCTIONS

    function addProduct(uint256 _productId, string memory _metadata) public onlyVerifiedManufacturer {   
        require(!products[_productId].exists, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            metadata: _metadata,
            exists: true
        });

        userInventory[msg.sender].push(_productId);
        ownershipHistory[_productId].push(OwnershipRecord(msg.sender, block.timestamp));
        
        emit ProductAdded(_productId, msg.sender);
    }

    function transferOwnership(uint256 _productId, address _newOwner) public onlyOwner(_productId) {
        require(_newOwner != address(0), "Invalid new owner");

        address previousOwner = msg.sender;
        products[_productId].currentOwner = _newOwner;

        // 1. Remove from seller's inventory
        _removeFromInventory(previousOwner, _productId);
        
        // 2. Add to buyer's inventory
        userInventory[_newOwner].push(_productId);

        // 3. Record History
        ownershipHistory[_productId].push(OwnershipRecord(_newOwner, block.timestamp));

        emit OwnershipTransferred(_productId, previousOwner, _newOwner);
    }

    // 🔹 VIEW FUNCTIONS

    // Main function for your "View Products" UI
    function getProductsByOwner(address _user) public view returns (uint256[] memory) {
        return userInventory[_user];
    }

    function getProductHistory(uint256 _productId) public view returns (OwnershipRecord[] memory) {
        require(products[_productId].exists, "Product does not exist");
        return ownershipHistory[_productId];
    }

    function verifyProduct(uint256 _productId) public view returns (address manufacturer, address currentOwner, bool valid) {
        if (!products[_productId].exists) return (address(0), address(0), false);
        Product memory p = products[_productId];
        return (p.manufacturer, p.currentOwner, true);
    }

    // 🔹 INTERNAL HELPERS
    function _removeFromInventory(address _user, uint256 _productId) internal {
        uint256[] storage list = userInventory[_user];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == _productId) {
                list[i] = list[list.length - 1]; // Move last element to the deleted spot
                list.pop(); // Remove last element
                break;
            }
        }
    }
}