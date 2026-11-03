/* ================= Annexure-Ga (All): upload branch Excel files, filter, report ================= */
const GA={sel:'all',q:'',batches:[],pend:null};
function pageGaAll(l){
  S.view.after=gaLoad;
  const up=isArea()||isAdmin();
  return`<div class="pghead"><div class="hrow"><h2>Annexure-Ga (All)</h2><div class="hrow" id="gactl" style="flex:1 1 auto;justify-content:flex-end"></div></div></div>
  ${up?`<div class="card" style="margin-top:12px" id="gaup"></div>`:''}<div id="gabox" class="muted" style="margin-top:12px">Loading...</div>`;
}
function gaLoadLib(){
  if(window.XLSX)return Promise.resolve();
  return new Promise((ok,no)=>{const s=document.createElement('script');s.src='/vendor/xlsx.mini.min.js';s.onload=ok;s.onerror=()=>no(new Error('Could not load the Excel reader.'));document.head.appendChild(s)});
}
const gaDmy=d=>String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
const gaNum=v=>typeof v==='number'?v:(/^-?[\d,]+(\.\d+)?$/.test(String(v).trim())&&String(v).trim()!==''?parseFloat(String(v).replace(/,/g,'')):NaN);
async function gaLoad(){
  const j=await api('/ga/rows?office='+encodeURIComponent(GA.sel));
  GA.batches=j.batches;gaRender();gaUpUi();
}
function gaUpUi(){
  const el=$('#gaup');if(!el||GA.upOpen===undefined&&false)return;
  const kids=childBranches();
  const p=GA.pend;
  el.innerHTML=`<div class="hrow"><b style="flex:1">Upload Annexure-Ga (Excel)</b><button onclick="GA.upOpen=!GA.upOpen;gaUpUi()">${GA.upOpen?'Close':'Upload'}</button></div>
  ${GA.upOpen?`<div class="row" style="margin-top:10px;align-items:flex-end"><div style="flex:1 1 240px"><label>Branch *</label><select id="ga_of"><option value="">- select branch -</option>${isArea()?`<option value="${S.user.office}">Area Office (own)</option>`:''}${kids.map(k=>`<option value="${k.code}" ${p&&p.office===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select></div>
  <div style="flex:1 1 200px"><label>Label / period (optional)</label><input id="ga_lb" placeholder="e.g. September 2026" value="${esc(p?p.label:'')}"></div>
  <div style="flex:1 1 260px"><label>Excel file (.xlsx, .xls or .csv)</label><input type="file" id="ga_f" accept=".xlsx,.xls,.csv" onchange="run(()=>gaPick(this))" style="height:auto"></div></div>
  ${p?`<div style="margin-top:10px"><div class="row" style="align-items:flex-end"><div style="flex:0 0 140px"><label>Header row no.</label><input id="ga_hr" type="number" min="1" value="${p.hr+1}" onchange="run(gaHdr)"></div><div class="muted small" style="flex:1">${esc(p.fname)} - ${p.rows.length} data rows found. Check the columns below, then Save.</div></div>
  <div style="overflow:auto;margin-top:8px"><table><tr>${p.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${p.rows.slice(0,5).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>
  <div class="bar" style="margin-top:10px"><button class="pri" onclick="run(gaSave)">Save upload</button><button onclick="GA.pend=null;gaUpUi()">Cancel</button></div></div>`:''}`:''}`;
}
async function gaPick(inp){
  const f=inp.files[0];if(!f)return;
  await gaLoadLib();
  const buf=await f.arrayBuffer();
  const wb=XLSX.read(buf,{type:'array',cellDates:true});
  const ws=wb.Sheets[wb.SheetNames[0]];
  const aoa=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:'',blankrows:false}).map(r=>r.map(c=>c instanceof Date?gaDmy(c):c));
  if(!aoa.length)throw new Error('The file is empty.');
  let hr=0,best=0;aoa.slice(0,15).forEach((r,i)=>{const n=r.filter(c=>String(c).trim()!=='').length;if(n>best){best=n;hr=i}});
  GA.raw=aoa;GA.fname=f.name;GA.pendOf=$('#ga_of').value;GA.pendLb=$('#ga_lb').value;
  gaBuild(hr);
}
function gaBuild(hr){
  const aoa=GA.raw,w=Math.max(...aoa.slice(hr).map(r=>r.length));
  const head=(aoa[hr]||[]).concat(Array(Math.max(0,w-(aoa[hr]||[]).length)).fill('')).slice(0,w).map((h,i)=>String(h).trim()||('Column '+(i+1)));
  const rows=aoa.slice(hr+1).map(r=>head.map((h,i)=>r[i]===undefined?'':r[i])).filter(r=>r.some(c=>String(c).trim()!=='')&&!/^(total|grand total|মোট|সর্বমোট)/i.test(String(r.find(c=>String(c).trim()!=='')||'').trim()));
  GA.pend={office:GA.pendOf,label:GA.pendLb,fname:GA.fname,head,rows,hr};
  gaUpUi();
}
async function gaHdr(){const v=parseInt($('#ga_hr').value)||1;GA.pendOf=$('#ga_of').value;GA.pendLb=$('#ga_lb').value;gaBuild(Math.max(0,Math.min(v-1,GA.raw.length-1)))}
async function gaSave(){
  const p=GA.pend,of=$('#ga_of').value;if(!of)throw new Error('Select the branch for this file.');
  if(!p.rows.length)throw new Error('No data rows found. Check the header row number.');
  await api('/ga/upload',{method:'PUT',body:{office:of,label:$('#ga_lb').value,fname:p.fname,head:p.head,rows:p.rows}});
  toast('Uploaded '+p.rows.length+' rows.');GA.pend=null;GA.upOpen=false;await gaLoad();
}
A.gaDel=async id=>{if(!confirm('Remove this uploaded file and its rows?'))return;await api('/ga/delete',{method:'POST',body:{id}});toast('Removed.');await gaLoad()};
A.gaSet=(k,v)=>{GA[k]=v;if(k==='sel')run(gaLoad);else gaRender()};
function gaTable(){   // union of headers; Branch column first
  const cols=[];GA.batches.forEach(b=>b.head.forEach(h=>{if(!cols.includes(h))cols.push(h)}));
  const q=GA.q.trim().toLowerCase(),rows=[];
  GA.batches.slice().reverse().forEach(b=>b.rows.forEach(r=>{
    const obj=Object.fromEntries(b.head.map((h,i)=>[h,r[i]]));
    const line=[officeName(b.office),...cols.map(c=>obj[c]===undefined?'':obj[c])];
    if(!q||line.join(' ').toLowerCase().includes(q))rows.push(line)}));
  const head=['Branch',...cols];
  const tot=head.map((h,i)=>{if(i===0)return'';const vals=rows.map(r=>r[i]).filter(v=>String(v).trim()!=='');if(!vals.length||/নং|\bno\b|number|account|acct|হিসাব|ক্র|sl|serial|date|তারিখ/i.test(h))return'';const nn=vals.map(gaNum);return nn.every(x=>!isNaN(x))?nn.reduce((a,b)=>a+b,0):''});
  return{head,rows,tot};
}
const gaFmt=v=>typeof v==='number'?(Number.isInteger(v)?v.toLocaleString('en-IN'):v.toLocaleString('en-IN',{maximumFractionDigits:2})):v;
function gaRender(){
  const box=$('#gabox'),ctl=$('#gactl');if(!box)return;
  const kids=isBranch()?[]:childBranches();
  if(ctl)ctl.innerHTML=`${isBranch()?'':`<select onchange="A.gaSet('sel',this.value)"><option value="all" ${GA.sel==='all'?'selected':''}>All branches</option>${isArea()?`<option value="${S.user.office}" ${GA.sel===S.user.office?'selected':''}>Area Office (own)</option>`:''}${kids.map(k=>`<option value="${k.code}" ${GA.sel===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select>`}<input placeholder="Search..." value="${esc(GA.q)}" oninput="GA.q=this.value;clearTimeout(GA.t);GA.t=setTimeout(gaRender,250)" style="height:28px;padding:2px 7px;font-size:13px;width:150px"><div class="bar"><button class="pri" onclick="A.gaPrint()">Print</button><button onclick="run(A.gaXl)">Download Excel</button></div>`;
  const t=gaTable();
  const up=isArea()||isAdmin();
  box.outerHTML=`<div id="gabox"><div class="card" style="overflow:auto">${t.rows.length?`<div class="muted small" style="margin-bottom:6px">${t.rows.length} rows from ${GA.batches.length} uploaded file(s).</div><table><tr><th>SL</th>${t.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map((c,k)=>`<td${typeof c==='number'?' style="text-align:right"':''}>${esc(gaFmt(c))}</td>`).join('')}</tr>`).join('')}${t.tot.some(x=>x!=='')?`<tr style="font-weight:700;background:var(--bg)"><td></td>${t.tot.map((c,k)=>`<td style="text-align:right">${k===0?'Total':c===''?'':esc(gaFmt(c))}</td>`).join('')}</tr>`:''}</table>`:'No Annexure-Ga data'+(GA.q?' matches the search.':' uploaded yet.')}</div>
  ${GA.batches.length?`<h3 style="margin-top:16px">Uploaded files</h3><div class="card" style="overflow:auto"><table><tr><th>Branch</th><th>Label</th><th>File</th><th>Rows</th><th>Uploaded</th>${up?'<th></th>':''}</tr>${GA.batches.map(b=>`<tr><td>${esc(officeName(b.office))}</td><td>${esc(b.label)}</td><td>${esc(b.fname)}</td><td>${b.nrows}</td><td>${fmtDT(b.uploaded)}</td>${up?`<td><button class="dan" onclick="run(()=>A.gaDel('${b.id}'))">Remove</button></td>`:''}</tr>`).join('')}</table></div>`:''}</div>`;
}
A.gaXl=async()=>{
  await gaLoadLib();const t=gaTable();
  const ws=XLSX.utils.aoa_to_sheet([['SL',...t.head],...t.rows.map((r,i)=>[i+1,...r]),...(t.tot.some(x=>x!=='')?[['',...t.tot.map((c,k)=>k===0?'Total':c)]]:[])]);
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Annexure-Ga');
  XLSX.writeFile(wb,'Annexure-Ga_'+(GA.sel==='all'?'All':GA.sel)+'.xlsx');
};
A.gaPrint=()=>{
  const t=gaTable(),o=office(S.user.office);
  A.lfPrintHtml(`<div class="bn r3p lfpad"><div class="p-h"><img src="${LOGO}" alt=""><div class="tx"><div class="b">জনতা ব্যাংক পিএলসি.</div><div>${esc(o?(o.nameBn||o.name):'')}</div></div></div><div class="gtitle">পরিশিষ্ট-গ (Annexure-Ga) - ${GA.sel==='all'?'সকল শাখা':esc(officeName(GA.sel))}</div>
  <table class="r3t" style="width:100%;border-collapse:collapse;font-size:10px"><tr><th>SL</th>${t.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map(c=>`<td${typeof c==='number'?' style="text-align:right"':''}>${esc(gaFmt(c))}</td>`).join('')}</tr>`).join('')}${t.tot.some(x=>x!=='')?`<tr style="font-weight:700"><td></td>${t.tot.map((c,k)=>`<td style="text-align:right">${k===0?'Total':c===''?'':esc(gaFmt(c))}</td>`).join('')}</tr>`:''}</table>${lfSign('কর্মকর্তা',isArea()?'অফিস প্রধান':'ব্যবস্থাপক')}</div>`)};
