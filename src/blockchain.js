const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,
    "B95411697C8A1F87D54875DCE44B4C759F7F071AA8FE220C404A70571101BD35",
    null,
    1524966128553,
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getNewestBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();


const createNewBlock = data => {
    const previousBlock = getNewestBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    addBlockToChain(newBlock);
    return newBlock;
};
const getBlockHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

const isBlockValid = (candidateBlock, latestBlock) => {
    if (!isBlockStructureValid(candidateBlock)) {
        console.log("The candidate block structure is not valid");
        return false;
    }
    else if (latestBlock.index + 1 != candidateBlock.index) {
        consloe.log('The candidate block doesnt have a valid index');
        return false;
    } else if (latestBlock.hash !== candidateBlock.previousHash) {
        console.log('The PreviousHash of the candidate block is not the hash of the latest block');
        return false;
    } else if (getBlockHash(candidateBlock) !== candidateBlock.hash) {
        consloe.log("The hash of this block is invalid");
        return false;
    }
    return true;
};

const isBlockStructureValid = (block) => {
    return (
        typeof block.index === 'number' &&
        typeof block.hash === 'string' &&
        typeof block.previousHash === 'string' &&
        typeof block.timestamp === 'number' &&
        typeof block.data === "string"
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isGenesisValid(candidateChain[0])) {
        console.log("The candidateChains's genesisBlock is not the same as our genesisBlock");
        return false;
    };
    for (let i = 1; i < candidateChain.length; i++) {
        if (!isBlockValid(candidateChain[i], candidateChain[i - 1])) {
            return false;
        }
    }
    return true;
};

const replaceChain = candidateBlock => {
    if(isChainValid(candidateBlock) && candidateBlock.length > getBlockchain().length){
        blockchain = candidateBlock;
        return true;
    } else {
        return false;
    }
}

const addBlockToChain = candidateBlock => {
    if(isBlockValid(candidateBlock, getNewestBlock())){
        getBlockchain().push(candidateBlock);
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getNewestBlock,
    getBlockchain,
    createNewBlock,
    isBlockStructureValid,
    addBlockToChain,
    replaceChain
};

