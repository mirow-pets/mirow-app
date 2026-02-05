// PWA: Only register for install/activate. Do NOT add a fetch listener
// unless you implement caching. An empty fetch listener can lead to
// a stale or blank root page being served from an old cache.
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
