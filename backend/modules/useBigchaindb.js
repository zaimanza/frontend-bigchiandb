const axios = require('axios').default

const useBigchaindb = () => {

    const API_PATH = 'http://max:maxmax@18.141.24.92:9984/api/v1/'
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
    return { fetchLatestTransaction }
}

module.exports = useBigchaindb