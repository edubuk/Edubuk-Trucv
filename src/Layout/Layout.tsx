import Navbar from "../pages/Navbar"

interface layoutProps {
    children: React.ReactNode;
    isAuthenticated?: boolean;
}

const Layout = ({children}: layoutProps) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    )
}

export default Layout