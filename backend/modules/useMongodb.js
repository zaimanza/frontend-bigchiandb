const mongoose = require('mongoose');
const { MongoClient } = require('mongodb')

var db
var assetsModel
var client

const useMongodb = () => {

    const connectDB = async () => {

        try {
            // USING_MONGODB_TO_CONNECT
            // const client = new MongoClient('mongodb://bigchaindb.appserver.projectoasis.io:27017/bigchain')
            // await client.connect()
            // console.log('Connected successfully to server')
            // db = await client.db('bigchain')
            // await db.listCollections().toArray(function (err, collections) {
            //     console.log('mongodb connected...')
            //     collections.forEach((collection) => {
            //         console.log(`{ name: ${collection.name}, type: ${collection.type} }`)
            //     })
            // })

            console.log('connecting')
            client = new MongoClient("mongodb://max:maxmax@18.141.24.92:27017/")
            await client.connect();
            console.log('Connected successfully to server');
            db = await client.db('bigchain');
            // assetsModel.find().toArray(function (err, assets) {
            //     console.log(assets)
            // })

            // mongoose.dropgodb = await mongoose.createConnection(
            //     'mongodb://bigchaindb.appserver.projectoasis.io:27017/bigchain',
            //     {
            //         useNewUrlParser: true,
            //         useUnifiedTopology: true,
            //     }
            // );
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