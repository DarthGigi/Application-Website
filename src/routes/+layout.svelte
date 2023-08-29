<script>
  import '../app.css';
</script>

<svelte:head>
  <!-- Global Metadata -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta content="#2B2D31" name="theme-color" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://example.com/" />

  <!-- Primary Meta Tags -->
  <title>Application Website</title>
  <meta name="title" content="Application Website" />
  <meta name="description" content="Lorem*" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://example.com/" />
  <meta property="og:title" content="Lorem Ipsum" />
  <meta property="og:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec iaculis quam. Maecenas pellentesque pretium est, ut sollicitudin nunc placerat et." />
  <meta property="og:image" content="/assets/images/jobsbanner.png" />
  <meta property="og:site_name" content="Lorem Ipsum" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://example.com/" />
  <meta property="twitter:title" content="Lorem Ipsum" />
  <meta property="twitter:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec iaculis quam. Maecenas pellentesque pretium est, ut sollicitudin nunc placerat et." />
  <meta property="twitter:image" content="/assets/images/jobsbanner.png" />

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/path/to/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/path/to/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/path/to/favicon-16x16.png" />
  <link rel="manifest" href="/path/to/site.webmanifest" />
  <link rel="mask-icon" href="/path/to/safari-pinned-tab.svg" color="#000000" />
  <link rel="icon" href="/path/to/favicon.ico" />
  <link rel="shortcut icon" href="/path/to/favicon.ico" />
  <meta name="msapplication-TileColor" content="#000000" />
  <meta name="msapplication-TileImage" content="/path/to/mstile-144x144.png" />
  <meta name="msapplication-config" content="/path/to/browserconfig.xml" />
</svelte:head>

<slot />
