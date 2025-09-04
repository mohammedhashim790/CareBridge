import { useState, useEffect } from 'react';
import {
  Menu, X, Heart, Clock, Users, Star, ArrowRight,
  Play, MessageCircle, Phone, Mail, MapPin, Award, Zap,
  Activity, Stethoscope, Video, Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let raf: number;
    const step = (t: number) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <span>{count}</span>;
};

const TestimonialCard = ({ name, role, content, rating }: {
  name: string; role: string; content: string; rating: number;
}) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-6 leading-relaxed">“{content}”</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-full flex items-center justify-center text-white font-bold text-lg">
        {name.charAt(0)}
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const navigate = useNavigate();

  const services = [
    {
      icon: Video,
      title: 'Virtual Consultations',
      description: 'Connect with certified doctors through secure video calls from anywhere.',
      features: ['HD Video Quality', 'Digital Prescriptions'],
      color: 'from-[#2E81C7] to-[#66a9db]'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock emergency support with immediate response times.',
      features: ['Instant Response', 'Emergency Protocols', 'Critical Care'],
      color: 'from-red-500 to-pink-500' // keep distinct for urgency
    },
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Continuous health tracking with AI‑powered insights and alerts.',
      features: ['Real‑time Monitoring', 'Health Analytics', 'Personalised Reports'],
      color: 'from-[#2E81C7] to-[#66a9db]'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Working Mother',
      content: 'The virtual consultations saved me so much time. I could get expert medical advice without leaving my home.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Senior Executive',
      content: '24/7 availability is a game‑changer. I got immediate help during a health emergency at 2 AM.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'College Student',
      content: 'Affordable, accessible, and professional. This platform made healthcare so much easier for me.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
    
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#2E81C7]">CareBridge</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Sign In'].map((t) => (
                <Link
                key={t}
                to="/login"
                className="text-gray-600 hover:text-[#2E81C7] font-medium transition-colors"
              >
                {t}
              </Link>
              ))}
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#2E81C7] to-[#66a9db] text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >Sign Up</Link>

            </div>

            <button className="md:hidden text-gray-600 hover:text-[#2E81C7]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4 pt-4">
                {['Home', 'Services', 'About', 'Contact'].map((t) => (
                  <a key={t} href={`#${t.toLowerCase()}`} className="text-gray-600 hover:text-[#2E81C7] transition-colors">
                    {t}
                  </a>
                ))}
                <button className="bg-gradient-to-r from-[#2E81C7] to-[#66a9db] text-white px-6 py-2 rounded-full font-medium w-fit">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

  
      <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-[#e6f2fc] via-white to-[#e6f2fc] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c7dbf0] rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#d4e3f5] rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#d4e3f5] rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Text block */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-[#2E81C7] border border-[#2E81C7]/30">
                <Zap className="w-4 h-4 mr-2" />
                #1 Trusted Healthcare Platform
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-900">Your Health,</span>
                <br />
                <span className="bg-gradient-to-r from-[#2E81C7] via-[#66a9db] to-[#2E81C7] bg-clip-text text-transparent">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Experience the future of healthcare with our AI‑powered platform. Connect with world‑class doctors, get instant consultations, and manage your health journey seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={()=>{navigate('/login')}} className="group bg-gradient-to-r from-[#2E81C7] to-[#66a9db] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white border border-gray-200 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {[
                  { label: 'Happy Patients', value: '50K+' },
                  { label: 'Expert Doctors', value: '500+' },
                  { label: 'Support', value: '24/7' }
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-sm text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Professional Healthcare"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                {/* Floating labels */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Online Now</div>
                      <div className="text-xs text-gray-500">200+ Doctors Available</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] text-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 fill-current" />
                    <div>
                      <div className="text-lg font-bold">4.9/5</div>
                      <div className="text-sm opacity-90">Patient Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={50} />K+
              </div>
              <div className="text-gray-600">Active Patients</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#66a9db] to-[#2E81C7] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={500} />+
              </div>
              <div className="text-gray-600">Expert Doctors</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={98} />%
              </div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={25} />+
              </div>
              <div className="text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#e6f2fc] rounded-full px-4 py-2 text-sm font-medium text-[#2E81C7] mb-4">
              <Activity className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Healthcare
              <span className="block bg-gradient-to-r from-[#2E81C7] to-[#66a9db] bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From virtual consultations to emergency care, we provide complete healthcare solutions tailored to your needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${activeService === i ? 'bg-white shadow-lg scale-105' : 'bg-white/60 hover:bg-white hover:shadow-md'}`}
                    onClick={() => setActiveService(i)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                        <p className="text-gray-600 mb-3">{s.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.features.map((f) => (
                            <span key={f} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Service"
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{services[activeService].title}</h3>
                <p className="text-gray-600 mb-6">{services[activeService].description}</p>
                <button className="w-full bg-gradient-to-r from-[#2E81C7] to-[#66a9db] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#e6f2fc] rounded-full px-4 py-2 text-sm font-medium text-[#2E81C7] mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Patients
              <span className="block bg-gradient-to-r from-[#2E81C7] to-[#66a9db] bg-clip-text text-transparent">Say About Us</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-[#2E81C7] via-[#66a9db] to-[#2E81C7] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#a8cbe8] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="block">Healthcare Experience?</span>
          </h2>
          <p className="text-xl text-[#dff0ff] mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust us with their health. Start your journey to better healthcare today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#2E81C7] px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#2E81C7] to-[#66a9db] rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CareBridge</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transforming healthcare through innovative technology and compassionate care. Your health, our priority.
              </p>
              <div className="flex space-x-4">
                {['f', 't', 'in'].map((c) => (
                  <span key={c} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2E81C7] transition-colors cursor-pointer font-bold text-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3 text-gray-300">
                {['Virtual Consultations', 'Emergency Care', 'Health Monitoring', 'Prescription Management'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-[#2E81C7] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-300">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-[#2E81C7] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#66a9db]" />
                  <span>+1 (555) 123‑4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#66a9db]" />
                  <span>hr@carebridge.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#66a9db]" />
                  <span>6283 Alumni Crescent, Halifax</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            © 2025 CareBridge. All rights reserved. Designed with ❤️ for better health.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
