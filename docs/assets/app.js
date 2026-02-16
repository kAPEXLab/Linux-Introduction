(() => {
  const cfg = window.GH_BROWSER_CONFIG || {};
  const OWNER = cfg.OWNER;
  const REPO  = cfg.REPO;
  let BRANCH  = cfg.BRANCH || "";   // resolved later if empty

  const els = {
    repoName: document.getElementById("repo-name"),
    branchName: document.getElementById("branch-name"),
    breadcrumbs: document.getElementById("breadcrumbs"),
    listView: document.getElementById("list-view"),
    fileView: document.getElementById("file-view"),
    fileContent: document.getElementById("file-content"),
    openRaw: document.getElementById("open-raw"),
    openGh: document.getElementById("open-gh"),
    download: document.getElementById("download-file"),
    loading: document.getElementById("loading"),
    error: document.getElementById("error"),
    filterInput: document.getElementById("filter-input"),
    refreshBtn: document.getElementById("refresh-btn"),
  };

  const apiBase = "https://api.github.com";
  const headers = { "Accept": "application/vnd.github.v3+json" };
  const token = localStorage.getItem("gh_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  function sizeFmt(s) {
    if (s == null || isNaN(s)) return "";
    if (s < 1024) return `${s} B`;
    if (s < 1024*1024) return `${(s/1024).toFixed(1)} KB`;
    if (s < 1024*1024*1024) return `${(s/1024/1024).toFixed(1)} MB`;
    return `${(s/1024/1024/1024).toFixed(1)} GB`;
  }

  function setHash(path, isFile=false) {
    const enc = encodeURIComponent(path);
    if (isFile) {
      location.hash = `#/view/${enc}`;
    } else {
      location.hash = path ? `#/${enc}` : `#/`;
    }
  }

  function parseHash() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    if (!h || h === "/") return { mode: "folder", path: "" };
    const parts = h.split("/");
    if (parts[0] === "view") {
      return { mode: "file", path: decodeURIComponent(parts.slice(1).join("/")) };
    }
    return { mode: "folder", path: decodeURIComponent(parts.join("/")) };
  }

  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  async function getJSON(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function ensureBranch() {
    if (BRANCH) return BRANCH;
    const url = `${apiBase}/repos/${OWNER}/${REPO}`;
    const data = await getJSON(url);
    BRANCH = data.default_branch;
    els.branchName.textContent = `@ ${BRANCH}`;
    return BRANCH;
  }

  function rawUrl(owner, repo, branch, path) {
    // The API returns download_url (raw), but we can also compute it:
    return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${path}`;
  }

  function renderBreadcrumbs(path) {
    const parts = path ? path.split("/").filter(Boolean) : [];
    const root = document.createElement("span");
    root.className = "crumb";
    root.innerHTML = `<a href="javascript:void(0)">root</a>`;
    root.onclick = () => setHash("");
    const frag = document.createDocumentFragment();
    frag.appendChild(root);

    let accum = [];
    parts.forEach((p, i) => {
      accum.push(p);
      const sep = document.createElement("span");
      sep.textContent = " / ";
      frag.appendChild(sep);

      const crumb = document.createElement("span");
      crumb.className = "crumb";
      crumb.innerHTML = `<a href="javascript:void(0)">${p}</a>`;
      crumb.onclick = () => setHash(accum.join("/"));
      frag.appendChild(crumb);
    });

    els.breadcrumbs.innerHTML = "";
    els.breadcrumbs.appendChild(frag);
  }

  function renderList(items, currentPath) {
    // items: array of {type:'file'|'dir', name, size, download_url, html_url, path}
    const filter = (els.filterInput.value || "").toLowerCase();

    const filtered = items.filter(x =>
      !filter || x.name.toLowerCase().includes(filter)
    );

    const dirs = filtered.filter(x => x.type === "dir").sort((a,b) => a.name.localeCompare(b.name));
    const files = filtered.filter(x => x.type !== "dir").sort((a,b) => a.name.localeCompare(b.name));

    const rows = [];
    if (currentPath) {
      rows.push(`
        <tr class="row up">
          <td class="col-name" colspan="3">
            <a href="javascript:void(0)" data-up="1">⬅︎ .. (up)</a>
          </td>
        </tr>
      `);
    }
    dirs.forEach(d => {
      rows.push(`
        <tr class="row dir">
          <td class="col-name">
            <a href="javascript:void(0)" data-dir="${encodeURIComponent(d.path)}">📁 ${d.name}</a>
          </td>
          <td class="col-size"></td>
          <td class="col-actions">
            <a class="mini" href="${d.html_url}" target="_blank" rel="noopener">GitHub</a>
          </td>
        </tr>
      `);
    });
    files.forEach(f => {
      rows.push(`
        <tr class="row file">
          <td class="col-name">
            <a href="javascript:void(0)" data-file="${encodeURIComponent(f.path)}">📄 ${f.name}</a>
          </td>
          <td class="col-size">${sizeFmt(f.size)}</td>
          <td class="col-actions">
            <a class="mini" href="${f.html_url}" target="_blank" rel="noopener">GitHub</a>
            <a class="mini" href="${f.download_url}" target="_blank" rel="noopener">Raw</a>
          </td>
        </tr>
      `);
    });

    els.listView.innerHTML = `
      <table class="grid">
        <thead>
          <tr><th>Name</th><th>Size</th><th>Actions</th></tr>
        </thead>
        <tbody>${rows.join("\n") || `<tr><td colspan="3">(empty)</td></tr>`}</tbody>
      </table>
    `;

    // Click handlers
    els.listView.querySelectorAll("[data-dir]").forEach(a => {
      a.addEventListener("click", () => {
        const p = decodeURIComponent(a.getAttribute("data-dir"));
        setHash(p);
      });
    });
    els.listView.querySelectorAll("[data-file]").forEach(a => {
      a.addEventListener("click", () => {
        const p = decodeURIComponent(a.getAttribute("data-file"));
        setHash(p, true);
      });
    });
    const up = els.listView.querySelector("[data-up]");
    if (up) {
      up.addEventListener("click", () => {
        const parts = currentPath.split("/").filter(Boolean);
        parts.pop();
        setHash(parts.join("/"));
      });
    }
  }

  async function listPath(path) {
    const branch = await ensureBranch();
    const endpoint = path ? `contents/${encodeURIComponent(path)}` : "contents";
    const url = `${apiBase}/repos/${OWNER}/${REPO}/${endpoint}?ref=${encodeURIComponent(branch)}`;
    const data = await getJSON(url);
    // If it's a file, API returns an object; if directory, an array
    if (Array.isArray(data)) {
      // directory
      return data.map(x => ({
        type: x.type,
        name: x.name,
        size: x.size,
        download_url: x.download_url,
        html_url: x.html_url,
        path: x.path
      }));
    } else {
      return data; // file metadata
    }
  }

  function isTextLike(name) {
    const ext = name.split(".").pop().toLowerCase();
    return ["txt","c","h","hpp","cpp","cc","cxx","py","sh","js","ts","json","yml","yaml","ini","conf","cfg","xml","html","css","md","markdown"].includes(ext);
  }
  function isMarkdown(name) {
    const ext = name.split(".").pop().toLowerCase();
    return ["md","markdown","mdown","mkd"].includes(ext);
  }
  function isImage(name) {
    const ext = name.split(".").pop().toLowerCase();
    return ["png","jpg","jpeg","gif","webp","svg","bmp"].includes(ext);
  }
  function isPdf(name) {
    return name.toLowerCase().endsWith(".pdf");
  }

  async function viewFile(meta) {
    const branch = await ensureBranch();
    const download = meta.download_url || rawUrl(OWNER, REPO, branch, meta.path);
    const htmlUrl = meta.html_url;

    els.openRaw.href = download;
    els.download.href = download;
    els.openGh.href = htmlUrl;

    const name = meta.name;
    els.fileContent.innerHTML = "";

    if (isMarkdown(name)) {
      const res = await fetch(download, { headers });
      const text = await res.text();
      const html = marked.parse(text, { breaks: true });
      els.fileContent.innerHTML = DOMPurify.sanitize(html);
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
      return;
    }

    if (isImage(name)) {
      const img = document.createElement("img");
      img.src = download;
      img.alt = name;
      img.className = "image";
      els.fileContent.appendChild(img);
      return;
    }

    if (isPdf(name)) {
      // In-page PDF viewer (fallback to browser plugin)
      const iframe = document.createElement("iframe");
      iframe.className = "pdf";
      iframe.src = download; // Simple: let the browser display it
      // If you prefer PDF.js viewer, uncomment next line:
      // iframe.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(download)}`;
      els.fileContent.appendChild(iframe);
      return;
    }

    if (isTextLike(name)) {
      const res = await fetch(download, { headers });
      const text = await res.text();
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = text;
      pre.appendChild(code);
      els.fileContent.appendChild(pre);
      hljs.highlightElement(code);
      return;
    }

    // Unknown type – just offer a download
    els.fileContent.innerHTML = `
      <p>Preview not supported for this file type. Use the buttons above to open or download.</p>
    `;
  }

  async function route() {
    hide(els.error);
    hide(els.listView);
    hide(els.fileView);
    show(els.loading);

    els.repoName.textContent = `${OWNER} / ${REPO}`;

    try {
      await ensureBranch();
      const { mode, path } = parseHash();
      renderBreadcrumbs(path);

      if (mode === "folder") {
        const items = await listPath(path);
        hide(els.loading);
        show(els.listView);
        renderList(items, path);
      } else {
        const meta = await listPath(path); // returns file metadata for file
        hide(els.loading);
        show(els.fileView);
        await viewFile(meta);
      }
    } catch (err) {
      hide(els.loading);
      els.error.textContent = `Error: ${err.message}. Check rate limits or path.`;
      show(els.error);
    }
  }

  // Events
  window.addEventListener("hashchange", route);
  els.filterInput.addEventListener("input", () => {
    const state = parseHash();
    if (state.mode === "folder") route();
  });
  els.refreshBtn.addEventListener("click", () => route());

  // First load
  route();
})();
