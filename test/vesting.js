const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("vesting",function(){
    let owner;
    let token;
    let vesting;
    let invester1;
    let invester2;
    let invester3;
    let invester4;

    it("deployment",async ()=>{
        [owner,token,vesting,invester1,invester2,invester3,...invester4]=await ethers.getSigners();
        console.log("Owner",owner.address);
        
        //***************************************deploy token***************************************
         const Token=await ethers.getContractFactory("AURA");
        
        token=await Token.deploy();
        token.deployed();
        
        

        //***************************************deploy Vesting***************************************
        const Vesting =await hre.ethers.getContractFactory("vesting");
        vesting=await Vesting.deploy(token.address);
        console.log("VESTING ADDRESS :",vesting.address);

    })

     //***************************************getting the Tokens from  Token contract ***************************************
     it("Checking the balance of Token owner",async ()=> {
        console.log(await token.decimals());
        const balance=await token.balanceOf(owner.address);
        expect(await ethers.utils.formatEther(balance)).to.equal('100000000.0');

    });
    //***************************************transfer Tokens from  Token contract ***************************************
    it("transfer the token to othercontract address",async()=>{
  
        const Transfer= await  token.transfer(vesting.address, ethers.utils.parseEther("100000000.0"));
        //checking the balance of vesting logic smart contract
        const balance=await token.balanceOf(vesting.address);
        console.log("balance of vestinglogic contract: ",ethers.utils.formatEther(balance));
        expect(await token.balanceOf(vesting.address)).to.equal(ethers.utils.parseEther("100000000.0"));

    })
   // ***************************************Add vesting other person not owner ***************************************
    it("add vesting by other person not owner of contract",async()=>{
       
        try {
            await vesting.connect(invester1).addVesting(invester1.address,100);
          } catch (error) {
            console.log("ERROR", error.message);
          }
    });
    //***************************************Add vesting by vestig owner ***************************************
    it("add vesting by vestingcontract owner",async ()=>{
        const vest=await  vesting.addVesting(invester1.address,100);
        //checking the investor vesting details before withdraw.
       console.log(await vesting.vestingMap(1));
       //checking how much amount has release  to this address 
        console.log(await vesting.connect(invester1).releaseAmount(1));
        //escaping the time  using this command 
        await network.provider.send("evm_increaseTime", [7776000]);
        //withdraw the amount 
        const withdraws=await vesting.withdraw(invester1.address,1);
        //checking the amount we get
        console.log(await vesting.vestingMap(1));
        console.log(await vesting.connect(invester1).releaseAmount(1));
        //skiping the second month so we can get  50% amount of second;
        await network.provider.send("evm_increaseTime", [7776000]);
        //withdraw the amount 
        await vesting.withdraw(invester1.address,1);
        console.log(await vesting.connect(invester1).releaseAmount(1));
        console.log(await vesting.vestingMap(1));
        // console.log()
       //skiping the third month so we can get  20% amount of second;
       await network.provider.send("evm_increaseTime", [7776000]);
       //withdraw the amount 
       await vesting.withdraw(invester1.address,1);
       console.log(await vesting.connect(invester1).releaseAmount(1));
       console.log(await vesting.vestingMap(1));

    })
    //***************************************Add vesting by vesting owner with different amount on different time***************************************
    it("add vesting with multitime  by same investor",async ()=>{
        await vesting.addVesting(invester2.address,100);
        //checking  the  investor  vesting details  before withdraw
        console.log(await vesting.vestingMap(2));
        //checking how much amount has release  to this address 
        console.log(await vesting.connect(invester2).releaseAmount(1));
        //escaping the time  using this command 
        await network.provider.send("evm_increaseTime", [7776000]);
        //withdraw the amount 
       await vesting.withdraw(invester2.address,2);
        //checking the amount we get
        console.log(await vesting.vestingMap(2));
        console.log(await vesting.connect(invester2).releaseAmount(2));
        //checking how many time he invest
        console.log(await vesting.getUserRecord(invester2.address));
        //investing second time 
        await vesting.addVesting(invester2.address,200);
        console.log(await vesting.getUserRecord(invester2.address));
          //escaping the time  using this command 
          await network.provider.send("evm_increaseTime", [7776000]);
          await network.provider.send("evm_increaseTime", [15552000]);
          //withdraw the amount of both ids that user have
        await vesting.withdraw(invester2.address,3);
        await vesting.withdraw(invester2.address,2);
        console.log(await vesting.vestingMap(2));
        console.log(await vesting.vestingMap(3));
        //investing 3rd time and with draw by invester itself
        await vesting.addVesting(invester2.address,10);
        // console.log(await vesting.connect(invester2).releaseAmount(2));
        await network.provider.send("evm_increaseTime", [7776000]);
        await vesting.connect(invester2).withdraw(invester2.address,4);
        console.log(await vesting.vestingMap(4));
        console.log("remaining balance",await token.balanceOf(vesting.address));

  })
    // //***************************************Add vesting by vesting owner and tranfer the ownership***************************************

    // it("add vesting above the balance ownership",async ()=>{
    //     //before changing the ownership 
    //     console.log(await vesting.ContractOwner());
    //     //do vesting above the current  balance before changing owership 
    //     try {
    //         await vesting.addVesting(invester3.address, ethers.utils.parseUnits("100000000",18));   
    //               } catch (error) {
    //                 console.log("ERROR", error.message);
    //               }
    
    //   })

    //***************************************Add vesting by vesting above the balance***************************************

  it("add vesting above the balance ownership",async ()=>{
    //do vesting above the current  balance  
    try {
        await vesting.addVesting(invester3.address, ethers.utils.parseUnits("100000000",18));   
              } catch (error) {
                console.log("ERROR", error.message);
              }
    //getting the contract balance 
    console.log("balance of",await token.balanceOf(vesting.address));
    //vesting most of amount to one invester
    await vesting.addVesting(invester3.address,"9999999999999999999999697");
    //checking the total amount that have been sign
    console.log("totalassign",ethers.utils.formatEther(await vesting.totalAssignAmount()));
    //VESTING THE REMAINING TOTAL AMOUNT 
     await vesting.addVesting(invester3.address,ethers.utils.parseEther("9999999.999999999999999704"));
    console.log(await vesting.vestingMap(5));
    await network.provider.send("evm_increaseTime", [7776000]);
    await network.provider.send("evm_increaseTime", [15552000]);
    await vesting.withdraw(invester3.address,5);
    await vesting.withdraw(invester3.address,6);
    console.log(await vesting.vestingMap(5));
      //getting the contract balance 
      console.log("remaining balance",await token.balanceOf(vesting.address));
      //checking the total amount that have been sign
      console.log("totalassign",ethers.utils.formatEther(await vesting.totalAssignAmount()));

  })
    


})