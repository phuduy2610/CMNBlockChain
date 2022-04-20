const SHA256 = require('crypto-js/sha256');
class Block {
    timestamp;
    transactions;
    previousHash;
    hash;
    nounce;
    constructor(transactions, timestamp, previousHash = '') {
        //timestamp: Thoi gian tao
        //data: Du lieu ( thong tin ve giao dich co the de o day)
        //previousHash: Hash cua block dang truoc
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    //Tinh hash cua block hien tai
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nounce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined:" + this.hash);
    }
}

class BlockChain {
    chain;
    difficulty;
    pendingTransactions; // Chua cac transaction doi
    miningReward;
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //Ham khoi tao block dau tien
    createGenesisBlock() {
        return new Block("Genesis block", new Date().toLocaleString(), "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(this.pendingTransactions, new Date().toLocaleString()); // pick a transactions instead of all trans
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }
            }
        }
        return balance;
    }
    // addNewBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.timestamp = new Date().toLocaleString();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

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

class Transaction {
    fromAddress;
    toAddress;
    amount;
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

let octCoin = new BlockChain();
octCoin.createTransaction(new Transaction('address1','address2',6));
octCoin.createTransaction(new Transaction('address2','address1',9));
console.log("\n Starting the miner...");
octCoin.minePendingTransactions('miner address');
console.log("\n Balance of miner is:",octCoin.getBalanceOfAddress('miner address'));
console.log("\n Starting the miner again...");
octCoin.minePendingTransactions('miner address');
console.log("\n Balance of miner is:",octCoin.getBalanceOfAddress('miner address'));
console.log(JSON.stringify(octCoin, null, 4));

// console.log("Mining block 1...");
// octCoin.addNewBlock(new Block({ amount: 4 }));
// console.log("Mining block 2...");
// octCoin.addNewBlock(new Block({ amount: 10 }));
// console.log(JSON.stringify(octCoin, null, 4));
// console.log("Is valid:"+ octCoin.isChainValid());
// octCoin.chain[1].data = {amount:1};
// console.log("Is valid now:"+ octCoin.isChainValid());

