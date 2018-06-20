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

web3.eth.defaultAccount = '0x5b877b50695A364F8e1B8c16C875E1931f76A308';
var accounts = web3.eth.accounts;

const fs = require("fs");
const solc = require('solc')

let source = fs.readFileSync('../worldcup.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
// console.log(compiledContract); 
let abi = compiledContract.contracts[':WorldCup'].interface;
let bytecode = compiledContract.contracts[':WorldCup'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let worldcup = web3.eth.contract(JSON.parse(abi));



// initiate contract for an address
var worldcupInstance = worldcup.at('0x7b75ef95ffe4d634d0dda6db2955827a444574b2');


// web3.eth.defaultAccount = '0xbC611a7F443f50FFee5B1c58503cd6D0075b1667';
// var result = worldcupInstance.init_fan();


web3.eth.defaultAccount = '0x5b877b50695A364F8e1B8c16C875E1931f76A308';
//init fan
var result = worldcupInstance.init_fan();
// call constant function
var result = worldcupInstance.get_count_of_fan.call();
console.log('count of fun',result.c) // 

////this func not support!!!!!!!~~~~~~~~~~~~~~~~~~~~~~~
var result = worldcupInstance.support_team(2,{value: web3.toWei('10', 'ether'), gas: gasEstimate});



// call get blance
var result = worldcupInstance.get_balance.call();
console.log('balnce :',result.c) // 
