import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/newLogo.png";
import truCv from "../assets/truCV2.png";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { googleLogout } from "@react-oauth/google";
import { API_BASE_URL } from "@/main";
import { useUserData } from "@/context/AuthContext";
import { ChevronDown, LogOut, Menu, Search, UserRound, WalletCards } from "lucide-react";
import SearchResultsPopup from "@/components/ui/SearchResultsPopup";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { useDebounce } from "@/hooks/useDebounce";
import { type SearchProfile } from "@/api/search.apis";
import AnimatedSearchInput from "@/components/ui/AnimatedPlaceHolder";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./current-home.css";

interface LinkItem {
  path: string;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  links: LinkItem[];
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlerLogout: () => void;
  currentPath: string;
  user: any;
  loading: boolean;
}



const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [loading, setLoading] = useState(false);
  //`console.log("currentPath", currentPath);

  const debouncedSearch = useDebounce(search, 300);

  const { users, isLoading, searchProfiles } = useSearchProfiles();
  

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handlerLogout = async () => {
    try {
      setLoading(true);
      const logoutData = await fetch(`${API_BASE_URL}/api/v1/user/logout`, {
        method: "PUT",
        credentials: "include",
      });
      const logoutResult = await logoutData.json();
      console.log("logoutResult", logoutResult);
      if (logoutResult.success) {
        googleLogout(); // Perform Google OAuth logout and remove stored token
        localStorage.removeItem("googleIdToken");
        localStorage.removeItem("email");
        localStorage.removeItem("userName");
        localStorage.removeItem("userImage");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Create CV",
      path: "/create-cv",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Verify",
      path: "/verify",
    },
    {
      name: "Browse CV",
      path: "/browse-cvs",
    },
    // {
    //   name:"Hackathons",
    //   path:"/hackathons"
    // }
  ];

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setShowResults(false);
      return;
    }

    setShowResults(true);
    searchProfiles(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry) {
      const expiryTime = Number(tokenExpiry);
      const currentTime = Date.now() / 1000;
      if (expiryTime < currentTime) {
        toast.error("Your session has expired. Please login again.");
        handlerLogout();
      }
    }
  }, []);

  useEffect(() => {
    const closeAccountMenu = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };

    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="current-nav">
      <div className="current-nav__inner">
        <Link to="/" className="current-nav__brand" aria-label="Edubuk TruCV home">
          <span className="current-nav__edubuk">
            <img src="/latest_edubuk_logo.png" alt="Edubuk" />
          </span>
          <span className="current-nav__brand-divider" aria-hidden="true" />
          <img src={truCv} alt="TruCV" className="current-nav__trucv" />
        </Link>

        <nav className="current-nav__links" aria-label="Primary navigation">
        {links?.map((link, i) =>
          link.name === "Home" ? (
            <Link
              key={i + 1}
              to={link.path}
              className={currentPath === link.path ? "is-active" : ""}
            >
              {link.name}
            </Link>
          ) : (
            user && (
              <Link
                key={i + 1}
                to={link.path}
                className={currentPath === link.path ? "is-active" : ""}
              >
                {link.name}
              </Link>
            )
          ),
        )}
        {user?.roles === "admin" && (
          <Link
            key="admin"
            to="/admin"
            className={currentPath === "/admin" ? "is-active" : ""}
          >
            Admin
          </Link>
        )}
        </nav>

        <div className="current-nav__tools">
          <div className="current-nav__search">
            <Search size={15} />
            <AnimatedSearchInput value={search} onChange={setSearch} />
            {showResults && (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="current-nav__results"
              >
                <SearchResultsPopup
                  users={users}
                  loading={isLoading}
                  onSelect={(selectedUser: SearchProfile) => {
                    setShowResults(false);
                    setSearch("");
                    navigate(`/cv/${selectedUser.userId}`);
                    window.location.reload();
                  }}
                />
              </div>
            )}
          </div>

        {!user ? (
          <Link to="/login" className="current-nav__auth">Sign in</Link>
        ) : (
          <div className="current-nav__account" ref={accountMenuRef}>
            <button
              type="button"
              className={`current-nav__account-trigger ${isAccountMenuOpen ? "is-open" : ""}`}
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="menu"
            >
              <span className="current-nav__account-icon"><UserRound size={16} /></span>
              <span>Account</span>
              <ChevronDown size={15} className="current-nav__account-chevron" />
            </button>

            <div className={`current-nav__account-menu ${isAccountMenuOpen ? "is-open" : ""}`} role="menu">
              <div className="current-nav__account-label"><WalletCards size={15} />Wallet</div>
              <div className="current-nav__wallet">
                <ConnectButton />
              </div>
              <div className="current-nav__account-divider" />
              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  handlerLogout();
                }}
                disabled={loading}
                className="current-nav__logout"
                role="menuitem"
              >
                <LogOut size={16} />
                {loading ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        )}

          <button
            type="button"
            className="current-nav__menu"
            onClick={toggleSidebar}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        links={links}
        setIsSidebarOpen={setIsSidebarOpen}
        handlerLogout={handlerLogout}
        currentPath={currentPath}
        user={user}
        loading={loading}
      />
    </header>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  links,
  setIsSidebarOpen,
  handlerLogout,
  currentPath,
  user,
  loading,
}) => {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsSidebarOpen(false)}
        className={`current-nav__overlay ${isOpen ? "is-open" : ""}`}
      />
      <aside className={`current-sidebar ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="current-sidebar__head">
          <img src={logo} alt="Edubuk" />
          <MdClose
            className="current-sidebar__close"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <nav className="current-sidebar__links">
        {links?.map((link, i) =>
          link.name === "Home" ? (
            <Link
              key={i + 1}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={currentPath === link.path ? "is-active" : ""}
            >
              <span>0{i + 1}</span>{link.name}
            </Link>
          ) : (
            user && (
              <Link
                key={i + 1}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={currentPath === link.path ? "is-active" : ""}
              >
                <span>0{i + 1}</span>{link.name}
              </Link>
            )
          ),
        )}

        {user?.roles === "admin" && (
          <Link
            to="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={currentPath === "/admin" ? "is-active" : ""}
          >
            <span>06</span>Admin
          </Link>
        )}
        </nav>

        {!user ? (
          <Link
            to="/login"
            onClick={() => setIsSidebarOpen(false)}
            className="current-sidebar__action"
          >
            Sign in to TruCV
          </Link>
        ) : (
          <div className="current-sidebar__account">
            <div className="current-sidebar__wallet-label"><WalletCards size={16} />Wallet account</div>
            <div className="current-sidebar__wallet"><ConnectButton /></div>
            <button onClick={handlerLogout} className="current-sidebar__action" disabled={loading}>
              <LogOut size={16} />{loading ? "Signing out..." : "Logout"}
            </button>
          </div>
        )}
        <img src={truCv} alt="TruCV" className="current-sidebar__trucv" />
      </aside>
    </>
  );
};

export default Navbar;
