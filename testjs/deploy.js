var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}



var connected = web3.isConnected();
if(!connected){
  console.log("node not connected!");
}else{
  console.log("node connected");
}

if(!web3.currentProvider)
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:7545"));

web3.eth.defaultAccount = '0xdd60A5C72B920Ca9Ea0cbBb8880696DBC95f27fb';
var accounts = web3.eth.accounts;
// console.log(accounts); 

// var balance = web3.eth.getBalance('0x160b41d953cad924c605371c52be9ea163837310');
// console.log(balance); // instanceof BigNumber
// console.log(balance.toString(10)); // '1000000000000'
// console.log(balance.toNumber()); // 1000000000000
const fs = require("fs");
const solc = require('solc')

let source = fs.readFileSync('../worldcup.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
// console.log(compiledContract); 
let abi = compiledContract.contracts[':WorldCup'].interface;
let bytecode = compiledContract.contracts[':WorldCup'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let worldcup = web3.eth.contract(JSON.parse(abi));




// console.log(worldcup); 
///////////////////////////////////deploy contract
var myContractReturned = worldcup.new( {
   from:'0xdd60A5C72B920Ca9Ea0cbBb8880696DBC95f27fb',
   data:bytecode,
   gas:gasEstimate}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.

       // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
       // check address on the second call (contract deployed)
       } else {
           console.log(myContract.address) // the contract address
       }

       // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    }
  });