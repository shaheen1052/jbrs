/* ================= Forwarding (AO): forwarding letter to Divisional Office from Annexure-Ga Excel ================= */
const FW={rep:'letter',show:false,files:[],comb:true,code:'',fname:'',nn:'',nd:'',fs:{},rem:'',d:'',ref:{},pre:'',suf:'',sig:'',des:'',to:'',aoff:'',raw:null,hr:0,map:{},br:''};
const FW_F=[['br','শাখার নাম (Branch)',/শাখা|branch/i],['nm','গ্রাহকের নাম (Customer)',/গ্রাহক|ঋণগ্রহীতা|ঋণ গ্রহীতা|name|customer|borrower/i],['loan','ঋণের পরিমাণ (Loan)',/ঋণের|ঋণ\s*স্থিতি|loan|limit/i],['imp','আরোপিত সুদ (Imposed)',/^(?!.*অনারোপিত).*আরোপিত|imposed|charged/i],['gen','অনারোপিত সাধারণ সুদ',/সাধারণ|general|unapplied.*gen|normal/i],['pen','অনারোপিত দন্ড সুদ',/দন্ড|দণ্ড|penal/i],['tot','মোট (Total)',/^মোট|^total/i],['sus','ইন্টারেস্ট সাসপেন্স',/সাসপেন্স|suspense/i],['cib','যাচিত CIBTCA',/cibtca|যাচিত/i],['rem','মন্তব্য (Remarks)',/মন্তব্য|remark|status/i]];

const FW_BJ={A:'অ',B:'ই',C:'ঈ',D:'উ',E:'ঊ',F:'ঋ',G:'এ',H:'ঐ',I:'ও',J:'ঔ',K:'ক',L:'খ',M:'গ',N:'ঘ',O:'ঙ',P:'চ',Q:'ছ',R:'জ',S:'ঝ',T:'ঞ',U:'ট',V:'ঠ',W:'ড',X:'ঢ',Y:'ণ',Z:'ত',_:'থ','`':'দ',a:'ধ',b:'ন',c:'প',d:'ফ',e:'ব',f:'ভ',g:'ম',h:'য',i:'র',j:'ল',k:'শ',l:'ষ',m:'স',n:'হ',o:'ড়',p:'ঢ়',q:'য়',r:'ৎ',s:'ং',t:'ঃ',u:'ঁ',v:'া',x:'ী',y:'ু',z:'ু','~':'ূ','„':'ৃ','Š':'ৗ','¨':'্য','ª':'্র','Ö':'্র','|':'।','ÿ':'ক্ষ','Ä':'ঞ্জ','Ÿ':'জ্ঞ','¯':'স্','®':'ষ্ণ','¤':'ন্','¦':'ব্','œ':'স্ত','Ñ':'ঙ্গ','Ý':'ন্দ','Ø':'্ব','ã':'ব্দ','¶':'ক্ষ','«':'্র','¬':'্ল','£':'ঙ্ক','¢':'ক্ক','¥':'ত্ব','±':'ক্ত','³':'ক্ষ','µ':'ড্ড'};
const FW_PRE={'w':'ি','‡':'ে','†':'ে','‰':'ৈ'};
function fwBijoy(t){
  t=String(t).replace(/Av/g,'আ');let out='',pre='',i=0;const a=[...t];
  while(i<a.length){
    const c=a[i];
    if(c==='©'&&!pre){let j=out.length-1;while(j>=2&&out[j-1]==='্')j-=2;if(j>=0)out=out.slice(0,j)+'র্'+out.slice(j);i++;continue}
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
const FW_WK=['pre','suf','sig','des','to','sub','fin','prep','signs'];let fwTm=0;
const fwSV=(k,v)=>{try{localStorage.setItem('jbrs_fw_'+k,v)}catch(e){}
  clearTimeout(fwTm);fwTm=setTimeout(()=>{const o={};FW_WK.forEach(x=>o[x]=FW[x]);api('/fw/wording',{method:'PUT',body:{v:JSON.stringify(o)}}).catch(()=>{})},700)};
async function fwLoadWording(){try{const j=await api('/fw/wording');if(!j.v)return;const o=JSON.parse(j.v);FW_WK.forEach(k=>{if(typeof o[k]==='string'){FW[k]=o[k];const e=$('#fwv_'+k);if(e)e.value=o[k]}});if(FW.raw)fwDraw()}catch(e){}}
function fwInit(){
  if(FW.init)return;FW.init=1;setTimeout(fwLoadWording,50);
  FW.rem='বিএল';FW.pre=fwLS('pre','এঃঅঃসিরাজ/এক্সিট পলিসি');FW.suf=fwLS('suf','এমএএইচ');FW.sig=fwLS('sig','আহমেদ তৈয়ব হাসান');FW.des=fwLS('des','উপ মহাব্যবস্থাপক');
  FW.to=fwLS('to','মহাব্যবস্থাপক\nজনতা ব্যাংক পিএলসি.\nবিভাগীয় কার্যালয়\nবগুড়া।');
  FW.sub=fwLS('sub','বাংলাদেশ ব্যাংকের বিআরপিডি-১ সার্কুলার লেটার নং ২৩ তারিখ: ২৯/০৬/২০২৬ ইং এবং অত্র ব্যাংকের নির্দেশ বিজ্ঞপ্তি নং ১৪১১/২৬ তারিখ: ০২/০৭/২০২৬ ইং এর আলোকে রিটেইল কাস্টমার ডিপার্টমেন্ট-৩ এর ০৮/০৭/২০২৬ ইং তারিখের পত্র সূত্র নং আরসিডি-৩/কৃ. ও প. ঋণ/ এককালীন এক্সিট/ ২০২৬/ ২৫৭-৪০৭ এর পরামর্শক্রমে বিশেষ এক্সিট সুবিধার আওতায় সুদ মওকুফ প্রস্তাব প্রেরণ প্রসঙ্গে।');
  FW.fin=fwLS('fin','(আহমেদ তৈয়ব হাসান)|উপমহাব্যবস্থাপক');FW.prep=fwLS('prep','(মোঃ আলমগীর হোসেন)|এসপিও');FW.signs=fwLS('signs','(মোঃ শাহীন মাহমুদ)|পিও\n(মোঃ আলমগীর হোসেন)|এসপিও\n(নিবির কুমার আমিন)|এসপিও\nমোঃ জাফর ইকবাল|সহকারী মহাব্যবস্থাপক\n(আহমেদ তৈয়ব হাসান)|উপমহাব্যবস্থাপক');
  const t=new Date();FW.d=String(t.getDate()).padStart(2,'0')+'/'+String(t.getMonth()+1).padStart(2,'0')+'/'+t.getFullYear();FW.nd=FW.d;
}
function pageFwd(l){
  fwInit();
  const I=(lb,v,ev,ex='')=>`<div><label>${lb}</label><input value="${esc(v)}" oninput="${ev}" ${ex}></div>`;
  return`<div class="pghead"><div class="hrow"><h2>Forwarding (AO)</h2><div class="hrow" id="fwctl" style="flex:1 1 auto;justify-content:flex-end"><div class="bar"><select id="fwrep" onchange="FW.rep=this.value;FW.show=false;$('#fwview').innerHTML='';$('#fwbr').style.display=this.value==='gabr'?'':'none';$('#fwxl').style.display=this.value==='gabr'?'':'none'" style="height:32px"><option value="letter" ${FW.rep==='letter'?'selected':''}>Forwarding letter</option><option value="note" ${FW.rep==='note'?'selected':''}>Note Sheet</option><option value="gha" ${FW.rep==='gha'?'selected':''}>Annexure-Gha</option><option value="gabr" ${FW.rep==='gabr'?'selected':''}>Annexure-Ga (Branchwise)</option></select><select id="fwbr" onchange="FW.gbr=this.value;FW.show=false;$('#fwview').innerHTML=''" style="height:32px;${FW.rep==='gabr'?'':'display:none'}"><option value="">All branches</option>${childBranches().map(k=>`<option value="${k.code}" ${FW.gbr===k.code?'selected':''}>${k.code} - ${esc(k.name.replace(/ Branch, Sirajganj$/,''))}</option>`).join('')}</select>
  <button onclick="run(()=>A.fwView())">View</button><button onclick="run(()=>A.fwGo('print'))">Print</button><button class="pri" onclick="run(()=>A.fwGo('pdf'))">Download</button><button id="fwxl" onclick="run(()=>A.fwGaXl())" style="${FW.rep==='gabr'?'':'display:none'}">Excel</button></div></div></div></div>
  <div class="card fwform" style="margin-top:8px;padding:8px 12px"><div class="fwr1">
  ${I('Letter Date',FW.d,"FW.d=this.value;fwDraw()",'id="fw_d" maxlength="10"')}
  <span id="fwref" style="display:contents"></span>
  ${I('Meeting no.',FW.nn,"FW.nn=this.value;fwDraw()")}${I('Note date',FW.nd,"FW.nd=this.value;fwDraw()",'maxlength="10"')}
  <label class="chk" title="Ticked: files of different branches are put in ONE letter, ONE Note Sheet, ONE Gha. Unticked: a separate letter and Note Sheet for each branch."><input type="checkbox" ${FW.comb?'checked':''} onchange="FW.comb=this.checked;fwDraw()"> Combine letter</label></div>
  <table class="fwft fwfx"><colgroup><col style="width:200px"><col style="width:200px"><col style="width:270px"><col style="width:140px"><col style="width:220px"></colgroup><tr><th>Annexure-Ga</th><th>File Name</th><th>Branch</th><th>Upazilla</th><th>Save/Clear</th></tr>
  <tr><td><input type="file" id="fw_f" accept=".xlsx,.xls,.csv" multiple onchange="run(()=>fwPick(this))" style="height:auto;padding:2px;width:100%"></td><td id="fwc1"></td><td id="fwc2"></td><td id="fwc3"></td><td style="white-space:nowrap"><button class="pri" onclick="run(()=>A.fwSave())">Save</button> <a href="#" onclick="FW.files=[];FW.raw=null;FW.fs={};$('#fw_f').value='';fwMapUi();fwDraw();return false" style="margin-left:8px">Clear</a> <span id="fwx" style="margin-left:6px"></span></td></tr><tbody id="fwmap"></tbody></table></div>
  <details class="card" style="margin-top:6px;padding:3px 12px"><summary style="cursor:pointer;font-size:13px"><b>Wording</b></summary><div class="g" style="margin-top:8px">
  <div style="grid-column:span 2">${I('Letter Reference',FW.pre,"FW.pre=this.value;fwSV('pre',this.value);fwDraw()",'id="fwv_pre"')}</div>
  ${I('Ref suffix',FW.suf,"FW.suf=this.value;fwSV('suf',this.value);fwDraw()",'id="fwv_suf"')}
  ${I('Sign name',FW.sig,"FW.sig=this.value;fwSV('sig',this.value);fwDraw()",'id="fwv_sig"')}${I('Post',FW.des,"FW.des=this.value;fwSV('des',this.value);fwDraw()",'id="fwv_des"')}
  <div style="grid-column:span 2">${I('Note: prepared by (name|post)',FW.prep,"FW.prep=this.value;fwSV('prep',this.value)",'id="fwv_prep"')}</div><div style="grid-column:span 2">${I('Note: final approval (name|post)',FW.fin,"FW.fin=this.value;fwSV('fin',this.value)",'id="fwv_fin"')}</div></div>
  <div class="g" style="margin-top:8px"><div style="grid-column:span 2"><label>Note: signers (name|post per line)</label><textarea id="fwv_signs" rows="5" oninput="FW.signs=this.value;fwSV('signs',this.value)">${esc(FW.signs)}</textarea></div>
  <div><label>To</label><textarea id="fwv_to" rows="5" oninput="FW.to=this.value;fwSV('to',this.value);fwDraw()">${esc(FW.to)}</textarea></div>
  <div style="grid-column:span 2"><label>Subject</label><textarea id="fwv_sub" rows="5" oninput="FW.sub=this.value;fwSV('sub',this.value);fwDraw()">${esc(FW.sub)}</textarea></div></div></details>
  <details class="card" style="margin-top:6px;padding:3px 12px" ontoggle="if(this.open)fwSaved()"><summary style="cursor:pointer;font-size:13px"><b>Saved list</b></summary><div id="fwsaved" style="margin:6px 0"></div></details>
  <div id="fwview" class="lfsc" style="margin-top:12px;overflow:auto"><p class="muted">Upload the Annexure-Ga Excel file(s), choose the report above and press View.</p></div>`;
}
const fwUpz=f=>f.upz!==undefined?f.upz:fwLoc(f.code).upz;
const fwUni=t=>{t=String(t==null?'':t).trim();return t&&!/[\u0980-\u09FF]/.test(t)&&/[A-Za-z\u2020\u2021\u02c6\u2030\u0153]/.test(t)?fwBijoy(t).trim():t};
const fwGaRows=f=>{const out=[],n=v=>{v=gaNum(v);return isNaN(v)?0:fw2(v)};
  for(const r of f.aoa.slice(f.start)){
    if(!/^\s*[\d\u09E6-\u09EF]+\s*$/.test(String(r[0])))break;const nm=fwUni(r[1]);if(!nm)continue;
    const imp=fw2(n(r[14])-n(r[15])),gen=n(r[16]),pen=n(r[17]),wo=String(r[21]).trim();
    out.push({br:f.br,code:f.code,upz:fwUpz(f),nm,loan:n(r[6]),imp,gen,pen,tot:fw2(imp+gen+pen),sus:n(r[18]),cib:n(r[19]),raw:(()=>{const q=r.slice(0,22);q[1]=nm;q[3]=fwUni(q[3]);return q})(),rem:wo&&!/^(না|নাই|no|n|-|0)$/i.test(wo)?'অবলোপন':FW.rem});
  }return out};
async function fwParse(f){
  const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});
  const sn=wb.SheetNames.find(n=>/customer|পরিশিষ্ট-গ|annexure/i.test(n)&&!/summ?ery/i.test(n))||wb.SheetNames[0];
  const aoa=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true}).map(r=>r.map(c=>c instanceof Date?gaDmy(c):c));
  const d=fwDetect(aoa);return{name:f.name,aoa,ga:d.ga,start:d.start,br:d.br,upz:d.upz,code:''};
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

const fwEn=t=>String(t==null?'':t).trim().replace(/[০-৯]/g,d=>d.charCodeAt(0)-0x9E6);
function fwDetect(a){
  const nr=a.findIndex(r=>fwEn(r[0])==='1'&&fwEn(r[1])==='2'&&fwEn(r[2])==='3'&&r.length>=20);
  if(nr<0)return{ga:false};
  let br='',upz;for(const r of a.slice(0,nr)){for(const c0 of r){const c=String(c0);
    if(!br&&/^kvLvi bvg/.test(c))br=fwBijoy(c.split(/\s+t\s*/)[1]||'').trim();
    else if(!br&&/^\s*শাখার নাম\s*[:ঃ]/.test(c))br=c.replace(/^\s*শাখার নাম\s*[:ঃ]\s*/,'').split(',')[0].replace(/\s*শাখা\s*$/,'').trim();
    const u=c.match(/^\s*উপজেলা\s*[:ঃ]\s*(.*)$/);if(u&&u[1].trim())upz=u[1].trim()}
    if(br)break}
  return{ga:true,start:nr+1,br,upz};
}
function fwGuess(){
  const h=(FW.raw[FW.hr]||[]).map(x=>String(x));FW.map={};const used=new Set();
  FW_F.forEach(([k,,re])=>{const i=h.findIndex((x,j)=>!used.has(j)&&re.test(x));if(i>=0){FW.map[k]=i;used.add(i)}else FW.map[k]=-1});
  if(FW.map.imp<0&&FW.map.gen>=0&&FW.map.pen>=0){}
}
const fwSel=(f,i)=>{const kids=childBranches();return`<select style="width:100%" onchange="FW.files[${i}].code=this.value;FW.files[${i}].upz=undefined;const u=this.closest('tr').querySelector('.fwupz');if(u)u.value=fwUpz(FW.files[${i}]);if(FW.show)fwShow()"><option value="">- branch -</option>${kids.map(k=>`<option value="${k.code}" ${f.code===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select>`};
const fwUp=(f,i)=>`<input class="fwupz" style="width:100%" value="${esc(fwUpz(f))}" oninput="FW.files[${i}].upz=this.value;if(FW.show)fwShow()">`;
const fwXs=i=>`<a href="#" onclick="FW.files.splice(${i},1);FW.raw=FW.files.length?FW.files[0].aoa:null;fwMapUi();fwDraw();return false">&times;</a>`;
function fwFilesUi(){
  const f=FW.files,nm=x=>`<div class="fwnm" title="${esc(x.name)}">${esc(x.name)} ${fwGaRows(x).length}</div>`;
  $('#fwc1').innerHTML=f[0]?nm(f[0]):'';$('#fwc2').innerHTML=f[0]?fwSel(f[0],0):'';$('#fwc3').innerHTML=f[0]?fwUp(f[0],0):'';$('#fwx').innerHTML=f[0]?fwXs(0):'';
  return f.slice(1).map((x,j)=>`<tr><td></td><td>${nm(x)}</td><td>${fwSel(x,j+1)}</td><td>${fwUp(x,j+1)}</td><td>${fwXs(j+1)}</td></tr>`).join('');
}
function fwMapUi(){
  if(FW.ga){$('#fwmap').innerHTML=fwFilesUi();return}
  $('#fwc1').innerHTML='';$('#fwc2').innerHTML='';$('#fwc3').innerHTML='';$('#fwx').innerHTML='';
  const h=FW.raw[FW.hr]||[];
  const opt=k=>`<option value="-1">- none -</option>${h.map((x,i)=>`<option value="${i}" ${FW.map[k]===i?'selected':''}>${i+1}. ${esc(String(x).slice(0,40)||'(blank)')}</option>`).join('')}`;
  $('#fwmap').innerHTML=`<tr><td colspan="5"><div class="row" style="margin-top:4px;align-items:flex-end"><div style="flex:0 0 120px"><label>Header row no.</label><input type="number" min="1" value="${FW.hr+1}" onchange="FW.hr=Math.max(0,(+this.value||1)-1);fwGuess();fwMapUi();fwDraw()"></div>
  <div style="flex:1 1 220px"><label>Branch name (if the file has no branch column)</label><input value="${esc(FW.br)}" oninput="FW.br=this.value;fwDraw()"></div></div>
  <div class="muted small" style="margin:8px 0 4px">Match each letter column with a column of your Excel file (guessed automatically - please check):</div>
  <div class="row">${FW_F.map(([k,n])=>`<div style="flex:1 1 190px"><label>${n}</label><select onchange="FW.map['${k}']=+this.value;fwDraw()">${opt(k)}</select></div>`).join('')}</div></td></tr>`;
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
const fw2=v=>{v=Math.round((+v||0)*100+(v<0?-1e-7:1e-7))/100;return v===0?0:v};
const fwN=v=>toBn(fw2(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
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
  const nn=v=>{v=gaNum(v);return isNaN(v)?0:fw2(v)},idx=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  const data=[],tot=new Array(16).fill(0);
  Object.values(g).forEach((x,i)=>{const sum=idx.map(c=>fw2(x.rs.reduce((a,r)=>a+nn(r[c]),0)));data.push([i+1,'সিরাজগঞ্জ',x.br,x.ty,x.rs.length,...sum]);tot[0]+=x.rs.length;sum.forEach((v,j)=>tot[j+1]=fw2(tot[j+1]+v))});
  return{data,tot};
}
function fwShow(){
  const v=$('#fwview');if(!v)return;const rows=fwData();
  if(!rows.length){v.innerHTML='<p class="muted">No loan rows found.</p>';return}
  if(FW.rep!=='letter'&&!FW.ga){v.innerHTML='<p class="muted">This report needs Annexure-Ga (customer wise) files.</p>';return}
  if(FW.rep==='gha'||FW.rep==='gabr'){const sets=FW.rep==='gha'?null:fwGaSets(rows);if(sets&&!sets.length){v.innerHTML='<p class="muted">No uploaded file is saved to this branch.</p>';return}v.innerHTML='<div style="overflow:auto">'+(sets?fwGaHtml(sets):fwGhaHtml(fwGSets(rows,false)))+'</div>';fwFitZoom(v);return}
  v.innerHTML=FW.rep==='note'?fwNotePages(rows):fwPages(rows);fwFitIn(v);
}
A.fwView=async()=>{if(!FW.raw)return toast('Upload the Annexure-Ga Excel first.');FW.show=true;fwShow()};
A.fwGo=async w=>{
  if(!FW.raw)return toast('Upload the Annexure-Ga Excel first.');
  const rows=fwData();if(!rows.length)return toast('No loan rows found.');
  if(FW.rep==='gha')return fwOut(fwGhaHtml(fwGSets(rows,false)),w,'JBRS_Annexure-Gha.pdf',true);
  if(FW.rep==='gabr'){const sets=fwGaSets(rows);if(!sets.length)return toast('No uploaded file is saved to this branch.');return fwOut(fwGaHtml(sets),w,'JBRS_Annexure-Ga_'+(FW.gbr||'all')+'.pdf',true)}
  if(FW.rep==='note'){if(!FW.ga)return toast('The Note Sheet needs the Annexure-Ga (customer wise) file.');return fwOut(fwNotePages(rows),w,'JBRS_Note_Sheet.pdf')}
  return fwOut(fwPages(rows),w,'JBRS_Forwarding_AO.pdf');
};
const fwOver=(t,av,w,pg)=>t.scrollWidth>av+1||w.scrollHeight>pg.clientHeight-4||[...t.querySelectorAll('td,th')].some(c=>c.scrollWidth>c.clientWidth+1);
async function fwFitZoom(v){if(document.fonts&&document.fonts.ready)await document.fonts.ready;fwFitIn(v);const zf=Math.min(1,(v.clientWidth-4)/(297*96/25.4));v.querySelectorAll('.fwpage').forEach(e=>{e.style.zoom=zf;e.style.marginBottom='8px'})}
function fwFitIn(root){
  root.querySelectorAll('.fwt').forEach(t=>{if(t.style.fontSize)return;const w=t.closest('.fwin'),cs=getComputedStyle(w),av=w.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),pg=t.closest('.lfpage');let f=8;t.style.fontSize=f+'pt';while(fwOver(t,av,w,pg)&&f>3.2){f-=.2;t.style.fontSize=f+'pt'}});
}
async function fwOut(html,w,fname,land){
  let win=null;if(w==='print'){try{win=window.open('','_blank')}catch(e){}}
  toast('Preparing PDF...');await lfLoadPdf();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const host=document.createElement('div');host.className='lfpdfhost';host.innerHTML=html;document.body.appendChild(host);
  try{fwFitIn(host);const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:land?'landscape':'portrait',compress:true});
    const pgs=[...host.querySelectorAll('.lfpage')];
    for(let i=0;i<pgs.length;i++){const c=await html2canvas(pgs[i],{scale:3,backgroundColor:'#ffffff',logging:false});{const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);const pr=pgs[i].getBoundingClientRect(),S=3,R=v=>Math.round(v*S);g.strokeStyle='#000';g.lineWidth=2;g.lineJoin='miter';pgs[i].querySelectorAll('.fwt th,.fwt td').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width)return;const x1=R(r.left-pr.left),y1=R(r.top-pr.top);g.strokeRect(x1,y1,R(r.right-pr.left)-x1,R(r.bottom-pr.top)-y1)})}if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.95),'JPEG',0,0,land?297:210,land?210:297,undefined,'FAST')}
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
    const rs=by[br],T=k=>fw2(rs.reduce((a,r)=>a+r[k],0));
    const col=r=>r.raw,n=v=>fwN(v);
    const body=rs.map((r,i)=>{const c=r.raw,coll=gaNum(c[13]);return`<tr><td class="c">${toBn(i+1)}</td>${fwRun(rs,i)}<td>${esc(r.nm)}</td><td class="c">${esc(String(c[2]))}</td><td class="n">${n(r.loan)}</td><td class="n">${n(isNaN(coll)?0:coll)}</td><td class="n">${n(r.imp)}</td><td class="n">${n(r.gen)}</td><td class="n">${n(r.pen)}</td><td class="n">${n(r.tot)}</td><td class="n">${n(r.sus)}</td><td class="n">${n(r.cib)}</td><td class="c">${esc(r.rem)}</td></tr>`}).join('');
    const coll=fw2(rs.reduce((a,r)=>a+(isNaN(gaNum(r.raw[13]))?0:fw2(gaNum(r.raw[13]))),0));
    h+=`<div class="lfpage fwpage note"><div class="fwin" style="padding:12mm 10mm">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:3mm"><img src="${LOGO}" alt="" style="width:16mm;height:auto"><div style="text-align:center"><div style="font-size:19pt;font-weight:700;line-height:1.15">জনতা ব্যাংক পিএলসি.</div><div style="font-size:12pt">এরিয়া অফিস, সিরাজগঞ্জ</div></div></div>
    <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1.5px solid #000;border-bottom:1px solid #000;padding:1.5mm 0;margin:2mm 0 3mm"><span>সভা নং-${FW.nn?esc(toBn(FW.nn)):'<span style="display:inline-block;width:12mm"></span>'}</span><span>নোট শীট</span><span>তারিখ: ${esc(fwDate(FW.nd))}</span></div>
    <p class="j" style="margin:0 0 2mm;font-size:10.5pt"><b>বিষয়ঃ</b> বাংলাদেশ ব্যাংকের ''এক্সিট পলিসি'' বিআরপিডি-১ সার্কুলার লেটার নং-২৩ ; তারিখ-২৯.০৬.২০২৬ এর আলোকে অত্র ব্যাংকের নি: বি: নং-১৪১১/২৬ তারিখ ০২/০৭/২০২৬ ইং মোতাবেক ''ক্ষতি'' হিসাবে শ্রেণীকৃত ঋণ সমূহ শাখার সুপারিশের প্রেক্ষিতে নিম্নোক্ত কৃষি/পল্লী ঋণের সুদ মওকুফ (আরোপিত, অনারোপিত এবং দন্ড সুদ) প্রস্তাব প্রধান কার্যালয়ে প্রেরণের নিমিত্তে অত্র কার্যালয়ে যাচাই কমিটিতে সিদ্ধান্তের জন্য উপস্থাপন করা হলো।</p>
    <div style="text-align:right;font-size:10.5pt;margin:1mm 0 14mm;line-height:1.25">${esc(prep[0]||'')}<br>${esc(prep[1]||'')}</div>
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

/* ===== Annexure-Gha: same layout as the calculator's prescribed format ===== */
const FW_GSUBJ='বিষয়: নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখ ০২/০৭/২০২৬ অনুযায়ী বিশেষ এক্সিট সুবিধার আওতায় কৃষি ও পল্লী ঋণসমূহের ৩০/০৬/২০২৬ জুন ভিত্তিক ক্ষতি হিসাবে শ্রেণিকৃত অনাদায়ী ঋণ হিসাবের তথ্যাদি।';
const FW_GNOTE='বি: দ্র:- নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখ: ০২/০৭/২০২৬ মোতাবেক সুদ মওকুফের নিমিত্ত ১৯ নং কলামে উল্লিখিত CIBTCA এর পরিমাণ সঠিক রয়েছে।';
const FW_GNUM={8:'৯=(৬+৭+৮)',12:'১৩=(১০+১১+১২)',13:'১৪=(৯-১৩)',14:'১৫=(৬-১০)',18:'১৯=(১৪-১৫-১৮)'};
const FW_GFILL=['','','','','','#FCD5B4','#FCD5B4','#FCD5B4','#FCD5B4','#92D050','#92D050','#92D050','#92D050','#FCD5B4','#FCD5B4','','','#92D050','#FFC000','#C6D9F1'];
const FW_GSIGN=['এরিয়া অফিস সংশ্লিষ্ট কর্মকর্তা','এরিয়া অফিস প্রধান','বিভাগীয় কার্যালয় সংশ্লিষ্ট কর্মকর্তা','বিভাগীয় কার্যালয় প্রধান'];
const fwLoc=code=>{const o=(S.offices||[]).find(x=>x.code===code);if(!o||!(o.nameBn||o.name_bn))return{upz:'',dist:''};const p=(o.nameBn||o.name_bn).split(/\s*,\s*/);return{upz:(p[0]||'').replace(/\s*শাখা$/,''),dist:p[1]||''}};
const fwGSets=(rows,by)=>{
  const mk=(rs,name)=>{const {data,tot}=fwGhaAoa(rs);const cs=[...new Set(rs.map(r=>r.code).filter(Boolean))],l=cs.length===1&&rs.every(r=>r.code)?fwLoc(cs[0]):{upz:'',dist:''};const us=[...new Set(rs.map(r=>r.upz).filter(Boolean))];if(cs.length===1)l.upz=us.length===1?us[0]:l.upz;return{name,data,tot,doff:'বগুড়া',upz:l.upz,dist:l.dist}};
  if(!by)return[mk(rows,'Annexure-Gha')];
  const o=[];[...new Set(rows.map(r=>r.br))].forEach(b=>o.push(mk(rows.filter(r=>r.br===b),b)));return o;
};
function fwGhaHtml(sets){
  const th=(t,c,o='')=>`<th ${o} style="${FW_GFILL[c]?'background:'+FW_GFILL[c]+';':''}">${esc(t)}</th>`;
  const PER=24;let h='';
  sets.forEach(set=>{
    const n=set.data.length,pn=Math.max(1,Math.ceil(n/PER));
    for(let p=0;p<pn;p++){
      const rs=set.data.slice(p*PER,(p+1)*PER),last=p===pn-1;
      h+=`<div class="lfpage fwpage fwland"><div class="fwin" style="padding:9mm 8mm"><div style="text-align:center;font-size:15pt;font-weight:700">জনতা ব্যাংক পিএলসি.</div>
      <div style="text-align:right;font-size:11pt;font-weight:700;text-decoration:underline">পরিশিষ্ট-ঘ${pn>1?`<span style="font-weight:400;text-decoration:none">&nbsp;&nbsp;(পাতা ${toBn(p+1)}/${toBn(pn)})</span>`:''}</div>
      <div style="text-align:center;font-size:9.5pt;margin-top:1mm">বিভাগীয় কার্যালয়ের নাম: ${esc(set.doff)}</div>
      <div style="display:flex;justify-content:center;gap:40mm;font-size:9.5pt"><span>উপজেলা: ${esc(set.upz)}</span><span>জেলা: ${esc(set.dist)}</span></div>
      <p style="font-size:9pt;margin:2mm 0 1mm;text-decoration:underline;text-align:justify">${FW_GSUBJ}</p><div style="text-align:right;font-size:9pt">(টাকার অংকে)</div>
      <table class="fwt" style="table-layout:auto"><tr>${[0,1,2,3,4].map(c=>th(['ক্র: নং','এরিয়ার নাম','শাখার নাম','ঋণের ধরণ /প্রকৃতি','ঋণ সংখ্যা'][c],c,'rowspan="2"')).join('')}${th('আসল',5,'rowspan="2"')}${th('আরোপিত দায়',6,'colspan="2"')}${th('মোট দায়',8,'rowspan="2"')}${th('পরিশোধ',9,'colspan="3"')}${th('মোট পরিশোধ',12,'rowspan="2"')}${th('লেজার বকেয়া',13,'rowspan="2"')}${th('আদায়যোগ্য আসল',14,'rowspan="2"')}${th('অনারোপিত দায়',15,'colspan="2"')}${th('ইন্টারেস্ট সাসপেন্স এর পরিমাণ',17,'rowspan="2"')}${th('যাচিত CIBTCA এর পরিমাণ',18,'rowspan="2"')}${th('কস্ট অব ফান্ড পরিমাণ',19,'rowspan="2"')}</tr>
      <tr>${[[6,'সুদ'],[7,'অন্যান্য খরচ'],[9,'আসল'],[10,'সুদ'],[11,'অন্যান্য খরচ'],[15,'সাধারণ সুদ'],[16,'দণ্ড সুদ']].map(([c,t])=>th(t,c)).join('')}</tr>
      <tr>${FW_GFILL.map((f,c)=>`<th style="background:#D9D9D9">${FW_GNUM[c]||toBn(c+1)}</th>`).join('')}</tr>
      ${rs.map((r,i)=>`<tr>${r.map((c,k)=>`<td style="${k===1||k===2?'text-align:left':k>4?'text-align:right':'text-align:center'}">${k===0?toBn(c):k===4?toBn(c):k>4?fwN(c):esc(c)}</td>`).join('')}</tr>`).join('')}
      ${last?`<tr style="font-weight:700"><td colspan="4" style="text-align:center">সর্বমোট</td><td style="text-align:center">${toBn(set.tot[0])}</td>${set.tot.slice(1).map(c=>`<td style="text-align:right">${fwN(c)}</td>`).join('')}</tr>`:''}</table>
      ${last?`<p style="font-size:9pt;margin:3mm 0 0">${FW_GNOTE}</p><div style="display:flex;justify-content:space-around;margin-top:16mm;font-size:9.5pt;text-align:center">${FW_GSIGN.map(t=>`<div>${t}<br>(নামসহ সীল মোহর)</div>`).join('')}</div>`:''}
      </div></div>`;
    }
  });
  return h;
}
const XCRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function xZip(files){const enc=new TextEncoder(),parts=[],cd=[];let off=0;
 const u16=v=>[v&255,(v>>>8)&255],u32=v=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
 files.forEach(f=>{const nm=enc.encode(f[0]),d=typeof f[1]=="string"?enc.encode(f[1]):f[1];let c=0xFFFFFFFF;for(let i=0;i<d.length;i++)c=XCRC[(c^d[i])&255]^(c>>>8);c=(c^0xFFFFFFFF)>>>0;
  const h=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)]);
  parts.push(h,nm,d);cd.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);off+=h.length+nm.length+d.length});
 const cs=cd.reduce((a,b)=>a+b.length,0);parts.push(...cd,new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cs),...u32(off),...u16(0)]));
 return new Blob(parts,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})}

const FW_GSTY=(()=>{const FN='<name val="Kalpurush"/><family val="2"/>',font=(sz,b,u)=>`<font>${b?"<b/>":""}${u?"<u/>":""}<sz val="${sz}"/>${FN}</font>`;
 const fill=c=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${c}"/><bgColor indexed="64"/></patternFill></fill>`;
 const X=(f,fi,b,al,nf)=>`<xf numFmtId="${nf||0}" fontId="${f}" fillId="${fi}" borderId="${b}" xfId="0"${nf?' applyNumberFormat="1"':""} applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment ${al}/></xf>`;
 const C='horizontal="center" vertical="center" wrapText="1"',Lf='horizontal="left" vertical="center" wrapText="1"',Rt='horizontal="right" vertical="center"';
 const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="[$-5000445]#,##0.00;[$-5000445](#,##0.00);&quot;-&quot;"/><numFmt numFmtId="165" formatCode="[$-5000445]0"/></numFmts><fonts count="7">${font(11)}${font(14,1)}${font(12,1,1)}${font(11,1)}${font(10)}${font(9,1)}${font(11,1)}</fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${fill("FCD5B4")}${fill("92D050")}${fill("C6D9F1")}${fill("D9D9D9")}${fill("FFC000")}</fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="21"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>${X(1,0,0,C)}${X(2,0,0,Rt)}${X(2,0,0,C)}${X(3,0,0,'horizontal="left" vertical="center"')}${X(0,0,0,Rt)}${X(4,0,1,C)}${X(4,2,1,C)}${X(4,3,1,C)}${X(4,4,1,C)}${X(5,5,1,C)}${X(6,0,1,C)}${X(6,0,1,Lf)}${X(6,0,1,Rt,164)}${X(6,0,1,C)}${X(6,0,1,Rt,164)}${X(3,0,0,Lf)}${X(0,0,0,C)}${X(6,0,1,C,165)}${X(4,6,1,C)}${X(3,0,0,C)}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
return styles})();
function fwGhaSheet(set){
  const L=i=>{let s='';i++;while(i){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=(i-m-1)/26}return s};
  const xe=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const rows={},put=(r,c,cell)=>{(rows[r]=rows[r]||{})[c]=cell},merges=[],M=(a,b)=>merges.push(a+':'+b);
  const S_=(r,c,t,st)=>put(r,c,`<c r="${L(c)}${r}" s="${st}" t="inlineStr"><is><t xml:space="preserve">${xe(t)}</t></is></c>`),B_=(r,c,st)=>put(r,c,`<c r="${L(c)}${r}" s="${st}"/>`),
  N_=(r,c,n,st,f)=>put(r,c,`<c r="${L(c)}${r}" s="${st}">${f?`<f>${xe(f)}</f>`:''}<v>${Math.round((+n||0)*100)/100}</v></c>`);
  const FILL=[6,6,6,6,6,7,7,7,7,8,8,8,8,7,7,6,6,8,19,9];
  S_(1,0,'জনতা ব্যাংক পিএলসি.',1);M('A1','T1');S_(2,17,'পরিশিষ্ট-ঘ',2);M('R2','T2');
  S_(3,0,'বিভাগীয় কার্যালয়ের নাম: '+set.doff,20);M('A3','T3');
  S_(4,4,'উপজেলা: '+set.upz,20);M('E4','H4');S_(4,12,'জেলা: '+set.dist,20);M('M4','P4');
  S_(5,0,FW_GSUBJ,3);M('A5','T5');S_(6,18,'(টাকার অংকে)',5);M('S6','T6');
  for(let c=0;c<20;c++){B_(7,c,FILL[c]);B_(8,c,FILL[c])}
  [[0,'ক্র: নং'],[1,'এরিয়ার নাম'],[2,'শাখার নাম'],[3,'ঋণের ধরণ /প্রকৃতি'],[4,'ঋণ সংখ্যা'],[5,'আসল'],[8,'মোট দায়'],[12,'মোট পরিশোধ'],[13,'লেজার বকেয়া'],[14,'আদায়যোগ্য আসল'],[17,'ইন্টারেস্ট সাসপেন্স এর পরিমাণ'],[18,'যাচিত CIBTCA এর পরিমাণ'],[19,'কস্ট অব ফান্ড পরিমাণ']].forEach(([c,t])=>{S_(7,c,t,FILL[c]);M(L(c)+7,L(c)+8)});
  [[6,7,'আরোপিত দায়'],[9,11,'পরিশোধ'],[15,16,'অনারোপিত দায়']].forEach(([a,b,t])=>{S_(7,a,t,FILL[a]);M(L(a)+7,L(b)+7)});
  [[6,'সুদ'],[7,'অন্যান্য খরচ'],[9,'আসল'],[10,'সুদ'],[11,'অন্যান্য খরচ'],[15,'সাধারণ সুদ'],[16,'দণ্ড সুদ']].forEach(([c,t])=>S_(8,c,t,FILL[c]));
  for(let c=0;c<20;c++)S_(9,c,FW_GNUM[c]||toBn(c+1),10);
  const D=set.data,r0=10,rl=r0+D.length-1,tr=rl+1;
  D.forEach((d,i)=>{const r=r0+i,FM={8:`F${r}+G${r}+H${r}`,12:`J${r}+K${r}+L${r}`,13:`I${r}-M${r}`,14:`F${r}-J${r}`,18:`N${r}-O${r}-R${r}`};
    N_(r,0,d[0],18);S_(r,1,d[1],12);S_(r,2,d[2],12);S_(r,3,d[3],11);N_(r,4,d[4],18);
    for(let c=5;c<=19;c++)N_(r,c,d[c],13,FM[c])});
  S_(tr,0,'সর্বমোট',14);for(let c=1;c<4;c++)B_(tr,c,14);M('A'+tr,'D'+tr);N_(tr,4,set.tot[0],18,'SUM(E'+r0+':E'+rl+')');
  for(let c=5;c<=19;c++)N_(tr,c,set.tot[c-4],15,'SUM('+L(c)+r0+':'+L(c)+rl+')');
  S_(tr+2,0,FW_GNOTE,16);M('A'+(tr+2),'T'+(tr+2));
  [[2,4,FW_GSIGN[0]],[7,9,FW_GSIGN[1]],[11,13,FW_GSIGN[2]],[16,17,FW_GSIGN[3]]].forEach(([a,b,t])=>{S_(tr+8,a,t,17);M(L(a)+(tr+8),L(b)+(tr+8));S_(tr+9,a,'(নামসহ সীল মোহর)',17);M(L(a)+(tr+9),L(b)+(tr+9))});
  const HT={1:22,2:18,3:18,4:18,5:34,6:18,7:30,8:36,9:28};for(let r=r0;r<=rl;r++)HT[r]=24;HT[tr]=22;HT[tr+2]=20;HT[tr+8]=18;HT[tr+9]=18;
  const W=[6,13,16,9,7,12.5,12,11,14,12.5,11,11.5,14,12.5,12.5,11.5,11,12.5,13,12.5];
  const xml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" zoomScale="90"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${W.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${Object.keys(rows).map(Number).sort((a,b)=>a-b).map(r=>`<row r="${r}"${HT[r]?` ht="${HT[r]}" customHeight="1"`:''}>${Object.keys(rows[r]).map(Number).sort((a,b)=>a-b).map(c=>rows[r][c]).join('')}</row>`).join('')}</sheetData><mergeCells count="${merges.length}">${merges.map(m=>`<mergeCell ref="${m}"/>`).join('')}</mergeCells><pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="1"/></worksheet>`;
  return{xml,pa:'T$'+(tr+9)};
}
function fwGhaXlsx(sets){
  const used=new Set(),nm=sets.map((s,i)=>{let n=String(s.name).replace(/[\[\]:*?\/\\]/g,' ').trim().slice(0,28)||'Sheet'+(i+1);while(used.has(n.toLowerCase()))n=n.slice(0,25)+'-'+(i+1);used.add(n.toLowerCase());return n});
  const sh=sets.map(fwGhaSheet),H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const files=[['[Content_Types].xml',H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sh.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
   ['_rels/.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
   ['xl/workbook.xml',H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+nm.map((n,i)=>`<sheet name="${n.replace(/&/g,'&amp;')}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets><definedNames>'+nm.map((n,i)=>`<definedName name="_xlnm.Print_Area" localSheetId="${i}">'${n.replace(/&/g,'&amp;')}'!$A$1:$${sh[i].pa}</definedName>`).join('')+'</definedNames><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>'],
   ['xl/_rels/workbook.xml.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sh.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${sh.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
   ['xl/styles.xml',FW_GSTY],...sh.map((s,i)=>['xl/worksheets/sheet'+(i+1)+'.xml',s.xml])];
  return xZip(files);
}
A.fwGhaXl=async(by)=>{
  const rows=fwData();if(!rows.length||!FW.ga)return toast('Upload the Annexure-Ga (customer wise) Excel first.');
  const blob=fwGhaXlsx(fwGSets(rows,by)),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=by?'JBRS_Annexure-Gha_Branchwise.xlsx':'JBRS_Annexure-Gha.xlsx';document.body.appendChild(a);a.click();a.remove();toast('Excel downloaded.');
};

/* ===== Annexure-Ga (customer wise), one set of pages per branch ===== */
const FW_GAFILL=['','','','','','','#FCD5B4','#FCD5B4','#FCD5B4','#FCD5B4','#92D050','#92D050','#92D050','#92D050','#FCD5B4','#FCD5B4','','','#92D050','#FCD5B4','#C6D9F1',''];
const FW_GANUM={9:'১০= (৭+৮+৯)',13:'১৪=(১১+১২+১৩)',15:'১৬=(৭-১১)',19:'২০=(১৫-১৬-১৯)'};
function fwGaSets(rows){
  const m=new Map();rows.forEach(r=>{const k=r.code||r.br;if(!m.has(k))m.set(k,{code:r.code,br:r.br,rs:[]});m.get(k).rs.push(r.raw)});
  const g=[...m.values()].filter(x=>!FW.gbr||x.code===FW.gbr).sort((x,y)=>{const e=z=>{const o=(S.offices||[]).find(q=>q.code===z.code);return o?o.name:'~'+z.br};return e(x).localeCompare(e(y),'en')});if(!g.length)return[];
  const rs=[],brs=[],tot=new Array(22).fill(0);
  g.forEach(x=>x.rs.forEach(r=>{rs.push(r);brs.push(x.br);for(let c=6;c<=20;c++){const v=gaNum(r[c]);if(!isNaN(v))tot[c]=fw2(tot[c]+fw2(v))}}));
  return[{br:g.length===1?g[0].br:'',rs,brs,tot}];
}
function fwGaHtml(sets){
  const th=(t,c,o='')=>`<th ${o} style="${FW_GAFILL[c]?'background:'+FW_GAFILL[c]+';':''}">${esc(t)}</th>`,PER=18;let h='';
  const R2=[[0,'ক্র.নং.'],[1,'ঋণ গ্রহীতার নাম'],[2,'হিসাব নং'],[3,'ঋণের ধরণ/ প্রকৃতি'],[4,'ঋণ বিতরণের তারিখ'],[5,'ক্ষতি হিসাবে শ্রেণীকরণের তারিখ'],[6,'আসল']];
  sets.forEach(set=>{
    const n=set.rs.length,pn=Math.max(1,Math.ceil(n/PER));
    for(let p=0;p<pn;p++){
      const last=p===pn-1;
      h+=`<div class="lfpage fwpage fwland"><div class="fwin" style="padding:9mm 8mm"><div style="text-align:center;font-size:15pt;font-weight:700">জনতা ব্যাংক পিএলসি.</div><div style="text-align:center;font-size:12pt;font-weight:700">এরিয়া অফিস, সিরাজগঞ্জ</div>
      <p style="font-size:9.5pt;margin:2mm 0 1mm;text-align:justify">${FW_GSUBJ}</p>
      ${pn>1?`<div style="font-size:9pt;text-align:right">পাতা ${toBn(p+1)}/${toBn(pn)}</div>`:''}
      <table class="fwt" style="table-layout:auto"><tr>${R2.slice(0,1).map(([c,t])=>th(t,c,'rowspan="2"')).join('')}${th('শাখা',0,'rowspan="2"')}${R2.slice(1).map(([c,t])=>th(t,c,'rowspan="2"')).join('')}${th('আরোপিত দায়',7,'colspan="2"')}${th('মোট দায়',9,'rowspan="2"')}${th('পরিশোধ',10,'colspan="3"')}${[[13,'মোট পরিশোধ'],[14,'লেজার বকেয়া'],[15,'আদায়যোগ্য আসল']].map(([c,t])=>th(t,c,'rowspan="2"')).join('')}${th('অনারোপিত সুদ',16,'colspan="2"')}${[[18,'ইন্টারেস্ট সাসপেন্স এর পরিমাণ'],[19,'যাচিত CIBTCA এর পরিমাণ'],[20,'কস্ট অব ফান্ড এর পরিমাণ'],[21,'অবলোপনকৃত কি’না?']].map(([c,t])=>th(t,c,'rowspan="2"')).join('')}</tr>
      <tr>${[[7,'সুদ'],[8,'অন্যান্য খরচ'],[10,'আসল'],[11,'সুদ'],[12,'অন্যান্য খরচ'],[16,'সাধারণ সুদ'],[17,'দণ্ড সুদ']].map(([c,t])=>th(t,c)).join('')}</tr>
      <tr><th style="background:#D9D9D9">১</th><th style="background:#D9D9D9">০</th>${FW_GAFILL.slice(1).map((f,c0)=>{const c=c0+1;return`<th style="background:#D9D9D9">${FW_GANUM[c]||toBn(c+1)}</th>`}).join('')}</tr>
      ${set.rs.slice(p*PER,(p+1)*PER).map((r,i)=>`<tr><td style="text-align:center">${toBn(p*PER+i+1)}</td><td style="text-align:left">${esc(set.brs[p*PER+i])}</td>${r.slice(1).map((c,k0)=>{const k=k0+1;return`<td style="${k===1?'white-space:nowrap;text-align:left':k>=6&&k<=20?'text-align:right':'text-align:center'}">${k===1?esc(c):k>=6&&k<=20?fwN(isNaN(gaNum(c))?0:fw2(gaNum(c))):toBn(String(c))}</td>`}).join('')}</tr>`).join('')}
      ${last?`<tr style="font-weight:700"><td colspan="7" style="text-align:center">সর্বমোট</td>${set.tot.slice(6,21).map(c=>`<td style="text-align:right">${fwN(c)}</td>`).join('')}<td></td></tr>`:''}</table>
      </div></div>`;
    }
  });
  return h;
}
A.fwGaXl=async()=>{
  const rows=fwData();if(!rows.length||!FW.ga)return toast('Upload the Annexure-Ga (customer wise) Excel first.');
  const sets=fwGaSets(rows);if(!sets.length)return toast('No uploaded file is saved to this branch.');
  await gaLoadLib();const wb=XLSX.utils.book_new(),used=new Set();
  sets.forEach((st,i)=>{
    const H=[FW_GA_HEAD[0],'শাখা',...FW_GA_HEAD.slice(1)],aoa=[['জনতা ব্যাংক পিএলসি.'],['এরিয়া অফিস, সিরাজগঞ্জ'],[FW_GSUBJ],H,[1,0,...FW_GA_HEAD.slice(1).map((_,c)=>c+2)],
      ...st.rs.map((r,k)=>[k+1,st.brs[k],...r.slice(1).map((c,j0)=>{const j=j0+1;return j>=6&&j<=20?(isNaN(gaNum(c))?0:fw2(gaNum(c))):String(c)})]),
      ['','সর্বমোট','','','','','',...st.tot.slice(6,21),'']];
    const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!merges']=[0,1,2].map(r=>({s:{r,c:0},e:{r,c:22}}));ws['!cols']=H.map((_,c)=>({wch:c===2?30:c===3?16:c<7?14:13}));
    let n=String(st.br||'Annexure-Ga').replace(/[\[\]:*?\/\\]/g,' ').slice(0,28);while(used.has(n.toLowerCase()))n=n.slice(0,25)+'-'+(i+1);used.add(n.toLowerCase());XLSX.utils.book_append_sheet(wb,ws,n);
  });
  XLSX.writeFile(wb,'JBRS_Annexure-Ga_'+(FW.gbr||'all')+'.xlsx');
};
const FW_GA_HEAD=['ক্র.নং','ঋণ গ্রহীতার নাম','হিসাব নং','ঋণের ধরণ/প্রকৃতি','ঋণ বিতরণের তারিখ','ক্ষতি হিসাবে শ্রেণীকরণের তারিখ','আসল','আরোপিত দায়: সুদ','আরোপিত দায়: অন্যান্য খরচ','মোট দায়','পরিশোধ: আসল','পরিশোধ: সুদ','পরিশোধ: অন্যান্য খরচ','মোট পরিশোধ','লেজার বকেয়া','আদায়যোগ্য আসল','অনারোপিত সাধারণ সুদ','অনারোপিত দন্ড সুদ','ইন্টারেস্ট সাসপেন্সের পরিমাণ','যাচিত CIBTCA এর পরিমাণ','কস্ট অব ফান্ড এর পরিমাণ','অবলোপনকৃত কিনা?'];
async function fwSaved(){
  const el=$('#fwsaved');if(!el)return;el.innerHTML='<span class="muted small">Loading...</span>';
  try{const j=await api('/ga/rows?office=all');const nm=c=>{const o=(S.offices||[]).find(x=>x.code===c);return c+(o?' - '+o.name.replace(/ Branch, Sirajganj$/,''):'')};
    const b=(j.batches||[]).slice().sort((x,y)=>nm(x.office).localeCompare(nm(y.office),'en')||String(y.uploaded).localeCompare(String(x.uploaded)));FW.sv=b;
    el.innerHTML=b.length?`<table class="fwft fwfx" style="width:100%"><colgroup><col style="width:190px"><col><col style="width:60px"><col style="width:140px"><col style="width:110px"></colgroup><tr><th>Branch</th><th>File Name</th><th>Loans</th><th>Saved on</th><th></th></tr>${b.map((x,i)=>`<tr><td title="${esc(nm(x.office))}">${esc(nm(x.office))}</td><td title="${esc(x.fname)}">${esc(x.fname)}</td><td>${x.nrows}</td><td>${esc(String(x.uploaded).slice(0,16).replace('T',' '))}</td><td><a href="#" onclick="fwSavedView(${i});return false">View</a> &nbsp; <a href="#" onclick="run(()=>fwSavedDel('${esc(x.id)}'));return false">Remove</a></td></tr>`).join('')}</table>`:'<span class="muted small">Nothing saved yet.</span>';
  }catch(e){el.innerHTML='<span class="muted small">'+esc(e.message)+'</span>'}
}
function fwSavedView(i){
  const x=(FW.sv||[])[i];if(!x)return;const o=(S.offices||[]).find(q=>q.code===x.office),nm=o?o.name.replace(/ Branch, Sirajganj$/,''):x.office,tot=new Array(22).fill(0);
  x.rows.forEach(r=>{for(let c=6;c<=20;c++){const v=gaNum(r[c]);if(!isNaN(v))tot[c]=fw2(tot[c]+fw2(v))}});
  const bn=o&&(o.nameBn||'').split(/\s*,\s*/)[0].replace(/\s*শাখা$/,'')||nm,v=$('#fwview');FW.show=false;
  v.innerHTML='<div style="overflow:auto">'+fwGaHtml([{br:bn,rs:x.rows,brs:x.rows.map(()=>bn),tot}])+'</div>';fwFitZoom(v);v.scrollIntoView({behavior:'smooth',block:'start'});
}
async function fwSavedDel(id){if(!confirm('Remove this saved file and its rows?'))return;await api('/ga/delete',{method:'POST',body:{id}});toast('Removed.');await fwSaved()}
A.fwSave=async()=>{
  if(!FW.ga||!FW.files.length)return toast('Upload the Annexure-Ga (customer wise) Excel first.');
  const miss=FW.files.filter(f=>!f.code);if(miss.length)return toast('Select "Save to" branch for: '+miss.map(f=>f.name).join(', '));
  const key=r=>fwEn(r[2]).replace(/\s+/g,''),clean=r=>r.map(c=>typeof c==='number'?c:String(c));
  const st={},lines=[];
  for(const code of new Set(FW.files.map(f=>f.code))){const j=await api('/ga/rows?office='+encodeURIComponent(code));st[code]=(j.batches||[]).filter(b=>b.office===code).map(b=>({id:b.id,fname:b.fname,label:b.label,rows:b.rows,dirty:0}))}
  const nb=[];
  for(const f of FW.files){
    const rows=fwGaRows(f).map(r=>clean(r.raw)),ks=new Set(rows.map(key).filter(Boolean)),hit=new Set();
    st[f.code].concat(nb.filter(x=>x.code===f.code)).forEach(b=>{const keep=b.rows.filter(r=>{const k=key(r);if(k&&ks.has(k)){hit.add(fwEn(r[2]));return false}return true});if(keep.length!==b.rows.length){b.rows=keep;b.dirty=1}});
    if(hit.size)lines.push(f.name+' ('+officeName(f.code)+'): '+hit.size+' account(s) already saved will be replaced ('+[...hit].slice(0,6).join(', ')+(hit.size>6?', ...':'')+')');
    nb.push({code:f.code,fname:f.name,label:'Annexure-Ga '+FW.d,rows,isNew:1});
  }
  if(lines.length&&!confirm(lines.join('\n')+'\n\nOnly these accounts are replaced in the older saved files; every other borrower stays. Continue?'))return;
  let n=0,rp=0;
  for(const code in st)for(const b of st[code])if(b.dirty){await api('/ga/delete',{method:'POST',body:{id:b.id}});if(b.rows.length)await api('/ga/upload',{method:'PUT',body:{office:code,label:b.label,fname:b.fname,head:FW_GA_HEAD,rows:b.rows.map((r,i)=>{r=r.slice();r[0]=i+1;return r})}})}
  for(const b of nb)if(b.rows.length){await api('/ga/upload',{method:'PUT',body:{office:b.code,label:b.label,fname:b.fname,head:FW_GA_HEAD,rows:b.rows.map((r,i)=>{r=r.slice();r[0]=i+1;return r})}});n+=b.rows.length}
  toast('Saved '+n+' loan(s) from '+nb.length+' file(s). See Annexure-Ga (All).');{const d=$('#fwsaved');if(d&&d.closest('details').open)fwSaved()}
};


