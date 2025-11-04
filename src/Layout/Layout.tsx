import Navbar from "../pages/Navbar"

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}

export default Layout