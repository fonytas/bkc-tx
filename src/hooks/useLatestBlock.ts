import { API_CONFIG } from '@constants/api-config'
import { CHAIN } from '@constants/chain'
import { hexToDecimal } from '@helpers/hexToDecimal'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const useLatestBlock = () => {
    const [latestBlock, setLatestBlock] = useState(null)

    useEffect(() => {
        getLatestBlock()

        const interval = setInterval(() => {
            getLatestBlock()
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const getLatestBlock = async () => {
        try {
            const result = await axios.post(
                CHAIN.RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1,
                },
                {
                    headers: API_CONFIG.HEADER,
                },
            )

            const latestBlockNumber = result.data.result
            setLatestBlock(latestBlockNumber)
            return latestBlockNumber
        } catch (error) {
            console.log('error', error)
        }
    }

    return {
        latestBlock: hexToDecimal(latestBlock || '0'),
        latestBlockInHex: latestBlock || '0x0',
    }
}
