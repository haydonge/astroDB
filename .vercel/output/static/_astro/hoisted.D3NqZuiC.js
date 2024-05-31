import{p as i}from"./purify.es.CGkS_BcK.js";import"./Search2data.astro_astro_type_script_index_0_lang.ClA61DnJ.js";const o=document.querySelector("#search"),h=document.querySelector("#form1"),p=document.querySelector("#searchResults");function l(e){document.title=e?`Search Result for "${e}"`:"Searchthe database"}function m(e){const t=new URL(window.location.href);t.searchParams.set("q",e),window.history.replaceState(null,"",t)}function f(e){return e.map(t=>{const{id:r,partnumber:s,description:n,qty:a,url:c,safeqty:d}=t;return`
            <tr  class="text-center">
                <td class="py-2">${r}</td>
                <td class="py-2">${s}</td>
                <td class="py-2">${n}</td>
                <td class="py-2">${a}</td>
                <td class="py-2">${d}</td>
                <td class="py-2"> <a href=${c} class="text-blue-500 hover:underline mr-4"> Link </a> </td>
                <td>  <button
                  data-update
                  data-id=${r}
                  data-partnumber=${s}
                  data-description=${n}
                  data-qty=${a}
                  data-url=${c}
                  data-safeqty=${d}
                  classes="absolute -right-1 -bottom-1 border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2"
                  aria-label={"Update Link: ${s}"}
                  class="text-red-500 hover:text-red-700"
                }> update </button>
                </td>
            </tr>
        `}).join(" ")}async function u(e){if(e.length!==0)try{const t=await fetch("/api/searchdata.json",{method:"SEARCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),{success:r,data:s,message:n}=await t.json(),a=s;console.log(a),p.innerHTML=a.length>0?f(a):"Not Found Data"}catch(t){console.error(t)}}window.addEventListener("DOMContentLoaded",()=>{const e=i.sanitize(new URLSearchParams(window.location.search).get("q"));u(e),l(e),o.value=e,o.focus()});h.addEventListener("submit",async e=>{e.preventDefault();try{const t=i.sanitize(o.value);l(t);const r=new URLSearchParams(window.location.search).get("q");u(t),m(t)}catch(t){t instanceof Error&&alert(t.message),console.error(t)}});
