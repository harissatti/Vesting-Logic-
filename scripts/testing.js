const { ethers } = require("hardhat");
async function main () {
    const accounts = await ethers.provider.listAccounts();
    console.log(accounts);
    const ERC20_Address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    
    const ERC20FC = await ethers.getContractFactory("AURA")
    
    const ERC20 = await ERC20FC.attach(ERC20_Address)
    
    await ERC20.transfer(accounts[1], ethers.utils.parseUnits("300", 18))
    
   console.log("sdd")
    console.log(await ERC20.balanceOf(accounts[1]))









}
main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
