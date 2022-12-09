/**
 * In order to bundle the content script and keep it compatible with `chrome.scripting` api, make sure each file uses the following format:
 * ```typescript
 * export default function nameOfFunciont() {
 *   // implementation
 * }
 * ```
 * See related setup in `build.js`
 */

import { injectIframe } from "./utils/inject-iframe";
import { injectScript } from "./utils/inject-script";

export default async function main() {
  console.log("content script live");
  injectScript(chrome.runtime.getURL("content-injection.js"));
  injectIframe(chrome.runtime.getURL("proxy.html"));
}

// No need to call default exported function. Chrome runtime will execute.
