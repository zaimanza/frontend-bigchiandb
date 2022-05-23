import mongoose from 'mongoose'
import { Db, MongoClient } from 'mongodb'

var db: Db
var client: MongoClient

const mongodb_database = () => {

    const connectDB = async () => {

        try {
            console.log("connecting database")
            client = new MongoClient("mongodb://13.215.249.21:27017/bigchain")
            await client.connect()
            console.log('Connected successfully to server')
            db = client.db('bigchain')
            console.log('mongodb connected...')
        } catch (error) {
            console.error(`MongoDB connection error: ${error}`)
        }
    }

    const Assets = async () => db.collection('assets')
    const Transactions = async () => db.collection('transactions')

    return { connectDB, Assets, Transactions }
}

export default mongodb_database