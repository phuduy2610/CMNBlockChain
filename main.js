const SHA256 = require('crypto-js/sha256');
class Block {
    index;
    timestamp;
    data;
    previousHash;
    hash;
    nounce;
    constructor(data, timestamp, previousHash = '') {
        //index: So thu tu trong chuoi
        //timestamp: Thoi gian tao
        //data: Du lieu ( thong tin ve giao dich co the de o day)
        //previousHash: Hash cua block dang truoc
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    //Tinh hash cua block hien tai
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nounce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined:"+ this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    //Ham khoi tao block dau tien
    createGenesisBlock() {
        return new Block("Genesis block", new Date().toLocaleString(), "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.index = this.chain.length;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.timestamp = new Date().toLocaleString();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if ((currentBlock.hash != currentBlock.calculateHash()) || previousBlock.hash != currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    }
}

let octCoin = new BlockChain();
console.log("Mining block 1...");
octCoin.addNewBlock(new Block({ amount: 4 }));
console.log("Mining block 2...");
octCoin.addNewBlock(new Block({ amount: 10 }));
// console.log(JSON.stringify(octCoin, null, 4));
// console.log("Is valid:"+ octCoin.isChainValid());
// octCoin.chain[1].data = {amount:1};
// console.log("Is valid now:"+ octCoin.isChainValid());

