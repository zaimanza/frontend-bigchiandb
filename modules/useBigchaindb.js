const axios = require('axios').default
const BigChainDB = require('bigchaindb-driver')
const bip39 = require('bip39')

const useBigchaindb = () => {
    const API_PATH = 'http://18.141.24.92:8000/api/v1/'
    const conn = new BigChainDB.Connection(API_PATH)
    const fetchLatestTransaction = async (assetId) => {
        try {
            // console.log(assetId)
            let list = await axios.get(`${API_PATH}transactions?asset_id=${assetId}&operation=TRANSFER&last_tx=${true}`)
            // fetch(
            //     `${API_PATH}transactions?asset_id=${assetId}&operation=TRANSFER&last_tx=${true}`,
            // )

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
        // try {
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

        let assetTransfered = await conn.postTransactionCommit(signedTransfer)

        return assetTransfered ?? {}
        // } catch (error) {
        //     res.status(400).json(error);
        // }
    }
    return { fetchLatestTransaction, createSingleAsset, updateSingleAsset }
}

module.exports = useBigchaindb