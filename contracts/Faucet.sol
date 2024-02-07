// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Faucet {

    // keep track of how many requests per address
    mapping(address => uint) withdrawalRequests;
    // track the next request time for each address
    mapping(address => uint256) nextRequestTime; 

    uint withdrawalAmount = 0.001 * (10**18);

    // get the address of the contract owner
    address payable owner = payable(msg.sender);

    uint private locktime = 1 minutes * 60 * 24; 

    event withdrawal(uint withdraw_amount);
    event balanceUpdated(uint new_balance);

    // function to allow an address to withdraw some ether from this contract
    function withdraw() public {
        
        // the address requesting to withdraw must be valid
        require(msg.sender != address(0));
        // cannot withdraw more than is in the faucet
        require(withdrawalAmount <= address(this).balance, "Faucet has insufficient funds");
        // prevent address draining the faucet
        require(block.timestamp >= nextRequestTime[msg.sender], "You're only allowed 1 request per 24 hours. Come back tomorrow.");

        // calcualte the next request time
        nextRequestTime[msg.sender] = block.timestamp + locktime;

        // transfer the amount to the requester
        payable(msg.sender).transfer(withdrawalAmount);
        
        // fire a withdrawal event
        emit withdrawal(withdrawalAmount);
    
        //fire the updated balance event
        // can get the contract's balance using address(this).balance
        emit balanceUpdated(address(this).balance);
    }

    // retrive the balance
   function getFaucetBalance() public view returns (uint) {
        return address(this).balance;
   }
   
    // Allows anyone to send ether to this contract
    // In any amount 
    receive() external payable {
        emit balanceUpdated(address(this).balance);
    }
    
    // setters in case owner want to change these
    function setWithdrawalAmount(uint amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }
    function setLockTime(uint time) public onlyOwner {
        locktime = time * 1 minutes;
    }

    // allow setters to only be called by the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can send this message");
        _;
    }
}