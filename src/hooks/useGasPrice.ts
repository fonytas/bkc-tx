import { API_CONFIG } from '@constants/api-config'
import { CHAIN } from '@constants/chain'
import { hexToDecimal } from '@helpers/hexToDecimal'
import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

export const useGasPrice = (props: { unit?: 'wei' | 'gwei' }) => {
    const { unit } = props
    const [gasPrice, setGasPrice] = useState('0')

    useEffect(() => {
        getGasPrice()
    }, [])

    const getGasPrice = async () => {
        try {
            const result = await axios.post(
                CHAIN.RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_gasPrice',
                    params: [],
                    id: 1,
                },
                {
                    headers: API_CONFIG.HEADER,
                },
            )

            const _gasPrice = hexToDecimal(result.data.result)
            setGasPrice(_gasPrice)
            return _gasPrice
        } catch (error) {
            console.log('error', error)
        }
    }

    const getGasPriceInUnit = () => {
        switch (unit) {
            case 'gwei': {
                return Number(ethers.formatUnits(gasPrice, 'gwei'))
            }
            case 'wei':
            default: {
                // wei
                return gasPrice
            }
        }
    }

    return {
        gasPrice: getGasPriceInUnit(),
    }
}
