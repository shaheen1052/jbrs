/* ================= Forwarding (AO): forwarding letter to Divisional Office from Annexure-Ga Excel ================= */
const FW={rep:'letter',show:false,files:[],comb:true,code:'',fname:'',nn:'',nd:'',fs:{},rem:'',d:'',ref:{},pre:'',suf:'',sig:'',des:'',to:'',aoff:'',raw:null,hr:0,map:{},br:''};
const FW_F=[['br','শাখার নাম (Branch)',/শাখা|branch/i],['nm','গ্রাহকের নাম (Customer)',/গ্রাহক|ঋণগ্রহীতা|ঋণ গ্রহীতা|name|customer|borrower/i],['loan','ঋণের পরিমাণ (Loan)',/ঋণের|ঋণ\s*স্থিতি|loan|limit/i],['imp','আরোপিত সুদ (Imposed)',/^(?!.*অনারোপিত).*আরোপিত|imposed|charged/i],['gen','অনারোপিত সাধারণ সুদ',/সাধারণ|general|unapplied.*gen|normal/i],['pen','অনারোপিত দন্ড সুদ',/দন্ড|দণ্ড|penal/i],['tot','মোট (Total)',/^মোট|^total/i],['sus','ইন্টারেস্ট সাসপেন্স',/সাসপেন্স|suspense/i],['cib','যাচিত CIBTCA',/cibtca|যাচিত/i],['rem','মন্তব্য (Remarks)',/মন্তব্য|remark|status/i]];

const FW_BJ={A:'অ',B:'ই',C:'ঈ',D:'উ',E:'ঊ',F:'ঋ',G:'এ',H:'ঐ',I:'ও',J:'ঔ',K:'ক',L:'খ',M:'গ',N:'ঘ',O:'ঙ',P:'চ',Q:'ছ',R:'জ',S:'ঝ',T:'ঞ',U:'ট',V:'ঠ',W:'ড',X:'ঢ',Y:'ণ',Z:'ত',_:'থ','`':'দ',a:'ধ',b:'ন',c:'প',d:'ফ',e:'ব',f:'ভ',g:'ম',h:'য',i:'র',j:'ল',k:'শ',l:'ষ',m:'স',n:'হ',o:'ড়',p:'ঢ়',q:'য়',r:'ৎ',s:'ং',t:'ঃ',u:'ঁ',v:'া',x:'ী',y:'ু',z:'ু','~':'ূ','„':'ৃ','Š':'ৗ','¨':'্য','ª':'্র','Ö':'্র','|':'।','ÿ':'ক্ষ','Ä':'ঞ্জ','Ÿ':'জ্ঞ','¯':'স্','®':'ষ্ণ','¤':'ন্','¦':'ব্','œ':'স্ত','Ñ':'ঙ্গ','Ý':'ন্দ','Ø':'্ব'};
const FW_PRE={'w':'ি','‡':'ে','†':'ে','‰':'ৈ'};
function fwBijoy(t){
  t=String(t).replace(/Av/g,'আ');let out='',pre='',i=0;const a=[...t];
  while(i<a.length){
    const c=a[i];
    if(FW_PRE[c]){pre+=FW_PRE[c];i++;continue}
    const m=c==='আ'?'আ':FW_BJ[c];
    if(m===undefined){out+=pre+c;pre='';i++;continue}
    if(pre&&/^[ক-হড়ঢ়য়ৎ]/.test(m)){
      let cl=m;i++;
      while(i<a.length&&FW_BJ[a[i]]&&/^্/.test(FW_BJ[a[i]])){cl+=FW_BJ[a[i]];i++}
      let sg=pre;if(pre==='ে'&&a[i]==='v'){sg='ো';i++}else if(pre==='ে'&&a[i]==='Š'){sg='ৌ';i++}
      out+=cl+sg;pre='';continue;
    }
    out+=pre+m;pre='';i++;
  }
  return out+pre;
}
const fwLS=(k,d)=>{try{return localStorage.getItem('jbrs_fw_'+k)||d}catch(e){return d}};
const fwSV=(k,v)=>{try{localStorage.setItem('jbrs_fw_'+k,v)}catch(e){}};
function fwInit(){
  if(FW.init)return;FW.init=1;
  FW.rem='বিএল';FW.pre=fwLS('pre','এঃঅঃসিরাজ/এক্সিট পলিসি');FW.suf=fwLS('suf','এমএএইচ');FW.sig=fwLS('sig','আহমেদ তৈয়ব হাসান');FW.des=fwLS('des','উপ মহাব্যবস্থাপক');
  FW.to=fwLS('to','মহাব্যবস্থাপক\nজনতা ব্যাংক পিএলসি.\nবিভাগীয় কার্যালয়\nবগুড়া।');
  FW.sub=fwLS('sub','বাংলাদেশ ব্যাংকের বিআরপিডি-১ সার্কুলার লেটার নং ২৩ তারিখ: ২৯/০৬/২০২৬ ইং এবং অত্র ব্যাংকের নির্দেশ বিজ্ঞপ্তি নং ১৪১১/২৬ তারিখ: ০২/০৭/২০২৬ ইং এর আলোকে রিটেইল কাস্টমার ডিপার্টমেন্ট-৩ এর ০৮/০৭/২০২৬ ইং তারিখের পত্র সূত্র নং আরসিডি-৩/কৃ. ও প. ঋণ/ এককালীন এক্সিট/ ২০২৬/ ২৫৭-৪০৭ এর পরামর্শক্রমে বিশেষ এক্সিট সুবিধার আওতায় সুদ মওকুফ প্রস্তাব প্রেরণ প্রসঙ্গে।');
  FW.fin=fwLS('fin','(আহমেদ তৈয়ব হাসান)|উপমহাব্যবস্থাপক');FW.prep=fwLS('prep','(মোঃ আলমগীর হোসেন)|এসপিও');FW.signs=fwLS('signs','(মোঃ শাহীন মাহমুদ)|পিও\n(মোঃ আলমগীর হোসেন)|এসপিও\n(নিবির কুমার আমিন)|এসপিও\nমোঃ জাফর ইকবাল|সহকারী মহাব্যবস্থাপক\n(আহমেদ তৈয়ব হাসান)|উপমহাব্যবস্থাপক');
  const t=new Date();FW.d=String(t.getDate()).padStart(2,'0')+'/'+String(t.getMonth()+1).padStart(2,'0')+'/'+t.getFullYear();FW.nd=FW.d;
}
function pageFwd(l){
  fwInit();
  const I=(lb,v,ev,ex='')=>`<div><label>${lb}</label><input value="${esc(v)}" oninput="${ev}" ${ex}></div>`;
  return`<div class="pghead"><div class="hrow"><h2>Forwarding (AO)</h2><div class="hrow" id="fwctl" style="flex:1 1 auto;justify-content:flex-end"><div class="bar"><select id="fwrep" onchange="FW.rep=this.value;FW.show=false;$('#fwview').innerHTML=''" style="height:32px"><option value="letter" ${FW.rep==='letter'?'selected':''}>Forwarding letter</option><option value="note" ${FW.rep==='note'?'selected':''}>Note Sheet</option><option value="gha" ${FW.rep==='gha'?'selected':''}>Annexure-Gha</option></select>
  <button onclick="run(()=>A.fwView())">View</button><button onclick="run(()=>A.fwGo('print'))">Print</button><button class="pri" onclick="run(()=>A.fwGo('pdf'))">Download</button></div></div></div></div>
  <div class="card fwform" style="margin-top:12px"><div class="g">
  <div style="grid-column:span 2"><label>Excel files (Ga)</label><input type="file" id="fw_f" accept=".xlsx,.xls,.csv" multiple onchange="run(()=>fwPick(this))" style="height:auto"></div>
  <div style="grid-column:span 2">${I('Letter Reference',FW.pre,"FW.pre=this.value;fwSV('pre',this.value);fwDraw()")}</div>
  ${I('Date',FW.d,"FW.d=this.value;fwDraw()",'id="fw_d" maxlength="10"')}${I('Meeting no.',FW.nn,"FW.nn=this.value;fwDraw()")}${I('Note date',FW.nd,"FW.nd=this.value;fwDraw()",'maxlength="10"')}
  <div id="fwref" style="display:contents"></div>
  <label class="chk" title="Ticked: files of different branches are put in ONE letter, ONE Note Sheet, ONE Gha. Unticked: a separate letter and Note Sheet for each branch."><input type="checkbox" ${FW.comb?'checked':''} onchange="FW.comb=this.checked;fwDraw()"> Combine all branches in one letter</label></div>
  <div id="fwmap"></div><div class="bar" style="margin-top:12px"><button class="pri" onclick="run(()=>A.fwSave())">Save</button></div></div>
  <details class="card" style="margin-top:12px"><summary><b>Wording</b> <span class="muted small">(saved on this computer)</span></summary><div class="g" style="margin-top:8px">
  ${I('Ref suffix',FW.suf,"FW.suf=this.value;fwSV('suf',this.value);fwDraw()")}
  ${I('Sign name',FW.sig,"FW.sig=this.value;fwSV('sig',this.value);fwDraw()")}${I('Post',FW.des,"FW.des=this.value;fwSV('des',this.value);fwDraw()")}
  <div style="grid-column:span 2">${I('Note: prepared by (name|post)',FW.prep,"FW.prep=this.value;fwSV('prep',this.value)")}</div><div style="grid-column:span 2">${I('Note: final approval (name|post)',FW.fin,"FW.fin=this.value;fwSV('fin',this.value)")}</div></div>
  <div class="g" style="margin-top:8px"><div style="grid-column:span 2"><label>Note: signers (name|post per line)</label><textarea rows="5" oninput="FW.signs=this.value;fwSV('signs',this.value)">${esc(FW.signs)}</textarea></div>
  <div><label>To</label><textarea rows="5" oninput="FW.to=this.value;fwSV('to',this.value);fwDraw()">${esc(FW.to)}</textarea></div>
  <div style="grid-column:span 2"><label>Subject</label><textarea rows="5" oninput="FW.sub=this.value;fwSV('sub',this.value);fwDraw()">${esc(FW.sub)}</textarea></div></div></details>
  <div id="fwview" class="lfsc" style="margin-top:12px;overflow:auto"><p class="muted">Upload the Annexure-Ga Excel file(s), choose the report above and press View.</p></div>`;
}
const fwGaRows=f=>{const out=[],n=v=>{v=gaNum(v);return isNaN(v)?0:v};
  for(const r of f.aoa.slice(f.start)){
    if(!/^\s*\d+\s*$/.test(String(r[0])))break;const nm=String(r[1]).trim();if(!nm)continue;
    const imp=n(r[14])-n(r[15]),gen=n(r[16]),pen=n(r[17]),wo=String(r[21]).trim();
    out.push({br:f.br,nm,loan:n(r[6]),imp,gen,pen,tot:imp+gen+pen,sus:n(r[18]),cib:n(r[19]),raw:r.slice(0,22),rem:wo&&!/^(না|নাই|no|n|-|0)$/i.test(wo)?'অবলোপন':FW.rem});
  }return out};
async function fwParse(f){
  const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});
  const sn=wb.SheetNames.find(n=>/customer|পরিশিষ্ট-গ|annexure/i.test(n)&&!/summ?ery/i.test(n))||wb.SheetNames[0];
  const aoa=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true}).map(r=>r.map(c=>c instanceof Date?gaDmy(c):c));
  const d=fwDetect(aoa);return{name:f.name,aoa,ga:d.ga,start:d.start,br:d.br,code:''};
}
async function fwPick(inp){
  const fl=[...inp.files];if(!fl.length)return;await gaLoadLib();FW.fs={};
  const P=[];for(const f of fl)P.push(await fwParse(f));inp.value='';
  if(P.every(x=>x.ga)){
    FW.ga=true;if(!FW.files.length)FW.ref={};
    P.forEach(x=>{const k=childBranches().find(o=>o.nameBn&&x.br&&String(o.nameBn).includes(x.br));if(k)x.code=k.code;FW.files.push(x)});
    FW.raw=FW.files[0].aoa;
  }else{
    FW.files=[];FW.ga=false;FW.ref={};const x=P[0];FW.fname=x.name;FW.raw=x.aoa;FW.br='';
    let hr=0,best=0;x.aoa.slice(0,15).forEach((r,i)=>{const n=r.filter(c=>String(c).trim()!=='').length;if(n>best){best=n;hr=i}});FW.hr=hr;fwGuess();
    if(P.length>1)toast('Several files can be combined only when they are Annexure-Ga files. Using the first file.');
  }
  fwMapUi();fwDraw();
}

function fwDetect(a){
  const nr=a.findIndex(r=>String(r[0]).trim()==='1'&&String(r[1]).trim()==='2'&&String(r[2]).trim()==='3'&&r.length>=20);
  if(nr<0)return{ga:false};
  let br='';for(const r of a.slice(0,nr)){const c=r.map(x=>String(x)).find(x=>/^kvLvi bvg/.test(x));if(c){br=fwBijoy(c.split(/\s+t\s*/)[1]||'').trim();break}}
  return{ga:true,start:nr+1,br};
}
function fwGuess(){
  const h=(FW.raw[FW.hr]||[]).map(x=>String(x));FW.map={};const used=new Set();
  FW_F.forEach(([k,,re])=>{const i=h.findIndex((x,j)=>!used.has(j)&&re.test(x));if(i>=0){FW.map[k]=i;used.add(i)}else FW.map[k]=-1});
  if(FW.map.imp<0&&FW.map.gen>=0&&FW.map.pen>=0){}
}
function fwFilesUi(){
  const kids=childBranches();
  return`<table class="fwft" style="margin-top:10px"><tr><th>File</th><th>Loans</th><th>Branch (from file)</th><th>Save to</th><th><a href="#" onclick="FW.files=[];FW.raw=null;FW.fs={};fwMapUi();fwDraw();return false">Clear</a></th></tr>
  ${FW.files.map((f,i)=>`<tr><td>${esc(f.name)}</td><td>${fwGaRows(f).length}</td><td><input value="${esc(f.br)}" oninput="FW.files[${i}].br=this.value;fwDraw()"></td><td><select onchange="FW.files[${i}].code=this.value"><option value="">- branch -</option>${kids.map(k=>`<option value="${k.code}" ${f.code===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select></td><td><a href="#" onclick="FW.files.splice(${i},1);FW.raw=FW.files.length?FW.files[0].aoa:null;fwMapUi();fwDraw();return false">&times;</a></td></tr>`).join('')}</table>`;
}
function fwMapUi(){
  if(FW.ga){$('#fwmap').innerHTML=FW.files.length?fwFilesUi():'';return}
  const h=FW.raw[FW.hr]||[];
  const opt=k=>`<option value="-1">- none -</option>${h.map((x,i)=>`<option value="${i}" ${FW.map[k]===i?'selected':''}>${i+1}. ${esc(String(x).slice(0,40)||'(blank)')}</option>`).join('')}`;
  $('#fwmap').innerHTML=`<div class="row" style="margin-top:10px;align-items:flex-end"><div style="flex:0 0 120px"><label>Header row no.</label><input type="number" min="1" value="${FW.hr+1}" onchange="FW.hr=Math.max(0,(+this.value||1)-1);fwGuess();fwMapUi();fwDraw()"></div>
  <div style="flex:1 1 220px"><label>Branch name (if the file has no branch column)</label><input value="${esc(FW.br)}" oninput="FW.br=this.value;fwDraw()"></div></div>
  <div class="muted small" style="margin:8px 0 4px">Match each letter column with a column of your Excel file (guessed automatically - please check):</div>
  <div class="row">${FW_F.map(([k,n])=>`<div style="flex:1 1 190px"><label>${n}</label><select onchange="FW.map['${k}']=+this.value;fwDraw()">${opt(k)}</select></div>`).join('')}</div>
  `;
}
function fwData(){
  if(FW.ga)return FW.files.flatMap(fwGaRows);
  if(!FW.raw)return[];
  const M=FW.map,g=(r,k)=>M[k]>=0?r[M[k]]:'';const out=[];
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
const fwBy=rows=>{const by={};if(FW.comb&&new Set(rows.map(r=>r.br)).size>1){by.ALL=rows;return by}rows.forEach(r=>{(by[r.br]=by[r.br]||[]).push(r)});return by};
const fwRun=(rs,i)=>{if(i&&rs[i-1].br===rs[i].br)return'';let n=1;while(i+n<rs.length&&rs[i+n].br===rs[i].br)n++;return`<td class="c" rowspan="${n}">${esc(rs[i].br)}</td>`};
const fwN=v=>toBn((+v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
function fwPages(rows){
  const by=fwBy(rows);
  const d=FW.d,yr=(d.split('/')[2]||'');let h='';
  Object.keys(by).forEach(br=>{
    const rs=by[br],brs=[...new Set(rs.map(r=>r.br))],n=rs.length,S_=['loan','imp','gen','pen','tot','sus','cib'].map(k=>rs.reduce((a,r)=>a+r[k],0));
    const cls=n<=12?'fw1':n<=20?'fw2':n<=30?'fw3':'fw4';
    const rn=String(FW.ref[br]||'').trim(),ref=esc(br==='ALL'?`${FW.pre}/${toBn(yr)}/`:`${FW.pre}/${br}/${toBn(yr)}/`)+(rn?esc(toBn(rn)):'<span style="display:inline-block;width:11mm"></span>')+esc(`/${FW.suf}`);
    for(const copy of [0,1]){
      h+=`<div class="lfpage fwpage ${cls}"><div class="fwin">
      <div class="fwh"><img src="${LOGO}" alt=""><div class="fwl"><div class="fwb">জনতা ব্যাংক পিএলসি.</div><div>প্রধান কার্যালয়: জনতা ভবন</div><div>১১০ মতিঝিল বা/এ, পোষ্ট বক্স নম্বর : ৪৬৮, ঢাকা-১০০০, বাংলাদেশ।</div><div>SWIFT: JANBBDDH, Website: www.jb.com.bd</div><div>পিএবিএক্স : 02-223380042</div></div>
      <div class="fwr"><div class="fwa">এরিয়া অফিস, সিরাজগঞ্জ।</div><div>এস.এস. রোড, সিরাজগঞ্জ, বাংলাদেশ।</div><div>ফোন : 02588831078, 02588831342</div><div>E-mail: jb5038@janatabank-bd.com</div></div></div>
      <div class="fwref"><span>সূত্রঃ ${ref}</span><span>তারিখঃ ${esc(toBn(d))} ইং</span></div>
      <div class="fwto">${esc(FW.to).replace(/\n/g,'<br>')}</div>
      <div class="fwsub"><b>বিষয়ঃ</b><span>${esc(FW.sub)}</span></div>
      <p>প্রিয় মহোদয়</p>
      <p class="j">শিরোনামে বর্ণিত সার্কুলারসমূহের নিদের্শনা অনুযায়ী অত্র এরিয়াধীন শাখাসমূহ হতে প্রাপ্ত সুদ মওকুফ প্রস্তাবসমূহ পর্যালোচনা ও যাচাই-বাছাই করতঃ অত্র এরিয়ার সুপারিশসহ নিম্নোক্ত ছক মোতাবেক আপনাদের সদয় অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের নিমিত্তে এতদসঙ্গে প্রেরণ করা হলো।</p>
      <table class="fwt" data-b="${esc(br)}"><colgroup><col style="width:4.5%"><col style="width:9%"><col style="width:16%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:9.5%"><col style="width:8%"></colgroup><tr><th rowspan="2">ক্রঃ নং</th><th rowspan="2">শাখার নাম</th><th rowspan="2">গ্রাহকের নাম</th><th rowspan="2">ঋণের পরিমাণ</th><th colspan="4">সুদ মওকুফের জন্য সুপারিশকৃত সুদের পরিমাণ</th><th rowspan="2">ইন্টারেস্ট সাসপেন্স</th><th rowspan="2">যাচিত CIBTCA এর পরিমাণ</th><th rowspan="2">মন্তব্য</th></tr>
      <tr><th>আরোপিত<br>সুদ</th><th>অনারোপিত<br>সাধারণ সুদ</th><th>অনারোপিত<br>দন্ড সুদ</th><th>মোট</th></tr>
      ${rs.map((r,i)=>`<tr><td class="c">${toBn(i+1)}</td><td class="c">${esc(r.br)}</td><td>${esc(r.nm)}</td><td class="n">${fwN(r.loan)}</td><td class="n">${fwN(r.imp)}</td><td class="n">${fwN(r.gen)}</td><td class="n">${fwN(r.pen)}</td><td class="n">${fwN(r.tot)}</td><td class="n">${fwN(r.sus)}</td><td class="n">${fwN(r.cib)}</td><td class="c">${esc(r.rem)}</td></tr>`).join('')}
      <tr class="tt"><td colspan="3" class="c">মোট</td>${S_.map(v=>`<td class="n">${fwN(v)}</td>`).join('')}<td></td></tr></table>
      <p class="j" style="margin-top:6px">বর্ণিত ${toBn(n)} টি ঋণ প্রস্তাব এক্সিট পলিসির আওতায় নিস্পত্তির প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য সুপারিশসহ অনুরোধ জানানো হলো।</p>
      <div class="fwsg"><div>আপনার বিশ্বস্ত</div>${copy?'<div style="margin-top:10px">স্বাঃ/-</div><div>':'<div style="margin-top:44px">'}(${esc(FW.sig)})</div><div>${esc(FW.des)}</div></div>
      ${copy?`<div class="fwan"><div>অনুলিপিঃ</div><div>১। ব্যবস্থাপক, জনতা ব্যাংক পিএলসি., ${esc(brs.join(', '))} শাখা, সিরাজগঞ্জ।</div><div>২। অফিস কপি।</div><div style="margin-top:36px">${esc(FW.des)}</div></div>`:''}
      </div></div>`;
    }
  });
  return h;
}
function fwDraw(){
  if(!FW.raw)return;const rows=fwData(),keys=Object.keys(fwBy(rows));
  const rf=$('#fwref');
  if(rf&&rf.dataset.k!==keys.join('|')){rf.dataset.k=keys.join('|');rf.innerHTML=`${keys.map(b=>`<div><label>Outward Number${keys.length>1||b==='ALL'?' - '+esc(b==='ALL'?'all':b):''}</label><input value="${esc(FW.ref[b]||'')}" oninput="FW.ref[${esc(JSON.stringify(b)).replace(/"/g,'&quot;')}]=this.value;fwDraw()" placeholder="e.g. 1759"></div>`).join('')}`}
  if(FW.show)fwShow();
}
function fwGhaAoa(rows){
  const g={};rows.forEach(r=>{const ty=String(r.raw[3]).trim(),k=r.br+'|'+ty;(g[k]=g[k]||{br:r.br,ty,rs:[]}).rs.push(r.raw)});
  const nn=v=>{v=gaNum(v);return isNaN(v)?0:v},idx=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  const data=[],tot=new Array(16).fill(0);
  Object.values(g).forEach((x,i)=>{const sum=idx.map(c=>Math.round(x.rs.reduce((a,r)=>a+nn(r[c]),0)*100)/100);data.push([i+1,'সিরাজগঞ্জ',x.br,x.ty,x.rs.length,...sum]);tot[0]+=x.rs.length;sum.forEach((v,j)=>tot[j+1]=Math.round((tot[j+1]+v)*100)/100)});
  return{data,tot};
}
function fwShow(){
  const v=$('#fwview');if(!v)return;const rows=fwData();
  if(!rows.length){v.innerHTML='<p class="muted">No loan rows found.</p>';return}
  if(FW.rep!=='letter'&&!FW.ga){v.innerHTML='<p class="muted">This report needs Annexure-Ga (customer wise) files.</p>';return}
  if(FW.rep==='gha'){const {data,tot}=fwGhaAoa(rows);v.innerHTML=`<div class="card" style="overflow:auto"><table class="fwft"><tr>${FW_GH.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${data.map(r=>`<tr>${r.map((c,i)=>`<td${typeof c==='number'&&i>3?' style="text-align:right"':''}>${typeof c==='number'&&i>4?fwN(c):esc(c)}</td>`).join('')}</tr>`).join('')}<tr style="font-weight:700"><td></td><td>সর্বমোট</td><td></td><td></td>${tot.map((c,i)=>`<td style="text-align:right">${i?fwN(c):c}</td>`).join('')}</tr></table></div>`;return}
  v.innerHTML=FW.rep==='note'?fwNotePages(rows):fwPages(rows);fwFitIn(v);
}
A.fwView=async()=>{if(!FW.raw)return toast('Upload the Annexure-Ga Excel first.');FW.show=true;fwShow()};
A.fwGo=async w=>{
  if(!FW.raw)return toast('Upload the Annexure-Ga Excel first.');
  const rows=fwData();if(!rows.length)return toast('No loan rows found.');
  if(FW.rep==='gha'){if(w==='print')return fwOut(fwGhaPage(rows),'print','JBRS_Annexure-Gha.pdf',true);return A.fwGha()}
  if(FW.rep==='note'){if(!FW.ga)return toast('The Note Sheet needs the Annexure-Ga (customer wise) file.');return fwOut(fwNotePages(rows),w,'JBRS_Note_Sheet.pdf')}
  return fwOut(fwPages(rows),w,'JBRS_Forwarding_AO.pdf');
};
function fwGhaPage(rows){
  const {data,tot}=fwGhaAoa(rows);
  return`<div class="lfpage fwpage fwland"><div class="fwin" style="padding:10mm 8mm"><div style="text-align:center"><div style="font-size:16pt;font-weight:700">জনতা ব্যাংক পিএলসি.</div><div style="font-size:12pt;font-weight:700">পরিশিষ্ট-ঘ</div></div>
  <p class="j" style="font-size:9pt;margin:2mm 0">বিষয়ঃ নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখ ০২/০৭/২০২৬ অনুযায়ী বিশেষ এক্সিট সুবিধার আওতায় কৃষি ও পল্লী ঋণসমূহের ৩০/০৬/২০২৬ জুন ভিত্তিক ক্ষতি হিসাবে শ্রেণিকৃত অনাদায়ী ঋণ হিসাবের তথ্যাদি।</p><div style="text-align:right;font-size:9pt">(টাকার অংকে)</div>
  <table class="fwt" style="table-layout:auto"><tr>${FW_GH.map(h=>`<th>${esc(h)}</th>`).join('')}</tr><tr>${FW_GH.map((_,i)=>`<th style="font-weight:400">${toBn(i+1)}</th>`).join('')}</tr>${data.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>3?'n':'c'}">${typeof c==='number'&&i>4?fwN(c):esc(i===0?toBn(c):i===4?toBn(c):c)}</td>`).join('')}</tr>`).join('')}<tr class="tt"><td></td><td class="c">সর্বমোট</td><td></td><td></td>${tot.map((c,i)=>`<td class="n">${i?fwN(c):toBn(c)}</td>`).join('')}</tr></table></div></div>`;
}
const fwOver=(t,av,w,pg)=>t.scrollWidth>av+1||w.scrollHeight>pg.clientHeight-4||[...t.querySelectorAll('td,th')].some(c=>c.scrollWidth>c.clientWidth+1);
function fwFitIn(root){
  root.querySelectorAll('.fwt').forEach(t=>{if(t.style.fontSize)return;const w=t.closest('.fwin'),cs=getComputedStyle(w),av=w.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),pg=t.closest('.lfpage');let f=8;t.style.fontSize=f+'pt';while(fwOver(t,av,w,pg)&&f>3.2){f-=.2;t.style.fontSize=f+'pt'}});
}
async function fwOut(html,w,fname,land){
  let win=null;if(w==='print'){try{win=window.open('','_blank')}catch(e){}}
  toast('Preparing PDF...');await lfLoadPdf();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const host=document.createElement('div');host.className='lfpdfhost';host.innerHTML=html;document.body.appendChild(host);
  try{fwFitIn(host);const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:land?'landscape':'portrait',compress:true});
    const pgs=[...host.querySelectorAll('.lfpage')];
    for(let i=0;i<pgs.length;i++){const c=await html2canvas(pgs[i],{scale:2.2,backgroundColor:'#ffffff',logging:false});if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,land?297:210,land?210:297,undefined,'FAST')}
    if(w==='print'&&win){win.location.href=URL.createObjectURL(pdf.output('blob'));toast('Opened in a new tab - print or save from there.')}
    else pdf.save(fname);
  }catch(e){if(win)win.close();throw e}finally{host.remove()}
}
A.fwDo=async w=>{
  const rows=fwData();if(!rows.length)return toast('Upload the Annexure-Ga Excel first.');
  return fwOut(fwPages(rows),w,'JBRS_Forwarding_AO.pdf');   // uses the font sizes fitted in the preview
};
const fwDate=d=>toBn(d)+' ইং';
function fwNotePages(rows){
  const by=fwBy(rows);let h='';
  const fin=FW.fin.split('|'),prep=FW.prep.split('|'),sg=FW.signs.split('\n').filter(x=>x.trim()).map(x=>x.split('|'));
  Object.keys(by).forEach(br=>{
    const rs=by[br],T=k=>rs.reduce((a,r)=>a+r[k],0);
    const col=r=>r.raw,n=v=>fwN(v);
    const body=rs.map((r,i)=>{const c=r.raw,coll=gaNum(c[13]);return`<tr><td class="c">${toBn(i+1)}</td>${fwRun(rs,i)}<td>${esc(r.nm)}</td><td class="c">${esc(String(c[2]))}</td><td class="n">${n(r.loan)}</td><td class="n">${n(isNaN(coll)?0:coll)}</td><td class="n">${n(r.imp)}</td><td class="n">${n(r.gen)}</td><td class="n">${n(r.pen)}</td><td class="n">${n(r.tot)}</td><td class="n">${n(r.sus)}</td><td class="n">${n(r.cib)}</td><td class="c">${esc(r.rem)}</td></tr>`}).join('');
    const coll=rs.reduce((a,r)=>a+(isNaN(gaNum(r.raw[13]))?0:gaNum(r.raw[13])),0);
    h+=`<div class="lfpage fwpage note"><div class="fwin" style="padding:12mm 10mm">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:3mm"><img src="${LOGO}" alt="" style="width:16mm;height:auto"><div style="text-align:center"><div style="font-size:19pt;font-weight:700;line-height:1.15">জনতা ব্যাংক পিএলসি.</div><div style="font-size:12pt">এরিয়া অফিস, সিরাজগঞ্জ</div></div></div>
    <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1.5px solid #000;border-bottom:1px solid #000;padding:1.5mm 0;margin:2mm 0 3mm"><span>সভা নং-${FW.nn?esc(toBn(FW.nn)):'<span style="display:inline-block;width:12mm"></span>'}</span><span>নোট শীট</span><span>তারিখ: ${esc(fwDate(FW.nd))}</span></div>
    <p class="j" style="margin:0 0 2mm;font-size:10.5pt"><b>বিষয়ঃ</b> বাংলাদেশ ব্যাংকের ''এক্সিট পলিসি'' বিআরপিডি-১ সার্কুলার লেটার নং-২৩ ; তারিখ-২৯.০৬.২০২৬ এর আলোকে অত্র ব্যাংকের নি: বি: নং-১৪১১/২৬ তারিখ ০২/০৭/২০২৬ ইং মোতাবেক ''ক্ষতি'' হিসাবে শ্রেণীকৃত ঋণ সমূহ শাখার সুপারিশের প্রেক্ষিতে নিম্নোক্ত কৃষি/পল্লী ঋণের সুদ মওকুফ (আরোপিত, অনারোপিত এবং দন্ড সুদ) প্রস্তাব প্রধান কার্যালয়ে প্রেরণের নিমিত্তে অত্র কার্যালয়ে যাচাই কমিটিতে সিদ্ধান্তের জন্য উপস্থাপন করা হলো।</p>
    <div style="text-align:right;font-size:10.5pt;margin:1mm 0 7mm;line-height:1.25">${esc(prep[0]||'')}<br>${esc(prep[1]||'')}</div>
    <table class="fwt" data-b="${esc(br)}"><colgroup><col style="width:3.2%"><col style="width:7%"><col style="width:12%"><col style="width:10.5%"><col style="width:9%"><col style="width:8.8%"><col style="width:8.2%"><col style="width:8.2%"><col style="width:8.2%"><col style="width:8.5%"><col style="width:7.6%"><col style="width:7.8%"><col style="width:6.5%"></colgroup>
    <tr><th rowspan="2">ক্রম নং</th><th rowspan="2">শাখার নাম</th><th rowspan="2">ঋণ গ্রহীতার নাম</th><th rowspan="2">ঋণের প্রকৃতি ও হিসাব নং</th><th rowspan="2">মূল ঋণ</th><th rowspan="2">বিতরণের পর হতে মোট আদায় (নগদ আদায় + অন্যান্য)</th><th colspan="4">সুদ মওকুফের জন্য সুপারিশকৃত সুদের পরিমাণ</th><th rowspan="2">ইন্টারেস্ট সাসপেন্স</th><th rowspan="2">যাচিত CIBTCA</th><th rowspan="2">মন্তব্য</th></tr>
    <tr><th>আরোপিত সুদ</th><th>অনা: সা: সুদ</th><th>অনা: দন্ড সুদ</th><th>মোট</th></tr>
    <tr>${[1,2,3,4,5,6,7,8,9,'১০=(৭+৮+৯)',11,12,13].map(x=>`<th style="font-weight:400">${toBn(x)}</th>`).join('')}</tr>
    ${body}
    <tr class="tt"><td colspan="4" class="c">মোট</td><td class="n">${n(T('loan'))}</td><td class="n">${n(coll)}</td><td class="n">${n(T('imp'))}</td><td class="n">${n(T('gen'))}</td><td class="n">${n(T('pen'))}</td><td class="n">${n(T('tot'))}</td><td class="n">${n(T('sus'))}</td><td class="n">${n(T('cib'))}</td><td></td></tr></table>
    <p class="j" style="margin:6mm 0 0;font-size:10.5pt">বর্ণিত সার্কুলার মোতাবেক সুদ মওকুফ প্রস্তাব বিবেচ্য হওয়ায় প্রস্তাবগুলি প্রধান কার্যালয়ে প্রেরণের নিমিত্তে বিভাগীয় কার্যালয়, বগুড়ায় প্রেরণের সিদ্ধান্ত গৃহীত হলো :-</p>
    <div style="display:flex;justify-content:space-between;margin-top:20mm;font-size:10pt;text-align:center;line-height:1.3">${sg.map(x=>`<div>${esc(x[0]||'')}<br>${esc(x[1]||'')}</div>`).join('')}</div>
    <div style="margin-top:20mm;text-align:right;font-size:10.5pt;line-height:1.3">${esc(fin[0]||'')}<br>${esc(fin[1]||'')}</div>
    </div></div>`;
  });
  return h;
}
A.fwNote=async()=>{
  const rows=fwData();if(!rows.length)return toast('Upload the Annexure-Ga Excel first.');
  if(!FW.ga)return toast('The Note Sheet needs the Annexure-Ga (customer wise) file.');
  return fwOut(fwNotePages(rows),'print','JBRS_Note_Sheet.pdf');
};
const FW_GH=['ক্রঃ নং','এরিয়ার নাম','শাখার নাম','ঋণের ধরণ/প্রকৃতি','ঋণ সংখ্যা','আসল','আরোপিত দায়: সুদ','আরোপিত দায়: অন্যান্য খরচ','মোট দায় (৬+৭+৮)','পরিশোধ: আসল','পরিশোধ: সুদ','পরিশোধ: অন্যান্য খরচ','মোট পরিশোধ','লেজার বকেয়া (৯-১৩)','আদায়যোগ্য আসল (৬-১০)','অনারোপিত সাধারণ সুদ','অনারোপিত দন্ড সুদ','ইন্টারেস্ট সাসপেন্সের পরিমাণ','যাচিত CIBTCA এর পরিমাণ (১৪-১৫-১৮)','কস্ট অব ফান্ড এর পরিমাণ'];
A.fwGha=async()=>{
  const rows=fwData();if(!rows.length||!FW.ga)return toast('Upload the Annexure-Ga (customer wise) Excel first.');
  await gaLoadLib();const {data,tot}=fwGhaAoa(rows);
  const aoa=[['জনতা ব্যাংক পিএলসি.'],['পরিশিষ্ট-ঘ'],['বিষয়ঃ নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখ ০২/০৭/২০২৬ অনুযায়ী বিশেষ এক্সিট সুবিধার আওতায় কৃষি ও পল্লী ঋণসমূহের ৩০/০৬/২০২৬ জুন ভিত্তিক ক্ষতি হিসাবে শ্রেণিকৃত অনাদায়ী ঋণ হিসাবের তথ্যাদি।'],['(টাকার অংকে)'],FW_GH,FW_GH.map((_,i)=>i+1),...data,['','সর্বমোট','','',...tot]];
  const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!merges']=[0,1,2].map(r=>({s:{r,c:0},e:{r,c:19}}));
  ws['!cols']=FW_GH.map((_,i)=>({wch:i<4?16:15}));
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Annexure-Gha');
  XLSX.writeFile(wb,'JBRS_Annexure-Gha.xlsx');
};
const FW_GA_HEAD=['ক্র.নং','ঋণ গ্রহীতার নাম','হিসাব নং','ঋণের ধরণ/প্রকৃতি','ঋণ বিতরণের তারিখ','ক্ষতি হিসাবে শ্রেণীকরণের তারিখ','আসল','আরোপিত দায়: সুদ','আরোপিত দায়: অন্যান্য খরচ','মোট দায়','পরিশোধ: আসল','পরিশোধ: সুদ','পরিশোধ: অন্যান্য খরচ','মোট পরিশোধ','লেজার বকেয়া','আদায়যোগ্য আসল','অনারোপিত সাধারণ সুদ','অনারোপিত দন্ড সুদ','ইন্টারেস্ট সাসপেন্সের পরিমাণ','যাচিত CIBTCA এর পরিমাণ','কস্ট অব ফান্ড এর পরিমাণ','অবলোপনকৃত কিনা?'];
A.fwSave=async()=>{
  if(!FW.ga||!FW.files.length)return toast('Upload the Annexure-Ga (customer wise) Excel first.');
  const miss=FW.files.filter(f=>!f.code);if(miss.length)return toast('Select "Save to" branch for: '+miss.map(f=>f.name).join(', '));
  const dup=new Set(FW.files.map(f=>f.code));if(dup.size<FW.files.length)return toast('Two files point to the same branch. Check "Save to".');
  const olds=[];for(const f of FW.files){const j=await api('/ga/rows?office='+encodeURIComponent(f.code));olds.push((j.batches||[]).filter(b=>b.office===f.code))}
  const ex=FW.files.filter((f,i)=>olds[i].length).map(f=>officeName(f.code));
  if(ex.length&&!confirm('Already saved for: '+ex.join(', ')+'. Replace with these files?'))return;
  let n=0;
  for(let i=0;i<FW.files.length;i++){const f=FW.files[i];
    for(const b of olds[i])await api('/ga/delete',{method:'POST',body:{id:b.id}});
    const rows=fwGaRows(f).map(r=>r.raw.map((c,k)=>k===0?r.raw[0]:(typeof c==='number'?c:String(c))));
    await api('/ga/upload',{method:'PUT',body:{office:f.code,label:'Annexure-Ga '+FW.d,fname:f.name,head:FW_GA_HEAD,rows}});n+=rows.length}
  toast('Saved '+n+' loans of '+FW.files.length+' branch(es). See Annexure-Ga (All).');
};
