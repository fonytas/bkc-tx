import styled from 'styled-components'

const Header = () => {
    return (
        <HeaderWrapper>
            <LogoImg src='/images/logo.png' />
        </HeaderWrapper>
    )
}

export default Header

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 24px;
`

const LogoImg = styled.img`
    height: 48px;
    object-fit: cover;
`
