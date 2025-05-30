import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  api.onPageChange((url, title) => {
    const currentUser = api.getCurrentUser();

    if (settings.exclude_groups.trim() && currentUser) {
      const excludedGroups = settings.exclude_groups
        .split(",")
        .map((g) => g.trim());
      const currentUserGroups = currentUser.groups.map((g) => g.name);
      if (excludedGroups.filter((g) => currentUserGroups.includes(g)).length) {
        return;
      }
    }

    const _paq = (window._paq = window._paq || []);
    window._paq_loaded = window._paq_loaded || false;

    if (!window._paq_loaded) {
      let u = `//${settings.host_url}/`;
      _paq.push(["setTrackerUrl", u + "piwik.php"]);
      _paq.push(["setSiteId", settings.website_id]);
      let d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.type = "text/javascript";
      g.async = true;
      g.defer = true;
      g.src = u + "piwik.js";
      s.parentNode.insertBefore(g, s);
      window._paq_loaded = true;
    }

    const userIdField = settings.user_id_tracking.trim();
    if (userIdField && currentUser && currentUser[userIdField]) {
      _paq.push(["setUserId", currentUser[userIdField]]);
    }

    if (settings.subdomain_tracking) {
      const allDomains =
        "*" + document.domain.substring(document.domain.indexOf("."));
      _paq.push(["setCookieDomain", allDomains]);
      _paq.push(["setDomains", allDomains]);
    }

    if (settings.do_not_track) {
      _paq.push(["setDoNotTrack", true]);
    }

    if (settings.disable_cookies) {
      _paq.push(["disableCookies"]);
    }

    _paq.push(["setCustomUrl", url]);
    _paq.push(["setDocumentTitle", title]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
  });
});
