/* empty css                          */
import { e as createAstro, f as createComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderSlot, j as renderComponent, u as unescapeHTML, k as Fragment, l as renderHead } from '../astro_D5tOgv0N.mjs';
import 'kleur/colors';
import { cva } from 'class-variance-authority';
import 'clsx';
import { getIconData, iconToSVG } from '@iconify/utils';
import { twMerge } from 'tailwind-merge';
import { g as getImage } from './generic_DXnwhZye.mjs';
import { d as db, L as Link } from './_id__DiqyZWkJ.mjs';

const $$Astro$a = createAstro();
const $$Link = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Link;
  const a = cva(
    "flex items-center gap-2 max-w-fit rounded transition-all shadow-xl shadow-black/60 hover:shadow-none",
    {
      variants: {
        intent: {
          primary: [
            "bg-theme-text",
            "text-theme-base",
            "border-transparent",
            "hover:bg-theme-text/90",
            "focus:outline-none",
            "focus-visible:ring-2",
            "ring-theme-text",
            "ring-offset-4",
            "ring-offset-theme-base"
          ],
          accent: [
            "bg-theme-accent",
            "border-transparent",
            "hover:bg-theme-accent/90",
            "focus:outline-none",
            "focus-visible:ring-2",
            "ring-theme-accent",
            "ring-offset-4",
            "ring-offset-theme-base"
          ]
        },
        size: {
          small: ["text-sm", "py-1", "px-2"],
          medium: ["text-base", "py-2", "px-4"],
          large: ["text-lg", "py-3", "px-5"]
        }
      }
    }
  );
  const { intent = "primary", size = "medium", ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(a({ intent, size }), "class:list")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Link.astro", void 0);

const icons = {"local":{"prefix":"local","lastModified":1715827188,"icons":{"check":{"body":"<g fill=\"none\" fill-rule=\"evenodd\"><path d=\"M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z\"/><path fill=\"currentColor\" d=\"M19.495 3.133a1 1 0 0 1 1.352.309l.99 1.51a1 1 0 0 1-.155 1.279l-.003.004-.014.013-.057.053-.225.215a83.86 83.86 0 0 0-3.62 3.736c-2.197 2.416-4.806 5.578-6.562 8.646-.49.856-1.687 1.04-2.397.301l-6.485-6.738a1 1 0 0 1 .051-1.436l1.96-1.768A1 1 0 0 1 5.6 9.2l3.309 2.481c5.169-5.097 8.1-7.053 10.586-8.548\"/></g>","width":24,"height":24},"trash":{"body":"<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687 4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z\" clip-rule=\"evenodd\"/>","width":15,"height":15}}}};

const cache = /* @__PURE__ */ new WeakMap();

const $$Astro$9 = createAstro();
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Icon;
  class AstroIconError extends Error {
    constructor(message) {
      super(message);
    }
  }
  const req = Astro2.request;
  const { name = "", title, "is:inline": inline = false, ...props } = Astro2.props;
  const map = cache.get(req) ?? /* @__PURE__ */ new Map();
  const i = map.get(name) ?? 0;
  map.set(name, i + 1);
  cache.set(req, map);
  const includeSymbol = !inline && i === 0;
  let [setName, iconName] = name.split(":");
  if (!setName && iconName) {
    const err = new AstroIconError(`Invalid "name" provided!`);
    throw err;
  }
  if (!iconName) {
    iconName = setName;
    setName = "local";
    if (!icons[setName]) {
      const err = new AstroIconError('Unable to load the "local" icon set!');
      throw err;
    }
    if (!(iconName in icons[setName].icons)) {
      const err = new AstroIconError(`Unable to locate "${name}" icon!`);
      throw err;
    }
  }
  const collection = icons[setName];
  if (!collection) {
    const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
    throw err;
  }
  const iconData = getIconData(collection, iconName ?? setName);
  if (!iconData) {
    const err = new AstroIconError(`Unable to locate "${name}" icon!`);
    throw err;
  }
  const id = `ai:${collection.prefix}:${iconName ?? setName}`;
  if (props.size) {
    props.width = props.size;
    props.height = props.size;
    delete props.size;
  }
  const renderData = iconToSVG(iconData);
  const normalizedProps = { ...renderData.attributes, ...props };
  const normalizedBody = renderData.body;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": ($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "xlink:href")}></use> ` })}`} </svg>`;
}, "D:/demo/astro-db-first-look/node_modules/astro-icon/components/Icon.astro", void 0);

const $$Astro$8 = createAstro();
const $$Checkbox = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Checkbox;
  const { inputId, checked, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative max-w-fit flex gap-2 items-center"> <input type="checkbox"${addAttribute(checked, "checked")} class="absolute inset-0 peer opacity-0 cursor-pointer"${addAttribute(`check-${inputId}`, "id")}${spreadAttributes(rest)}> <div class="size-6 border-2 border-theme-accent rounded-md grid place-items-center text-theme-base peer-checked:bg-theme-accent peer-focus-visible:ring-2 ring-theme-accent ring-offset-2 ring-offset-theme-base" aria-hidden="true"> ${renderComponent($$result, "Icon", $$Icon, { "name": "check", "size": 16 })} </div> <label${addAttribute(`check-${inputId}`, "for")}>Is Read?</label> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Checkbox.astro", void 0);

const $$Astro$7 = createAstro();
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Button;
  const button = cva(
    "flex items-center gap-2 max-w-fit rounded transition-all focus:outline-none focus-visible:ring-2 ring-offset-4 border-transparent text-theme-base ring-offset-theme-base",
    {
      variants: {
        intent: {
          primary: ["bg-theme-text", "hover:bg-theme-text/90", "ring-theme-text"],
          accent: [
            "bg-theme-accent",
            "hover:bg-theme-accent/90",
            "ring-theme-accent"
          ]
        },
        size: {
          small: ["text-sm", "py-1", "px-2"],
          medium: ["text-base", "py-2", "px-4"],
          large: ["text-lg", "py-3", "px-5"],
          square: ["p-2", "aspect-square"]
        }
      }
    }
  );
  const { intent = "primary", size = "medium", classes, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button${addAttribute(twMerge([button({ intent, size }), classes]), "class:list")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </button>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Button.astro", void 0);

const $$Astro$6 = createAstro();
const $$LinkCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$LinkCard;
  const { link } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="p-4 sm:p-6 bg-theme-base text-theme-text shadow-black/60 shadow-xl rounded-md grid gap-6 relative"> <div class="grid gap-2"> ${renderComponent($$result, "Checkbox", $$Checkbox, { "checked": link.isRead, "inputId": link.id, "data-id": link.id, "data-isRead": true })} <h2 class="leading-tight font-bold text-theme-accent text-xl text-balance"> ${link.title} </h2> <p>${link.description}</p> </div> ${renderComponent($$result, "Link", $$Link, { "href": link.url, "intent": "primary" }, { "default": ($$result2) => renderTemplate`Open Link` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "size": "square", "data-delete": true, "data-id": link.id, "classes": "absolute -top-2 -right-2 rounded-full border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2", "aria-label": `Delete Link: ${link.title}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "name": "trash", "size": 24 })} ` })} </article> `;
}, "D:/demo/astro-db-first-look/src/components/LinkCard.astro", void 0);

const dots = new Proxy({"src":"/_astro/dots.B3Rppea-.png","width":14,"height":14,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "D:/demo/astro-db-first-look/src/assets/dots.png";
							}
							
							return target[name];
						}
					});

const $$Astro$5 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="bg-theme-base text-sm"> <div class="container grid place-items-center p-2"> <p>Copyright &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Sanmina</p> </div> </footer>`;
}, "D:/demo/astro-db-first-look/src/components/Footer.astro", void 0);

const $$Astro$4 = createAstro();
const $$TextArea = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$TextArea;
  const { id, name } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative grid gap-1"> <label${addAttribute(`input-${id}`, "for")} class="text-sm uppercase">${name}</label> <textarea required${addAttribute(`input-${id}`, "id")}${addAttribute(name.toLowerCase().replace(" ", "-"), "name")} class="p-2 bg-theme-text text-theme-base rounded focus:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-theme-base ring-theme-accent"></textarea> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/TextArea.astro", void 0);

const $$Astro$3 = createAstro();
const $$TextInput = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TextInput;
  const { inputId, name, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative grid gap-1"> <label${addAttribute(`input-${inputId}`, "for")} class="text-sm uppercase">${name}</label> <input type="text" required${addAttribute(`input-${inputId}`, "id")}${spreadAttributes(rest)}${addAttribute(name.toLowerCase().replace(" ", "-"), "name")} class="p-2 bg-theme-text text-theme-base rounded focus:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-theme-base ring-theme-accent"> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/TextInput.astro", void 0);

const $$Astro$2 = createAstro();
const $$Dialog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Dialog;
  return renderTemplate`${maybeRenderHead()}<dialog class="bg-theme-base text-theme-text shadow-black/60 shadow-xl rounded-md w-full max-w-sm backdrop:bg-black/60"> <div class="p-4 sm:p-8 grid gap-6"> <form class="grid gap-4" id="add-form"> <h2 class="text-xl text-theme-accent font-bold leading-tight">
增加订单
</h2> ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Link Title", "inputId": Math.random() })} ${renderComponent($$result, "TextArea", $$TextArea, { "name": "Link Description", "id": Math.random() })} ${renderComponent($$result, "TextInput", $$TextInput, { "name": "Link URL", "inputId": Math.random(), "title": "Must start with https://", "pattern": "https?://.*" })} ${renderComponent($$result, "Checkbox", $$Checkbox, { "checked": false, "inputId": Math.random(), "name": "isRead" })} <div class="flex gap-4 flex-wrap"> ${renderComponent($$result, "Button", $$Button, { "intent": "primary", "id": "close-dialog", "type": "button" }, { "default": ($$result2) => renderTemplate`Close` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "type": "submit" }, { "default": ($$result2) => renderTemplate`Add Link` })} </div> </form> </div> </dialog> `;
}, "D:/demo/astro-db-first-look/src/components/ui/Dialog.astro", void 0);

const $$Astro$1 = createAstro();
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const dotsImage = await getImage({ src: dots, format: "avif" });
  const { title = "\u8BA2\u5355\u7BA1\u7406", description = "Links for web developers." } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="msapplication-TileColor" content="#F46633"><meta name="theme-color" content="#202020"><meta name="color-scheme" content="dark"><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${renderHead()}</head> <body class="bg-gradient-to-b from-black to-theme-base text-theme-text text-base relative"> <div${addAttribute(`background-image: url(${dotsImage.src}); -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))`, "style")} class="absolute left-0 h-60 right-0 opacity-40 mix-blend-difference -z-10"></div> <div class="grid gap-10 sm:gap-16 min-h-screen grid-rows-auto_1fr_auto relative overflow-hidden"> <header class="grid place-items-center py-8"> <h1 class="text-theme-accent font-bold text-4xl [text-shadow:_0_10px_15px_black]">
订单管理系统
</h1> ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "id": "open-dialog" }, { "default": ($$result2) => renderTemplate`增加订单` })} </header> <main class="container after:absolute after:bg-theme-accent after:w-3/4 after:left-1/2 after:-translate-x-1/2 after:h-96 after:mix-blend-difference after:rounded-full after:-bottom-1/4 after:-z-50 after:blur-3xl after:opacity-40"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "Dialog", $$Dialog, {})} </div> <div${addAttribute(`background-image: url(${dotsImage.src}); -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, to(rgba(0,0,0,1)), from(rgba(0,0,0,0)))`, "style")} class="absolute left-0 h-60 bottom-0 right-0 opacity-30 mix-blend-difference -z-10"></div> </body></html>`;
}, "D:/demo/astro-db-first-look/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const links = await db.select().from(Link);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-start"> ${links.map((link) => renderTemplate`${renderComponent($$result2, "LinkCard", $$LinkCard, { "link": link })}`)} </div> ` })}`;
}, "D:/demo/astro-db-first-look/src/pages/index.astro", void 0);

const $$file = "D:/demo/astro-db-first-look/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
