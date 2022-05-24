const express = require('express');
const bip39 = require('bip39');
const BigChainDB = require('bigchaindb-driver');
const router = express.Router();

router.get('/', async (req, res, next) => {
    //create
    const mnemonic = req.body.mnemonic
    // const mnemonic = bip39.generateMnemonic()
    console.log("generated_mnemonic")
    console.log(mnemonic)
    //create mnemonic

    const seed = (await bip39.mnemonicToSeed(mnemonic)).slice(0, 32)
    const user = new BigChainDB.Ed25519Keypair(seed)

    await console.log("hello_bigchain_call_start_6")
    await console.table({
        mnemonic: mnemonic,
        private: user.privateKey,
        public: user.publicKey,
    })
    res.status(200).json({
        mnemonic: mnemonic,
        private: user.privateKey,
        public: user.publicKey,
    });
});

router.post('/', async (req, res, next) => {
    //create
    const mnemonic = bip39.generateMnemonic()
    console.log("generated_mnemonic")
    console.log(mnemonic)
    //create mnemonic
    //   const mnemonic = 'fever loan palace crack hint ivory nice soccer purchase whale air ready'

    const seed = (await bip39.mnemonicToSeed(mnemonic)).slice(0, 32)
    const user = new BigChainDB.Ed25519Keypair(seed)

    await console.log("hello_bigchain_call_start_6")
    await console.table({
        mnemonic: mnemonic,
        private: user.privateKey,
        public: user.publicKey,
    })
    res.status(200).json({
        mnemonic: mnemonic,
        private: user.privateKey,
        public: user.publicKey,
    });
});

module.exports = router;