// {
//     "1349d703": "count_of_fans()",
//     "600cd433": "fan(address)",
//     "997eff1d": "fan_detail(uint256)",
//     "c1cfb99a": "get_balance()",
//     "272352c8": "get_count_of_fan()",
//     "48b89b43": "get_fans_support_team()",
//     "dd8b4600": "get_fans_ticks()",
//     "1afe22a6": "get_reward()",
//     "12f95c9c": "init_fan()",
//     "8da5cb5b": "owner()",
//     "b8e4a6de": "ref_end()",
//     "c1b18343": "ref_result(uint256)",
//     "4f7e539a": "set_fee_addr(address)",
//     "bed49065": "set_tick(uint256)",
//     "f5aa99b2": "support_team(uint256)",
//     "3ed2b77a": "teams(uint256)"
// }

var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
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


///////////////////////////////////////////////////////////
var gambing = 0.7;
var contract_addr = '0xe00c7fd30a8ce9db49d69a48989599911cacbdf8'
var privateKey = new Buffer('6a0b2e83b3243fffae80393b97f3c81e02971ade4bfda531873c19797ab6a1ea', 'hex')
var account_addr = '0x66E544b0562e224e8acEB10497Cdce5781439C62';
var count = web3.eth.getTransactionCount(account_addr);
  console.log(count);


// init fan 
var test_data = '0x'+ web3.sha3("init_fan()").substr(2,8)+'0000000000000000000000000000000000000000000000000000000000000000'
var rawTx = {
  nonce: count,
  // gasPrice: '0x09184e72a000', 
  gasLimit: 3000000,
  to: contract_addr, 
  value: '0x00', 
  data: test_data
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); 
});



// suport fan
var test_data = '0x'+ web3.sha3("support_team(uint256)").substr(2,8)+ '0000000000000000000000000000000000000000000000000000000000000003'

var rawTx = {
  nonce: count+1,
  // gasPrice: '0x09184e72a000', 
  gasLimit: 3000000,
  to: contract_addr, 
  value: web3.toHex(web3.toWei(gambing, 'ether')), 
  data: test_data
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

//console.log(serializedTx.toString('hex'));

web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); 
});



