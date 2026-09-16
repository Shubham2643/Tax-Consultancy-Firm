import { useEffect } from 'react';

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Enterprise SEO hook — dynamically updates:
 * - Document title
 * - Meta description
 * - OpenGraph & Twitter tags (WhatsApp, LinkedIn, Twitter share previews)
 * - JSON-LD Structured Data script injection for Google Rich Snippets
 */
const useSEO = ({
  title,
  description,
  image = 'https://shreechamundaassociates.onrender.com/assets/logo_new.jpg',
  url,
  type = 'website',
  jsonLd = null,
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? (title.includes('Shree Chamunda') ? title : `${title} | Shree Chamunda Associates`)
      : 'Shree Chamunda Associates | Tax Consultancy Firm & Chartered Advisory';
    document.title = formattedTitle;

    // 2. Standard Meta
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:title', formattedTitle);
    if (description) setMetaTag('property', 'og:description', description);
    if (image) setMetaTag('property', 'og:image', image);
    if (type) setMetaTag('property', 'og:type', type);
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    if (currentUrl) setMetaTag('property', 'og:url', currentUrl);

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    if (description) setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    // 5. Dynamic JSON-LD Structured Data
    const existingScript = document.getElementById('dynamic-seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    let jsonLdScript = null;
    if (jsonLd) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.id = 'dynamic-seo-jsonld';
      jsonLdScript.className = 'dynamic-seo-jsonld';
      jsonLdScript.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      const el = document.getElementById('dynamic-seo-jsonld');
      if (el) el.remove();
    };
  }, [title, description, image, url, type, jsonLd]);
};

export default useSEO;
