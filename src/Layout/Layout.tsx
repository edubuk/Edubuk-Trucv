import Navbar from "../pages/Navbar"
import DebugSessionBanner from "../components/developer/DebugSessionBanner"

interface layoutProps {
    children: React.ReactNode;
    isAuthenticated?: boolean;
}

const Layout = ({children}: layoutProps) => {
    return (
        <div>
            <Navbar />
            <DebugSessionBanner />
            <main>{children}</main>
        </div>
    )
}

export default Layout