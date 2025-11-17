import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for dynamic meta tags, Open Graph, and Twitter Cards
 * @param {Object} props - SEO configuration
 */
const SEO = ({
  title = 'Mechanics of Motherhood',
  description = 'Discover delicious family recipes and cooking tips for busy moms.',
  canonical = '',
  image = '',
  type = 'website',
  author = '',
  keywords = [],
  noindex = false,
}) => {
  const siteUrl = 'https://mechanicsofmotherhood.com';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const defaultImage = `${siteUrl}/og-default-image.jpg`;
  const ogImage = image || defaultImage;

  // Construct full title with site name
  const fullTitle = title.includes('Mechanics of Motherhood')
    ? title
    : `${title} | Mechanics of Motherhood`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Mechanics of Motherhood" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {author && <meta name="twitter:creator" content={`@${author}`} />}
    </Helmet>
  );
};

export default SEO;
