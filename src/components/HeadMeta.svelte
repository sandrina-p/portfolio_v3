<script>
  export let site
  export let title
  export let description 
  export let coverUrl 
</script>

<svelte:head>
  <title>{title}</title>
  
  <meta name="theme-color" content="#9f76ff" />
      
  <meta name="keywords" content="UX Engineer, frontend developer, React, CSS, accessibility, usability">
  <meta name="description" content={description}>
  
  <meta name="image" content={ coverUrl }>
  <link rel="icon" type="image/png" href="favicon192.png" sizes="192x192">
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

  <meta property="og:site_name" content={ title }>
  <meta name="twitter:image:alt" content="website cover">

  <script async src="https://www.google-analytics.com/analytics.js"></script>
  <script>
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', '__GA_ID__', 'auto'); // Key at rollup.config.js
  </script>
</svelte:head>