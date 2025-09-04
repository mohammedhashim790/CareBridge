import {FilePenLine, FileText, Home, Menu, Pill, Settings, X} from "lucide-react";
import {Component} from "react";
import {Link, useLocation} from "react-router-dom";

const SidebarWithNavigation = (props: {
    mobileMenuOpen: boolean,
    sidebarCollapsed: boolean,
    onCollapsed: (collapsed: boolean) => void,
    setMobileMenuOpen: (mobileMenuOpen: boolean) => void
}) => {
    const location = useLocation();

    const navigationItems = [{
        icon: Home, label: "Dashboard", active: location.pathname === "/a" || location.pathname === "/", path: "/a"
    }, {
        icon: FileText, label: "Health Records", path: "/a/ehr",
    }, {
        icon: FilePenLine, label: "Intake Form", path: "/a/intakeForm/view",
    }, {
        icon: Pill, label: "Prescriptions", path: "/a/prescription",
    }, // {
        //     icon: MessageSquare,
        //     label: "Messages",
        //     path: "/a/messages",
        // },
        {
            icon: Settings, label: "Settings", path: "/settings",
        },];

    const {mobileMenuOpen, sidebarCollapsed, onCollapsed, setMobileMenuOpen} = props;

    return (<div>
            {mobileMenuOpen && (<div className="mobile-menu-overlay">
                    <div className="mobile-menu-header">
                        <div className="mobile-menu-logo">CareBridge</div>
                        <button onClick={() => setMobileMenuOpen(false)} className="mobile-menu-close">
                            <X size={24}/>
                        </button>
                    </div>
                    <nav className="mobile-menu-nav">
                        {navigationItems.map((item, index) => (<Link
                                key={index}
                                to={item.path}
                                className={`mobile-menu-item ${item.active ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon size={20}/>
                                <span>{item.label}</span>
                            </Link>))}
                    </nav>
                </div>)}
            <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">{!sidebarCollapsed && "CareBridge"}</div>
                    <button onClick={() => onCollapsed(!sidebarCollapsed)} className="sidebar-toggle">
                        <Menu size={20}/>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navigationItems.map((item, index) => (<Link
                            key={index}
                            to={item.path}
                            className={`sidebar-nav-item ${item.active ? "active" : ""}`}
                            title={sidebarCollapsed ? item.label : ""}
                        >
                            <item.icon size={20}/>
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>))}
                </nav>
            </aside>
        </div>);
};

export class Sidebar extends Component<{
    mobileMenuOpen: boolean,
    sidebarCollapsed: boolean,
    onCollapsed: (collapsed: boolean) => void,
    setMobileMenuOpen: (mobileMenuOpen: boolean) => void
}> {
    render() {
        return <SidebarWithNavigation {...this.props} />;
    }
}
