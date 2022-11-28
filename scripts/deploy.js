
const hre = require("hardhat");

async function main() {
  
  const token= await hre.ethers.getContractFactory("AURA");
  const  mytoken=await token.deploy();
  await mytoken.deployed();
  
  const vesting = await hre.ethers.getContractFactory("vesting");
  const vestingLogic = await vesting.deploy(mytoken.address);
  await vestingLogic.deployed();

  await vestingLogic.deployed();

  console.log(
    `myToken deployed to ${mytoken.address}`
  );
  console.log(
    `vestinglogic deployed to ${vestingLogic.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// myToken deployed to 0x1baFAa51b69382565F3fE2A12a5D9Cc65e841038
//vestinglogic deployed to 0xbceE458407113600553d4D0aBB73f2D9560AA341