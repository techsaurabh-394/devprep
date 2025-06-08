import { Helmet } from "react-helmet-async";

export const WebsiteStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevPrep",
    url: "https://devprep.com",
    description:
      "Complete developer interview preparation platform with AI-powered mock interviews, resume building, and skill enhancement",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://devprep.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const CourseStructuredData = ({
  courseName,
  description,
  provider = "DevPrep",
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseName,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider,
      sameAs: "https://devprep.com",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export const ArticleStructuredData = ({
  title,
  description,
  imageUrl,
  datePublished,
  author,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "DevPrep",
      logo: {
        "@type": "ImageObject",
        url: "https://devprep.com/devprep_logo.png",
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
