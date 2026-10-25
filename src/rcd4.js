/* ================= RCD-4 (Retail Customer Department-4 loans) ================= */
/* The same pages serve RCD-4 and RCD-4 Consumer Financing; K is the active report's layout. */
const R4K={name:'RCD-4',tpl:'rcd4',leaf:'ln_rcd4',file:'RCD-4',rows:RCD4_ROWS,nf:RCD4_NF,byp:RCD4_BYP,seed:RCD4_SEED,
  E:'CDEFGHIJKLMNPQRS',CNT:new Set(['D','J','M','Q']),wo:'QRS',woH1:'<th colspan="3">অবলোপনকৃত ঋণ</th>',woH2:'<th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমান</th><th rowspan="2">আদায়</th>',
  keep:'FGIJKLMNQR',nfQR:['R','S'],nfKa:'ক',nfFile:'Format-Ka',nfTitle:'রিটেইল কাস্টমার ডিপার্টমেন্ট-৪ এর একীভূত ঋণের মাসিক বিবরণী',nfGrand:'সর্বমোট ঋণ = (ক+খ)',
  cH:p=>r4fy(p)+' অর্থ বছরে বরাদ্দ',nfCH:p=>r4fy(p)+' অর্থ বছরে বরাদ্দ',
  t2:p=>`বিষয়ঃ-রিটেইল কাস্টমার-৪ সংশ্লিষ্ট ঋণের ${gctx(p).asOn} ভিত্তিক মাসিক বিবরণী।`,
  t3:p=>`বিষয়ঃ-রিটেইল কাস্টমার-৪ সংশ্লিষ্ট ঋণের ${gctx(p).asOn} তারিখের প্রোডাক্ট ভিত্তিক মাসিক বিবরণী।`,
  s3cols:'DEFHIJKLN',s3tail:'<th rowspan="3">মেয়াদোত্তীর্ণ ঋণের পরিমান</th><th rowspan="3">শ্রেণীকৃত ঋণের পরিমান</th>'};
const R4CF={...R4K,name:'RCD-4 Consumer Financing',tpl:'rcd4cf',leaf:'ln_rcd4cf',file:'RCD-4_CF',rows:RCD4CF_ROWS,nf:RCD4CF_NF,byp:RCD4CF_BYP,seed:RCD4CF_SEED,
  E:'CDEFGHIJKLMNPQR',CNT:new Set(['D','J','M']),wo:'QR',woH1:'<th colspan="2">অবলোপনকৃত ঋণ</th>',woH2:'<th rowspan="2">মোট পরিমান</th><th rowspan="2">চলতি অর্থ বছরে আদায়</th>',
  keep:'FGIJKLMNQ',nfQR:['Q','R'],nfKa:'খ',nfFile:'Format-Kha',nfTitle:'রিটেইল কাস্টমার ডিপার্টমেন্ট-৪ এর কনজুমার্স ফাইন্যান্সিং এর মাসিক বিবরণী',nfGrand:'সর্বমোট =',
  cH:p=>toBn(p.slice(0,4))+' সালের বাজেট',nfCH:p=>toBn(p.slice(0,4))+' সালের জন্য বরাদ্দ',
  t2:p=>`বিষয়ঃ-রিটেইল কাস্টমার ডিপার্টমেন্ট-৪ সংশ্লিষ্ট কনজুমার্স ফাইন্যান্সিং এর আওতায় চাকুরিজীবী ঋণ, কনজুমার্স ক্রেডিট, ডক্টরস লোন ও সাইবার ক্যাফে ঋণ কর্মসূচীর আওতায় বিতরণকৃত ঋণের তথ্য সম্বলিত ${gctx(p).asOn} ইং মাসের বিবরণী।`,
  t3:p=>`বিষয়ঃ রিটেইল কাস্টমার ডিপার্টমেন্ট-৪ এর কনজুমার্স ফাইন্যান্সিং এর ${gctx(p).asOn} তারিখের প্রোডাক্ট ভিত্তিক মাসিক বিবরণী।`,
  s3cols:'DEFHIJKL',s3tail:'<th rowspan="3">মেয়াদোত্তীর্ণ ঋণের পরিমান</th>'};
let K=R4K;
const r4data=()=>K.rows.map(x=>x.r);
const r4f=(v,c)=>{if(v===null||v===undefined||v===''||!isFinite(v))return'';const n=+v;if(Math.abs(n)<0.005)return'';return toBn(K.CNT.has(c)?String(Math.round(n)):n.toFixed(2))};
const r4fy=p=>{const [y,m]=p.split('-').map(Number);const a=m>=7?y:y-1;return toBn(a+'-'+(a+1))};
const r4has=x=>x!==undefined&&x!==null&&x!==''&&!isNaN(parseFloat(x));
function r4sum(v,rows,cols){const o={};(cols||K.E).split('').forEach(c=>{let any=false,t=0;rows.forEach(r=>{const x=v[r]&&v[r][c];if(r4has(x)){any=true;t+=parseFloat(x)}});o[c]=any?t:undefined});o.O=o.K&&o.N!==undefined?o.N/o.K*100:null;return o}
function r4line(v,r){const x=v[r]||{};const o={...x};o.O=r3n(x.K)&&r4has(x.N)?r3n(x.N)/r3n(x.K)*100:null;return o}
function r4add(list){const v={};list.forEach(d=>r4data().forEach(r=>{const x=d&&d[r];if(!x)return;K.E.split('').forEach(c=>{const n=parseFloat(x[c]);if(!isNaN(n)){v[r]=v[r]||{};v[r][c]=+((v[r][c]||0)+n).toFixed(4)}})}));return v}
function r4cell(c,val,r,ed){
  const al=K.CNT.has(c)?' cn':'';const lock=ed&&ed.lock&&ed.lock.has(c);
  if(r&&ed&&(ed.all&&c!=='O'&&!lock||ed.cols&&ed.cols.includes(c)))return`<td class="gn${al}"><input class="gi${al}" type="text" inputmode="decimal" data-num="1" data-r="${r}" data-c="${c}" value="${esc(toBn(val??''))}" oninput="A.r4set(this)"></td>`;
  if(c==='O')return`<td class="gn gc">${val===null||val===undefined?'':toBn(val.toFixed(2))}</td>`;
  return`<td class="gn${al}${r&&!lock?'':' gc'}">${r4f(val,c)}</td>`;
}
const r4cg=(n,lab)=>`<colgroup><col style="width:3%"><col style="width:${lab}%">${`<col style="width:${((97-lab)/n).toFixed(2)}%">`.repeat(n)}</colgroup>`;
const r4nums=n=>`<tr class="r3no">${Array.from({length:n},(_,i)=>`<td>${toBn(i+1)}</td>`).join('')}</tr>`;

/* ---------- sheet 2 / branch sheet: accumulated statement ---------- */
function r4table(v,opt){
  const cols='CDEFGHIJKLMNOP'+(opt.wo?K.wo:''),ed=opt.edit||null;
  let h=`<table class="gt r3t r4t">${ed&&ed.all?'':r4cg(cols.length,22)}<tr><th rowspan="3">ক্রমিক নং</th><th rowspan="3">ঋণ কর্মসূচীর নাম</th><th rowspan="3" class="r3th3">${K.cH(opt.period)}</th><th colspan="3">বিতরণকৃত ঋণ</th><th rowspan="3">আদায়যোগ্য ঋণ</th><th colspan="2">আদায়</th><th colspan="2">বর্তমান অনাদায়ী</th><th rowspan="3">মেয়াদোত্তীর্ণ ঋণের পরিমান</th><th colspan="3">শ্রেণীকৃত ঋণ</th><th rowspan="3">শ্রেণীকৃত ঋণ হতে চলতি বছরে আদায়</th>${opt.wo?K.woH1:''}</tr>
  <tr><th colspan="2">চলতি অর্থবছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত বিতরণ</th><th rowspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত আদায়</th><th rowspan="2">ঋণ গ্রহীতার সংখ্যা</th><th rowspan="2">ঋণের পরিমান</th><th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমান</th><th rowspan="2">শতকরা হার</th>${opt.wo?K.woH2:''}</tr>
  <tr><th>সংখ্যা</th><th>পরিমান</th></tr>${r4nums(cols.length+2)}`;
  K.rows.forEach(x=>{const o=r4line(v,x.r);h+=`<tr><td class="gc0">${esc(x.sl)}</td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>r4cell(c,o[c],x.r,ed)).join('')}</tr>`});
  const t=r4sum(v,r4data());h+=`<tr class="gsum r3grand"><td></td><td class="glab">মোটঃ-</td>${cols.split('').map(c=>r4cell(c,t[c])).join('')}</tr>`;
  return h+'</table>';
}
function r4head2(p,o){return r3bank(o)+`<div class="r3title r4sp">${K.t2(p)}</div><div class="r3unit">(লক্ষ টাকায়)</div>`}

/* ---------- sheet 1: Head Office format (ছক-ক) ---------- */
function r4nfhead(p,o){
  const [y,m]=p.split('-').map(Number);
  return`<div class="r3hd"><div class="r3c"><img src="${LOGO}" alt=""><div class="b">জনতা ব্যাংক পিএলসি.</div></div></div><div class="r3title">${K.nfTitle}</div>
  <div class="r4nfl"><div>রিপোর্টিং মাস : ${MBN[m-1]}, ${toBn(y)} &nbsp;&nbsp;&nbsp; এরিয়ার নাম : সিরাজগঞ্জ${o&&o.level==='BR'?' &nbsp;&nbsp; শাখা : '+esc((o.nameBn||o.name).split(',')[0]):''}</div><div class="r4nfr">ছক-“${K.nfKa}”<br>(লক্ষ টাকায়)</div></div>`;
}
function r4nftable(v,nfc,opt){
  const cols='CDEFGHIJKLMNOPQR';const ed=opt.edit;
  const lineOf=x=>{const s=x.acc?r4line(v,x.acc):{};const o={};'DEFGHIJKLMNP'.split('').forEach(c=>o[c]=s[c]);o.O=s.O;o.Q=s[K.nfQR[0]];o.R=s[K.nfQR[1]];o.C=nfc[x.n]!==undefined?nfc[x.n]:(x.acc?s.C:undefined);return o};
  let h=`<table class="gt r3t r4t">${r4cg(16,19)}<tr><th rowspan="3">ক্রঃ নং</th><th rowspan="3">ঋণ কর্মসূচীর নাম</th><th rowspan="3" class="r3th3">${K.nfCH(opt.period)}</th><th colspan="3">বিতরণকৃত ঋণ</th><th rowspan="3">মোট আদায়যোগ্য ঋণ</th><th colspan="2">আদায়</th><th colspan="2">বর্তমান মোট অনাদায়ী</th><th rowspan="3">মোট মেয়াদোত্তীর্ণ ঋণের পরিমাণ</th><th colspan="3">মোট শ্রেণীকৃত ঋণ</th><th rowspan="3">শ্রেণীকৃত ঋণ হতে চলতি অর্থ বছরে আদায়</th><th rowspan="3">মোট অবলোপনকৃত ঋণের পরিমাণ</th><th rowspan="3">অবলোপনকৃত ঋণ হতে চলতি অর্থ বছরে আদায়</th></tr>
  <tr><th colspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভূত</th><th rowspan="2">চলতি অর্থ বছরে মোট আদায়</th><th rowspan="2">ক্রমপুঞ্জিভূত</th><th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমাণ (অবলোপনকৃত ঋণসহ)</th><th rowspan="2">সংখ্যা</th><th rowspan="2">পরিমাণ</th><th rowspan="2">শতকরা হার</th></tr>
  <tr><th>সংখ্যা</th><th>পরিমাণ</th></tr>${r4nums(18)}`;
  const grp=[];let cur=[],all=[];
  const cnt=c=>c==='M'||c==='J'||c==='D';
  const tot=list=>{const o={};cols.split('').forEach(c=>{let any=false,t=0;list.forEach(l=>{if(r4has(l[c])){any=true;t+=parseFloat(l[c])}});o[c]=any?t:undefined});o.O=o.K&&o.N!==undefined?o.N/o.K*100:null;return o};
  const td=(c,val,n)=>{
    if(n&&ed&&c==='C')return`<td class="gn"><input class="gi" type="text" inputmode="decimal" data-num="1" data-n="${n}" value="${esc(toBn(val??''))}" oninput="A.r4nfset(this)"></td>`;
    if(c==='O')return`<td class="gn gc">${val===null||val===undefined?'':toBn(val.toFixed(2))}</td>`;
    return`<td class="gn${cnt(c)?' cn':''}${n?'':' gc'}">${r4f(val,cnt(c)?'D':'C')}</td>`;
  };
  K.nf.forEach(x=>{
    if(x.t==='sub'){const o=tot(cur);all.push(...cur);cur=[];h+=`<tr class="gsum"><td class="gc0">${esc(x.sl)}</td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>td(c,o[c])).join('')}</tr>`;return}
    const o=lineOf(x);cur.push(o);h+=`<tr><td class="gc0">${esc(x.sl)}</td><td class="glab">${esc(x.label)}</td>${cols.split('').map(c=>td(c,o[c],x.n)).join('')}</tr>`;
  });
  all.push(...cur);const g=tot(all);h+=`<tr class="gsum r3grand"><td colspan="2" class="glab">${K.nfGrand}</td>${cols.split('').map(c=>td(c,g[c])).join('')}</tr>`;
  return h+'</table>';
}

/* ---------- pages ---------- */
function pageRcd4(l){
  K=l.tpl.startsWith('rcd4cf')?R4CF:R4K;const tp=l.tpl.replace(K.tpl,'rcd4');
  const p=S.view.period||prevMonth();
  const head=`<div class="muted small">${esc(l.pillar)} / Agricultural and rural credit / ${K.name}</div><h2>${esc(l.name)}</h2>`;
  const month=`<div style="max-width:200px"><label>Month</label><input type="month" id="r3p" value="${p}" onchange="go({...S.view,period:this.value,after:null})"></div>`;
  if(tp==='rcd4'){
    if(isBranch()){S.view.after=()=>r4openOwn(p);return head+`<div class="card"><div class="row">${month}</div></div><div id="r3out" class="muted" style="margin-top:12px">Loading...</div>`}
    S.view.after=()=>r4grid(p);return head+`<div class="card"><div class="row">${month}</div><div id="r3out" class="muted" style="margin-top:12px">Loading branch status...</div></div>`;
  }
  const kids=isBranch()?[]:RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const of=S.view.r4of||(isBranch()?S.user.office:'all');
  const sel=isBranch()||tp==='rcd4s3'?'':`<div style="flex:2"><label>Office</label><select onchange="go({...S.view,r4of:this.value,after:null})"><option value="all" ${of==='all'?'selected':''}>All branches (consolidated)</option>${kids.map(c=>`<option value="${c}" ${of===c?'selected':''}>${c} - ${esc(RCD3_SHORT[c]||officeName(c))}</option>`).join('')}</select></div>`;
  S.view.after=()=>tp==='rcd4s1'?r4s1(p,of):tp==='rcd4s2'?r4s2(p,of):r4s3(p);
  return head+`<div class="card"><div class="row">${month}${sel}</div></div><div id="r3out" class="card muted" style="margin-top:12px">Loading...</div>`;
}
async function r4fetch(p,of){
  if(isBranch()||(of&&of!=='all')){
    const code=isBranch()?S.user.office:of;
    const j=await api('/report?office='+encodeURIComponent(code)+'&leaf='+K.leaf+'&period='+p);
    const d=j.report&&j.report.data;return{list:d?[{office:code,v:d.v||{}}]:[],single:code};
  }
  const c=await api('/collect?leaf='+K.leaf+'&period='+p);
  return{list:c.reports.filter(x=>office(x.office)&&office(x.office).level==='BR').map(x=>({office:x.office,v:(x.data&&x.data.v)||{}}))};
}
async function r4own(p){if(!isArea())return null;try{const j=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+K.leaf+'&period='+p);return j.report&&j.report.data||null}catch(e){return null}}
function r4note(d,kids){const miss=kids.filter(k=>!d.list.some(x=>x.office===k));return`<div class="note ${miss.length?'n-warn':'n-ok'}" style="font-family:inherit"><b>${toBn(d.list.length)} / ${toBn(kids.length)}</b> branches submitted.${miss.length?' Not yet: '+miss.map(c=>esc(RCD3_SHORT[c]||c)).join(', '):''}</div>`}
const r4btns=(file,edit)=>`<div class="bar"><button class="pri" onclick="A.r3print()">Print</button><button onclick="r3csv('${file}')">Download Excel</button>${isArea()&&edit?(S.r4edit===edit?`<button class="pri" onclick="run(()=>A.r4saveAlloc('${edit}'))">Save allocation</button><button onclick="S.r4edit=null;go({...S.view,after:null})">Cancel</button>`:`<button onclick="S.r4edit='${edit}';go({...S.view,after:null})">Edit allocation</button>`):''}</div>`;
async function r4s2(p,of){
  const out=$('#r3out');const d=await r4fetch(p,of);
  if(d.single){const o=office(d.single);
    if(!d.list.length){out.outerHTML=`<div id="r3out" class="card">No ${K.name} data for ${fmtPeriod(p)} yet.</div>`;return}
    const body=r4head2(p,o)+r4table(d.list[0].v,{period:p,wo:true});
    out.outerHTML=`<div id="r3out" class="card bn"><div class="gscroll">${body}</div>${r4btns(K.file+'_'+d.single+'_'+p+'.csv')}</div>`;S.r3doc=[body];S.r3cap=null;S.r3land=true;return}
  const kids=RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const v=r4add(d.list.map(x=>x.v));const own=await r4own(p);const al=(own&&own.v)||{};
  if(own&&own.v)r4data().forEach(r=>{if(v[r])delete v[r].C;if(al[r]&&r4has(al[r].C)){v[r]=v[r]||{};v[r].C=r3n(al[r].C)}});
  S.r4={p,own:own||{}};
  const o=isArea()?myOffice():office('5038');
  const body=r4head2(p,o)+r4table(v,{period:p,edit:S.r4edit==='acc'&&isArea()?{cols:'C'}:null});
  out.outerHTML=`<div id="r3out" class="card bn">${r4note(d,kids)}<div class="gscroll">${body}</div>${r4btns(K.file+'_Accumulated_'+p+'.csv','acc')}</div>`;
  S.r3doc=[r4head2(p,o)+r4table(v,{period:p})];S.r3cap=null;S.r3land=true;
}
async function r4s1(p,of){
  const out=$('#r3out');const d=await r4fetch(p,of);
  const kids=RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  let v,nfc={},o;
  if(d.single){o=office(d.single);if(!d.list.length){out.outerHTML=`<div id="r3out" class="card">No ${K.name} data for ${fmtPeriod(p)} yet.</div>`;return}v=d.list[0].v}
  else{v=r4add(d.list.map(x=>x.v));const own=await r4own(p);nfc=(own&&own.nf)||{};S.r4={p,own:own||{}};o=isArea()?myOffice():office('5038')}
  const body=r4nfhead(p,d.single?o:null)+r4nftable(v,nfc,{period:p,edit:!d.single&&S.r4edit==='nf'&&isArea()});
  out.outerHTML=`<div id="r3out" class="card bn">${d.single?'':r4note(d,kids)}<div class="gscroll">${body}</div>${r4btns(K.file+'_'+K.nfFile+'_'+p+'.csv',d.single?null:'nf')}</div>`;
  S.r3doc=[r4nfhead(p,d.single?o:null)+r4nftable(v,nfc,{period:p})];S.r3cap=null;S.r3land=true;
}
A.r4nfset=el=>{numIn(el)};
A.r4saveAlloc=async which=>{
  const r=S.r4;const own=JSON.parse(JSON.stringify(r.own||{}));
  if(which==='acc'){const v={};document.querySelectorAll('#r3out input[data-c="C"]').forEach(el=>{const n=toEn(el.value).trim();if(n!=='')(v[el.dataset.r]=v[el.dataset.r]||{}).C=n});own.v=v}
  else{const nf={};document.querySelectorAll('#r3out input[data-n]').forEach(el=>{const n=toEn(el.value).trim();if(n!=='')nf[el.dataset.n]=n});own.nf=nf}
  own.kind='area-allocation';
  await api('/report',{method:'PUT',body:{leaf:K.leaf,period:r.p,data:own}});
  S.r4edit=null;toast('Allocation saved.');go({...S.view,after:null});
};
async function r4s3(p){
  const out=$('#r3out');const d=await r4fetch(p,'all');
  const codes=isBranch()?[S.user.office]:RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const by={};d.list.forEach(x=>by[x.office]=x.v);
  const o=isBranch()?myOffice():office('5038');
  const cols=K.s3cols;
  const head=r3bank(o)+`<div class="r3title r4sp">${K.t3(p)}</div><div class="r3unit">(লক্ষ টাকায়)</div>`;
  const tabs=[];
  K.byp.forEach(pr=>{
    let t=`<table class="gt r3t r3t2 r4t" data-cap="${esc(pr.title)}">${r4cg(cols.length,18)}<tr class="r3caprow"><th colspan="${cols.length+2}">${esc(pr.title)}</th></tr><tr><th rowspan="3">ক্রমিক নং</th><th rowspan="3">শাখার নাম</th><th colspan="3">বিতরণকৃত ঋণ</th><th colspan="2">আদায়</th><th colspan="2">বর্তমান অনাদায়ী</th>${K.s3tail}</tr>
    <tr><th colspan="2">চলতি অর্থবছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত বিতরণ</th><th rowspan="2">চলতি অর্থ বছরে</th><th rowspan="2">ক্রমপুঞ্জিভুত আদায়</th><th rowspan="2">ঋণ গ্রহীতার সংখ্যা</th><th rowspan="2">ঋণের পরিমান</th></tr><tr><th>সংখ্যা</th><th>পরিমান</th></tr>`;
    const tot={};
    codes.forEach((c,i)=>{const line=(by[c]&&by[c][pr.r])||{};t+=`<tr${by[c]?'':' class="r3miss"'}><td class="gc0">${toBn(i+1)}</td><td class="glab">${esc(RCD3_SHORT[c]||officeName(c))}</td>${cols.split('').map(k=>{const n=line[k];if(r4has(n))tot[k]=(tot[k]||0)+r3n(n);return`<td class="gn${K.CNT.has(k)?' cn':''}">${by[c]?r4f(n,k):''}</td>`}).join('')}</tr>`});
    t+=`<tr class="gsum"><td></td><td class="glab">মোট</td>${cols.split('').map(k=>`<td class="gn${K.CNT.has(k)?' cn':''}">${r4f(tot[k],k)}</td>`).join('')}</tr></table>`;
    tabs.push(t);
  });
  const miss=codes.filter(c=>!by[c]);
  out.outerHTML=`<div id="r3out" class="card bn">${!isBranch()&&miss.length?`<div class="note n-warn" style="font-family:inherit">Not yet submitted (blank rows): ${miss.map(c=>esc(RCD3_SHORT[c]||c)).join(', ')}</div>`:''}<div class="gscroll">${head+tabs.join('<div class="r3gap"></div>')}</div><div class="bar"><button class="pri" onclick="A.r3print()">Print</button><button onclick="r3csv('${K.file}_ProductWise_${p}.csv')">Download Excel</button></div></div>`;
  const pages=[];for(let i=0;i<tabs.length;i+=2)pages.push((i?'':head)+tabs.slice(i,i+2).join('<div class="r3gap"></div>'));
  S.r3doc=pages;S.r3cap=1.1;S.r3land=false;
}

/* ---------- branch data entry ---------- */
async function r4grid(p){
  const kids=RCD3_ORDER.filter(c=>childBranches().some(k=>k.code===c));
  const m=await api('/reports?leaf='+K.leaf+'&period='+p);const by={};m.reports.forEach(r=>by[r.office]=r);
  const n=kids.filter(k=>by[k]&&by[k].status==='SUBMITTED').length;
  let h=`<div class="note ${n===kids.length?'n-ok':'n-info'}"><b>${n} of ${kids.length}</b> branches have submitted ${K.name} for ${fmtPeriod(p)}.</div><div class="gscroll"><table><tr><th>Code</th><th>Branch</th><th>Status</th><th>Last saved</th><th></th></tr>`;
  kids.forEach(c=>{const r=by[c];const st=r?r.status:'NONE';h+=`<tr><td>${c}</td><td class="bn">${esc(RCD3_SHORT[c]||officeName(c))}</td><td><span class="badge b-${st}">${STATUS_TXT[st]}</span>${r&&st==='RETURNED'&&r.note?`<div class="muted small">${esc(r.note)}</div>`:''}</td><td class="small">${r?fmtDT(r.updated):''}</td><td style="white-space:nowrap">${st==='SUBMITTED'?`<button class="sm" onclick="go({page:'leaf',leaf:'${K.leaf}s2',period:'${p}',r4of:'${c}'})">View</button> <button class="sm dan" onclick="A.returnPrompt('${c}','${K.leaf}','${p}')">Return</button>`:''}</td></tr>`});
  $('#r3out').outerHTML=`<div id="r3out">${h}</table></div></div>`;
}
function r4cum(r,row){
  const b=r.base;if(!b)return;const x=r.v[row]=r.v[row]||{},q=b.v[row]||{};
  [['F','E'],['I','H']].forEach(([cum,fy])=>{
    const has=r4has(q[cum])||r4has(x[fy]);
    if(!has){delete x[cum];return}
    x[cum]=String(+(r3n(q[cum])+r3n(x[fy])-(b.same?r3n(q[fy]):0)).toFixed(4));
  });
  if(!Object.keys(x).length)delete r.v[row];
}
async function r4openOwn(p){
  const code=S.user.office;
  const [j,list]=await Promise.all([api('/report?office='+encodeURIComponent(code)+'&leaf='+K.leaf+'&period='+p),api('/reports?leaf='+K.leaf+'&office='+encodeURIComponent(code))]);
  const prev=list.reports.filter(x=>x.period<p).sort((a,b)=>b.period.localeCompare(a.period))[0];
  let base=null;
  if(prev){const pj=await api('/report?office='+encodeURIComponent(code)+'&leaf='+K.leaf+'&period='+prev.period);
    if(pj.report&&pj.report.data&&pj.report.data.v)base={period:prev.period,v:pj.report.data.v,same:r3fyStart(prev.period)===r3fyStart(p)}}
  let r;
  if(j.report)r={period:p,status:j.report.status,note:j.report.note,submitted:j.report.submitted,v:(j.report.data&&j.report.data.v)||{}};
  else{
    r={period:p,status:'NEW',v:{}};
    if(base){const keep=base.same?K.E:K.keep;
      Object.entries(base.v).forEach(([row,x])=>{const o={};keep.split('').forEach(c=>{if(r4has(x[c]))o[c]=x[c]});if(Object.keys(o).length)r.v[row]=o});
      toast('Figures of '+fmtPeriod(base.period)+' are filled in'+(base.same?'':' (new financial year: allocation and this year\'s figures start empty)')+'. Update them for '+fmtPeriod(p)+'.')}
  }
  r.base=base;if(base&&canEdit(r))r4data().forEach(row=>r4cum(r,row));
  S.r4cur=r;S.dirty=false;r4render();
}
const r4lock=r=>r.base?new Set(['F','I']):null;
function r4render(){
  const r=S.r4cur,ed=canEdit(r),o=myOffice();
  const body=r4head2(r.period,o)+r4table(r.v,{period:r.period,wo:true,edit:ed?{all:true,lock:r4lock(r)}:null});
  $('#r3out').outerHTML=`<div id="r3out" class="card bn"><div style="font-family:var(--sans,inherit)"><span class="badge b-${r.status==='NEW'?'NONE':r.status}">${r.status==='NEW'?'New':STATUS_TXT[r.status]}</span> <span id="saveState" class="muted small"></span>
  ${r.status==='RETURNED'?`<div class="note n-warn"><b>Returned by Area Office:</b> ${esc(r.note)}</div>`:''}${r.status==='SUBMITTED'?`<div class="note n-ok">Submitted on ${fmtDT(r.submitted)}. Locked; the Area Office can return it if a correction is needed.</div>`:''}
  ${ed?`<div class="note n-info">Amounts in lakh Taka; সংখ্যা columns are numbers. The total row, শতকরা হার (শ্রেণীকৃত ঋণ ÷ ঋণের পরিমান × ১০০) and the ক্রমপুঞ্জিভুত columns (previous month's cumulative + this year's disbursement / recovery since then) are calculated automatically.</div>`:''}</div>
  <div class="gscroll" id="r3body">${body}</div><div class="bar">${ed?`<button onclick="run(A.r4save)">Save</button><button class="pri" onclick="run(A.r4submit)">Save and submit to Area Office</button>`:''}<button onclick="A.r4printOwn()">Print</button><button onclick="r3csv('${K.file}_${S.user.office}_${r.period}.csv')">Download Excel</button></div></div>`;
  if(ed){clearInterval(S.autoTimer);S.autoTimer=setInterval(()=>{if(S.dirty)run(()=>A.r4save(true))},60000)}
}
A.r4set=el=>{
  const v=numIn(el);const r=S.r4cur;
  if(r&&canEdit(r)){const x=r.v[el.dataset.r]=r.v[el.dataset.r]||{};if(v==='')delete x[el.dataset.c];else x[el.dataset.c]=v;if(r.base)r4cum(r,el.dataset.r);markDirty();
    const t=$('#r3body table');if(!t)return;const f=document.createElement('div');f.innerHTML=r4table(r.v,{period:r.period,wo:true,edit:{all:true,lock:r4lock(r)}});
    const a=[...t.rows],b=[...f.querySelector('table').rows];a.forEach((tr,i)=>[...tr.cells].forEach((td,j)=>{if(!td.querySelector('input')&&b[i]&&b[i].cells[j]&&td.classList.contains('gn'))td.textContent=b[i].cells[j].textContent}))}
};
A.r4save=async quiet=>{
  const r=S.r4cur;if(!r||!canEdit(r))return;
  await api('/report',{method:'PUT',body:{leaf:K.leaf,period:r.period,data:{v:r.v}}});
  if(r.status==='NEW')r.status='DRAFT';S.dirty=false;
  const s=$('#saveState');if(s)s.textContent='Saved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  if(quiet!==true)toast('Saved.');
};
A.r4submit=async()=>{
  const r=S.r4cur;let bad=false;Object.values(r.v).forEach(x=>Object.values(x).forEach(val=>{const n=parseFloat(val);if(isNaN(n)||n<0)bad=true}));
  if(bad)throw new Error('Some figures are not valid numbers. Please check and correct them.');
  if(!Object.keys(r.v).length)throw new Error('Enter the figures first.');
  if(!confirm('Submit '+K.name+' for '+fmtPeriod(r.period)+' to the Area Office? After submitting you cannot change it unless the Area Office returns it.'))return;
  await A.r4save(true);await api('/report/submit',{method:'POST',body:{leaf:K.leaf,period:r.period}});
  toast('Submitted.');S.dirty=false;r4openOwn(r.period);
};
A.r4printOwn=()=>{const r=S.r4cur,o=myOffice();r3print([r4head2(r.period,o)+r4table(r.v,{period:r.period,wo:true})],null,true)};
A.r4import=async cf=>{
  K=cf?R4CF:R4K;const sd=K.seed,items=[];
  Object.entries(sd.branches).forEach(([code,v])=>items.push({office:code,leaf:K.leaf,period:sd.period,status:'SUBMITTED',data:{v}}));
  Object.entries(sd.area).forEach(([code,a])=>items.push({office:code,leaf:K.leaf,period:sd.period,status:'DRAFT',data:{v:a.v,nf:a.nf,kind:'area-allocation'}}));
  if(!confirm('Import '+K.name+' for September 2026 from the Excel workbook ('+Object.keys(sd.branches).length+' branches, as submitted, plus the Area Office allocations)? Reports that already exist online are not changed.'))return;
  const j=await api('/admin/import',{method:'POST',body:{items}});
  toast('Imported '+j.added+' report(s); '+j.skipped+' already existed and were kept.');
};
