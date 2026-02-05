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

    }


    function transferOwnership(
        uint256 _productId,
        address _newOwner
    ) public {
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].currentOwner == msg.sender, "Not current owner");
        require(_newOwner != address(0), "Invalid new owner");

        products[_productId].currentOwner = _newOwner;
    }

    // =========================
    // PERSON B: TRACEABILITY & SECURITY
    // =========================

    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => OwnershipRecord[]) internal ownershipHistory;

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
        // TODO (Person B):
        // - Require msg.sender == currentOwner
        _;
    }

    function getProductHistory(
        uint256 _productId
    ) public view returns (OwnershipRecord[] memory) {
        // TODO (Person B):
        // - Return ownership history
    }

    function verifyProduct(
        uint256 _productId
    ) public view returns (
        address manufacturer,
        address currentOwner,
        bool valid
    ) {
        // TODO (Person B):
        // - Check existence
        // - Return details
    }
}
