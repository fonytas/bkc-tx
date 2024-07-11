import styled, { keyframes } from 'styled-components'
import Typewriter from 'typewriter-effect'
import Header from './layout/header'

const HeroBanner = () => {
    return (
        <Wrapper>
            <Header />
            <Title>BKCDM #4</Title>

            <Subtitle>
                <Typewriter
                    options={{
                        strings: ['Bitkub chain rising beyond limits'],
                        autoStart: true,
                        loop: true,
                    }}
                />
            </Subtitle>

            <ArrowWrapper src='/icons/arrow.png' />
        </Wrapper>
    )
}

export default HeroBanner

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    background: #151917;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    user-select: none;
`
const Title = styled.div`
    font-size: 72px;
    font-weight: bold;
`

const Subtitle = styled.div`
    font-size: 28px;
`

const bouncing = keyframes`
  0% {bottom: 0;}
    50% {bottom: 20px;}
    100% {bottom: 0;}
`
const ArrowWrapper = styled.img`
    animation: ${bouncing} 1s infinite ease-in-out;
    display: block;
    position: absolute;
    width: 60px;
    transform: rotate(90deg);
    padding: 48px;
    cursor: pointer;
`
