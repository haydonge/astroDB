import { renderers } from './renderers.mjs';
import { manifest } from './manifest_C8IAINRw.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_B5Q02rmR.mjs');
const _page1 = () => import('./chunks/addLink_CbuwHmwx.mjs');
const _page2 = () => import('./chunks/_id___qmEG_Cp.mjs');
const _page3 = () => import('./chunks/index_Bs8_9BPY.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/addLink.json.ts", _page1],
    ["src/pages/api/[id].json.ts", _page2],
    ["src/pages/index.astro", _page3]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "1a2b34e9-4446-4e3e-8ad0-44cb9dd23fb2"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
