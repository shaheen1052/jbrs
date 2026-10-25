/* ================= RCD-3 (Agricultural and rural credit) ================= */
const R3E='CDEFGHIJKLNOPQ';            // columns a branch enters (M is calculated)
const R3CNT=new Set(['D','I','O']);    // counts, the rest are lakh Taka
const R3DATA=RCD3_ROWS.filter(x=>x.t==='row').map(x=>x.r);
const R3LEAF='ln_rcd3';
const r3n=v=>{const n=parseFloat(v);return isNaN(n)?0:n};
const r3f=(v,c)=>{if(v===null||v===undefined||v===''||!isFinite(v))return'';const n=+v;if(Math.abs(n)<0.005)return'';return toBn(R3CNT.has(c)?String(Math.round(n)):n.toFixed(2))};
function r3fy(p){const [y,m]=p.split('-').map(Number);const a=m>=7?y:y-1;return toBn(a+'-'+String(a+1).slice(2))}
function r3sum(v,rows){const o={};R3E.split('').forEach(c=>{let any=false,t=0;rows.forEach(r=>{const x=v[r]&&v[r][c];if(x!==undefined&&x!==null&&x!==''&&!isNaN(parseFloat(x))){any=true;t+=parseFloat(x)}});o[c]=any?t:undefined});o.M=o.J&&o.L!==undefined?o.L/o.J*100:null;return o}
function r3line(v,r){const x=v[r]||{};const o={};R3E.split('').forEach(c=>o[c]=x[c]);const J=r3n(x.J);o.M=J&&x.L!==undefined&&x.L!==''?r3n(x.L)/J*100:null;return o}
function r3add(list){const v={};list.forEach(d=>R3DATA.forEach(r=>{const x=d&&d[r];if(!x)return;R3E.split('').forEach(c=>{const n=parseFloat(x[c]);if(!isNaN(n)){v[r]=v[r]||{};v[r][c]=+((v[r][c]||0)+n).toFixed(4)}})}));return v}

/* ---------- statement table (sheet 1 format; branch sheets also have the written-off columns) ---------- */
function r3table(v,opt){
  const cols=opt.wo?'CDEFGHIJKLMNOPQ':'CDEFGHIJKLMN';
  const ed=opt.edit||{};
  const cell=(c,val,r)=>{
    const al=R3CNT.has(c)?' cn':'';
    if(r&&(ed.all&&c!=='M'&&!(ed.lock&&ed.lock.has(c))||ed.cols&&ed.cols.includes(c)))return`<td class="gn${al}"><input class="gi${al}" type="text" inputmode="decimal" data-num="1" data-r="${r}" data-c="${c}" value="${esc(toBn(val??''))}" oninput="A.r3set(this)"></td>`;
    if(c==='M')return`<td class="gn gc">${val===null||val===undefined?'':toBn(val.toFixed(2))}</td>`;
    return`<td class="gn${al}${r&&!(ed.lock&&ed.lock.has(c))?'':' gc'}">${r3f(val,c)}</td>`;
  };
  let h=`<table class="gt r3t"><tr><th rowspan="3">ক্রমিক নং</th><th rowspan="3">কর্মসূচির নাম</th><th rowspan="3" class="r3th3">চলতি ${r3fy(opt.period)} অর্থ বছরে বরাদ্দ</th><th colspan="3">বিতরণকৃত ঋণ</th><th colspan="2">আদায়</th><th colspan="2">বর্তমান অনাদায়ী</th><th rowspan="3">মেয়াদোত্তীর্ণ ঋণের পরিমান</th><th colspan="3">শ্রেণীকৃত ঋণ</th>${opt.wo?'<th colspan="3">অবলোপনকৃত ঋণ</th>':''}</tr>
  <tr><th colspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত</th><th rowspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত আদায়</th><th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমান</th><th rowspan="2">শ্রেণীকৃত ঋণের পরিমান</th><th rowspan="2">শতকরা হার</th><th rowspan="2">শ্রেণীকৃত ঋণ হতে আদায়</th>${opt.wo?'<th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমান</th><th rowspan="2">আদায়</th>':''}</tr>
  <tr><th>সংখ্যা</th><th>পরিমান</th></tr>
  <tr class="r3no">${['১','২','৩','৪','৫','৬','৭','৮','৯','১০','১১','১২','১৩','১৪'].concat(opt.wo?['১৫','১৬','১৭']:[]).map(x=>`<td>${x}</td>`).join('')}</tr>`;
  const subs=[];
  for(const x of RCD3_ROWS){
    if(x.t==='sec'){h+=`<tr class="r3sec"><td class="gc0">${esc(x.sl)}</td><td class="glab" colspan="${cols.length+1}"><b>${esc(x.label)}</b></td></tr>`;continue}
    if(x.t==='row'){const o=r3line(v,x.r);h+=`<tr${x.bold?' class="gsum"':''}><td class="gc0">${esc(x.sl)}</td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>cell(c,o[c],x.r)).join('')}</tr>`;if(x.bold)subs.push([x.r]);continue}
    if(x.t==='sub'){subs.push(x.of);const o=r3sum(v,x.of);h+=`<tr class="gsum"><td></td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>cell(c,o[c])).join('')}</tr>`;continue}
    if(x.t==='grand'){const o=r3sum(v,subs.flat());h+=`<tr class="gsum r3grand"><td></td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>cell(c,o[c])).join('')}</tr>`}
  }
  return h+'</table>';
}
function r3office(o){return o?(o.level==='AREA'?'এরিয়া অফিস, সিরাজগঞ্জ।':(o.nameBn||o.name).replace(/\s*$/,'')+'।'):''}
function r3bank(o){return`<div class="r3hd"><div class="r3c"><img src="${LOGO}" alt=""><div><div class="b">জনতা ব্যাংক পিএলসি</div><div class="o">${esc(r3office(o))}</div></div></div></div>`}
function r3head(p,o,sub,unit){
  return r3bank(o)+`<div class="r3codes"><div>এসএসিপি-১(ক)</div><div>রিটেইল কাস্টমার ডিপার্টমেন্ট-৩</div></div>
  <div class="r3title">রিটেইল কাস্টমার ডিপার্টমেন্ট-৩ সম্পৃক্ত কৃষি/পল্লী ঋণ হিসাবের ${gctx(p).asOn} তারিখের ${sub||''}একত্রীভুত মাসিক বিবরণী।</div><div class="r3unit">${unit||'(লক্ষ টাকা)'}</div>`;
}
function r3head2(p,o){return r3bank(o)+`<div class="r3title">বিষয়ঃ রিটেইল কাস্টমার ডিপার্টমেন্ট-৩ সম্পৃক্ত কৃষি/পল্লী ঋণ হিসাবের ${gctx(p).asOn} তারিখের প্রোডাক্ট ভিত্তিক একত্রীভুত মাসিক বিবরণী।</div><div class="r3unit">(লক্ষ টাকায়)</div>`}
const r3sign=o=>`<div class="p-end"><div class="p-sign"><div>কর্মকর্তা</div><div>${o&&o.level==='BR'?'ব্যবস্থাপক':'অফিস প্রধান'}</div></div></div>`;
function r3print(pages,cap,land){
  if(!Array.isArray(pages))pages=[pages];
  const W=land?1040:712,H=land?700:1030;    // A4 inside the 10/11 mm print margins, in CSS px
  let st=document.getElementById('r3pg');if(!st){st=document.createElement('style');st.id='r3pg';document.head.appendChild(st)}
  st.textContent=land?'@page{size:A4 landscape;margin:0}':'';
  const off=()=>{st.textContent='';window.removeEventListener('afterprint',off)};window.addEventListener('afterprint',off);
  const m=document.createElement('div');m.className='bn r3p';m.style.cssText='position:absolute;left:-20000px;top:0;visibility:hidden;width:'+W+'px';document.body.appendChild(m);
  const meas=(h,w)=>{m.innerHTML='<div class="r3pg" style="width:'+w+'px">'+h+'</div>';const el=m.firstChild;return[el.scrollWidth,el.scrollHeight]};
  const out=pages.map(h=>{
    // find the largest zoom at which the page, laid out at width W/zoom, fits one A4 page
    let lo=0.3,hi=cap||1.6;
    for(let i=0;i<14;i++){const z=(lo+hi)/2,[sw,sh]=meas(h,Math.floor(W/z));if(sh*z<=H&&sw<=Math.floor(W/z)+1)lo=z;else hi=z}
    const z=lo;
    return '<div class="r3pg" style="zoom:'+z.toFixed(4)+';width:'+Math.floor(W/z)+'px">'+h+'</div>'});
  m.remove();
  $('#printArea').innerHTML='<div class="bn r3p">'+out.join('')+'</div>';
  window.print();
}
function r3csv(name){
  const t=document.querySelectorAll('#r3out table.gt');if(!t.length)return;
  const q=v=>{const s=toEn(String(v??'').trim());return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const lines=[];
  t.forEach(tb=>{const cap=tb.dataset.cap;if(cap)lines.push(q(cap));const grid=[];
    [...tb.rows].forEach((tr,ri)=>{grid[ri]=grid[ri]||[];let ci=0;[...tr.cells].forEach(td=>{while(grid[ri][ci]!==undefined)ci++;const inp=td.querySelector('input');const val=inp?inp.value:td.textContent;const cs=td.colSpan||1,rs=td.rowSpan||1;for(let a=0;a<rs;a++)for(let b=0;b<cs;b++){grid[ri+a]=grid[ri+a]||[];grid[ri+a][ci+b]=(a||b)?'':val}ci+=cs})});
    grid.forEach(r=>lines.push(r.map(q).join(',')));lines.push('')});
  const blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
}

/* ---------- pages ---------- */
function pageRcd3(l){
  const p=S.view.period||prevMonth();
  const head=`<div class="muted small">${esc(l.pillar)} / Agricultural and rural credit / RCD-3</div><h2>${esc(l.name)}</h2>`;
  const month=`<div style="max-width:200px"><label>Month</label><input type="month" id="r3p" value="${p}" onchange="go({...S.view,period:this.value,after:null})"></div>`;
  if(l.tpl==='rcd3'){
    if(isBranch()){S.view.after=()=>r3openOwn(p);return head+`<div class="card"><div class="row">${month}</div></div><div id="r3out" class="muted" style="margin-top:12px">Loading...</div>`}
    S.view.after=()=>r3grid(p);return head+`<div class="card"><div class="row">${month}</div><div id="r3out" class="muted" style="margin-top:12px">Loading branch status...</div></div>`;
  }
  const kids=isBranch()?[]:RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const of=S.view.r3of||(isBranch()?S.user.office:'all');
  const sel=isBranch()?'':`<div style="flex:2"><label>Office</label><select id="r3of" onchange="go({...S.view,r3of:this.value,after:null})"><option value="all" ${of==='all'?'selected':''}>All branches (consolidated)</option>${kids.map(c=>`<option value="${c}" ${of===c?'selected':''}>${c} - ${esc(RCD3_SHORT[c]||officeName(c))}</option>`).join('')}</select></div>`;
  let prod='';
  if(l.tpl==='rcd3s2'){const pv=S.view.r3pr||'sheet';prod=`<div style="flex:2"><label>Product</label><select id="r3pr" onchange="go({...S.view,r3pr:this.value,after:null})"><option value="sheet" ${pv==='sheet'?'selected':''}>Products in the statement (${toBn(RCD3_BYPRODUCT.length)})</option><option value="all" ${pv==='all'?'selected':''}>All products</option>${RCD3_ROWS.filter(x=>x.t==='row').map(x=>`<option value="${x.r}" ${String(x.r)===pv?'selected':''}>${esc(x.sl+'. '+x.label)}</option>`).join('')}</select></div>`}
  S.view.after=()=>l.tpl==='rcd3s1'?r3s1(p,of):r3s2(p,of);
  return head+`<div class="card"><div class="row">${month}${l.tpl==='rcd3s1'?sel:''}${prod}</div></div><div id="r3out" class="card muted" style="margin-top:12px">Loading...</div>`;
}
async function r3fetch(p,of){
  // returns {list:[{office,v}], note}
  if(isBranch()||(of&&of!=='all'&&of!=='own')){
    const code=isBranch()?S.user.office:of;
    const j=await api('/report?office='+encodeURIComponent(code)+'&leaf='+R3LEAF+'&period='+p);
    const d=j.report&&j.report.data;return{list:d?[{office:code,v:d.v||{},status:j.report.status}]:[],single:code,status:j.report?j.report.status:'NONE'};
  }
  const c=await api('/collect?leaf='+R3LEAF+'&period='+p);
  return{list:c.reports.filter(x=>office(x.office)&&office(x.office).level==='BR').map(x=>({office:x.office,v:(x.data&&x.data.v)||{}}))};
}
async function r3s1(p,of){
  const out=$('#r3out');const d=await r3fetch(p,of);
  if(d.single){
    const o=office(d.single);
    if(!d.list.length){out.outerHTML=`<div id="r3out" class="card">No RCD-3 data for ${fmtPeriod(p)} yet.</div>`;return}
    const body=r3head(p,o)+r3table(d.list[0].v,{period:p,wo:true});
    out.outerHTML=`<div id="r3out" class="card bn">${!isBranch()&&d.status!=='SUBMITTED'?'':''}<div class="gscroll">${body}</div><div class="bar"><button class="pri" onclick="A.r3print()">Print</button><button onclick="r3csv('RCD-3_${d.single}_${p}.csv')">Download Excel</button></div></div>`;
    S.r3doc=[body];S.r3cap=null;S.r3land=false;return;
  }
  const kids=RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const v=r3add(d.list.map(x=>x.v));
  let own=null;if(isArea()){try{const j=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+R3LEAF+'&period='+p);own=j.report&&j.report.data&&j.report.data.v||null}catch(e){}}
  const alloc=own||{};R3DATA.forEach(r=>{if(alloc[r]&&alloc[r].C!=null&&alloc[r].C!==''){v[r]=v[r]||{};v[r].C=r3n(alloc[r].C)}});
  S.r3={p,v,alloc:JSON.parse(JSON.stringify(alloc))};
  const miss=kids.filter(k=>!d.list.some(x=>x.office===k));
  const o=isArea()?myOffice():office('5038');
  const body=r3head(p,o)+r3table(v,{period:p,edit:S.r3edit&&isArea()?{cols:'C'}:null});
  out.outerHTML=`<div id="r3out" class="card bn"><div class="note ${miss.length?'n-warn':'n-ok'}" style="font-family:inherit"><b>${toBn(d.list.length)} / ${toBn(kids.length)}</b> branches submitted for ${fmtPeriod(p)}.${miss.length?' Not yet: '+miss.map(c=>esc(RCD3_SHORT[c]||c)).join(', '):''}</div>
  ${isArea()?`<div class="note n-info" style="font-family:inherit">Column ৩ (allocation) is the Area Office allocation for each programme; where none is set, the branches' total is shown. ${S.r3edit?'Type the allocation and click <b>Save allocation</b>.':''}</div>`:''}
  <div class="gscroll">${body}</div><div class="bar"><button class="pri" onclick="A.r3print()">Print</button><button onclick="r3csv('RCD-3_Accumulated_${p}.csv')">Download Excel</button>${isArea()?(S.r3edit?`<button class="pri" onclick="run(A.r3saveAlloc)">Save allocation</button><button onclick="S.r3edit=false;go({...S.view,after:null})">Cancel</button>`:`<button onclick="S.r3edit=true;go({...S.view,after:null})">Edit allocation</button>`):''}</div></div>`;
  S.r3doc=[r3head(p,o)+r3table(v,{period:p})];S.r3cap=null;S.r3land=false;
}
A.r3saveAlloc=async()=>{
  const r=S.r3;const v={};document.querySelectorAll('#r3out input[data-c="C"]').forEach(el=>{const n=toEn(el.value).trim();if(n!=='')(v[el.dataset.r]=v[el.dataset.r]||{}).C=n});
  await api('/report',{method:'PUT',body:{leaf:R3LEAF,period:r.p,data:{v,kind:'area-allocation'}}});
  S.r3edit=false;toast('Allocation saved.');go({...S.view,after:null});
};
A.r3print=()=>r3print(S.r3doc,S.r3cap,S.r3land);
async function r3s2(p){
  const out=$('#r3out');const d=await r3fetch(p,'all');
  const pv=S.view.r3pr||'sheet';
  const prods=pv==='sheet'?RCD3_BYPRODUCT:pv==='all'?R3DATA:[+pv];
  const codes=isBranch()?[S.user.office]:RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const by={};d.list.forEach(x=>by[x.office]=x.v);
  const o=isBranch()?myOffice():office('5038');
  const cols='CDEFGHIJK';
  const head2=r3head2(p,o);let body='';const tabs=[];
  for(const r of prods){
    const x=RCD3_ROWS.find(z=>z.r===r);const sl=toBn(String(toEn(x.sl)).padStart(2,'0'));
    const cap=`${sl}. ${x.label}`;
    let t=`<table class="gt r3t r3t2" data-cap="${esc(cap)}"><tr class="r3caprow"><th colspan="11">${esc(cap)}</th></tr><tr><th rowspan="3">ক্রমিক নং</th><th rowspan="3">শাখার নাম</th><th rowspan="3">চলতি অর্থ বছরে বরাদ্দ</th><th colspan="3">বিতরণকৃত ঋণ</th><th colspan="2">আদায়</th><th colspan="2">বর্তমান অনাদায়ী</th><th rowspan="3">মেয়াদোত্তীর্ণ ঋণের পরিমান</th></tr>
    <tr><th colspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত</th><th rowspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত আদায়</th><th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমান</th></tr><tr><th>সংখ্যা</th><th>পরিমান</th></tr>`;
    const tot={};
    codes.forEach((c,i)=>{const line=(by[c]&&by[c][r])||{};t+=`<tr${by[c]?'':' class="r3miss"'}><td class="gc0">${toBn(i+1)}</td><td class="glab">${esc(RCD3_SHORT[c]||officeName(c))}</td>${cols.split('').map(k=>{const n=line[k];if(n!=null&&n!=='')tot[k]=(tot[k]||0)+r3n(n);return`<td class="gn${R3CNT.has(k)?' cn':''}">${by[c]?r3f(n===undefined?'':n,k):''}</td>`}).join('')}</tr>`});
    t+=`<tr class="gsum"><td></td><td class="glab">মোট</td>${cols.split('').map(k=>`<td class="gn${R3CNT.has(k)?' cn':''}">${r3f(tot[k],k)}</td>`).join('')}</tr></table>`;
    body+=t;tabs.push(t);
  }
  const miss=codes.filter(c=>!by[c]);
  out.outerHTML=`<div id="r3out" class="card bn">${!isBranch()&&miss.length?`<div class="note n-warn" style="font-family:inherit">Not yet submitted (blank rows): ${miss.map(c=>esc(RCD3_SHORT[c]||c)).join(', ')}</div>`:''}<div class="gscroll">${head2+body}</div><div class="bar"><button class="pri" onclick="A.r3print()">Print</button><button onclick="r3csv('RCD-3_ProductWise_${p}.csv')">Download Excel</button></div></div>`;
  const pages=[];for(let i=0;i<tabs.length;i+=2)pages.push((i?'':head2)+tabs.slice(i,i+2).join('<div class="r3gap"></div>'));S.r3doc=pages;S.r3cap=1.1;S.r3land=false;
}

/* ---------- branch data entry ---------- */
async function r3grid(p){
  const kids=RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const m=await api('/reports?leaf='+R3LEAF+'&period='+p);const by={};m.reports.forEach(r=>by[r.office]=r);
  const n=kids.filter(k=>by[k]&&by[k].status==='SUBMITTED').length;
  let h=`<div class="note ${n===kids.length?'n-ok':'n-info'}"><b>${n} of ${kids.length}</b> branches have submitted RCD-3 for ${fmtPeriod(p)}. The statements are under <b>Statement-1</b> and <b>Statement-2</b>.</div><div class="gscroll"><table><tr><th>Code</th><th>Branch</th><th>Status</th><th>Last saved</th><th></th></tr>`;
  kids.forEach(c=>{const r=by[c];const st=r?r.status:'NONE';h+=`<tr><td>${c}</td><td class="bn">${esc(RCD3_SHORT[c]||officeName(c))}</td><td><span class="badge b-${st}">${STATUS_TXT[st]}</span>${r&&st==='RETURNED'&&r.note?`<div class="muted small">${esc(r.note)}</div>`:''}</td><td class="small">${r?fmtDT(r.updated):''}</td><td style="white-space:nowrap">${st==='SUBMITTED'?`<button class="sm" onclick="go({page:'leaf',leaf:'ln_rcd3s1',period:'${p}',r3of:'${c}'})">View</button> <button class="sm dan" onclick="A.returnPrompt('${c}','${R3LEAF}','${p}')">Return</button>`:''}</td></tr>`});
  $('#r3out').outerHTML=`<div id="r3out">${h}</table></div></div>`;
}
const r3fyStart=m=>{const [y,mm]=m.split('-').map(Number);return mm>=7?y:y-1};
// ক্রমপুঞ্জিভুত = previous month's cumulative + this year's figure added since then
function r3cum(r,row){
  const b=r.base;if(!b)return;const x=r.v[row]=r.v[row]||{},p=b.v[row]||{};
  [['F','E'],['H','G']].forEach(([cum,fy])=>{
    const has=p[cum]!=null&&p[cum]!==''||x[fy]!=null&&x[fy]!=='';
    if(!has){delete x[cum];return}
    const t=r3n(p[cum])+r3n(x[fy])-(b.same?r3n(p[fy]):0);x[cum]=String(+t.toFixed(4));
  });
  if(!Object.keys(x).length)delete r.v[row];
}
async function r3openOwn(p){
  const code=S.user.office;
  const [j,list]=await Promise.all([api('/report?office='+encodeURIComponent(code)+'&leaf='+R3LEAF+'&period='+p),api('/reports?leaf='+R3LEAF+'&office='+encodeURIComponent(code))]);
  const prev=list.reports.filter(x=>x.period<p).sort((a,b)=>b.period.localeCompare(a.period))[0];
  let base=null;
  if(prev){const pj=await api('/report?office='+encodeURIComponent(code)+'&leaf='+R3LEAF+'&period='+prev.period);
    if(pj.report&&pj.report.data&&pj.report.data.v)base={period:prev.period,v:pj.report.data.v,same:r3fyStart(prev.period)===r3fyStart(p)}}
  let r;
  if(j.report)r={leaf:R3LEAF,period:p,status:j.report.status,note:j.report.note,submitted:j.report.submitted,v:(j.report.data&&j.report.data.v)||{}};
  else{
    r={leaf:R3LEAF,period:p,status:'NEW',v:{}};
    if(base){
      // previous month's figures are filled in to help; in a new financial year this year's figures start empty
      const keep=base.same?R3E:'FHIJKLOP';
      Object.entries(base.v).forEach(([row,x])=>{const o={};keep.split('').forEach(c=>{if(x[c]!=null&&x[c]!=='')o[c]=x[c]});if(Object.keys(o).length)r.v[row]=o});
      toast('Figures of '+fmtPeriod(base.period)+' are filled in'+(base.same?'':' (new financial year: allocation and this year\'s figures start empty)')+'. Update them for '+fmtPeriod(p)+'.');
    }
  }
  r.base=base;
  if(base&&canEdit(r))R3DATA.forEach(row=>r3cum(r,row));
  S.r3cur=r;S.dirty=false;r3render();
}
function r3render(){
  const r=S.r3cur,ed=canEdit(r),o=myOffice();
  const body=r3head(r.period,o)+r3table(r.v,{period:r.period,wo:true,edit:ed?{all:true,lock:r.base?new Set(['F','H']):null}:null});
  $('#r3out').outerHTML=`<div id="r3out" class="card bn"><div style="font-family:var(--sans,inherit)"><span class="badge b-${r.status==='NEW'?'NONE':r.status}">${r.status==='NEW'?'New':STATUS_TXT[r.status]}</span> <span id="saveState" class="muted small"></span>
  ${r.status==='RETURNED'?`<div class="note n-warn"><b>Returned by Area Office:</b> ${esc(r.note)}</div>`:''}${r.status==='SUBMITTED'?`<div class="note n-ok">Submitted on ${fmtDT(r.submitted)}. Locked; the Area Office can return it if a correction is needed.</div>`:''}
  ${ed?`<div class="note n-info">Amounts in lakh Taka; সংখ্যা columns are numbers of loans. Sub-totals, grand total, শতকরা হার (শ্রেণীকৃত ঋণ ÷ বর্তমান অনাদায়ী × ১০০) and the ক্রমপুঞ্জিভুত columns (previous month's cumulative + this year's disbursement / recovery since then) are calculated automatically. Bangla or English digits are both accepted.</div>`:''}</div>
  <div class="gscroll" id="r3body">${body}</div><div class="bar">${ed?`<button onclick="run(A.r3save)">Save</button><button class="pri" onclick="run(A.r3submit)">Save and submit to Area Office</button>`:''}<button onclick="A.r3printOwn()">Print</button><button onclick="r3csv('RCD-3_${S.user.office}_${r.period}.csv')">Download Excel</button></div></div>`;
  if(ed){clearInterval(S.autoTimer);S.autoTimer=setInterval(()=>{if(S.dirty)run(()=>A.r3save(true))},60000)}
}
A.r3set=el=>{
  const v=numIn(el);
  if(S.r3cur&&canEdit(S.r3cur)){const x=S.r3cur.v[el.dataset.r]=S.r3cur.v[el.dataset.r]||{};if(v==='')delete x[el.dataset.c];else x[el.dataset.c]=v;if(S.r3cur.base)r3cum(S.r3cur,el.dataset.r);markDirty();r3recalc()}
};
function r3recalc(){
  // refresh only the calculated cells without rebuilding the inputs
  const t=$('#r3body table');if(!t)return;
  const fresh=document.createElement('div');fresh.innerHTML=r3table(S.r3cur.v,{period:S.r3cur.period,wo:true,edit:{all:true,lock:S.r3cur.base?new Set(['F','H']):null}});
  const a=[...t.rows],b=[...fresh.querySelector('table').rows];
  a.forEach((tr,i)=>{[...tr.cells].forEach((td,j)=>{if(!td.querySelector('input')&&b[i]&&b[i].cells[j]&&td.classList.contains('gn'))td.textContent=b[i].cells[j].textContent})});
}
A.r3save=async quiet=>{
  const r=S.r3cur;if(!r||!canEdit(r))return;
  await api('/report',{method:'PUT',body:{leaf:R3LEAF,period:r.period,data:{v:r.v}}});
  if(r.status==='NEW')r.status='DRAFT';S.dirty=false;
  const s=$('#saveState');if(s)s.textContent='Saved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  if(quiet!==true)toast('Saved.');
};
A.r3submit=async()=>{
  const r=S.r3cur;
  const bad=[];Object.entries(r.v).forEach(([row,x])=>Object.entries(x).forEach(([c,val])=>{const n=parseFloat(val);if(isNaN(n)||n<0)bad.push(row)}));
  if(bad.length)throw new Error('Some figures are not valid numbers. Please check and correct them.');
  if(!Object.keys(r.v).length)throw new Error('Enter the figures first.');
  if(!confirm('Submit RCD-3 for '+fmtPeriod(r.period)+' to the Area Office? After submitting you cannot change it unless the Area Office returns it.'))return;
  await A.r3save(true);await api('/report/submit',{method:'POST',body:{leaf:R3LEAF,period:r.period}});
  toast('Submitted.');S.dirty=false;r3openOwn(r.period);
};
A.r3printOwn=()=>{const r=S.r3cur,o=myOffice();r3print([r3head(r.period,o)+r3table(r.v,{period:r.period,wo:true})])};

/* ---------- one-time import of the September 2026 Excel figures (admin) ---------- */
A.r3import=async()=>{
  const sd=RCD3_SEED,items=[];
  Object.entries(sd.branches).forEach(([code,v])=>items.push({office:code,leaf:R3LEAF,period:sd.period,status:'SUBMITTED',data:{v}}));
  Object.entries(sd.area).forEach(([code,v])=>items.push({office:code,leaf:R3LEAF,period:sd.period,status:'DRAFT',data:{v,kind:'area-allocation'}}));
  if(!confirm('Import RCD-3 for September 2026 from the Excel workbook ('+Object.keys(sd.branches).length+' branches, as submitted, plus the Area Office allocation)? Reports that already exist online are not changed.'))return;
  const j=await api('/admin/import',{method:'POST',body:{items}});
  toast('Imported '+j.added+' report(s); '+j.skipped+' already existed and were kept.');
};
