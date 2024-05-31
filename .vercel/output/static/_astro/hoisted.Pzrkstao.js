import{p as u}from"./purify.es.CGkS_BcK.js";import"./Search2data.astro_astro_type_script_index_0_lang.ClA61DnJ.js";const c=document.querySelector("#search"),m=document.querySelector("#form1"),y=document.querySelector("#searchResults");function i(t){document.title=t?`Search Result for "${t}"`:"Searchthe database"}function p(t){const e=new URL(window.location.href);e.searchParams.set("q",t),window.history.replaceState(null,"",e)}function h(t){return t.map(e=>{const{id:o,partnumber:a,description:n,qty:r,url:s,safeqty:d}=e;return`
            <tr  class="text-center">
                <td class="py-2">${o}</td>
                <td class="py-2">${a}</td>
                <td class="py-2">${n}</td>
                <td class="py-2">${r}</td>
                <td class="py-2">${d}</td>
                <td class="py-2"> <a href=${s} class="text-blue-500 hover:underline mr-4"> Link </a> </td>
                <td> <button
                  data-update
                  data-id=${o}
                  data-partnumber=${a}
                  data-description=${n}
                  data-qty=${r}
                  data-url=${s}
                  data-safeqty=${d}
                  classes="absolute -right-1 -bottom-1 border-4 border-theme-base hover:scale-105 active:scale-95 ring-offset-2"
                  aria-label={"Update Link: ${a}"}
                  class="text-red-500 hover:text-red-700"
                }> update </button>
                </td>
            </tr>
        `}).join(" ")}async function l(t){if(t.length!==0)try{const e=await fetch("/api/searchdata.json",{method:"SEARCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),{success:o,data:a,message:n}=await e.json(),r=a;console.log(r),y.innerHTML=r.length>0?h(r):"Not Found Data"}catch(e){console.error(e)}}window.addEventListener("DOMContentLoaded",()=>{const t=u.sanitize(new URLSearchParams(window.location.search).get("q"));l(t),i(t),c.value=t,c.focus();const e=document.querySelectorAll("data-update"),o=document.getElementById("dialog2");e.forEach(a=>{a.addEventListener("click",n=>{const r={id:a.getAttribute("data-id"),partnumber:a.getAttribute("data-partnumber"),description:a.getAttribute("data-description"),qty:a.getAttribute("data-qty"),url:a.getAttribute("data-url"),safeqty:a.getAttribute("data-safeqty")};if(o){const s=o.querySelector("form");s.querySelector("[name='id']").value=r.id,s.querySelector("[name='partnumber']").value=r.partnumber,s.querySelector("[name='description']").value=r.description,s.querySelector("[name='qty']").value=r.qty,s.querySelector("[name='url']").value=r.url,s.querySelector("[name='safeqty']").value=r.safeqty,o.showModal()}})})});m.addEventListener("submit",async t=>{t.preventDefault();try{const e=u.sanitize(c.value);i(e);const o=new URLSearchParams(window.location.search).get("q");l(e),p(e)}catch(e){e instanceof Error&&alert(e.message),console.error(e)}});
