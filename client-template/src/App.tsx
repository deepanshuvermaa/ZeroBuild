import { useEffect, useState } from 'react';
import PageRenderer from './renderer/PageRenderer';
import pageConfig from './config/page-config.json';
import type { PageConfig } from './types';

function App() {
  const [config, setConfig] = useState<PageConfig | null>(null);

  useEffect(() => {
    // Load configuration
    setConfig(pageConfig as PageConfig);

    // Set document title from SEO config
    if (pageConfig.seo?.title) {
      document.title = pageConfig.seo.title;
    }

    // Set meta description
    if (pageConfig.seo?.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', pageConfig.seo.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = pageConfig.seo.description;
        document.head.appendChild(meta);
      }
    }
  }, []);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <PageRenderer config={config} />;
}

export default App;
