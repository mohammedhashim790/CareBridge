import {useState} from "react"
import {Bell, Menu, User,} from "lucide-react"
import "./AElement.css"
import {Outlet} from "react-router-dom";
import {Sidebar} from "../../dashboard/components/sidebar/sidebar.tsx";
import {clearAuthToken} from "../../../../../shared-modules/src/user_auth/user_auth.ts";

const AElement = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


    return (<div className={`container ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Sidebar mobileMenuOpen={mobileMenuOpen} sidebarCollapsed={sidebarCollapsed} onCollapsed={setSidebarCollapsed}
                 setMobileMenuOpen={setMobileMenuOpen}/>
        <main className="main-content">
            <header className="main-header">
                <div className="header-left">
                    <button className="mobile-menu-button">
                        <Menu size={24} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}/>
                    </button>
                    <h1>Carebridge</h1>
                </div>

                <div className="header-right">
                    <div className="header-controls">
                        <div className="notification-bell">
                            <Bell size={20}/>
                            <span className="notification-badge">1</span>
                        </div>
                        <div className="user-avatar">
                            <button onClick={() => {
                                clearAuthToken();
                                window.location.reload();
                            }}>
                                <User size={16}></User>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <Outlet></Outlet>
        </main>
    </div>)
}

export default AElement
