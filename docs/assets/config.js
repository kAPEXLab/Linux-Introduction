// Basic config for the browser app.
// If you fork or rename the repo, update OWNER/REPO here.
window.GH_BROWSER_CONFIG = {
  OWNER: "kAPEXLab",
  REPO:  "Linux-Introduction",
  // Optional: set a fixed branch; if empty, the app will detect default branch.
  BRANCH: "",
  // Rate limit: unauthenticated calls are ~60/hour per IP.
  // If needed, you can temporarily add a PAT via localStorage:
  // localStorage.setItem("gh_token", "ghp_xxx"); // remove when done
};
