import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title,
  description,
  keywords,
  ogImage = "https://devprep.com/og-image.png",
  ogType = "website",
  canonicalUrl,
}) => {
  const siteTitle = title
    ? `${title} | DevPrep`
    : "DevPrep - Your Complete Developer Interview Preparation Platform";
  const metaDescription =
    description ||
    "DevPrep helps developers ace technical interviews with AI-powered mock interviews, resume building, coding practice, and personalized learning paths.";
  const defaultKeywords =
    "developer interview preparation, coding interview, technical interview, mock interview, software engineering interview, programming interview questions, resume builder for developers, coding practice, machine coding, system design interview";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta
        name="keywords"
        content={`${defaultKeywords}${keywords ? `, ${keywords}` : ""}`}
      />

      {/* Open Graph / Social Media Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="DevPrep" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

export default SEO;
