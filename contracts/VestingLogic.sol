// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

 error NotOwnerError();
 
 contract vesting {
    
    struct Vesting {
        address owner;
        bool threemonths;
        bool sixMonths;
        bool nineMonths; 
        uint128 totalAmount; 
        uint128 remainingAmount;  
        uint256 startedAt; 
    }
    
    uint128 public totalAssignAmount; 
    uint128 public totalReleasedAmount;
    uint64 private id;
    address public ContractOwner;
    IERC20 public token;
  

 // Beneficiary address -
    mapping(uint256 => Vesting) public vestingMap;
    mapping(address=>uint256[]) private userRecord;

    /// @notice Contract constructor - sets the token address that the contract facilitates.
    /// @param _token - ERC20 token address.
    constructor(IERC20 _token)  
    {
        token =  IERC20(_token);
        ContractOwner=msg.sender;    
    }
   
    modifier onlyOwner
    {
      if(msg.sender!=ContractOwner)
      {
          revert NotOwnerError();
          }
      _;
    }

    function transferOwnership(address _newOwner) public onlyOwner
    {
              ContractOwner = _newOwner;  
    }
    
    function totalVested()view public returns(uint256) 
    {
        uint256 amount=token.balanceOf(address(this));
         return amount;
    }
    

    function releaseAmount(uint _id)public view returns(uint256){
        
        uint256 release=vestingMap[_id].totalAmount-vestingMap[_id].remainingAmount;
        return release;
    }

      function getUserRecord(address _user) public view returns(uint[] memory USER){
        uint[] memory user = new uint[](userRecord[_user].length);
        for(uint i=0; i< user.length; i++){
            user[i] = userRecord[_user][i];
        }
        USER = user;
    }

    function addVesting(address _beneficiary,uint128 _amount) public onlyOwner{
        require(totalVested()-totalAssignAmount>=_amount, "Vesting: DON_T_HAVE_ENOUGH_Balance");
         require(_amount >= 10, "Vesting: VESTING_AMOUNT_TO_LOW");
        totalAssignAmount=totalAssignAmount+_amount;
         id=id+1;
         vestingMap[id].owner=_beneficiary;
         vestingMap[id].startedAt=block.timestamp;
         vestingMap[id].totalAmount = vestingMap[id].totalAmount+_amount;
         vestingMap[id].remainingAmount= vestingMap[id].remainingAmount+_amount;
         userRecord[_beneficiary].push(id);
    }
    
     function withdraw(address invester,uint256 transaction_id) external 
    {
        if(msg.sender!= vestingMap[transaction_id].owner && msg.sender!=ContractOwner){revert NotOwnerError();}
         uint128 amount = vestingMap[transaction_id].totalAmount ;
         require(invester==  vestingMap[transaction_id].owner,"Hold no token");
         require(amount > 0, "DON_T_HAVE_RELEASED_TOKENS");

        if( block.timestamp>=vestingMap[transaction_id].startedAt+ 1 minutes && vestingMap[transaction_id].threemonths==false)
        {
            uint128 GivingAmount=(amount* 30)/100;
            vestingMap[transaction_id].remainingAmount=vestingMap[transaction_id].remainingAmount-GivingAmount;
            vestingMap[transaction_id].threemonths=true;
            totalReleasedAmount = totalReleasedAmount+GivingAmount;
            token.transfer(invester, GivingAmount);
            totalAssignAmount=totalAssignAmount-GivingAmount;
        }

        if(block.timestamp >= vestingMap[transaction_id].startedAt + 2 minutes && vestingMap[transaction_id].sixMonths==false)
        {
            uint128 GivingAmount=(amount* 50)/100; 
            vestingMap[transaction_id].remainingAmount=vestingMap[transaction_id].remainingAmount-GivingAmount;
            vestingMap[transaction_id].sixMonths=true;
            totalReleasedAmount = totalReleasedAmount+GivingAmount;
            token.transfer(invester, GivingAmount);
            totalAssignAmount=totalAssignAmount-GivingAmount;

        }

        if(block.timestamp >=vestingMap[transaction_id].startedAt + 3 minutes && vestingMap[transaction_id]. nineMonths==false)
        {
            uint128 GivingAmount=(amount* 20)/100; 
            vestingMap[transaction_id].remainingAmount=vestingMap[transaction_id].remainingAmount-GivingAmount;
            vestingMap[transaction_id].nineMonths=true;
            totalReleasedAmount = totalReleasedAmount+GivingAmount;
            token.transfer(invester, GivingAmount);
            totalAssignAmount=totalAssignAmount-GivingAmount;
        }      
    }
      
 }