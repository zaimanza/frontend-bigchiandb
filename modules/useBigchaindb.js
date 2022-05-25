const axios = require('axios').default
const BigChainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const useMongodb = require('./useMongodb')

const useBigchaindb = () => {
    const { Assets } = useMongodb()
    const API_PATH = 'http://18.141.24.92:8000/api/v1/'
    const conn = new BigChainDB.Connection(API_PATH)
    const fetchLatestTransaction = async (assetId) => {
        try {
            const assetsModel = await Assets()
            let list = await axios.get(`${API_PATH}transactions?asset_id=${assetId}&operation=TRANSFER&last_tx=${true}`)

            if (list.data.length == 0) {
                list = await axios.get(`${API_PATH}transactions?asset_id=${assetId}&operation=CREATE&last_tx=${true}`)
            }

            if (list.length == 0) return

            const dataAsset = await assetsModel.find({
                "id": assetId,

            }, { projection: { data: 1, _id: 0 } }).toArray()

            if (list.length != 0) {
                return await {
                    ...list.data[0],
                    asset: dataAsset[0].data
                }
            }

            return await list.data[0] ?? {}
        } catch (error) {
            res.status(400).json(error);
        }
    }
    const createSingleAsset = async ({ asset, metadata, publicKey, privateKey }) => {
        // try {
        const txCreatePaint = BigChainDB.Transaction.makeCreateTransaction(
            asset,
            metadata,
            [
                BigChainDB.Transaction.makeOutput(
                    BigChainDB.Transaction.makeEd25519Condition(publicKey),
                ),
            ],
            publicKey,
        )
        const txSigned = BigChainDB.Transaction.signTransaction(txCreatePaint, privateKey)
        console.log("asset_creating")
        // console.log(txSigned)
        let assetCreated = await conn.postTransactionCommit(txSigned)
        console.log("asset_created")
        console.log(assetCreated)
        return assetCreated ?? {}
        // } catch (error) {
        //     res.status(400).json(error);
        // }
    }
    const updateSingleAsset = async ({ txCreatedID, publicKey, privateKey, metadata }) => {
        try {
            let txCreated = await conn.getTransaction(txCreatedID)

            const updatedBuilding = BigChainDB.Transaction.makeTransferTransaction(
                [
                    {
                        tx: txCreated,
                        output_index: 0,
                    },
                ],
                [
                    BigChainDB.Transaction.makeOutput(
                        BigChainDB.Transaction.makeEd25519Condition(publicKey),
                    ),
                ],
                metadata,
            )

            const signedTransfer = BigChainDB.Transaction.signTransaction(
                updatedBuilding,
                privateKey,
            )

            console.log(signedTransfer)
            let assetTransfered = await conn.postTransactionCommit(signedTransfer)
            console.log("UPDATE_SUCCESS")
            return assetTransfered ?? {}
        } catch (error) {
            console.log(error)
        }
    }
    return { fetchLatestTransaction, createSingleAsset, updateSingleAsset }
}

module.exports = useBigchaindb