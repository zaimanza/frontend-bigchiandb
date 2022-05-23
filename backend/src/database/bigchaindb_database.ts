import axios, { AxiosResponse } from 'axios'
import express, { Express, NextFunction, Request, Response } from 'express'

const bigchaindb_database = () => {

    const API_PATH: string = 'http://13.215.249.21:9984/api/v1/'
    
    const fetchLatestTransaction = async (props: {assetId: string, res: Response}) => {
        try {
            const list: AxiosResponse<any, any>  = await axios.get(
                `${API_PATH}transactions?asset_id=${props.assetId}&operation=TRANSFER&last_tx=${true}`
                )

            return await list.data[0] ?? {}
        } catch (error) {
            props.res.status(400).json(error);
        }
    }
    return { fetchLatestTransaction }
}

export default bigchaindb_database