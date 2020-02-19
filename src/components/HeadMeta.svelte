<script>
  const site = 'https://sandrina-p.net'
  const title = 'Sandrina Pereira - UX Enginner';
  const description = `I'm a UX Enginner who helps to turn ideas into accessible experiences.`;
  const coverUrl = `${site}/cover_light.png`;
</script>

<svelte:head>
  <title>{title}</title>
  
  <meta name="theme-color" content="#52e9d0" />
      
  <meta name="keywords" content="UX Engineer, frontend developer, React, CSS, accessibility, usability">
  <meta name="description" content={description}>
  
  <meta name="image" content={ coverUrl }>
  <link rel="icon" type="image/png" href="favicon16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="favicon64.png" sizes="64x64">
  <link rel="icon" type="image/png" href="favicon192.png" sizes="192x192">
  <link rel="icon" type="image/png" href="favicon512.png" sizes="512x512">
  <link rel="apple-touch-icon" href="favicon512.png" sizes="512x512">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@a_sandrina_p">
  <meta name="twitter:title" content={ title }>
  <meta name="twitter:description" content={ description }>
  <meta name="twitter:image" content={ coverUrl }>

  <meta property="og:url" content={ site }>
  <meta property="og:title" content={ title }>
  <meta property="og:description" content={ description }>
  <meta property="og:image" content={ coverUrl }>

  <script type="application/ld+json">
[{"@context":"http://schema.org","@type":"WebSite","url":"https://sandrina-p.net","name":"Sandrina Pereira, UX Engineer"}]
  </script>
</svelte:head>