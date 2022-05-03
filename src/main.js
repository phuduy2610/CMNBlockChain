const {BlockChain,Transaction}= require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('c2a4e84363d7a96c8319b1c48c918f14bd4fd14b2d4b343f990f4b14310c40c7');
const myWalletAddress = myKey.getPublic('hex');

let octCoin = new BlockChain();

const trans1 = new Transaction(myWalletAddress,'public key goes here',10);
trans1.signTransaction(myKey);
octCoin.addTransaction(trans1);


console.log("\n Starting the miner...");
octCoin.minePendingTransactions(myWalletAddress);

console.log("\n Balance of miner is:",octCoin.getBalanceOfAddress(myWalletAddress));

console.log(octCoin);
console.log("\nTransaction:");
console.log(octCoin.chain[1].transactions.length ===0);
// console.log("Mining block 1...");
// octCoin.addNewBlock(new Block({ amount: 4 }));
// console.log("Mining block 2...");
// octCoin.addNewBlock(new Block({ amount: 10 }));
// console.log(JSON.stringify(octCoin, null, 4));
// console.log("Is valid:"+ octCoin.isChainValid());
// octCoin.chain[1].data = {amount:1};
// console.log("Is valid now:"+ octCoin.isChainValid());

