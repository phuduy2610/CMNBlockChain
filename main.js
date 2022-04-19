const SHA256 = require('crypto-js');
class Block {
    index;
    timestamp;
    data;
    previousHash;
    hash;
    constructor( timestamp, data, previousHash = '') {
        //index: So thu tu trong chuoi
        //timestamp: Thoi gian tao
        //data: Du lieu ( thong tin ve giao dich co the de o day)
        //previousHash: Hash cua block dang truoc
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    //Tinh hash cua block hien tai
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    //Ham khoi tao block dau tien
    createGenesisBlock(){
        return new Block(0,"01/01/2022","Genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    
    addNewBlock(newBlock){
        newBlock.index = this.chain.length;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let octCoin = new BlockChain();
octCoin.addNewBlock(new Block("19/04/2022",{amount : 4}));
octCoin.addNewBlock(new Block("22/04/2022",{amount : 10}));
console.log(JSON.stringify(octCoin,null,4));