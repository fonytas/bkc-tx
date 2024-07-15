import { numberWithComma } from '@helpers/numberWithComma'
import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { styled } from 'styled-components'
// @ts-ignore
import AnimatedNumber from 'react-animated-number'
import { formatNumber } from '@helpers/formatNumber'
import HeroBanner from '@components/HeroBanner'
import { Link, Element } from 'react-scroll'
import { useInView } from 'framer-motion'
import { useLatestBlock } from '@hooks/useLatestBlock'
import { useGasPrice } from '@hooks/useGasPrice'
import { useTransactionPerBlock } from '@hooks/useTransactionPerBlock'
import { motion } from 'framer-motion'
import ConfettiExplosion from 'react-confetti-explosion'

const HomePage = () => {
    const { latestBlock, latestBlockInHex } = useLatestBlock()
    const { gasPrice } = useGasPrice({ unit: 'gwei' })
    const {
        getTransactionPerBlock,
        highestTransactionPerBlock,
        transactionData,
        highestGasUsed,
        highestBlockReward,
        currentTransactionPerBlock,
    } = useTransactionPerBlock()
    const [isBouncingHighest, setIsBouncingHighest] = useState(false)
    const [isBouncingCurrent, setIsBouncingCurrent] = useState(false)
    const [highestTxPerBlock, setHighestTxPerBlock] = useState(0)
    const [currentTxPerBlock, setCurrentTxPerBlock] = useState(0)

    const ref = useRef(null)
    const isInView = useInView(ref, { once: false })

    useEffect(() => {
        if (Number(latestBlock)) {
            getTransactionPerBlock(latestBlockInHex)
        }
    }, [latestBlock])

    useEffect(() => {
        setIsBouncingHighest(true)

        setTimeout(() => {
            setIsBouncingHighest(false)
        }, 2000)

        setHighestTxPerBlock(highestTransactionPerBlock)
    }, [highestTransactionPerBlock])

    useEffect(() => {
        setCurrentTxPerBlock(currentTransactionPerBlock)
    }, [currentTransactionPerBlock])

    const data = {
        labels: [...transactionData.map((data) => data.blockNumber)],
        datasets: [
            {
                label: 'No. of transactions per block',
                backgroundColor: '#00B359',
                borderColor: '#00B359',
                borderWidth: 1,
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
                formatter: function (value: number) {
                    if (value <= 0) {
                        return ''
                    }
                    if (value === highestTransactionPerBlock) {
                        return `🔥${numberWithComma(value)}`
                    }
                    return numberWithComma(value)
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
                suggestedMax: 28000,
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
        labels: [...transactionData.map((data) => data.blockNumber)],
        datasets: [
            {
                label: 'Gas Used per block',
                backgroundColor: '#00B359',
                borderColor: '#00B359',
                borderWidth: 1,
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

    const [a, setA] = useState(0)

    const randomNumber = () => {
        // random number between 1 and 100
        setA(Math.floor(Math.random() * 100) + 1)
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
                    <Wrapper className={isInView ? 'animation-element animate' : 'animation-element'}>
                        <InfoWrapper>
                            <InfoBox>
                                <StatTitle>Gas Price</StatTitle>
                                <InfoValue>{Number(gasPrice)} GWEI</InfoValue>
                            </InfoBox>
                            <Divider />
                            <InfoBox>
                                <StatTitle>Gas Limit</StatTitle>
                                <InfoValue>{process.env.NEXT_PUBLIC_GAS_LIMIT}M</InfoValue>
                            </InfoBox>
                        </InfoWrapper>

                        <InfoWrapper>
                            <InfoBox>
                                <StatTitle>
                                    Highest
                                    <SubtitleText>Block Reward</SubtitleText>
                                </StatTitle>
                                <InfoValue>
                                    {highestBlockReward >= 2.25 ? '🔥' : ''}
                                    {highestBlockReward} KUB
                                </InfoValue>
                            </InfoBox>
                            <Divider />
                            <InfoBox>
                                <StatTitle>
                                    Latest
                                    <SubtitleText>Block Reward</SubtitleText>
                                </StatTitle>
                                <InfoValue>{transactionData?.[transactionData?.length - 1]?.blockReward} KUB</InfoValue>
                            </InfoBox>
                        </InfoWrapper>

                        <InfoWrapper>
                            <InfoBox>
                                <StatTitle>
                                    Current
                                    <SubtitleText>gas used per block</SubtitleText>
                                </StatTitle>
                                <InfoValue style={{ marginTop: '18px' }}>
                                    <CurrentTxWrapper>
                                        <AnimatedNumber
                                            component='text'
                                            value={currentTxPerBlock}
                                            style={{
                                                fontWeight: 'bold',
                                                transition: '0.8s ease-out',
                                                fontSize: 22,
                                                transitionProperty: 'background-color, color, opacity',
                                                color: '#00B359',
                                            }}
                                            duration={1200}
                                            formatValue={(n: number) => `${numberWithComma(n) || '0'} Tx/Block`}
                                            stepPrecision={0}
                                            initialValue={0}
                                        />
                                    </CurrentTxWrapper>
                                    <div className='blockchain'>
                                        <GasIcon>⛽️</GasIcon>
                                        {transactionData.slice(7).map((block) => (
                                            <div
                                                key={block.blockNumber}
                                                className={`block ${
                                                    block.blockNumber === transactionData[transactionData.length - 1].blockNumber
                                                        ? ''
                                                        : 'fadedBlock'
                                                }`}
                                            >
                                                {block.gasUsed > 0 && (
                                                    <div className='block-content'>{formatNumber(block.gasUsed)}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <LatestBlock>#{latestBlock}</LatestBlock>
                                </InfoValue>
                            </InfoBox>
                        </InfoWrapper>

                        {/* <InfoBarWrapper>
                            
                            <TitleWrapper>
                                <InfoBox>
                                    <StatTitle>
                                        Current
                                        <SubtitleText>Transactions per block</SubtitleText>
                                    </StatTitle>
                                </InfoBox>
                                <StatTitle>
                                    {isBouncingHighest && <ConfettiExplosion width={500} height={500} />}
                                    <InfoValue>{transactionData?.[transactionData?.length - 1]?.transactionCount}</InfoValue>
                                    Highest:
                                    <AnimatedNumber
                                        component='text'
                                        value={highestGasUsed}
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
                            <TitleWrapper>
                                <StatTitle>Gas spending</StatTitle>
                                <StatTitle>
                                    {isBouncingHighest && <ConfettiExplosion width={500} height={500} />}
                                    Highest:
                                    <AnimatedNumber
                                        component='text'
                                        value={highestGasUsed}
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
                        </InfoBarWrapper> */}
                    </Wrapper>
                    <br />
                    {/* <button onClick={handleButtonClick}>dd</button> */}
                    <section>
                        <TransactionPerBlockWrapper
                            ref={ref}
                            className={isInView ? 'animation-element animate' : 'animation-element'}
                        >
                            <TransactionPerBlockWrapperBox>
                                <StatValueWrapperHighest>
                                    <ConfettiWrapper>
                                        {isBouncingHighest && <ConfettiExplosion width={500} height={500} />}
                                    </ConfettiWrapper>

                                    <LabelTitle>HIGHEST</LabelTitle>

                                    <AnimatedNumber
                                        component='text'
                                        value={highestTxPerBlock}
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
                                    <Remark>(⛽️ Gas used: {formatNumber(highestGasUsed)})</Remark>
                                </StatValueWrapperHighest>
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
export default HomePage

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
    padding: 36px 24px;

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
    border-radius: 8px;

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

const Remark = styled.div`
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    margin-top: 4px;

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
        margin-bottom: 32px;
    }
`

const StatValueWrapperHighest = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 72px;
    font-weight: bold;
    flex-direction: column;
    position: relative;

    @media screen and (max-width: 1200px) {
        font-size: 64px;
        margin-bottom: 32px;
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

    @media screen and (max-width: 1200px) {
        height: 48px;
        width: unset;
    }
`

const InfoBarWrapper = styled(InfoWrapper)`
    flex-direction: column;

    @media screen and (max-width: 1200px) {
        height: 180px;
    }
`

const InfoBox = styled.div`
    width: 100%;
    position: relative;
    padding: 0 12px;
`

const GasIcon = styled.div`
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 60px;
    transform: translateY(-50%);
`

const InfoValue = styled.div`
    font-size: 28px;
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

const ConfettiWrapper = styled.div``

const CurrentTxWrapper = styled.div`
    margin-bottom: 6px;
    font-size: 24px;
`

const LatestBlock = styled.div`
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
`
