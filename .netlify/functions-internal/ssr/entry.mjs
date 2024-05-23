import { renderers } from './renderers.mjs';
import { manifest } from './manifest_Bcc7H2DN.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_DrpH3_Uu.mjs');
const _page1 = () => import('./chunks/addLink_B8-9tACJ.mjs');
const _page2 = () => import('./chunks/_id__TXfSJ73G.mjs');
const _page3 = () => import('./chunks/index_B29WANrV.mjs');
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
    "middlewareSecret": "e81dac89-f5e8-4b48-91a3-1f9850efdca9"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
