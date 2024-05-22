/* empty css                          */
import { e as createAstro, f as createComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as renderSlot, j as renderComponent } from '../astro_C_g3fONi.mjs';
import 'kleur/colors';
import { cva } from 'class-variance-authority';
import 'clsx';
import { $ as $$Icon, a as $$Button, b as $$BaseLayout } from './datas_CMGKRAUF.mjs';
import { d as db, L as Link } from './_id__DtOgwdQZ.mjs';

const $$Astro$4 = createAstro();
const $$Link = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
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

const $$Astro$3 = createAstro();
const $$Checkbox = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Checkbox;
  const { inputId, checked, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative max-w-fit flex gap-2 items-center"> <input type="checkbox"${addAttribute(checked, "checked")} class="absolute inset-0 peer opacity-0 cursor-pointer"${addAttribute(`check-${inputId}`, "id")}${spreadAttributes(rest)}> <div class="size-6 border-2 border-theme-accent rounded-md grid place-items-center text-theme-base peer-checked:bg-theme-accent peer-focus-visible:ring-2 ring-theme-accent ring-offset-2 ring-offset-theme-base" aria-hidden="true"> ${renderComponent($$result, "Icon", $$Icon, { "name": "check", "size": 16 })} </div> <label${addAttribute(`check-${inputId}`, "for")}>Is Read?</label> </div>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Checkbox.astro", void 0);

const $$Astro$2 = createAstro();
const $$LinkCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LinkCard;
  const { link } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="p-4 sm:p-6 bg-theme-base text-theme-text shadow-black/60 shadow-xl rounded-md grid gap-6 relative"> <div class="grid gap-2"> ${renderComponent($$result, "Checkbox", $$Checkbox, { "checked": link.isRead, "inputId": link.id, "data-id": link.id, "data-isRead": true })} <h2 class="leading-tight font-bold text-theme-accent text-xl text-balance"> ${link.title} </h2> <p>${link.description}</p> </div> ${renderComponent($$result, "Link", $$Link, { "href": link.url, "intent": "primary" }, { "default": ($$result2) => renderTemplate`Open Link` })} ${renderComponent($$result, "Button", $$Button, { "intent": "accent", "size": "square", "data-delete": true, "data-id": link.id, "classes": "absolute -top-2 -right-2 rounded-full border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2", "aria-label": `Delete Link: ${link.title}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "name": "trash", "size": 24 })} ` })} </article> `;
}, "D:/demo/astro-db-first-look/src/components/LinkCard.astro", void 0);

const $$Astro$1 = createAstro();
const $$Table = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Table;
  const { columns, data, onDelete, onEdit } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> ${columns.map((column) => renderTemplate`<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> ${column.label} </th>`)} <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> ${data.map((row) => renderTemplate`<tr class="hover:bg-gray-100"> ${columns.map((column) => renderTemplate`<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> ${String(row[column.key])} </td>`)} <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> <button class="text-red-500" data-delete${addAttribute(row.id, "data-id")}>Delete</button>  </td> </tr>`)} </tbody> </table>`;
}, "D:/demo/astro-db-first-look/src/components/ui/Table.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const links = await db.select().from(Link);
  const columns = [
    { label: "ID", key: "id" },
    { label: "Title", key: "title" },
    { label: "URL", key: "url" },
    { label: "Description", key: "description" },
    { label: "Is Read", key: "isRead" }
  ];
  async function deleteStock(id) {
    const response = await fetch("/api/deleteStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    if (response.ok) {
      console.log("l.....");
    } else {
      console.error("Failed to delete stock");
    }
  }
  async function editStock(stock) {
    const response = await fetch("/api/editStock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stock)
    });
    if (response.ok) {
      console.log("l.....333");
    } else {
      console.error("Failed to edit stock");
    }
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] items-start"> ${links.map((link) => renderTemplate`${renderComponent($$result2, "LinkCard", $$LinkCard, { "link": link })}`)} </div> ${renderComponent($$result2, "Table", $$Table, { "columns": columns, "data": links, "onDelete": deleteStock, "onEdit": editStock })} ` })}`;
}, "D:/demo/astro-db-first-look/src/pages/index.astro", void 0);

const $$file = "D:/demo/astro-db-first-look/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
