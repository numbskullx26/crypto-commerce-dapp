// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order{
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        
        owner = msg.sender;
    }

    //Listing Products
    function list(uint256 _id,string memory _name, string memory _category, string memory _image,uint256 _cost,uint256 _rating,uint256 _stock) public onlyOwner{
        
        //Create Item Struct 
        Item memory item = Item(_id,
        _name,
        _category,
        _image,
        _cost,
        _rating,
        _stock);


        //Save Item Struct to the Blockchain
        items[_id] = item;
        emit List(_name,_cost,_stock);

    }

    function buy(uint256  _id) public payable{
        //Fetch item that was saved to the blockchain
        Item memory item = items[_id];

        //Create an Order Struct

        Order memory order = Order(block.timestamp,item);

        //Require enough ether to buy item
        require(msg.value >= item.cost);

        //Require item is in Stock
        require(item.stock > 0);

        //Add order for the user
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Substract stock
         items[_id].stock = item.stock - 1;

        //Emit Event 
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    } 

    //Withdraw Funds
    function withdraw() public onlyOwner(){
        (bool success, )= owner.call{value : address(this).balance}("");
        require(success);
    }
}
