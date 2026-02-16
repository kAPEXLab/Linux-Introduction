<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Linux Introduction – Repository Browser</title>
  <meta name="description" content="Browse all folders and files in kAPEXLab/Linux-Introduction" />
  <link rel="stylesheet" href="./assets/style.css" />
  <!-- Highlight.js (syntax highlighting) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
  <!-- Optional: Icons -->
  <link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"/>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <span class="repo" id="repo-name">kAPEXLab / Linux-Introduction</span>
      <span class="branch" id="branch-name"></span>
    </div>
    <div class="controls">
      <input id="filter-input" class="filter" type="search" placeholder="Filter in this folder…" />
      <button id="refresh-btn" title="Reload listing" class="btn">↻</button>
    </div>
  </header>

  <nav class="breadcrumbs" id="breadcrumbs"></nav>

  <main id="main">
    <section id="list-view" class="panel hidden"></section>
    <section id="file-view" class="panel hidden">
      <div class="file-actions">
        <a id="open-raw" class="btn" target="_blank" rel="noopener">Raw</a>
        <a id="open-gh" class="btn" target="_blank" rel="noopener">Open on GitHub</a>
        <a id="download-file" class="btn" target="_blank" rel="noopener">Download</a>
      </div>
      <article id="file-content" class="content"></article>
    </section>
    <section id="loading" class="loading">Loading…</section>
    <section id="error" class="error hidden"></section>
  </main>

  <footer class="footer">
    <span>Powered by GitHub Contents API</span>
  </footer>

  <!-- Config (owner/repo can be changed here if you fork) -->
  <script src="./assets/config.js"></script>
  <!-- DOMPurify for safe Markdown rendering -->
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js"></script>
  <!-- Marked for Markdown -->
  <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
  <!-- Highlight.js -->
  <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js"></script>
  <!-- App -->
  <script src="./assets/app.js"></script>
</body>
</html>
