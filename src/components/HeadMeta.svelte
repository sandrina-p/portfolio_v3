<script>
  const site = 'htpps://sandrina-p.net'
  const title = 'Sandrina Pereira - UX Enginner';
  const description = `I'm a UX Enginner who helps to turn ideas into accessible experiences.`;
  const imageCover = 'cover_light.png';
</script>

<svelte:head>
    <title>{title}</title>
	  
    <meta name="theme-color" content="#52e9d0" />
        
    <meta name="keywords" content="UX Engineer, frontend developer, React, CSS, accessibility, usability">
    <meta name="description" content={description}>
    
    <meta name="image" content={ imageCover }>
    <link rel="icon" type="image/png" href="favicon16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="favicon32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="favicon64.png" sizes="64x64">
    <link rel="icon" type="image/png" href="favicon180.png" sizes="180x180">
    <link rel="apple-touch-icon" href="favicon512.png" sizes="512x512">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@a_sandrina_p">
    <meta name="twitter:title" content={ title }>
    <meta name="twitter:description" content={ description }>
    <meta name="twitter:image" content={ imageCover }>

    <meta property="og:url" content={ site }>
    <meta property="og:title" content={ title }>
    <meta property="og:description" content={ description }>
    <meta property="og:image" content={ imageCover }>

    <script type="application/ld+json">
[{"@context":"http://schema.org","@type":"WebSite","url":"https://sandrina-p.net","name":"Sandrina Pereira, UX Engineer"}]
    </script>
</svelte:head>