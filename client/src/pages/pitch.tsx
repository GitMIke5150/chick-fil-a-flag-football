import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Smartphone, Zap, Users, Trophy, BarChart3, Wifi, WifiOff, Bell, Share2, Star, Check, ArrowRight, Mail, QrCode } from 'lucide-react';
import chickFilALogo from '@assets/IMG_1083_1768217940008.png';
import surfstungLogo from '@assets/D28D4B9E-1A54-4691-B798-C07AE190DD30_1768318377404.png';
const surfstungLogoFull = '/surfstung-logo-full.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
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

const PitchPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const features = [
    { icon: Zap, title: 'Real-Time Scoring', desc: 'Live score updates that sync instantly across all devices—parents see plays as they happen' },
    { icon: BarChart3, title: 'Player Statistics', desc: 'Track TDs, catches, flag pulls, interceptions, and more for every player on the roster' },
    { icon: Users, title: 'Spectator Mode', desc: 'Parents and family can watch from anywhere—no login required, just open the link' },
    { icon: Smartphone, title: 'Installable PWA', desc: 'Add to home screen for an app-like experience without app store downloads' },
    { icon: WifiOff, title: 'Works Offline', desc: 'Keeps working even with spotty field WiFi—syncs when connection returns' },
    { icon: Trophy, title: 'Season Stats', desc: 'Aggregated season statistics with player stories and badges earned' },
  ];

  const sponsorBenefits = [
    'Your logo on the live scoring screen during games',
    'Featured in halftime sponsor carousel',
    'Link to your website or booking page',
    'Reach engaged local families every game',
    'Support youth sports in the community',
  ];

  const coachBenefits = [
    'Quick play entry designed for game speed',
    'Track every player\'s contribution',
    'Share live scores with parents instantly',
    'Season-long statistics for player development',
    'No app download required for spectators',
    'Customizable roster and player profiles',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Back to App
          </Link>
          <img src={surfstungLogo} alt="Surfstung" className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-purple-900/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <img src={surfstungLogoFull} alt="Surfstung AI & Media" className="w-64 h-64 object-contain drop-shadow-2xl" />
            </div>
            <p className="text-cyan-400 font-bold text-lg mb-2">Built by Surfstung AI & Media</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-red-400">
                Flag Football Score Tracker
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              A custom-built Progressive Web App for real-time game scoring, player statistics, and live spectator updates.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full text-red-300 text-sm font-medium">Real-Time</span>
              <span className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">Installable</span>
              <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium">Works Offline</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-black mb-4">
              Built for Game Day
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 max-w-2xl mx-auto">
              Every feature designed around the chaos of youth sports—quick entries, instant broadcasts, and zero friction for families.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-red-900/20 to-purple-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black">For Coaches</h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-gray-400 mb-6">
                Finally, a scoring app built for how youth football actually works—fast plays, rotating QBs, and parents who want updates NOW.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {coachBenefits.map((benefit, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black">For Sponsors</h2>
              </motion.div>
              <motion.p variants={fadeUp} className="text-gray-400 mb-6">
                Get your brand in front of engaged local families during every game. Your business, supporting youth sports.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {sponsorBenefits.map((benefit, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-black mb-4">
              Want This For Your Team?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 mb-8 max-w-2xl mx-auto">
              This app was custom-built by Surfstung Build Studio. We create tailored software solutions for businesses and organizations—no templates, no cookie-cutter sites.
            </motion.p>
            
            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <div className="flex justify-center mb-4">
                <img src={surfstungLogo} alt="Surfstung" className="w-16 h-16 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-2">Surfstung Build Studio</h3>
              <p className="text-gray-400 mb-6">"I wish I had an app that..."</p>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Elite custom software without the enterprise price tag. We build exactly what you need—websites, web apps, dashboards, AI integrations, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/surfstung">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    See Our Work <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <a href="mailto:info@surfstung.com?subject=Score%20Tracker%20Inquiry&body=Hi%20Surfstung!%0A%0AI%20saw%20the%20flag%20football%20score%20tracker%20and%20I'm%20interested%20in%20something%20similar%20for%20my%20team/organization.%0A%0A">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                  >
                    <Mail className="w-5 h-5" /> Get In Touch
                  </motion.button>
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm">Share this page with your league or organization</p>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Flag Football Score Tracker',
                      text: 'Check out this custom score tracking app for youth flag football!',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5" /> Share This Page
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Built with care by <Link href="/surfstung" className="text-purple-400 hover:text-purple-300">Surfstung Build Studio</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PitchPage;
