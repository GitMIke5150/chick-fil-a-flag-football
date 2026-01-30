import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Send } from 'lucide-react';
import chickFilALogo from '@assets/IMG_1083_1768217940008.png';

export default function SponsorInquiry() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    website: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Sponsor Inquiry: ${formData.businessName}`);
    const body = encodeURIComponent(
      `Hi Surfstung Team!\n\n` +
      `I'm interested in sponsoring the Chick-Fil-A Flag Football team.\n\n` +
      `Contact Information:\n` +
      `-------------------\n` +
      `Name: ${formData.name}\n` +
      `Business Name: ${formData.businessName}\n` +
      `Phone: ${formData.phone}\n` +
      `Website: ${formData.website}\n\n` +
      `Looking forward to hearing from you!`
    );
    
    window.location.href = `mailto:info@surfstung.com?subject=${subject}&body=${body}`;
  };

  const isFormValid = formData.name && formData.businessName && formData.phone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 btn-press" data-testid="link-back-scoreboard">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Scoreboard</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 p-3 shadow-xl">
            <img src={chickFilALogo} alt="Chick-Fil-A" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
            BECOME A SPONSOR
          </h1>
          <p className="text-white/70">
            Get your business in front of local families at every game!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E51636] focus:border-transparent"
              data-testid="input-sponsor-name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Your Awesome Business"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E51636] focus:border-transparent"
              data-testid="input-sponsor-business"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E51636] focus:border-transparent"
              data-testid="input-sponsor-phone"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourbusiness.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E51636] focus:border-transparent"
              data-testid="input-sponsor-website"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
              isFormValid 
                ? 'bg-[#E51636] text-white btn-press shadow-lg' 
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
            data-testid="button-submit-sponsor"
          >
            <Send className="w-5 h-5" />
            Send Inquiry
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          This will open your email app with your info pre-filled
        </p>
      </div>
    </div>
  );
}
