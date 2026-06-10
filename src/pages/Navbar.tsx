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
import { Search } from "lucide-react";
import SearchResultsPopup from "@/components/ui/SearchResultsPopup";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";
import { useDebounce } from "@/hooks/useDebounce";
import { type SearchProfile } from "@/api/search.apis";
//import { ConnectButton } from "@rainbow-me/rainbowkit";

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

const placeholders = ["name", "city", "college", "company", "skill"];

const Navbar: React.FC = () => {
  const [isActive, setActive] = useState("/");
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [loading, setLoading] = useState(false);
  //`console.log("currentPath", currentPath);
  const [placeholder, setPlaceholder] = useState("");
  const indexRef = useRef<number>(0);
  const charRef = useRef<number>(0);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { users, isLoading, searchProfiles } = useSearchProfiles();

  const typePlaceholder = (text: string) => {
    charRef.current = 0;
    const type = () => {
      if (charRef.current <= text.length) {
        setPlaceholder(text.slice(0, charRef.current));
        charRef.current++;
        typingRef.current = setTimeout(type, 60); // typing speed
      } else {
        // fully typed — wait then erase
        typingRef.current = setTimeout(() => erasePlaceholder(text), 1500);
      }
    };
    type();
  };

  const erasePlaceholder = (text: string) => {
    let len = text.length;
    const erase = () => {
      if (len >= 0) {
        setPlaceholder(text.slice(0, len));
        len--;
        typingRef.current = setTimeout(erase, 30); // erase speed faster
      } else {
        // move to next placeholder
        indexRef.current = (indexRef.current + 1) % placeholders.length;
        typingRef.current = setTimeout(
          () => typePlaceholder(placeholders[indexRef.current]),
          300,
        );
      }
    };
    erase();
  };

  useEffect(() => {
    typePlaceholder(placeholders[0]);
    return () => clearTimeout(typingRef.current as unknown as number); // cleanup on unmount
  }, []);

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

  const handlerActive = (linkName: string): void => {
    setActive(linkName);
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

  return (
    <div
      className="flex justify-between items-center sm:px-3 w-full border-b-2 border-gray-200 bg-white"
      data-aos="fade-right"
    >
      <img
        src={logo}
        alt="Logo"
        className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 "
      />
      <div className="relative flex gap-3 justify-between items-center">
        {links?.map((link, i) =>
          link.name === "Home" ? (
            <Link
              key={i + 1}
              to={link.path}
              onClick={() => handlerActive(link.name)}
              className={`hidden lg:flex ${
                isActive === link.name ? "text-[#f14419]" : "text-[#03257e]"
              } hover:text-[#f14419] transition duration-200 py-2 text-[18px] font-medium`}
            >
              {link.name}
            </Link>
          ) : (
            user && (
              <Link
                key={i + 1}
                to={link.path}
                onClick={() => handlerActive(link.name)}
                className={`hidden lg:flex ${
                  currentPath === link.path
                    ? "text-[#f14419]"
                    : "text-[#03257e]"
                } hover:text-[#f14419] transition duration-200 py-2 text-[18px] font-medium`}
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
            onClick={() => handlerActive("Admin")}
            className={`hidden lg:flex ${
              currentPath === "/admin" ? "text-[#f14419]" : "text-[#03257e]"
            } hover:text-[#f14419] transition duration-200 py-2 text-[18px] font-medium`}
          >
            Admin
          </Link>
        )}
        {!user ? (
          <div className="hidden lg:flex relative rounded-full p-[2px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
            <Link
              to="/login"
              className="w-full bg-white py-1 text-[18px] px-8 font-bold rounded-full text-[#03257e] hover:text-[#f14419]"
            >
              Login
            </Link>
          </div>
        ) : (
          <>
            <div className="relative hidden lg:flex rounded-full p-[2px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
              <button
                onClick={handlerLogout}
                disabled={loading}
                className="w-full bg-white py-1 text-[18px] px-8 font-bold rounded-full text-[#03257e] hover:text-[#f14419]"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Please Wait..." : "Logout"}
              </button>
            </div>
            {/* <div className="hidden xl:block">
              <ConnectButton />
            </div> */}
          </>
        )}
        {/* Hamburger Menu */}
        <div className="flex items-center justify-center gap-2 ml-1">
          <div
            className={`relative flex lg:hidden flex-col items-center justify-center w-8 h-8 cursor-pointer space-y-1 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "open" : ""
            }`}
            onClick={toggleSidebar}
          >
            <span
              className={`block w-8 h-1 bg-[#03257e] rounded transition duration-300 ease-in-out ${
                isSidebarOpen ? "transform translate-y-3 rotate-45" : ""
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-[#f14419] rounded transition duration-300 ease-in-out ${
                isSidebarOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-8 h-1 bg-[#006666] rounded transition duration-300 ease-in-out ${
                isSidebarOpen ? "transform -translate-y-2 -rotate-45" : ""
              }`}
            ></span>
          </div>
        </div>
        <div className="relative hidden">
          <Search
            size={14}
            className="
            hidden sm:block
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            text-slate-400
            z-10
          "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (users.length > 0) {
                setShowResults(true);
              }
            }}
            placeholder={`Search by ${placeholder}`}
            className="
              w-full
              h-8 sm:h-10
              pl-8
              pr-4
              rounded-2xl
              border
              border-slate-200
              text-sm
              sm:text-md
              bg-white
              text-slate-800
              placeholder:text-slate-400
              shadow-sm
              outline-none
              transition-all
              duration-200
              focus:border-[#03257e]
              focus:ring-4
              focus:ring-[#03257e]/10
              focus:shadow-lg
            "
          />
        </div>
        {showResults && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute top-full left-0 w-full z-[999]"
          >
            <SearchResultsPopup
              users={users}
              loading={isLoading}
              onSelect={(user: SearchProfile) => {
                setShowResults(false);
                setSearch("");
                navigate(`/cv/${user.userId}`);
              }}
            />
          </div>
        )}
      </div>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        links={links}
        setIsSidebarOpen={setIsSidebarOpen}
        handlerLogout={handlerLogout}
        currentPath={currentPath}
        user={user}
        loading={loading}
      />
      <img
        src={truCv}
        alt="trucv-logo"
        className="w-32 h-16 sm:h-24 sm:w-48 md:w-60 md:h-24"
      ></img>
    </div>
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
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-white text-[#006666] transform transition duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } shadow-lg z-10`}
    >
      <div className="flex flex-col space-y-4 p-4">
        <div className="flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-20 w-20" />
          <MdClose
            className="size-8 cursor-pointer hover:text-[#03257e]"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        {links?.map((link, i) =>
          link.name === "Home" ? (
            <Link
              key={i + 1}
              to={link.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`${
                currentPath === link.path ? "text-[#f14419]" : "text-[#03257e]"
              } hover:text-[#f14419] transition duration-200 py-2`}
            >
              {link.name}
            </Link>
          ) : (
            user && (
              <Link
                key={i + 1}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`${
                  currentPath === link.path
                    ? "text-[#f14419]"
                    : "text-[#03257e]"
                } hover:text-[#f14419] transition duration-200 py-2`}
              >
                {link.name}
              </Link>
            )
          ),
        )}

        {user?.roles === "admin" && (
          <Link
            to="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`${
              currentPath === "/admin" ? "text-[#f14419]" : "text-[#03257e]"
            } hover:text-[#f14419] transition duration-200 py-2`}
          >
            Admin
          </Link>
        )}

        {!user ? (
          <Link
            to="/login"
            className="bg-[#03257e] py-2 px-4 rounded-full text-center text-white"
          >
            Login
          </Link>
        ) : (
          <div className="relative rounded-full bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419]">
            <button
              onClick={handlerLogout}
              className=" w-full bg-white py-2 px-4 rounded-full text-[#03257e] hover:font-bold"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
