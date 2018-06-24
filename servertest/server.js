var http = require('http');
var fs = require("fs");

http.createServer(function (req, res) {  
    var path = req.url;    
    if (path == "/"){  
        path = "/fe.html";
        sendFile(res,path);    
    } else if (path.startsWith("/gamble")) {
        let matched = path.match(/first=([^&]+)&second=([^&]+)&third=([^&]+)&fourth=([^&]+)/);
        let [, first, second, third, fourth] = matched;
    	gamble(first, second, third, fourth, res);
    }else if (path.startsWith("/get_reward")) {
        let matched = path.match(/second=([^&]+)&third=([^&]+)/);
        let [, second, third] = matched;
      get_reward(second, third, res); 
    }else {
    	// 其余路由
    }
}).listen(8888)  

// @/
function sendFile (res, path) {  
    var path = process.cwd() + path;
    fs.readFile(path, function(err, stdout, stderr){  
        if (!err) {  
            var data = stdout;  
            var type = path.substr(path.lastIndexOf(".") + 1, path.length)  
            res.writeHead(200,{'Content-type':"text/" + type});
            res.write(data);  
        }  
        res.end();  
    })  
}  

// @/gamble
function gamble (first, second, third, fourth, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    try{

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
    var gambing = first;
    var contract_addr = '0x2efcc8d87bbdbf3b907bf13ec1596393b1cc5ac8'
    var privateKey = new Buffer(second, 'hex')
    var account_addr = third;
    var count = web3.eth.getTransactionCount(account_addr);
      console.log('transaction count:',count);


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
        console.log(''); 
    });



    // suport fan
    var test_data = '0x'+ web3.sha3("support_team(uint256)").substr(2,8)+ '00000000000000000000000000000000000000000000000000000000000000'+fourth

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

        /** 处理参数 begin  */
        let returnText = '下注成功，请等待矿工打包';
        if (hash == 'undefined'|| !hash || hash == undefined)
            returnText = '下注失败'; 
        /** 处理参数 end */
        let result = {
            text: returnText
        }
        let json = JSON.stringify(result);
        res.end(json);
    });


    }
    catch(err){
      console.log('some error')

        /** 处理参数 begin  */
        let returnText = '下注失败';
        /** 处理参数 end */
        let result = {
            text: returnText
        }
        let json = JSON.stringify(result);
        res.end(json);
    }

}




// @/gamble
function get_reward (second, third, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    try{

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
    var contract_addr = '0x2efcc8d87bbdbf3b907bf13ec1596393b1cc5ac8'
    var privateKey = new Buffer(second, 'hex')
    var account_addr = third;
    var count = web3.eth.getTransactionCount(account_addr);
      console.log('transaction count:',count);


    // init fan 
    var test_data = '0x'+ web3.sha3("get_reward()").substr(2,8)+'0000000000000000000000000000000000000000000000000000000000000000'
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
        console.log(''); 
       console.log(hash); 

        /** 处理参数 begin  */
        let returnText = '提取奖励成功，请等待矿工打包';
        if (hash == 'undefined'|| !hash || hash == undefined)
            returnText = '提取奖励失败'; 
        /** 处理参数 end */
        let result = {
            text: returnText
        }
        let json = JSON.stringify(result);
        res.end(json);
    });

    }
    catch(err){
      console.log('some error')

        /** 处理参数 begin  */
        let returnText = '提取奖励失败';
        /** 处理参数 end */
        let result = {
            text: returnText
        }
        let json = JSON.stringify(result);
        res.end(json);
    }

}



console.log('Server running at http://127.0.0.1:8888/');