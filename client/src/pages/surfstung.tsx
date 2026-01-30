import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Globe, Smartphone, Bot, BarChart3, QrCode, Users, Building2, Home, UtensilsCrossed, Wrench, Store, Sparkles, ArrowRight, Check, Mail, MessageCircle, Gift, Copy, Share2, CheckCircle2 } from 'lucide-react';
import surfstungLogo from '@assets/D28D4B9E-1A54-4691-B798-C07AE190DD30_1768318377404.png';
import surfstungHeroLogo from '@assets/F3F37007-BDAA-4B37-9A69-862289310F64_1768314904130.png';
import chickFilALogo from '@assets/IMG_1083_1768217940008.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const SurfstungLanding = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'CFAFLAG10';
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    currentWebsite: ''
  });

  const projectTypes = [
    'Website & Landing Page',
    'Web App & Dashboard',
    'AI Chatbot / GPT Integration',
    'Automations & Workflows',
    'QR Microsite & Funnel',
    'Admin Panel / Control Hub',
    'CRM-Lite System',
    'Training Course with Automation',
    'Rebooking & Loyalty Engine',
    'Custom Build (Let\'s Talk)'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Discovery Call Request - ${formData.projectType}`);
    const websiteLine = formData.currentWebsite ? `Current Website: ${formData.currentWebsite}\n` : '';
    const body = encodeURIComponent(`Hi Surfstung!\n\nI'd like to schedule a discovery call.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n${websiteLine}Project Type: ${formData.projectType}\n\nLooking forward to chatting!`);
    window.location.href = `mailto:info@surfstung.com?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
  const copyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOffer = () => {
    const shareText = `Hey! I'm getting 10% off custom website & app development from Surfstung Build Studio. Use my code ${couponCode} to get your 10% off too!`;
    if (navigator.share) {
      navigator.share({
        title: 'Exclusive 10% Off Development',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  const services = [
    { icon: Globe, title: 'Websites & Landing Pages', desc: 'Hand-coded, pixel-perfect sites that convert—not cookie-cutter templates' },
    { icon: Smartphone, title: 'Web Apps & Dashboards', desc: 'Custom-built tools with real-time data, user auth, and admin controls' },
    { icon: QrCode, title: 'QR Microsites & Funnels', desc: 'Scan-to-action campaigns with tracking, analytics, and follow-up flows' },
    { icon: Zap, title: 'Automations & Systems', desc: 'Complex workflows connecting APIs, databases, and services seamlessly' },
    { icon: BarChart3, title: 'Admin Panels & Control Hubs', desc: 'Full control centers with live metrics, user management, and instant updates' },
    { icon: Bot, title: 'AI Chatbots & GPT Engines', desc: 'Custom-trained AI that knows your business, answers questions, and closes deals' },
  ];

  const industries = [
    { icon: Building2, name: 'Medical Offices', color: 'bg-blue-500' },
    { icon: Home, name: 'Real Estate & Investors', color: 'bg-emerald-500' },
    { icon: Home, name: 'Airbnb/STR Hosts', color: 'bg-amber-500' },
    { icon: UtensilsCrossed, name: 'Restaurants & Hospitality', color: 'bg-rose-500' },
    { icon: Wrench, name: 'Contractors & Service Pros', color: 'bg-indigo-500' },
    { icon: Store, name: 'Local Businesses & Creators', color: 'bg-purple-500' },
  ];

  const specialBuilds = [
    { title: 'AI-Powered Business Websites', desc: 'GPT-integrated sites that answer questions, qualify leads, and book calls—24/7' },
    { title: 'Rebooking & Loyalty Engines', desc: 'Custom systems with SMS/email triggers, point tracking, and smart reminders' },
    { title: 'Training Courses with Automation', desc: 'Full LMS with progress tracking, drip content, certificates, and payment integration' },
    { title: 'CRM-Lite Systems', desc: 'Pipeline management, lead scoring, and deal tracking—built exactly how you work' },
    { title: 'Licensable SaaS Products', desc: 'White-label ready products with multi-tenant architecture and billing' },
    { title: 'Real-Time Dashboards', desc: 'Live data visualization with WebSocket updates, charts, and instant alerts' },
  ];

  const integrations = ['Stripe', 'Airtable', 'Zapier', 'Tally', 'OpenAI', 'Twilio', 'Google Sheets', 'Notion'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to App
          </Link>
          <div className="flex items-center gap-3">
            <img src={surfstungLogo} alt="Surfstung" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg">Surfstung</span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-emerald-600/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.img 
              src={surfstungLogo} 
              alt="Surfstung" 
              className="w-64 md:w-80 lg:w-96 mx-auto mb-6 drop-shadow-2xl"
              variants={scaleIn}
              transition={{ duration: 0.7 }}
            />
            
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-3"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>This Flag Football App is a Surfstung build</span>
            </motion.div>
            
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Link 
                href="/pitch"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 rounded-full text-sm font-bold hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share with a Coach or Sponsor
              </Link>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Ideas Into Weapons
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl font-semibold text-amber-400 mb-6"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              Custom Web-Based Business Systems. Built Fast.
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl text-white/70 mb-6 max-w-2xl mx-auto"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <span className="text-amber-400 font-semibold">"I wish I had an app that..."</span> — Stop wishing. We're elite developers who build exactly what you imagine, at prices that won't crush your budget.
            </motion.p>
            
            <motion.div 
              className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-semibold mb-10 border border-emerald-500/30"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Custom builds at prices that surprise you</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-4 justify-center"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <button 
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-8 py-4 rounded-xl text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 mx-auto"
                data-testid="cta-start-build"
              >
                <Sparkles className="w-5 h-5" />
                Schedule a Discovery Call
              </button>
              
              {showForm && (
                <motion.form 
                  onSubmit={handleFormSubmit}
                  className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-center mb-4">Let's Talk About Your Project</h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500 transition-colors"
                      data-testid="form-name"
                    />
                    
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500 transition-colors"
                      data-testid="form-email"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500 transition-colors"
                      data-testid="form-phone"
                    />
                    
                    <input
                      type="url"
                      placeholder="Current Website (if you have one)"
                      value={formData.currentWebsite}
                      onChange={(e) => setFormData({ ...formData, currentWebsite: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-500 transition-colors"
                      data-testid="form-website"
                    />
                    
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                      data-testid="form-project-type"
                    >
                      <option value="" disabled className="bg-gray-900 text-white/50">What can we build for you?</option>
                      {projectTypes.map((type, idx) => (
                        <option key={idx} value={type} className="bg-gray-900 text-white">{type}</option>
                      ))}
                    </select>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-8 py-4 rounded-xl text-lg hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                      data-testid="form-submit"
                    >
                      <Mail className="w-5 h-5" />
                      Send Request
                    </button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chick-fil-A Flag Football Family Exclusive Offer */}
      <motion.section 
        className="py-8 md:py-12 bg-gradient-to-r from-[#E51636]/20 via-[#E51636]/10 to-[#E51636]/20 border-y border-[#E51636]/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-[#E51636]/50 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#E51636]/20"
            variants={scaleIn}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <img src={chickFilALogo} alt="Chick-fil-A" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
                </div>
              </div>
              
              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-[#E51636]/20 px-4 py-1.5 rounded-full mb-4">
                  <Gift className="w-4 h-4 text-[#E51636]" />
                  <span className="text-[#E51636] font-semibold text-sm uppercase tracking-wide">Exclusive Family Offer</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Chick-fil-A 2026 Winter Flag Football Families
                </h2>
                
                <p className="text-white/70 text-lg mb-6">
                  Get <span className="text-[#E51636] font-bold">10% off</span> any custom website, app, or digital build. Share with a friend—they'll get 10% off too!
                </p>
                
                {/* Coupon Code Card */}
                <div className="bg-gradient-to-r from-[#E51636] to-[#c41230] rounded-2xl p-5 mb-6">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">Your Exclusive Code</p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="text-white text-3xl md:text-4xl font-bold tracking-widest" style={{ fontFamily: 'monospace' }}>
                      {couponCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all"
                      data-testid="copy-coupon-code"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Copy className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                  {copied && <p className="text-white/80 text-sm mt-2">Copied!</p>}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={shareOffer}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#E51636] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all shadow-lg"
                    data-testid="share-offer-button"
                  >
                    <Share2 className="w-5 h-5" />
                    Share with a Friend
                  </button>
                  <a
                    href={`mailto:info@surfstung.com?subject=CFA Flag Football Family - ${couponCode}&body=Hi! I'm a Chick-fil-A 2026 Winter Flag Football family member. I'd like to learn more about your development services with the 10% family discount.`}
                    className="inline-flex items-center justify-center gap-2 bg-[#E51636] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#c41230] transition-all shadow-lg"
                    data-testid="contact-discount-button"
                  >
                    <Mail className="w-5 h-5" />
                    Claim Your Discount
                  </a>
                </div>
              </div>
            </div>
            
            {/* Footer with Contact Info */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={surfstungLogo} alt="Surfstung" className="w-8 h-8 rounded-lg" />
                <div className="text-left">
                  <p className="text-white font-semibold">Surfstung Build Studio</p>
                  <p className="text-white/50 text-sm">Custom websites, apps & AI systems</p>
                </div>
              </div>
              <a 
                href="mailto:info@surfstung.com"
                className="text-white/70 hover:text-white transition-colors font-medium text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 border-t border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Build</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">100% custom-coded solutions—no templates, no drag-and-drop. Every line written for your business.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                  <service.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/60">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">From medical offices to Airbnb hosts—if you need systems that scale, we've got you</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {industries.map((industry, idx) => (
              <motion.div 
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-white/10 transition-all text-center"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className={`w-12 h-12 ${industry.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-xs leading-tight">{industry.name}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.div className="mt-8 text-center" variants={fadeUp} transition={{ duration: 0.5, delay: 0.5 }}>
            <p className="inline-flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full text-white/70 font-medium">
              <Users className="w-5 h-5 text-amber-400" />
              Anyone ready to scale without hiring
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 border-t border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Builds</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">High-impact systems designed to generate revenue and save time</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {specialBuilds.map((build, idx) => (
              <motion.div 
                key={idx}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex gap-4"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{build.title}</h3>
                  <p className="text-white/60 text-sm">{build.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 bg-gradient-to-b from-transparent via-amber-900/10 to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={fadeUp}>The Surfstung Difference</motion.h2>
              <motion.p className="text-xl text-white/80 mb-6" variants={fadeUp}>
                We don't just make a site. We build the <span className="text-amber-400 font-semibold">entire system</span> around it—custom-coded, not templated.
              </motion.p>
              <ul className="space-y-4">
                {['Affordable custom pricing', 'Brand & positioning strategy', 'Conversion-focused copywriting', 'Lead capture & nurturing', 'Automations & workflows', 'Monetization systems'].map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center gap-3 text-lg"
                    variants={fadeUp}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-white/60 mb-4 uppercase tracking-wider">Integrations We Work With</h3>
              <div className="flex flex-wrap gap-3">
                {integrations.map((int, idx) => (
                  <motion.span 
                    key={idx} 
                    className="bg-white/10 px-4 py-2 rounded-lg font-medium text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {int}
                  </motion.span>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm">...plus any API or platform your business needs—we integrate it all</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="py-16 md:py-24 border-t border-white/10 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={scaleIn}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <img 
            src={surfstungHeroLogo} 
            alt="" 
            className="w-full max-w-4xl h-auto object-contain"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-amber-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-8 md:p-12 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Something Custom?</h2>
            <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto">
              From simple landing pages to full-stack business systems with AI, real-time data, and custom integrations—we build it all from scratch.
            </p>
            <p className="text-lg text-emerald-400 font-semibold mb-8">
              More affordable than you think. Let's talk numbers.
            </p>
            <a 
              href="mailto:info@surfstung.com?subject=Let's Build Something"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25"
              data-testid="cta-bottom"
            >
              Start Your Custom Build
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </motion.section>

      <footer className="py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={surfstungLogo} alt="Surfstung" className="w-10 h-10 rounded-lg" />
              <div>
                <p className="font-bold text-lg">Surfstung™ Build Studio</p>
                <p className="text-white/50 text-sm">Websites, apps, and AI-powered systems</p>
              </div>
            </div>
            <a 
              href="mailto:info@surfstung.com"
              className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Get in Touch
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            Custom-coded solutions built to scale, flip, or run on autopilot.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SurfstungLanding;
