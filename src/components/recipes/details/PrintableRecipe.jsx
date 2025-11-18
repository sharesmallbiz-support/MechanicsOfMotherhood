import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Printable Recipe Component
 * Displays recipe in a print-friendly format with subtle Mechanics of Motherhood branding
 */
const PrintableRecipe = ({ recipe }) => {
  if (!recipe) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide everything except the printable recipe */
          body * {
            visibility: hidden;
          }

          .printable-recipe,
          .printable-recipe * {
            visibility: visible;
          }

          .printable-recipe {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0.5in;
          }

          /* Hide print button when printing */
          .no-print {
            display: none !important;
          }

          /* Optimize for printing */
          .printable-recipe {
            font-size: 11pt;
            color: #000;
            background: #fff;
          }

          /* Page breaks */
          .page-break-avoid {
            page-break-inside: avoid;
          }

          /* Branding in print */
          .print-header {
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 0.5in;
          }

          .print-footer {
            margin-top: 0.5in;
            padding-top: 0.25in;
            border-top: 1px solid #e5e7eb;
            font-size: 9pt;
          }
        }

        @media screen {
          .printable-recipe {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1rem;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      {/* Print Button - Screen Only */}
      <div className="no-print mb-4 text-center">
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Recipe
        </button>
      </div>

      {/* Printable Content */}
      <div className="printable-recipe">
        {/* Header with Branding */}
        <div className="print-header pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {recipe.name}
          </h1>
          <p className="text-sm text-gray-500">
            From{' '}
            <span className="font-semibold text-blue-600">
              Mechanics of Motherhood
            </span>
            {' '}• mechanicsofmotherhood.com
          </p>
        </div>

        {/* Recipe Metadata */}
        {(recipe.servings || recipe.authorNM) && (
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-700 page-break-avoid">
            {recipe.servings && (
              <div>
                <span className="font-semibold">Servings:</span> {recipe.servings}
              </div>
            )}
            {recipe.authorNM && (
              <div>
                <span className="font-semibold">By:</span> {recipe.authorNM}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {recipe.description && (
          <div className="mb-6 page-break-avoid">
            <div className="text-gray-700 prose prose-sm max-w-none">
              <ReactMarkdown>{recipe.description}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Ingredients */}
        {recipe.ingredients && (
          <div className="mb-6 page-break-avoid">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
              Ingredients
            </h2>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
              Instructions
            </h2>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Footer with Branding */}
        <div className="print-footer text-center text-gray-500">
          <p className="mb-1">
            <span className="font-semibold text-blue-600">
              Mechanics of Motherhood
            </span>
          </p>
          <p className="text-xs">
            Real-world perspectives on the challenges and triumphs of being a working mother
          </p>
          <p className="text-xs mt-1">
            www.mechanicsofmotherhood.com
          </p>
        </div>
      </div>
    </>
  );
};

export default PrintableRecipe;
