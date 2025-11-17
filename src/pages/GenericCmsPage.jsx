import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { findMenuByUrl } from '../api/webCmsApi';
import useAppStore from '../store/appStore';
import CmsPageRenderer from '../components/cms/CmsPageRenderer';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SEO from '../components/seo/SEO';

const GenericCmsPage = () => {
  const location = useLocation();
  const websiteId = useAppStore((state) => state.websiteId);
  const [menuItem, setMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await findMenuByUrl(websiteId, location.pathname);

        if (result?.success && result.data) {
          setMenuItem(result.data);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error('Error fetching CMS page:', err);
        setError(err.message || 'Failed to load page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, [location.pathname, websiteId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!menuItem) {
    return (
      <>
        <SEO
          title="Page Not Found"
          description="The page you are looking for does not exist."
          noindex={true}
        />
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600">The page you are looking for does not exist.</p>
        </div>
      </>
    );
  }

  // Extract plain text from HTML content for meta description
  const extractDescription = (html) => {
    if (!html) return '';
    // Remove HTML tags and get first 160 characters
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.substring(0, 160);
  };

  const seoDescription = extractDescription(menuItem.content);

  return (
    <>
      <SEO
        title={menuItem.title}
        description={seoDescription}
        canonical={location.pathname}
      />
      <CmsPageRenderer
        content={menuItem.content}
        title={menuItem.title}
      />
    </>
  );
};

export default GenericCmsPage;
