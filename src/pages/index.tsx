import { hexToDecimal } from '@helpers/hexToDecimal'
import { numberWithComma } from '@helpers/numberWithComma'
import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { styled } from 'styled-components'
// @ts-ignore
import AnimatedNumber from 'react-animated-number'
import { formatNumber } from '@helpers/formatNumber'
import { removeTrailingDecimal } from '@helpers/removeTrailingDecimal'
import HeroBanner from '@components/HeroBanner'
import { Link, Element, animateScroll as scroll } from 'react-scroll'
import uniqby from 'lodash.uniqby'
import { useInView } from 'framer-motion'

const RPC_URL = 'http://43.225.143.44:8545'

interface TransactionPerBlock {
    blockNumber: string
    transactionCount: string
    gasUsed: string
}

const LIMIT_LENGTH = 12

let HIGHEST_TRANSACTION_PER_BLOCK = 0
let HIGHEST_GAS_USED = 0
let HIGHEST_BLOCK_REWARD = 0
let CURRENT_TRANSACTION = 0

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': true,
}

const TestPage = () => {
    const [transactionData, setTransactionData] = useState<TransactionPerBlock[]>([])
    const [gasPrice, setGasPrice] = useState<string>('0x0')

    const ref = useRef(null)
    const isInView = useInView(ref, { once: false })

    useEffect(() => {
        getLatestBlockNumber()
        getGasPrice()
        const interval = setInterval(async () => {
            const result = await getTransactionsPerBlock()
            if (result) {
                setTransactionData((prevData) => {
                    const updatedData = [...prevData, result]
                    if (result.blockNumber === prevData[prevData.length - 1]?.blockNumber) {
                        return [...prevData]
                    }

                    if (prevData.length < 9) {
                        const appendedData = Array.from({ length: LIMIT_LENGTH - prevData.length }, (_, index) => {
                            return {
                                blockNumber: (Number(result.blockNumber) - (LIMIT_LENGTH - index)).toString(),
                                transactionCount: '0x0',
                                gasUsed: '0x0',
                            }
                        })
                        return uniqby([...appendedData, ...updatedData], 'blockNumber')
                    } else {
                        return uniqby(updatedData.slice(-LIMIT_LENGTH), 'blockNumber')
                    }
                })
            }
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const getGasPrice = async () => {
        try {
            const _gasPrice = await axios.post(
                RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_gasPrice',
                    params: [],
                    id: 1,
                },
                {
                    headers,
                },
            )

            const _gasPriceGwei = ethers.formatUnits(_gasPrice.data.result, 'gwei')
            setGasPrice(_gasPriceGwei)

            return _gasPriceGwei
        } catch (error) {
            console.log('error', error)
        }
    }

    const getTransactionsPerBlock = async () => {
        try {
            const blockNumber = await getLatestBlockNumber()

            const transactionsInBlock = await axios.post(
                RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_getBlockTransactionCountByNumber',
                    params: [blockNumber],
                    id: 1,
                },
                {
                    headers,
                },
            )

            const blockInfo = await axios.post(
                RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_getBlockByNumber',
                    params: [blockNumber, false],
                    id: 1,
                },
                {
                    headers,
                },
            )

            const transactionsPerBlock = transactionsInBlock.data.result
            const gasUsed = hexToDecimal(blockInfo.data.result.gasUsed)

            CURRENT_TRANSACTION = Number(hexToDecimal(transactionsPerBlock))

            if (Number(hexToDecimal(transactionsPerBlock)) > Number(HIGHEST_TRANSACTION_PER_BLOCK)) {
                HIGHEST_TRANSACTION_PER_BLOCK = Number(hexToDecimal(transactionsPerBlock))
            }

            if (Number(gasUsed) > Number(HIGHEST_GAS_USED)) {
                HIGHEST_GAS_USED = Number(gasUsed)
            }

            const newData = {
                blockNumber: hexToDecimal(blockNumber),
                transactionCount: transactionsPerBlock,
                gasUsed: hexToDecimal(blockInfo.data.result.gasUsed),
            }
            return newData
        } catch (error) {
            console.log('error', error)
        }
    }

    const getLatestBlockNumber = async () => {
        try {
            const latestBlockNumber = await axios.post(
                RPC_URL,
                {
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1,
                },
                {
                    headers,
                },
            )

            return latestBlockNumber.data.result
        } catch (error) {
            console.log('error', error)
        }
    }

    const data = {
        labels: [...transactionData.map((data) => data.blockNumber)],
        // labels: dataMockup.labels,
        datasets: [
            {
                label: 'No. of transactions per block',
                backgroundColor: '#00B359',
                borderColor: '#00B359',
                borderWidth: 1,
                // data: dataMockup.datasets[0].data,
                data: [...transactionData.map((data) => data.transactionCount)],
            },
        ],
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Bar Chart',
            },
            datalabels: {
                anchor: 'end' as any,
                align: 'top' as any,
                formatter: function (value: string) {
                    const formattedValue = Number(hexToDecimal(value))
                    if (formattedValue <= 0) {
                        return ''
                    }
                    if (formattedValue === HIGHEST_TRANSACTION_PER_BLOCK) {
                        return `🔥${numberWithComma(formattedValue)}`
                    }
                    return numberWithComma(formattedValue)
                },
                color: 'white',
                font: {
                    size: 14,
                    weight: 'bold' as any,
                },
            },
            legend: {
                maxWidth: 100,
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'TRANSACTIONS',
                    color: '#00b359',
                    font: {
                        weight: 'bold' as any,
                    },
                },
                min: 0,
                max: 28000,
                ticks: {
                    stepSize: 4000,
                },
                grid: {
                    display: true,
                    color: 'rgba(227, 227, 227, 0.1)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'BLOCK NUMBER',
                    color: '#00b359',
                    font: {
                        weight: 'bold' as any,
                    },
                },
                grid: {
                    display: true,
                    color: 'rgba(227, 227, 227, 0.1)',
                },
            },
        },
        animation: {
            duration: 0,
        },
        transitions: {
            active: {
                animation: {
                    duration: 0,
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    }

    const gasSpendingData = {
        // labels: gasSpendingDataMockup.labels,
        labels: [...transactionData.map((data) => data.blockNumber)],
        datasets: [
            {
                label: 'Gash Used per block',
                backgroundColor: '#00B359',
                borderColor: '#00B359',
                borderWidth: 1,
                // data: gasSpendingDataMockup.datasets[0].data,
                data: [...transactionData.map((data) => data.gasUsed)],
            },
        ],
    }

    const gasSpendingOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Bar Chart',
            },
            datalabels: {
                display: false,
            },
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    display: false,
                },
            },
            x: {
                display: false,
                ticks: {
                    display: false,
                },
            },
        },
        animation: {
            duration: 0,
        },
        transitions: {
            active: {
                animation: {
                    duration: 0,
                },
            },
        },
        layout: {
            padding: 24,
        },
    }

    const calculateLatestGasUsed = () => {
        const latestGasUsed = transactionData[transactionData.length - 1]?.gasUsed
        const rewardPerBoxInWei = Number(latestGasUsed) * Number(gasPrice)
        const rewardPerBoxInEther = (rewardPerBoxInWei / 1e9).toString()
        if (Number(rewardPerBoxInEther) > HIGHEST_BLOCK_REWARD) {
            HIGHEST_BLOCK_REWARD = Number(removeTrailingDecimal(rewardPerBoxInEther))
        }
        return removeTrailingDecimal(rewardPerBoxInEther)
    }

    return (
        <Layout>
            <Element name='hero'>
                <Link to='content' smooth={true} duration={500}>
                    <HeroBanner />
                </Link>
            </Element>

            <Element name='content'>
                <ContentWrapper>
                    {/* <section className='scroll-animation'> */}
                    <Wrapper className={isInView ? 'animation-element animate' : 'animation-element'}>
                        <InfoWrapper>
                            <InfoBox>
                                <StatTitle>Gas Price</StatTitle>
                                <InfoValue>{Number(gasPrice)} GWEI</InfoValue>
                            </InfoBox>
                            <Divider />
                            <InfoBox>
                                <StatTitle>Gas Limit</StatTitle>
                                <InfoValue>600M</InfoValue>
                            </InfoBox>
                        </InfoWrapper>

                        <InfoWrapper>
                            <InfoBox>
                                <StatTitle>
                                    Highest
                                    <SubtitleText>Block Reward</SubtitleText>
                                </StatTitle>
                                <InfoValue>
                                    {HIGHEST_BLOCK_REWARD >= 2.25 ? '🔥' : ''}
                                    {HIGHEST_BLOCK_REWARD} KUB
                                </InfoValue>
                            </InfoBox>
                            <Divider />
                            <InfoBox>
                                <StatTitle>
                                    Latest
                                    <SubtitleText>Block Reward</SubtitleText>
                                </StatTitle>
                                <InfoValue>{calculateLatestGasUsed()} KUB</InfoValue>
                            </InfoBox>
                        </InfoWrapper>

                        <InfoBarWrapper>
                            <TitleWrapper>
                                <StatTitle>Gas spending</StatTitle>
                                <StatTitle>
                                    Highest:
                                    <AnimatedNumber
                                        component='text'
                                        value={HIGHEST_GAS_USED}
                                        style={{
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            fontSize: 18,
                                            transitionProperty: 'background-color, color, opacity',
                                        }}
                                        duration={1200}
                                        formatValue={(n: number) => ` 🔥${formatNumber(n) || '0'}`}
                                        stepPrecision={0}
                                        initialValue={0}
                                    />
                                </StatTitle>
                            </TitleWrapper>
                            <GasSpendingWrapper>
                                <Bar data={gasSpendingData} options={gasSpendingOptions} />
                            </GasSpendingWrapper>
                        </InfoBarWrapper>
                    </Wrapper>
                    {/* </section> */}
                    <br />
                    <section>
                        <TransactionPerBlockWrapper
                            ref={ref}
                            className={isInView ? 'animation-element animate' : 'animation-element'}
                        >
                            <TransactionPerBlockWrapperBox>
                                <StatValueWrapper>
                                    <LabelTitle>HIGHEST</LabelTitle>
                                    <AnimatedNumber
                                        component='text'
                                        value={HIGHEST_TRANSACTION_PER_BLOCK}
                                        style={{
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            fontSize: 64,
                                            transitionProperty: 'background-color, color, opacity',
                                            color: '#00B359',
                                        }}
                                        duration={1200}
                                        formatValue={(n: number) => `🔥${numberWithComma(n) || '0'}`}
                                        stepPrecision={0}
                                        initialValue={0}
                                    />
                                    <Title>transactions per block</Title>
                                </StatValueWrapper>

                                <StatValueWrapper>
                                    <LabelTitle>CURRENT</LabelTitle>
                                    <AnimatedNumber
                                        component='text'
                                        value={CURRENT_TRANSACTION}
                                        style={{
                                            fontWeight: 'bold',
                                            transition: '0.8s ease-out',
                                            fontSize: 64,
                                            transitionProperty: 'background-color, color, opacity',
                                            color: '#00B359',
                                        }}
                                        duration={1200}
                                        formatValue={(n: number) => `${numberWithComma(n) || '0'}`}
                                        stepPrecision={0}
                                        initialValue={0}
                                    />
                                    <Title>transactions per block</Title>
                                </StatValueWrapper>
                            </TransactionPerBlockWrapperBox>

                            <ChartWrapper>
                                <Bar data={data} options={options} />
                            </ChartWrapper>
                        </TransactionPerBlockWrapper>
                    </section>
                </ContentWrapper>
            </Element>
        </Layout>
    )
}
export default TestPage

const LabelTitle = styled.div`
    font-size: 48px;
    font-weight: 600;
    text-align: center;
`

const StatTitle = styled.div`
    align-self: start;
    justify-self: start;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    color: #a4a4a4;
    position: relative;

    @media screen and (max-width: 986px) {
        font-size: 16px;
    }
`

const ContentWrapper = styled.div`
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    padding: 36px 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Layout = styled.div``

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 8px;
    height: 180px;
    /* padding: 12px; */
    border-radius: 8px;
    /* background-color: #262626; */
    /* background-image: url('/background/block-bg.png'); */

    @media screen and (max-width: 1200px) {
        flex-direction: column;
        height: unset;
    }
`

const Box = styled.div`
    display: flex;
    border-radius: 8px;
    width: 100%;
    background: #262626;
    flex-direction: column;
    padding: 12px 24px;

    @media screen and (max-width: 1200px) {
        width: unset;
    }
`

const ChartWrapper = styled.div`
    width: 70%;
    background-color: #262626;
    padding: 24px;
    border-radius: 8px;
    @media screen and (max-width: 1200px) {
        width: 100%;
        height: 500px;
    }
`

const TransactionPerBlockWrapperBox = styled(Box)`
    width: 30%;
    display: flex;
    flex-direction: column;

    background-color: #262626;
    padding: 12px 24px;
    border: 2px solid #2a2828;

    @media screen and (max-width: 986px) {
        width: 80%;
    }
`

const TransactionPerBlockWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 8px;
    max-width: 1600px;
    height: 480px;

    @media screen and (max-width: 1200px) {
        flex-direction: column;
        height: unset;
        align-items: center;
    }
`

const Title = styled.div`
    font-size: 22px;
    font-weight: 600;
    text-align: center;

    @media screen and (max-width: 1200px) {
        font-size: 18px;
    }
`

const StatValueWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 72px;
    font-weight: bold;
    flex-direction: column;

    @media screen and (max-width: 1200px) {
        font-size: 64px;
    }
`

const GasSpendingWrapper = styled.div`
    width: 100%;
    height: 100%;
`

const InfoWrapper = styled.div`
    display: flex;
    width: 100%;
    background-color: #262626;
    border-radius: 16px;
    padding: 12px 24px;
    border: 2px solid #2a2828;
`

const InfoBarWrapper = styled(InfoWrapper)`
    flex-direction: column;
`

const InfoBox = styled.div`
    width: 100%;
    position: relative;
    padding: 0 12px;
`

const InfoValue = styled.div`
    font-size: 32px;
    font-weight: bold;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const Divider = styled.div`
    height: 100%;
    width: 1px;
    background: rgba(227, 227, 227, 0.1);
`

const SubtitleText = styled.div`
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    color: #a4a4a4;
    position: absolute;
    bottom: -16px;
`

const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

const dataMockup = {
    labels: [
        '17518332',
        '17518333',
        '17518334',
        '17518335',
        '17518336',
        '17518337',
        '17518338',
        '17518339',
        '17518340',
        '17518341',
        '17518342',
        '17518343',
    ],
    datasets: [
        {
            label: 'No. of transactions per block',
            backgroundColor: '#00B359',
            borderColor: '#00B359',
            borderWidth: 1,
            data: [
                '0x3782',
                '0x6f3d',
                '0x377c',
                '0x322f',
                '0x33d9',
                '0x3244',
                '0x6994',
                '0x4537',
                '0x6f3d',
                '0x377c',
                '0x322f',
                '0x33d9',
            ],
        },
    ],
}

const gasSpendingDataMockup = {
    labels: [
        '17518300',
        '17518301',
        '17518302',
        '17518303',
        '17518304',
        '17518305',
        '17518306',
        '17518307',
        '17518308',
        '17518309',
        '17518310',
        '17518311',
    ],
    datasets: [
        {
            label: 'Gas Used per block',
            backgroundColor: '#00B359',
            borderColor: '#00B359',
            borderWidth: 1,
            data: [
                '537067165',
                '310771165',
                '266356165',
                '253168165',
                '293341165',
                '311058164',
                '443974165',
                '148525165',
                '537067165',
                '310771165',
                '266356165',
                '253168165',
            ],
        },
    ],
}
