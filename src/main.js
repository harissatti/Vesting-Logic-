import {useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import { NavBar } from "./components/navbar";
import { User } from "./components/user";
import Aura from "./artifacts/contracts/ERC20.sol/AURA.json";
import Vesting from "./artifacts/contracts/VestingLogic.sol/vesting.json";
import { ethers } from "ethers";
import { useRef } from 'react';



// import './App.css';

export function Main() {

  const [defaultAccount, setDefaultAccount] = useState("");
  const [tokenName,setTokenName]=useState("");
  const [userBalance, setUserBalance] = useState(null);
  const firstRef = useRef(null);
  const secondref = useRef("");
  const thirdRef = useRef(null);
  const fourthref = useRef("");
  const fifthref = useRef(null);
  const sixref = useRef("");
  const sevenref=useRef("");

  async function connecting() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts", })
        .then(result => {
          accountChangeHandler(result[0]);
        })
    }
    else {
      window.alert("please install meta mask");
    }

  }
  //account changehandler
  const accountChangeHandler = (newAccount) => {
  
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  }
  const getUserBalance = (address) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then(balance => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
  }
  //rerender the address and get user account and balance if user switch account
  window.ethereum.on("accountsChanged", accountChangeHandler);
  //connection with smartcotract 
  async function execute() {
    //getting contract address
    const contractAddress = "0x3A22cA423cAFE9Aa7E9cb3EEB08E11F04Ad26A9c";
    console.log(contractAddress, "erc");
    //getting provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider, "provider");
    //we need signer because when someone need to execute then it indicate them that they want  to execute.thats the one who want to do it;address of their indicate them
    const signer = provider.getSigner();//this is going to get the connected account 
    console.log(signer, "signer");
    //and also abi of contract
    const contract = new ethers.Contract(contractAddress, Aura.abi, signer);
    console.log(contract, "contract");
    const name = await contract.name();
    setTokenName(name);
    console.log(name, "name");
  }
  //transfer amount  by contract owner to vesting  contract
  const transferAmount = async (event) => {
    event.preventDefault();
    //getting contract address
    const contractAddress = "0x3A22cA423cAFE9Aa7E9cb3EEB08E11F04Ad26A9c";
    console.log(contractAddress, "erc");
    //getting provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider, "provider");
    const signer = provider.getSigner();
    console.log(signer, "signer");
    const contract = new ethers.Contract(contractAddress, Aura.abi, signer);
    console.log(secondref.current.value, "To Address");
    console.log(firstRef.current.value, "value");
    const amount = ethers.utils.parseUnits(firstRef.current.value, 18);
    const transfer = await contract.transfer(secondref.current.value, amount);
    console.log(transfer, "transfer");
    let vestingbalance = await contract.balanceOf(secondref.current.value);
    console.log("Vesting contract ballance :  ", ethers.utils.formatEther(vestingbalance));
  }
  //add vesting 
  const AddVesting = async (event) => {
    event.preventDefault();
    const vestingContractAddress = "0x5A681EeD662BD9748B8E8E26E00d4135c8a6800D";
    console.log(vestingContractAddress, "vesting");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider, "provider");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(vestingContractAddress, Vesting.abi, signer);
    const amount = ethers.utils.parseUnits(thirdRef.current.value, 18);
    await contract.addVesting(fourthref.current.value, amount);
    const user = await contract.getUserRecord(fourthref.current.value);
  //  getting the id of user that assign to him
    {
      user?.map(item => {
        console.log(parseInt(Number(item)))
        return <p>Owner Address : {item[0]}
        </p>
      })
    }
  }
  //withdraw the amount
  const WithDraw = async (event) => {
    event.preventDefault();
    const vestingContractAddress = "0x5A681EeD662BD9748B8E8E26E00d4135c8a6800D";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const vestingcontract = new ethers.Contract(vestingContractAddress, Vesting.abi, signer);
    //erccontract seting
    const erccontractAddress = "0x3A22cA423cAFE9Aa7E9cb3EEB08E11F04Ad26A9c";
    console.log(erccontractAddress, "erc");
    const ercprovider = new ethers.providers.Web3Provider(window.ethereum);
    const ercsigner = ercprovider.getSigner();
    const erccontract = new ethers.Contract(erccontractAddress, Aura.abi, ercsigner);
    //withdraw
    const result = await vestingcontract.withdraw(sixref.current.value, fifthref.current.value);
    //checking the amount of user get;
    console.log(result, "withdraw");
    const vestingbalance = await erccontract.balanceOf(sixref.current.value);
    console.log("Vesting contract ballance :  ", ethers.utils.formatEther(vestingbalance));
    const vestingRecord = await vestingcontract.vestingMap(fifthref.current.value);
    console.log("Record of user id", vestingRecord);
    //checking the total amount  that vested 
    let totalvested = await vestingcontract.totalVested();
    console.log("record of contract Amount that vested", ethers.utils.formatEther(totalvested));
  }
  const ChangeOwnerShip = async (event) => {
    event.preventDefault();
    const vestingContractAddress = "0x5A681EeD662BD9748B8E8E26E00d4135c8a6800D";
    console.log(vestingContractAddress, "vesting");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider, "provider");
    const signer = provider.getSigner();
    const contract = new ethers.Contract(vestingContractAddress, Vesting.abi, signer);
    const owner= await contract.ContractOwner();
    console.log("owner:",owner);
    const result = await contract.transferOwnership(sevenref.current.value);
    //transfer Ownership
    console.log(result, "withdraw");
    await contract.ContractOwner();
    console.log("owner:",owner);
  }




  return (
    
   
     
    <div  >
      
      <NavBar/>
      <Routes> 
      <Route exact path="/user" element={<User/>}/>
    </Routes>
        
      <div className="flex justify-end">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={connecting}>
          <span>{defaultAccount.length>0?`${defaultAccount}`:"Connect Wallet"}</span>
        </button>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-1">{userBalance}
      <h3><b>balance</b></h3>
      </div>
    
      
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={execute}>
        <span>{tokenName.length>0?`${tokenName}`:"TokenName"}</span>
      </button>
      <div className="grid gap-6 mb-6 md:grid-cols-2">

        <div>
          <label for="first_name" className="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">transfer Amount</label>
          <form onSubmit={transferAmount}>
            <input type="number" ref={firstRef}
              className="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Amount"
              required></input>
            <input type="text" ref={secondref}
              className="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Address"
              required></input>

            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
             dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
              dark:focus:ring-blue-800">enter</button>
          </form>


        </div>
      </div>


      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-gray-500"><h3>vesting</h3></div>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="first_name" className="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">vesting</label>
          <form onSubmit={AddVesting}>
            <input type="number" ref={thirdRef}
              className="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Amount"
              required></input>
            <label for="first_name" className="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">Investor address</label>
            <input type="text" ref={fourthref}
              class="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Address"
              required></input>

            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
             dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
              dark:focus:ring-blue-800">enter</button>
          </form>


        </div>
      </div>

      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-gray-500"><h3>WithDraw</h3></div>
      <div class="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label for="first_name" class="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">Withdraw Amount</label>
          <form onSubmit={WithDraw}>
            <input type="number" ref={fifthref}
              class="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="id"
              required></input>
            <label for="first_name" class="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">Investor address</label>
            <input type="text" ref={sixref}
              class="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Address"
              required></input>

            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
             dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
              dark:focus:ring-blue-800">enter</button>
          </form>
          <form onSubmit={ChangeOwnerShip}>
            <label for="first_name" className="block mb-2 text-sm font-medium
             text-gray-900 dark:text-gray-300">Transfer Ownership</label>
            <input type="text" ref={sevenref}
              class="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-lg focus:ring-blue-500
               focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white dark:focus:ring-blue-500
                  dark:focus:border-blue-500" placeholder="Transfer Ownership"
              required></input>

            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2
             dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
              dark:focus:ring-blue-800">enter</button>
          </form>



        </div>
      </div>


      
    </div>
   
   
  );
}
