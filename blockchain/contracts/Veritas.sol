// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract Veritas {

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


    function addProduct(
        uint256 _productId,
        string memory _metadata
    ) public {
        require(!products[_productId].exists, "Product already exists");

        products[_productId] = Product({
            productId: _productId,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            metadata: _metadata,
            exists: true
        });
        emit ProductAdded(_productId, msg.sender);
        productList[msg.sender].push(_productId);
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
}