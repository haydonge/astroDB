/* empty css                          */
import { e as createAstro, f as createComponent, r as renderTemplate, j as renderComponent, m as maybeRenderHead } from '../astro_CTJ0b-Qy.mjs';
import 'kleur/colors';
import { a as $$Button, b as $$BaseLayout } from './datas_rV8AlE7L.mjs';
import { d as db, S as Stockonhand } from './_id__DLXKWOuF.mjs';

const $$Astro = createAstro();
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  Astro2.props;
  await db.select().from(Stockonhand);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<main class="flex flex-col items-center space-y-4"> <!-- <h3 class="text-xl text-theme-accent font-bold leading-tight">
      搜索库存
    </h3> --> <form class="form flex items-center justify-center space-x-9" id="form1"> <label for="search">Search DataBase </label> <input type="text" required min="2" max="24" name="search" id="search" placeholder="Enter a search term…" class=" border border-white"> ${renderComponent($$result2, "Button", $$Button, { "intent": "accent", "type": "submit" }, { "default": ($$result3) => renderTemplate`Search` })} </form> <p id="searchReadout"></p> </main> <section aria-label="Search Results"> <table class="min-w-full small-text "> <thead> <tr class="text-center  small-text"> <th class="py-2">ID</th> <th class="py-2">Part Number</th> <th class="py-2">Description</th> <th class="py-2">Qty</th> <th class="py-2">SafeQty</th> <th class="py-2">URL</th> <th class="py-2">Action</th> </tr></thead> <tbody id="searchResults"></tbody></table> <div id="stockTableContainer"> <!-- <StockTable stocks={filteredStocks}/> --> </div> </section>   ` })}`;
}, "D:/demo/astro-db-first-look/src/pages/search.astro", void 0);

const $$file = "D:/demo/astro-db-first-look/src/pages/search.astro";
const $$url = "/search";

export { $$Search as default, $$file as file, $$url as url };
