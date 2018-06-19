//初始化过程
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

web3.eth.defaultAccount = '0x887388F796d6d3ADF8cB41761F0187CF9acE1674';
var accounts = web3.eth.accounts;
// console.log(accounts); 

// var balance = web3.eth.getBalance('0x160b41d953cad924c605371c52be9ea163837310');
// console.log(balance); // instanceof BigNumber
// console.log(balance.toString(10)); // '1000000000000'
// console.log(balance.toNumber()); // 1000000000000
const fs = require("fs");
const solc = require('solc')

let source = fs.readFileSync('worldcup.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
// console.log(compiledContract); 
let abi = compiledContract.contracts[':WorldCup'].interface;
let bytecode = compiledContract.contracts[':WorldCup'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let worldcup = web3.eth.contract(JSON.parse(abi));

// console.log(worldcup); 
/////////////////////////////////////deploy contract
// var myContractReturned = worldcup.new( {
//    from:'0x887388F796d6d3ADF8cB41761F0187CF9acE1674',
//    data:bytecode,
//    gas:gasEstimate}, function(err, myContract){
//     if(!err) {
//        // NOTE: The callback will fire twice!
//        // Once the contract has the transactionHash property set and once its deployed on an address.

//        // e.g. check tx hash on the first call (transaction send)
//        if(!myContract.address) {
//            console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
//        // check address on the second call (contract deployed)
//        } else {
//            console.log(myContract.address) // the contract address
//        }

//        // Note that the returned "myContractReturned" === "myContract",
//        // so the returned "myContractReturned" object will also get the address set.
//     }
//   });

// initiate contract for an address
var worldcupInstance = worldcup.at('0x666b13df52a89832d43366112443c538304ab4f6');


// web3.eth.defaultAccount = '0xbC611a7F443f50FFee5B1c58503cd6D0075b1667';
// var result = worldcupInstance.init_fan();


web3.eth.defaultAccount = '0x7ad13fc615797D978709717AA94d000CDEEFf0E0';
// var result = worldcupInstance.init_fan();
// call constant function
var result = worldcupInstance.get_count_of_fan.call();
console.log(result.c) // '0x25434534534'

////this func not support!!!!!!!~~~~~~~~~~~~~~~~~~~~~~~
var result = worldcupInstance.support_team(2,{value: 10000000000000000, gas: web3.toWei(150, 'gwei')});



