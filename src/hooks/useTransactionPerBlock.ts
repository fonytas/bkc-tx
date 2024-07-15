import { API_CONFIG } from '@constants/api-config'
import { CHAIN } from '@constants/chain'
import { hexToDecimal } from '@helpers/hexToDecimal'
import axios from 'axios'
import { useState } from 'react'
import uniqby from 'lodash.uniqby'
import { useGasPrice } from './useGasPrice'
import { removeTrailingDecimal } from '@helpers/removeTrailingDecimal'

interface TransactionPerBlock {
    blockNumber: string
    transactionCount: number
    gasUsed: number
    blockReward: number
}

const LIMIT_LENGTH = 12

export const useTransactionPerBlock = () => {
    const { gasPrice } = useGasPrice({ unit: 'gwei' })

    const [transactionData, setTransactionData] = useState<TransactionPerBlock[]>([])
    const [highestTransactionPerBlock, setHighestTransactionPerBlock] = useState<number>(0)
    const [highestGasUsed, setHighestGasUsed] = useState<number>(0)
    const [highestBlockReward, setHighestBlockReward] = useState<number>(0)
    const [currentTransactionPerBlock, setCurrentTransactionPerBlock] = useState<number>(0)

    const getTransactionPerBlock = async (blockNumber: string) => {
        try {
            const blockNumbeInDecimal = hexToDecimal(blockNumber)

            const blockInfo = await axios.post(
                CHAIN.RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_getBlockByNumber',
                    params: [blockNumber, false],
                    id: 1,
                },
                {
                    headers: API_CONFIG.HEADER,
                },
            )

            const transactionPerBlock = blockInfo.data.result.transactions.length || 0
            const gasUsed = Number(hexToDecimal(blockInfo.data.result.gasUsed))

            setCurrentTransactionPerBlock(transactionPerBlock)

            if (transactionPerBlock > highestTransactionPerBlock) {
                setHighestTransactionPerBlock(transactionPerBlock)
            }

            if (gasUsed > highestGasUsed) {
                setHighestGasUsed(gasUsed)
            }

            const newData = {
                blockNumber: blockNumbeInDecimal.toString(),
                transactionCount: transactionPerBlock,
                gasUsed,
                blockReward: calculateLatestGasUsed(gasUsed),
            }

            const newArray = uniqby([...transactionData, newData], 'blockNumber')

            if (newArray.length < LIMIT_LENGTH) {
                const appendedData = Array.from({ length: LIMIT_LENGTH - newArray.length }).map((_, index) => ({
                    blockNumber: (Number(blockNumbeInDecimal) - (LIMIT_LENGTH - index)).toString(),
                    transactionCount: 0,
                    gasUsed: 0,
                    blockReward: 0,
                }))

                setTransactionData([...appendedData, ...newArray])
            } else {
                if (newArray.length >= LIMIT_LENGTH) {
                    setTransactionData(() => newArray.slice(1))
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const calculateLatestGasUsed = (gasUsed: number) => {
        const rewardPerBoxInWei = gasUsed * Number(gasPrice)
        const rewardPerBoxInEther = (rewardPerBoxInWei / 1e9).toString()
        if (Number(rewardPerBoxInEther) > highestBlockReward) {
            setHighestBlockReward(Number(removeTrailingDecimal(rewardPerBoxInEther)))
        }
        return Number(removeTrailingDecimal(rewardPerBoxInEther))
    }

    return {
        getTransactionPerBlock,
        highestTransactionPerBlock,
        highestGasUsed,
        transactionData,
        highestBlockReward,
        currentTransactionPerBlock,
    }
}
