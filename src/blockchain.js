const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    fromAddress;
    toAddress;
    amount;
    signature;
    timestamp;
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = new Date().toLocaleString();
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    //signing key la key pair
    //Sign mot transaction bang cac key
    signTransaction(signingKey){

        if(signingKey.getPublic('hex')!=this.fromAddress){
            throw new Error('Cannot sign transactions for another wallets!');
        }

        const hashTx = this.calculateHash();
        const signing = signingKey.sign(hashTx,'base64');
        this.signature = signing.toDER('hex'); 
    }

    isValidTransaction(){
        //Null nghia la tu he thong thuong cho miner
        if(this.fromAddress == null){
            return true;
        }
        //Khong co signature 
        if(!this.signature || this.signature.length ===0){
            throw new Error('No signature');
        }
        //Lay public key tu chu ky
        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        //Verify la key do dung la tu chu ky do ma ra
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}

class Block {
            //timestamp: Thoi gian tao
        //transactions: thong tin ve giao dich co the de o day
        //previousHash: Hash cua block dang truoc
        //hash: hash cua block hien tai
        //nounce: so dung de tinh hash
    timestamp;
    transactions;
    previousHash;
    hash;
    nonce;
    constructor(transactions, timestamp, previousHash = '') {


        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    //Tinh hash cua block hien tai
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        //Tinh hash den khi thoa man do kho
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined:" + this.hash);
    }
    //Check tat ca transaction trong block co valid khong
    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValidTransaction()){
                return false;
            }
        }
        return true;
    }
}

class BlockChain {
    chain; //chain cac block voi nhau
    difficulty; //do kho
    pendingTransactions; // Chua cac transaction doi
    miningReward; //so thuong cho miner
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    //Ham khoi tao block dau tien
    createGenesisBlock() {
        return new Block([], new Date().toLocaleString(), "0");
    }
    //Ham lay block cuoi cung
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    //Mine cac transaction dang trong hang doi
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardTx);
        let block = new Block(this.pendingTransactions, new Date().toLocaleString()); // pick a transactions instead of all trans
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }
    //Tao ra 1 transaction
    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must have from and to address');
        }
        if(!transaction.isValidTransaction()){
            throw new Error('Cannot add Invalid transaction to the chain');
        }

        this.pendingTransactions.push(transaction);
    }
    //Lay so coin co trong vi 
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
    //Xet xem chain do co bi sua chua khong
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(!currentBlock.hasValidTransaction()){
                return false;
            }
            if ((currentBlock.hash !== currentBlock.calculateHash()) || previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    }
}


module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
