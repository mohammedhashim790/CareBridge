import {useState} from 'react';
import doc1 from '../../assets/HomePage1.png';
import doc2 from '../../assets/HomePage2.png';
import doc3 from '../../assets/HomePage3.png';

import HamburgerButton from '../../components/HamburgerButton';
import DesktopNavButton from '../../components/DesktopNavButton';
import MobileNavButton from '../../components/MobileNavButton';
import LearnMoreButton from '../../components/LearnMoreButton';
import HeaderCTAButton from '../../components/HeaderCTAButton';
import ExpandButton from '../../components/ExpandButton';
import FooterLink from '../../components/FooterLink';

const HomePage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen);
        console.log("Menu toggled");
    };

    const handleLearnMoreClick = () => {
        console.log("Learn More clicked - Dummy action");
        alert("Learn More action initiated! This is a dummy action.");
    };

    const handleExpandClick = (index: number) => {
        setExpandedTiles((prev) => ({
            ...prev, [index]: !prev[index],
        }));
        console.log(`Tile ${index} expanded`);
    };

    const handleFeatureLearnMore = (feature: string) => {
        console.log(`Learn more clicked for ${feature} - Dummy action`);
        alert(`Learn more about ${feature}! This is a dummy action.`);
    };

    const tileContents = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo lorem quis enim consectetur faucibus. Pellentesque sed blandit eros.", "Pellentesque a tellus auctor, convallis elit nec, fermentum nisi. In tristique tempus quam id tristique. Nam mollis tortor arcu.", "A vestibulum mauris finibus eu. In molestuda sapien ac leo bibendum, sed eleifend dui scelerisque. Maecenas metus nisi, gravida non ornare e.", "Egestas nec justo. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",];

    const scrollToSection = (sectionId: string) => {
        if (sectionId === 'home') {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            document.getElementById(sectionId)?.scrollIntoView({behavior: 'smooth'});
        }
        setMenuOpen(false);
    };

    const handleSignup = () => {
        console.log("Signup clicked - dummy logic: Simulating signup process");
        alert("Signup process initiated! This is a dummy action.");
    };

    const handleLogin = () => {
        console.log("Login clicked - dummy logic: Simulating login process");
        alert("Login process initiated! This is a dummy action.");
    };

    return (<div className="flex flex-col min-h-screen">
            <header
                className="bg-primary text-white flex flex-col items-center justify-center min-h-[56vh] lg:min-h-[60vh] relative">
                <div className="flex justify-between w-full max-w-7xl items-center px-4 py-6">
                    <h1 className="text-3xl lg:text-4xl font-bold">CareBridge</h1>
                    
                    <HamburgerButton onClick={handleMenuClick} />
                    
                    <nav className="hidden lg:flex space-x-8">
                        <DesktopNavButton onClick={() => scrollToSection('home')}>
                            Home
                        </DesktopNavButton>
                        <DesktopNavButton onClick={() => scrollToSection('services')}>
                            Services
                        </DesktopNavButton>
                        <DesktopNavButton onClick={handleSignup}>
                            Signup
                        </DesktopNavButton>
                        <DesktopNavButton onClick={handleLogin}>
                            Login
                        </DesktopNavButton>
                        <DesktopNavButton onClick={() => scrollToSection('footer')}>
                            Contact
                        </DesktopNavButton>
                    </nav>
                </div>
                {menuOpen && (
                    <div className="fixed inset-0 z-50 bg-white lg:hidden">
                        <button
                            className="close-button text-gray-800 absolute top-4 right-4 focus:outline-none"
                            onClick={handleMenuClick}
                        >
                            ×
                        </button>
                        <nav className="mt-12">
                            <MobileNavButton onClick={() => scrollToSection('home')}>
                                Home
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection('services')} className="mt-2">
                                Services
                            </MobileNavButton>
                            <MobileNavButton onClick={handleSignup} className="mt-2">
                                Signup
                            </MobileNavButton>
                            <MobileNavButton onClick={handleLogin} className="mt-2">
                                Login
                            </MobileNavButton>
                            <MobileNavButton onClick={() => scrollToSection('footer')} className="mt-2">
                                Contact
                            </MobileNavButton>
                        </nav>
                    </div>
                )}
                <div className="text-center mt-1 max-w-4xl px-4">
                    <h2 className="text-4xl lg:text-5xl font-bold">Get Instant Consultation from your Doctors</h2>
                    <p className="text-xl lg:text-2xl font-semibold mt-2">Quickly and Faster.</p>
                    <p className="mt-4 text-gray-200 text-base lg:text-lg max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo lorem quis enim
                        consectetur faucibus. Pellentesque sed blandit eros. Pellentesque consectetur lacinia
                        turpis ac laoreet.
                    </p>
                    <HeaderCTAButton onClick={handleLearnMoreClick} className="mt-4">
                        Learn More
                    </HeaderCTAButton>
                </div>
            </header>

            <main className="flex-grow p-6 lg:p-12">
                <div id="home"></div>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
                    <div className="bg-secondary p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-primary">96%</h2>
                        <p className="text-gray-600">POSITIVE REVIEWS</p>
                        <p className="text-gray-600">Trusted by thousands of patients</p>
                    </div>
                    <div className="bg-secondary p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-primary">100+</h2>
                        <p className="text-gray-600">EXPERIENCED DOCTORS</p>
                        <p className="text-gray-600">Get treatment from expert doctors</p>
                    </div>
                    <div className="bg-secondary p-6 rounded-lg text-center">
                        <h2 className="text-4xl font-bold text-primary">10K+</h2>
                        <p className="text-gray-600">PATIENTS CONSULTED</p>
                        <p className="text-gray-600">We've served more numbers</p>
                    </div>
                </section>

                <div id="services"></div>
                <section className="mb-12 max-w-6xl mx-auto">
                    <div className="text-left">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">Get Instant Consultation from your
                            Doctors</h2>
                        <p className="text-lg lg:text-2xl font-semibold mt-2 text-gray-600">Quickly and Faster.</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
                    <div className="bg-secondary p-6 rounded-lg flex flex-col">
                        <h3 className="text-lg font-bold leading-tight">
                            Instant Access to Experts
                        </h3>
                        <p className="text-gray-700 mt-4">
                            24/7 Availability to Doctors. Consultation is just a click away! Access our platform at any
                            time to schedule appointments from qualified professionals.
                        </p>
                        <LearnMoreButton 
                            onClick={() => handleFeatureLearnMore("Connect anytime")}
                            className="mt-6"
                        />
                    </div>
                    <div className="bg-secondary p-6 rounded-lg flex flex-col">
                        <h3 className="text-lg font-bold leading-tight">
                            Secure Video Consultations
                        </h3>
                        <p className="text-gray-700 mt-4">
                            Leverage the feature of video consultation and the security is on us. Our encrypted platform
                            ensures your medical discussions remain private and secure.
                        </p>
                        <LearnMoreButton 
                            onClick={() => handleFeatureLearnMore("Connect securely")}
                            className="mt-6"
                        />
                    </div>
                    <div className="bg-secondary p-6 rounded-lg flex flex-col">
                        <h3 className="text-lg font-bold leading-tight">
                            Digital Prescription Management
                        </h3>
                        <p className="text-gray-700 mt-4">
                            Forget the hassle of carrying physical prescriptions with you. Receive digital prescriptions
                            instantly anytime, anywhere, through our user-friendly interface.
                        </p>
                        <LearnMoreButton 
                            onClick={() => handleFeatureLearnMore("Online prescriptions")}
                            className="mt-6"
                        />
                    </div>
                </section>

                <section className="mb-12 max-w-6xl mx-auto">
                    <div className='flex flex-col lg:flex-row items-center gap-8'>
                        <img src={doc1} alt="Doctor with patient" className="w-full lg:w-1/2 h-auto rounded-lg"/>
                        <div className="flex flex-col justify-center text-center lg:text-left h-full">
                            <p className="text-2xl lg:text-3xl font-bold text-gray-800">We are here you always, at every
                                step of the way!</p>
                            <p className="mt-4 text-gray-700 text-base lg:text-lg">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo lorem quis enim
                                consectetur faucibus. Pellentesque sed blandit eros. Pellentesque consectetur lacinia
                                turpis ac laoreet.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <section className="bg-primary text-white w-full">
                <div className="max-w-6xl mx-auto px-4 py-6 lg:px-12 lg:py-12">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl lg:text-4xl font-bold">Connect with your Doctors by using our
                                TeleVideo Feature.</h2>
                        </div>
                        <img src={doc2} alt="Doctor at desk" className="w-full lg:w-1/2 h-auto rounded-lg"/>
                    </div>
                </div>
            </section>

            <main className="flex-grow p-6 lg:p-12">
                <section className="mb-12 max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <img src={doc3} alt="Doctor profile" className="w-full lg:w-1/2 h-auto rounded-lg"/>
                        <div className="w-full lg:w-1/2 flex flex-col justify-center h-full">
                            <div className="grid grid-cols-1 gap-4">
                                {[0, 1, 2, 3].map((index) => (
                                    <div key={index} className="bg-secondary p-4 rounded-lg relative group">
                                        <h3 className="text-lg font-bold text-gray-600">Lorem Ipsum</h3>
                                        <ExpandButton 
                                            onClick={() => handleExpandClick(index)}
                                            isExpanded={expandedTiles[index]}
                                        />
                                        {expandedTiles[index] && (
                                            <div className="mt-2 p-3 bg-white rounded-lg shadow-md text-gray-700">
                                                <p>{tileContents[index]}</p>
                                            </div>)}
                                    </div>))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer id="footer" className="bg-primary text-white w-full">
                <div className="max-w-7xl mx-auto px-4 py-6 lg:px-12 lg:py-12">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
                        <div className="w-full lg:w-1/3 text-center lg:text-left">
                            <h2 className="text-2xl font-semibold">CareBridge</h2>
                            <p className="mt-2 text-gray-300">Your Health, Our Priority</p>
                        </div>
                        <div className="w-full lg:w-1/3 flex justify-between text-center lg:text-left">
                            <div className="w-1/2">
                                <h3 className="text-lg font-bold mb-4">Explore</h3>
                                <FooterLink href="#">About Us</FooterLink>
                                <FooterLink href="#">Services</FooterLink>
                                <FooterLink href="#">Blog</FooterLink>
                            </div>
                            <div className="w-1/2">
                                <h3 className="text-lg font-bold mb-4">Support</h3>
                                <FooterLink href="#">FAQs</FooterLink>
                                <FooterLink href="#">Help Center</FooterLink>
                                <FooterLink href="#">Terms</FooterLink>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 text-center lg:text-right">
                            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                            <p>1234 Health St, Halifax, Nova Scotia</p>
                            <p>Scotia ABC 123, Canada</p>
                            <p>+1-234-567-890</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>);
};

export default HomePage;
