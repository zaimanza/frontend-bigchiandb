const mongoose = require('mongoose');
const { MongoClient } = require('mongodb')

var db
var assetsModel
var client

const useMongodb = () => {
    const connectDB = async () => {
        try {
            client = new MongoClient("mongodb://max:maxmax@18.141.24.92:27017/")
            await client.connect()
            db = await client.db('bigchain')
            await console.log('mongodb connected...')
        } catch (error) {
            console.error(`MongoDB connection error: ${error}`);
        }
    }
    const Assets = async () => await db.collection('assets')
    const Transactions = async () => await db.collection('transactions')
    return { connectDB, Assets, Transactions }
}
module.exports = useMongodb