/* ================= Forwarding (AO): forwarding letter to Divisional Office from Annexure-Ga Excel ================= */
const FW={d:'',ref:{},pre:'',suf:'',sig:'',des:'',to:'',aoff:'',raw:null,hr:0,map:{},br:''};
const FW_F=[['br','শাখার নাম (Branch)',/শাখা|branch/i],['nm','গ্রাহকের নাম (Customer)',/গ্রাহক|ঋণগ্রহীতা|ঋণ গ্রহীতা|name|customer|borrower/i],['loan','ঋণের পরিমাণ (Loan)',/ঋণের|ঋণ\s*স্থিতি|loan|limit/i],['imp','আরোপিত সুদ (Imposed)',/^(?!.*অনারোপিত).*আরোপিত|imposed|charged/i],['gen','অনারোপিত সাধারণ সুদ',/সাধারণ|general|unapplied.*gen|normal/i],['pen','অনারোপিত দন্ড সুদ',/দন্ড|দণ্ড|penal/i],['tot','মোট (Total)',/^মোট|^total/i],['sus','ইন্টারেস্ট সাসপেন্স',/সাসপেন্স|suspense/i],['cib','যাচিত CIBTCA',/cibtca|যাচিত/i],['rem','মন্তব্য (Remarks)',/মন্তব্য|remark|status/i]];
const fwLS=(k,d)=>{try{return localStorage.getItem('jbrs_fw_'+k)||d}catch(e){return d}};
const fwSV=(k,v)=>{try{localStorage.setItem('jbrs_fw_'+k,v)}catch(e){}};
function fwInit(){
  if(FW.init)return;FW.init=1;
  FW.pre=fwLS('pre','এঃঅঃসিরাজ/এক্সিট পলিসি');FW.suf=fwLS('suf','এমএএইচ');FW.sig=fwLS('sig','আহমেদ তৈয়ব হাসান');FW.des=fwLS('des','উপ মহাব্যবস্থাপক');
  FW.to=fwLS('to','মহাব্যবস্থাপক\nজনতা ব্যাংক পিএলসি.\nবিভাগীয় কার্যালয়\nবগুড়া।');
  FW.sub=fwLS('sub','বাংলাদেশ ব্যাংকের বিআরপিডি-১ সার্কুলার লেটার নং ২৩ তারিখ: ২৯/০৬/২০২৬ ইং এবং অত্র ব্যাংকের নির্দেশ বিজ্ঞপ্তি নং ১৪১১/২৬ তারিখ: ০২/০৭/২০২৬ ইং এর আলোকে রিটেইল কাস্টমার ডিপার্টমেন্ট-৩ এর ০৮/০৭/২০২৬ ইং তারিখের পত্র সূত্র নং আরসিডি-৩/কৃ. ও প. ঋণ/ এককালীন এক্সিট/ ২০২৬/ ২৫৭-৪০৭ এর পরামর্শক্রমে বিশেষ এক্সিট সুবিধার আওতায় সুদ মওকুফ প্রস্তাব প্রেরণ প্রসঙ্গে।');
  const t=new Date();FW.d=String(t.getDate()).padStart(2,'0')+'/'+String(t.getMonth()+1).padStart(2,'0')+'/'+t.getFullYear();
}
function pageFwd(l){
  fwInit();
  return`<div class="pghead"><div class="hrow"><h2>Forwarding (AO)</h2><div class="hrow" id="fwctl" style="flex:1 1 auto;justify-content:flex-end"><div class="bar"><button class="pri" onclick="run(()=>A.fwDo('print'))">Print</button><button onclick="run(()=>A.fwDo('pdf'))">Download PDF</button></div></div></div></div>
  <div class="card" style="margin-top:12px"><div class="row" style="align-items:flex-end"><div style="flex:1 1 260px"><label>Annexure-Ga Excel (.xlsx, .xls or .csv) - for forwarding only, not saved</label><input type="file" id="fw_f" accept=".xlsx,.xls,.csv" onchange="run(()=>fwPick(this))" style="height:auto"></div>
  <div style="flex:0 0 140px"><label>Letter date (dd/mm/yyyy)</label><input id="fw_d" value="${esc(FW.d)}" maxlength="10" oninput="FW.d=this.value;fwDraw()"></div></div>
  <div id="fwmap"></div></div>
  <details class="card" style="margin-top:12px"><summary><b>Letter wording (saved on this computer)</b></summary><div class="row" style="margin-top:8px">
  <div style="flex:1 1 280px"><label>Reference prefix</label><input value="${esc(FW.pre)}" oninput="FW.pre=this.value;fwSV('pre',this.value);fwDraw()"></div>
  <div style="flex:0 0 140px"><label>Reference suffix</label><input value="${esc(FW.suf)}" oninput="FW.suf=this.value;fwSV('suf',this.value);fwDraw()"></div>
  <div style="flex:1 1 220px"><label>Signatory name</label><input value="${esc(FW.sig)}" oninput="FW.sig=this.value;fwSV('sig',this.value);fwDraw()"></div>
  <div style="flex:1 1 220px"><label>Designation</label><input value="${esc(FW.des)}" oninput="FW.des=this.value;fwSV('des',this.value);fwDraw()"></div></div>
  <div class="row"><div style="flex:1 1 220px"><label>Addressee (one line each)</label><textarea rows="4" oninput="FW.to=this.value;fwSV('to',this.value);fwDraw()">${esc(FW.to)}</textarea></div>
  <div style="flex:2 1 400px"><label>Subject (বিষয়)</label><textarea rows="4" oninput="FW.sub=this.value;fwSV('sub',this.value);fwDraw()">${esc(FW.sub)}</textarea></div></div></details>
  <div id="fwview" class="lfsc" style="margin-top:12px;overflow:auto"><p class="muted">Upload the Annexure-Ga Excel to prepare the letters. Each branch gets an original letter and an office copy, one full page each.</p></div>`;
}
async function fwPick(inp){
  const f=inp.files[0];if(!f)return;await gaLoadLib();
  const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});
  const aoa=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:'',raw:true}).map(r=>r.map(c=>c instanceof Date?gaDmy(c):c));
  FW.raw=aoa;let hr=0,best=0;aoa.slice(0,15).forEach((r,i)=>{const n=r.filter(c=>String(c).trim()!=='').length;if(n>best){best=n;hr=i}});
  FW.hr=hr;fwGuess();fwMapUi();fwDraw();
}
function fwGuess(){
  const h=(FW.raw[FW.hr]||[]).map(x=>String(x));FW.map={};const used=new Set();
  FW_F.forEach(([k,,re])=>{const i=h.findIndex((x,j)=>!used.has(j)&&re.test(x));if(i>=0){FW.map[k]=i;used.add(i)}else FW.map[k]=-1});
  if(FW.map.imp<0&&FW.map.gen>=0&&FW.map.pen>=0){}
}
function fwMapUi(){
  const h=FW.raw[FW.hr]||[];
  const opt=k=>`<option value="-1">- none -</option>${h.map((x,i)=>`<option value="${i}" ${FW.map[k]===i?'selected':''}>${i+1}. ${esc(String(x).slice(0,40)||'(blank)')}</option>`).join('')}`;
  $('#fwmap').innerHTML=`<div class="row" style="margin-top:10px;align-items:flex-end"><div style="flex:0 0 120px"><label>Header row no.</label><input type="number" min="1" value="${FW.hr+1}" onchange="FW.hr=Math.max(0,(+this.value||1)-1);fwGuess();fwMapUi();fwDraw()"></div>
  <div style="flex:1 1 220px"><label>Branch name (if the file has no branch column)</label><input value="${esc(FW.br)}" oninput="FW.br=this.value;fwDraw()"></div></div>
  <div class="muted small" style="margin:8px 0 4px">Match each letter column with a column of your Excel file (guessed automatically - please check):</div>
  <div class="row">${FW_F.map(([k,n])=>`<div style="flex:1 1 190px"><label>${n}</label><select onchange="FW.map['${k}']=+this.value;fwDraw()">${opt(k)}</select></div>`).join('')}</div>
  <div id="fwref"></div>`;
}
function fwData(){
  if(!FW.raw)return[];const M=FW.map,g=(r,k)=>M[k]>=0?r[M[k]]:'';const out=[];
  FW.raw.slice(FW.hr+1).forEach(r=>{
    if(r.every(c=>String(c).trim()===''))return;
    if(r.slice(0,3).some(c=>/^\s*(total|মোট)/i.test(String(c))))return;
    const nm=String(g(r,'nm')).trim();if(!nm)return;
    const n=k=>{const v=gaNum(g(r,k));return isNaN(v)?0:v};
    const o={br:String(g(r,'br')||FW.br).trim(),nm,loan:n('loan'),imp:n('imp'),gen:n('gen'),pen:n('pen'),sus:n('sus'),cib:n('cib'),rem:String(g(r,'rem')).trim()};
    o.tot=M.tot>=0&&!isNaN(gaNum(g(r,'tot')))?gaNum(g(r,'tot')):o.imp+o.gen+o.pen;out.push(o);
  });
  return out;
}
const fwN=v=>toBn((+v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
function fwPages(rows){
  const by={};rows.forEach(r=>{(by[r.br]=by[r.br]||[]).push(r)});
  const d=FW.d,yr=(d.split('/')[2]||'');let h='';
  Object.keys(by).forEach(br=>{
    const rs=by[br],n=rs.length,S_=['loan','imp','gen','pen','tot','sus','cib'].map(k=>rs.reduce((a,r)=>a+r[k],0));
    const cls=n<=12?'fw1':n<=20?'fw2':n<=30?'fw3':'fw4';
    const ref=`${FW.pre}/${br}/${toBn(yr)}/${toBn(FW.ref[br]||'')}/${FW.suf}`;
    for(const copy of [0,1]){
      h+=`<div class="lfpage fwpage ${cls}"><div class="fwin">
      <div class="fwh"><img src="${LOGO}" alt=""><div class="fwl"><div class="fwb">জনতা ব্যাংক পিএলসি.</div><div>প্রধান কার্যালয়: জনতা ভবন</div><div>১১০ মতিঝিল বা/এ, পোষ্ট বক্স নম্বর : ৪৬৮, ঢাকা-১০০০, বাংলাদেশ।</div><div>SWIFT: JANBBDDH, Website: www.jb.com.bd</div><div>পিএবিএক্স : 02-223380042</div></div>
      <div class="fwr"><div class="fwa">এরিয়া অফিস, সিরাজগঞ্জ।</div><div>এস.এস. রোড, সিরাজগঞ্জ, বাংলাদেশ।</div><div>ফোন : 02588831078, 02588831342</div><div>E-mail: jb5038@janatabank-bd.com</div></div></div>
      <div class="fwref"><span>সূত্রঃ ${esc(ref)}</span><span>তারিখঃ ${esc(toBn(d))} ইং</span></div>
      <div class="fwto">${esc(FW.to).replace(/\n/g,'<br>')}</div>
      <div class="fwsub"><b>বিষয়ঃ</b><span>${esc(FW.sub)}</span></div>
      <p>প্রিয় মহোদয়</p>
      <p class="j">শিরোনামে বর্ণিত সার্কুলারসমূহের নিদের্শনা অনুযায়ী অত্র এরিয়াধীন শাখাসমূহ হতে প্রাপ্ত সুদ মওকুফ প্রস্তাবসমূহ পর্যালোচনা ও যাচাই-বাছাই করতঃ অত্র এরিয়ার সুপারিশসহ নিম্নোক্ত ছক মোতাবেক আপনাদের সদয় অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের নিমিত্তে এতদসঙ্গে প্রেরণ করা হলো।</p>
      <table class="fwt"><tr><th rowspan="2" style="width:7mm">ক্রঃ নং</th><th rowspan="2">শাখার নাম</th><th rowspan="2">গ্রাহকের নাম</th><th rowspan="2">ঋণের পরিমাণ</th><th colspan="4">সুদ মওকুফের জন্য সুপারিশকৃত সুদের পরিমাণ</th><th rowspan="2">ইন্টারেস্ট সাসপেন্স</th><th rowspan="2">যাচিত CIBTCA এর পরিমাণ</th><th rowspan="2">মন্তব্য</th></tr>
      <tr><th>আরোপিত সুদ</th><th>অনারোপিত সাধারণ সুদ</th><th>অনারোপিত দন্ড সুদ</th><th>মোট</th></tr>
      ${rs.map((r,i)=>`<tr><td class="c">${toBn(i+1)}</td><td class="c">${esc(br)}</td><td>${esc(r.nm)}</td><td class="n">${fwN(r.loan)}</td><td class="n">${fwN(r.imp)}</td><td class="n">${fwN(r.gen)}</td><td class="n">${fwN(r.pen)}</td><td class="n">${fwN(r.tot)}</td><td class="n">${fwN(r.sus)}</td><td class="n">${fwN(r.cib)}</td><td class="c">${esc(r.rem)}</td></tr>`).join('')}
      <tr class="tt"><td colspan="3" class="c">মোট</td>${S_.map(v=>`<td class="n">${fwN(v)}</td>`).join('')}<td></td></tr></table>
      <p class="j" style="margin-top:6px">বর্ণিত ${toBn(n)} টি ঋণ প্রস্তাব এক্সিট পলিসির আওতায় নিস্পত্তির প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য সুপারিশসহ অনুরোধ জানানো হলো।</p>
      <div class="fwsg"><div>আপনার বিশ্বস্ত</div>${copy?'<div style="margin-top:10px">স্বাঃ/-</div><div>':'<div style="margin-top:44px">'}(${esc(FW.sig)})</div><div>${esc(FW.des)}</div></div>
      ${copy?`<div class="fwan"><div>অনুলিপিঃ</div><div>১। ব্যবস্থাপক, জনতা ব্যাংক পিএলসি., ${esc(br)} শাখা, সিরাজগঞ্জ।</div><div>২। অফিস কপি।</div><div style="margin-top:36px">${esc(FW.des)}</div></div>`:''}
      </div></div>`;
    }
  });
  return h;
}
function fwDraw(){
  if(!FW.raw)return;const rows=fwData(),brs=[...new Set(rows.map(r=>r.br))];
  const rf=$('#fwref');
  if(rf&&rf.dataset.k!==brs.join('|')){rf.dataset.k=brs.join('|');rf.innerHTML=`<div class="muted small" style="margin:10px 0 4px">Reference number (only the number) for each branch:</div><div class="row">${brs.map(b=>`<div style="flex:1 1 200px"><label>${esc(b||'(no branch name)')} - ${rows.filter(r=>r.br===b).length} loan(s)</label><input value="${esc(FW.ref[b]||'')}" oninput="FW.ref[${esc(JSON.stringify(b)).replace(/"/g,'&quot;')}]=this.value;fwDraw()" placeholder="e.g. 1759"></div>`).join('')}</div>`}
  const v=$('#fwview');if(v)v.innerHTML=rows.length?fwPages(rows):'<p class="muted">No loan rows found. Check the header row number and the column matching above.</p>';
}
A.fwDo=async w=>{
  const rows=fwData();if(!rows.length)return toast('Upload the Annexure-Ga Excel first.');
  const html=fwPages(rows);
  if(w==='print')return A.lfPrintHtml(html);
  toast('Preparing PDF...');await lfLoadPdf();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const host=document.createElement('div');host.className='lfpdfhost';host.innerHTML=html;document.body.appendChild(host);
  try{const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
    const pgs=[...host.querySelectorAll('.lfpage')];
    for(let i=0;i<pgs.length;i++){const c=await html2canvas(pgs[i],{scale:2.2,backgroundColor:'#ffffff',logging:false});if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297,undefined,'FAST')}
    pdf.save('JBRS_Forwarding_AO.pdf');
  }finally{host.remove()}
};
