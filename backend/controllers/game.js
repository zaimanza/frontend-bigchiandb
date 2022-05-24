const express = require('express');
const bip39 = require('bip39');
const BigChainDB = require('bigchaindb-driver');
const useGames = require('../modules/useGames');
const useMongodb = require('../modules/useMongodb');
const useBigchaindb = require('../modules/useBigchaindb');
const { compareKeys } = require('../middleware/compareKeys');
const router = express.Router();

const { createSingleAsset, updateSingleAsset } = useGames()

const { Assets, Transactions } = useMongodb()
const { fetchLatestTransaction } = useBigchaindb()

router.get('/', async (req, res, next) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        const fetchedTransactions = await transactionsModel.find({
            "operation": "CREATE",
            "inputs.owners_before": req.body.publicKey
        }, { projection: { id: 1, _id: 0 } }).toArray()

        let fetchedFull = []

        for (const transaction of fetchedTransactions) {
            let latestTransaction = await fetchLatestTransaction(transaction.id)

            const dataAsset = await assetsModel.find({
                "id": transaction.id,

            }, { projection: { data: 1, _id: 0 } }).toArray()

            console.log(dataAsset[0].data)

            latestTransaction = await {
                ...latestTransaction,
                asset: dataAsset[0].data
            }
            fetchedFull.push(latestTransaction)
        }

        res.status(200).json(fetchedFull);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        let isCanCreate = true

        const isSame = compareKeys(req.body.asset, {
            game_name: "",
            game_category: "",
            game_genre: "",
            game_created_at: ""
        })

        if (!isSame) isCanCreate = false

        const fetchedTransactions = await transactionsModel.find({
            "operation": "CREATE",
            "inputs.owners_before": req.body.publicKey
        }, { projection: { id: 1, _id: 0 } }).toArray()

        for (const transaction of fetchedTransactions) {
            const fetchedAssets = await assetsModel.find({
                "id": transaction.id,
                "data": req.body.metadata
            }).toArray()

            if (fetchedAssets.length != 0) isCanCreate = false

            // let data = await fetchLatestTransaction(transaction.id)
            // data = await {
            //     ...data
            // }
            // console.log(await data)
        }

        // create game for user
        let assetCreated = {}

        if (isCanCreate) {
            console.log("is_can_create")
            assetCreated = await createSingleAsset({
                asset: req.body.asset,
                metadata: req.body.metadata,
                publicKey: req.body.publicKey,
                privateKey: req.body.privateKey,
            })
        }

        console.log("asset_created_exit")
        console.log(await assetCreated)

        res.status(200).json(await assetCreated);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.patch('/', async (req, res, next) => {
    try {
        // check if playerGameExist req.body.publicKey && req.body.game_name
        // if exist (!playerGameExist) return error player has not registered

        let isCanAppend = true

        const isSame = compareKeys(req.body.metadata, {
            updated_at: "",
            level: "",
            score: 0,
        })

        if (!isSame) isCanAppend = false

        let fetchedLatestTransaction = await fetchLatestTransaction(req.body.txCreatedID)

        if (!fetchedLatestTransaction) isCanAppend = false

        // append game for user
        let assetAppend = {}

        if (isCanAppend) {
            assetAppend = await updateSingleAsset({
                txCreatedID: req.body.txCreatedID,
                metadata: req.body.metadata,
                publicKey: req.body.publicKey,
                privateKey: req.body.privateKey,
            })
        }

        console.log("asset_append")
        console.log(assetAppend)
        res.status(200).json(assetAppend);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;