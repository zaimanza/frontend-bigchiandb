const express = require('express');
const bip39 = require('bip39');
const BigChainDB = require('bigchaindb-driver');
const useMongodb = require('../modules/useMongodb');
const useBigchaindb = require('../modules/useBigchaindb');
const { compareKeys } = require('../middleware/compareKeys');
const { dailyDate } = require('../middleware/dailyDate');
const router = express.Router();

const { fetchLatestTransaction, createSingleAsset, updateSingleAsset } = useBigchaindb()

const { Assets, Transactions } = useMongodb()

router.get('/', async (req, res, next) => {
    try {
        // get top 20

        const assetsModel = await Assets()
        // find by asset utk cari game, metadata utk cari tarikh and score utk filter

        console.log(req.body.game_name)
        // by date, by top 20
        const fetchedTransactions = await assetsModel.find({
            "data.game_name": req.body.game_name
        }, { projection: { id: 1, _id: 0 } }).toArray()


        const listUser = []
        for (const transaction of fetchedTransactions) {

            const previousData = await fetchLatestTransaction(transaction.id)
            console.log(previousData.metadata.submission_date)
            if (dailyDate({ date: previousData.metadata.submission_date }))
                listUser.push(previousData)

        }

        listUser.sort((a, b) => (a.metadata.score < b.metadata.score) ? 1 : -1)
        const top20Player = listUser.slice(0, 20)

        const aggregate = await assetsModel.aggregate([
            { $match: { "data.game_name": req.body.game_name } },
            {
                $lookup: {
                    from: "metadata",
                    let: { assetId: "$id" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$id", "$$assetId"] },
                                    // {
                                    //     $eq: [
                                    //         { $dayOfMonth: new Date("$metadata.submission_date") },
                                    //         { $dayOfMonth: new Date() }

                                    //     ]
                                    // },
                                    {
                                        $eq: [
                                            { $month: new Date("$metadata.submission_date") },
                                            { $month: new Date() }

                                        ]
                                    },
                                    // {
                                    //     $eq: [
                                    //         { $year: new Date("$metadata.submission_date") },
                                    //         { $year: new Date() }

                                    //     ]
                                    // }
                                ]
                            }
                        }
                    }],
                    as: "metadata",
                },
            },
            // { $sort: { "metadata.metadata.score": -1 } },
            { $limit: 20 }
        ]).toArray()

        // console.log(listUser)
        res.status(200).json(await aggregate);

    } catch (error) {
        console.log(error)
    }
});

router.post('/', async (req, res, next) => {
    try {
        const assetsModel = await Assets()
        const transactionsModel = await Transactions()

        let isCanCreate = true

        const isSame = compareKeys(req.body.asset, {
            game_type: "",
            game_category: "",
            game_name: ""
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