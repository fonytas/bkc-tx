import styled from 'styled-components'
import Header from './header'

const Layout = (props: { children: JSX.Element }) => {
    return (
        <LayoutWrapper>
            <Wrapper>{props.children}</Wrapper>
            <Header />
        </LayoutWrapper>
    )
}

export default Layout

const Wrapper = styled.div`
    padding: 24px;
`

const LayoutWrapper = styled.div`
    max-width: 1600px;
    margin: 0 auto;
`
