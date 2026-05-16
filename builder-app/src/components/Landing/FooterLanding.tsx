import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Templates', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API', 'Blog', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
];

export default function FooterLanding() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span className="text-lg font-bold text-white">ZeroBuild</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              One prompt. A complete website. Edit every section your way.
            </p>
            <div className="flex gap-3">
              {['X', 'GH', 'LI'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-800 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; 2026 ZeroBuild. All rights reserved.</p>
          <p className="text-slate-500">Built with ZeroBuild</p>
        </div>
      </div>
    </footer>
  );
}
