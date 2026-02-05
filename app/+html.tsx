import type { PropsWithChildren } from "react";

import { ScrollViewStyleReset } from "expo-router/html";

/**
 * This file is web-only and configures the root HTML for every web page
 * during static rendering. Expo injects the app scripts after this component.
 * Do not add a custom public/index.html — it would overwrite the generated
 * index.html and remove the script tags, causing a blank root page.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Mirow</title>
        <link rel="manifest" href="/manifest.json" />
        <ScrollViewStyleReset />
        <style
          id="expo-reset"
          dangerouslySetInnerHTML={{
            __html: `
              html, body { height: 100%; }
              body { overflow: hidden; }
              #root { display: flex; height: 100%; flex: 1; }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", function() {
                  navigator.serviceWorker.register("/sw.js")
                    .then(function(registration) {
                      console.log("Service Worker registered with scope:", registration.scope);
                    })
                    .catch(function(error) {
                      console.error("Service Worker registration failed:", error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
      </body>
    </html>
  );
}
