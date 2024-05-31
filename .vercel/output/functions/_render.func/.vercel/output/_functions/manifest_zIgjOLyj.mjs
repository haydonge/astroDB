import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_CTJ0b-Qy.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/addlink.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/addLink\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"addLink.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/addLink.json.ts","pathname":"/api/addLink.json","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/addstock.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/addstock\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"addstock.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/addstock.json.ts","pathname":"/api/addstock.json","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/excel.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/excel\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"excel.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/excel.json.ts","pathname":"/api/excel.json","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/process-data.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/process-data\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"process-data.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/process-data.json.ts","pathname":"/api/process-data.json","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/searchdata.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/searchdata\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"searchdata.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/searchdata.json.ts","pathname":"/api/searchdata.json","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/[id].json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/([^/]+?)\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false},{"content":".json","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/api/[id].json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/[idold].json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/([^/]+?)\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"idold","dynamic":true,"spread":false},{"content":".json","dynamic":false,"spread":false}]],"params":["idold"],"component":"src/pages/api/[idold].json.ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D_7PwjbZ.js"}],"styles":[{"type":"external","src":"/_astro/datas.DZ9ZGfIW.css"}],"routeData":{"route":"/datas","isIndex":false,"type":"page","pattern":"^\\/datas\\/?$","segments":[[{"content":"datas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/datas.astro","pathname":"/datas","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D3NqZuiC.js"}],"styles":[{"type":"external","src":"/_astro/datas.DZ9ZGfIW.css"}],"routeData":{"route":"/search","isIndex":false,"type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search.astro","pathname":"/search","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.Pzrkstao.js"}],"styles":[{"type":"external","src":"/_astro/datas.DZ9ZGfIW.css"}],"routeData":{"route":"/test","isIndex":false,"type":"page","pattern":"^\\/test\\/?$","segments":[[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test.astro","pathname":"/test","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CCkRN9gF.js"}],"styles":[{"type":"external","src":"/_astro/datas.DZ9ZGfIW.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/demo/astro-db-first-look/src/pages/datas.astro",{"propagation":"none","containsHead":true}],["D:/demo/astro-db-first-look/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/demo/astro-db-first-look/src/pages/search.astro",{"propagation":"none","containsHead":true}],["D:/demo/astro-db-first-look/src/pages/test.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/api/[idold].json.ts":"chunks/pages/_idold__DBSXSwQT.mjs","/src/pages/api/addLink.json.ts":"chunks/pages/addLink_8MdRghK1.mjs","/src/pages/api/addstock.json.ts":"chunks/pages/addstock_D89z4cBZ.mjs","/src/pages/api/excel.json.ts":"chunks/pages/excel_316J9Qxz.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_C-J7AcsS.mjs","/src/pages/index.astro":"chunks/pages/index_BiEANapK.mjs","/src/pages/api/process-data.json.ts":"chunks/pages/process-data_BDPThQQF.mjs","/src/pages/search.astro":"chunks/pages/search_DBkMcd1D.mjs","/src/pages/api/searchdata.json.ts":"chunks/pages/searchdata_DbXJNkUE.mjs","/src/pages/test.astro":"chunks/pages/test_DeAqFwJo.mjs","\u0000@astrojs-manifest":"manifest_zIgjOLyj.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_PtR8a_dE.mjs","\u0000@astro-page:src/pages/api/addLink.json@_@ts":"chunks/addLink_D-03fVOk.mjs","\u0000@astro-page:src/pages/api/addstock.json@_@ts":"chunks/addstock_By-G0cY6.mjs","\u0000@astro-page:src/pages/api/excel.json@_@ts":"chunks/excel_JZglk-uH.mjs","\u0000@astro-page:src/pages/api/process-data.json@_@ts":"chunks/process-data_DqU6w2fM.mjs","\u0000@astro-page:src/pages/api/searchdata.json@_@ts":"chunks/searchdata_2w6IMpmv.mjs","\u0000@astro-page:src/pages/api/[id].json@_@ts":"chunks/_id__B3FiwrZh.mjs","\u0000@astro-page:src/pages/api/[idold].json@_@ts":"chunks/_idold__DPd-x735.mjs","\u0000@astro-page:src/pages/datas@_@astro":"chunks/datas_COMkMxaD.mjs","\u0000@astro-page:src/pages/search@_@astro":"chunks/search_zeBh9FkV.mjs","\u0000@astro-page:src/pages/test@_@astro":"chunks/test_CV7-HOEM.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DPGxm7Ji.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.D3NqZuiC.js","/astro/hoisted.js?q=2":"_astro/hoisted.CCkRN9gF.js","/astro/hoisted.js?q=3":"_astro/hoisted.D_7PwjbZ.js","/astro/hoisted.js?q=1":"_astro/hoisted.Pzrkstao.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/dots.B3Rppea-.png","/_astro/datas.DZ9ZGfIW.css","/favicon.svg","/upload_icon.png","/_astro/hoisted.CCkRN9gF.js","/_astro/hoisted.D3NqZuiC.js","/_astro/hoisted.D_7PwjbZ.js","/_astro/hoisted.Pzrkstao.js","/_astro/purify.es.CGkS_BcK.js","/_astro/Search2data.astro_astro_type_script_index_0_lang.ClA61DnJ.js"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
