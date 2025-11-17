import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Component for injecting JSON-LD structured data into page head
 * @param {Object} schema - Schema.org structured data object
 */
const SchemaMarkup = ({ schema }) => {
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;
