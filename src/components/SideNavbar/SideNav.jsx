import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Clients from '../client/client.jsx'; 
import { signout } from '../../services/auth';
import './SideNav.css';
import Company from '../company/Company';
import Vendor from '../vendor/Vendor';
import Consultant from '../consultant/Consultant';
import Project from '../project/Project';
import Template from '../Template/Template';
import Invoice from '../invoice/Invoice';
import userLogo from '../../assets/userLogo.png'
import landingPageImage from '../../assets/landingPageImage.png';
import invoiceLogo from '../../assets/invoice.png'
import exitUser from '../../assets/exit.png'
import LandingPage from './LandingPage';

export default function SideNav() {
    const location = useLocation();
    const navigate = useNavigate(); 

    async function handleSignoutClick(e) {
        e.preventDefault(); 
        
        // Trigger animation by passing state through navigation
        await signout(); 
        navigate("/signin", {
            replace: true,
            state: { triggerSignout: true }
        }); 
    }

    const handleLogoClick = () => {
        navigate("/sidenav");
    }

    const getLinkClass = (path) => {
        if (location.pathname === path) {
            return 'active';
        }
        if (path !== '/sidenav' && location.pathname.startsWith(path)) {
            return 'active';
        }
        return '';
    };

    return(
        <div id="dashboard-layout"> 

            <nav id="side-navbar">
                <div 
                    id='sidebar-logo' 
                    onClick={handleLogoClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleLogoClick();
                        }
                    }}
                >
                    <img src={invoiceLogo} alt='invoice-logo' />
                    <h2>Invoice Generator</h2>
                </div>
                <ul> 
                    <li><Link to="/sidenav/clients" className={getLinkClass("/sidenav/clients")}>Clients</Link></li>
                    <li><Link to="/sidenav/companies" className={getLinkClass("/sidenav/companies")}>Companies</Link></li>
                    <li><Link to="/sidenav/vendors" className={getLinkClass("/sidenav/vendors")}>Vendors</Link></li>
                    <li><Link to="/sidenav/consultants" className={getLinkClass("/sidenav/consultants")}>Consultants</Link></li>
                    <li><Link to="/sidenav/projects" className={getLinkClass("/sidenav/projects")}>Projects</Link></li>
                    <li><Link to="/sidenav/templates" className={getLinkClass("/sidenav/templates")}>Templates</Link></li>
                    <li><Link to="/sidenav/invoices" className={getLinkClass("/sidenav/invoices")}>Invoice</Link></li>
                </ul>
            </nav>

            <main id="main-content">
                <header id="main-content-header">

                    <div id="user-info-header">
                        <img 
                            src={userLogo}
                            alt="User Profile" 
                            className="user-logo"
                        />
                        <span className="user-name">Admin</span>
                    </div>

                    <button id="signout-button-logo" onClick={handleSignoutClick}>
                        <img 
                            src={exitUser} 
                            alt="Sign Out" 
                            className="exit-icon"
                        />
                        <span className="signout-text">Sign Out</span>
                    </button>

                </header>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <div 
                                id="landing-page-content" >
                                <h2 id="welcome-message">Welcome <div>Select an item from the sidebar.</div></h2>
                                < LandingPage />
                            </div>
                        } 
                    />                    
                    <Route path="clients" element={<Clients />} /> 
                    <Route path="companies" element={<Company />} />
                    <Route path="vendors" element={<Vendor />} />
                    <Route path="consultants" element={<Consultant />} />
                    <Route path="projects" element={<Project />} />
                    <Route path="invoices" element={<Invoice />} />
                    <Route path="templates" element={<Template />} />
                    <Route path="*" element={<h3>404 - Content not found in this section.</h3>} /> 
                </Routes>
            </main>
        </div>
    )
}