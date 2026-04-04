import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  article = {}
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'zh';
  
  const defaultTitle = '拓途浙享 | TUOTU ZHEXIANG';
  const defaultDescription = '探索数字艺术与科技的边界 - 浙江大学 SQTP 项目组官方平台，展示摄影、音乐、视频、文章等多元创作内容';
  const defaultImage = '/pwa-icon.svg';
  const siteUrl = window.location.origin;
  
  const seoTitle = title ? `${title} | 拓途浙享` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const seoUrl = url || siteUrl;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="author" content="浙江大学 SQTP 项目组" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="拓途浙享" />
      <meta property="og:locale" content={lang === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional SEO */}
      <meta name="keywords" content="拓途浙享，浙江大学，SQTP，摄影，音乐，视频，文章，数字艺术" />
      <meta name="theme-color" content="#0a0a0a" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "拓途浙享",
          "alternateName": "TUOTU ZHEXIANG",
          "url": siteUrl,
          "logo": `${siteUrl}/pwa-icon.svg`,
          "description": defaultDescription,
          "founder": {
            "@type": "Organization",
            "name": "浙江大学 SQTP 项目组"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@tuotuzj.com"
          }
        })}
      </script>
      
      {/* Structured Data - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "拓途浙享",
          "alternateName": "TUOTU ZHEXIANG",
          "url": siteUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
