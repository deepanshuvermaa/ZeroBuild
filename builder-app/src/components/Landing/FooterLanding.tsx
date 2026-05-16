import { Sparkles, Mail, Linkedin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Changelog'] },
  { title: 'Resources', links: ['Documentation', 'API', 'Blog', 'Status'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
];

export default function FooterLanding() {
  return (
    <footer id="footer" className="bg-gray-950 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-white/60" />
              <span className="text-base font-bold text-white">ZeroBuild</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              One prompt. A complete website. Edit every section your way.
            </p>

            {/* Creator links */}
            <div className="space-y-2">
              <p className="text-xs text-white/25 uppercase tracking-widest font-semibold mb-3">Built by</p>
              <a href="https://deepanshuverma.site" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Globe className="h-3.5 w-3.5" />deepanshuverma.site
              </a>
              <a href="https://www.linkedin.com/in/deepanshu-verma-238080200/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Linkedin className="h-3.5 w-3.5" />Deepanshu Verma
              </a>
              <a href="mailto:deepanshuverma966@gmail.com"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5" />deepanshuverma966@gmail.com
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>2026 ZeroBuild. All rights reserved.</p>
          <a href="https://deepanshuverma.site" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition-colors">
            deepanshuverma.site
          </a>
        </div>
      </div>
    </footer>
  );
}
