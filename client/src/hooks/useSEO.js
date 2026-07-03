import { useEffect } from 'react';

/**
 * Lightweight SEO hook — dynamically sets page title and meta description.
 * No external dependencies required.
 */
const useSEO = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Shree Chamunda Associates`;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = 'Shree Chamunda Associates | Tax Consultancy';
    };
  }, [title, description]);
};

export default useSEO;
