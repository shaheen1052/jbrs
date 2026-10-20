/* ================= AT A GLANCE (এক নজরে) ================= */
const MBN=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
const S1=[
 ['ক','dep','আমানত (প্রদেয় বিলসহ)','grow'],
 ['খ','adv','ঋণ ও অগ্রিম','grow'],
 ['গ','op','পরিচালন মুনাফা','flow'],
 ['ঘ','imp','আমদানি','flow'],
 ['ঙ','exp','রপ্তানি','flow'],
 ['চ','rem','ফরেন রেমিট্যান্স','flow'],
 ['ছ','nii','সুদ বহির্ভূত আয়','flow'],
 ['জ','cl','শ্রেণীকৃত ঋণ (স্থিতি)','cl'],
 ['ঝ','clr','শ্রেণীকৃত ঋণের হার','clr'],
 ['ঞ','clc','শ্রেণীকৃত ঋণ হতে নগদ আদায়','flow'],
 ['','clo','অন্যান্য মাধ্যমে হ্রাস','flow'],
 ['','clt','মোট আদায়/হ্রাস','sum'],
 ['ট','wo','অবলোপনকৃত ঋণ স্থিতি','grow'],
 ['ঠ','woc','অবলোপনকৃত ঋণ হতে নগদ আদায়','flow'],
 ['ড','auto','অটোচালান','flow'],
 ['ঢ','acc','আমানত হিসাব খোলার লক্ষ্যমাত্রা','flow'],
 ['ণ','dc','টাকা পে/ভিসা ডেবিট কার্ড','flow'],
 ['ত','cc','ভিসা ক্রেডিট কার্ড','flow'],
 ['থ','ej','ই-জনতা এ্যাক্টিভেশন','flow'],
 ['দ','qr','বাংলা কিউ আর','flow']];
const S5R=[['খ','CMSME ঋণ বিতরণ',null],['1','বাণিজ্যিক ঋণ প্রকল্প','cm1'],['2','কার্যকরী মূলধন ঋণ (সিসি)','cm2'],['3','ট্রেডিং খাত','cm3'],['4','সেবা খাত','cm4'],['','CMSME মোট (১-৪)','cmT'],
 ['গ','মহিলা উদ্যোক্তা','wom'],['ঘ','চাকুরীজীবি','job'],['ঙ','CGS (ক্রেডিট গ্যারান্টি স্কিম)','cgs'],['চ','Start Up','sup'],['ছ','স্বল্প মেয়াদী কৃষি ঋণ','sag'],['জ','অন্যান্য ঋণ','oth']];
const S5C=['pc','pa','ta','ac','aa'];
const S6R=[['ক','cur','চলতি হিসাব'],['খ','sav','সঞ্চয়ী হিসাব'],['গ','snd','এসএনডি হিসাব'],['ঘ','fdr','স্থায়ী আমানত'],['ঙ','smart','জনতা ব্যাংক স্মার্ট একাউন্ট'],['চ','npd','নতুন প্রজন্ম দ্বিগুণ মুনাফা স্কিম'],['ছ','jbs','জেবি আমার সঞ্চয় আমার মুনাফা স্কিম'],['জ','dps','জনতা ব্যাংক ডিপোজিট পেনশন স্কিম'],['ঝ','koti','জনতা ব্যাংক কোটিপতি ডিপোজিট স্কিম'],['ঞ','oth','অন্যান্য'],['ট','stu','স্টুডেন্ট ব্যাংক হিসাব'],['ঠ','hajj','হজ্ব ডিপোজিট স্কিম'],['ড','umr','ওমরাহ ডিপোজিট স্কিম']];
const S6C=['pc','pa','tc','ta','ac','aa'];
const S7R=[['ক','cl','শ্রেণীকৃত ঋণ হতে আদায় ও সমন্বয়'],['খ','wo','অবলোপনকৃত ঋণ হতে আদায় ও সমন্বয়']];
const S7C=['bc','ba','cc','ca','rc','ra','wc','wa'];
const YC=['y2','y1','y0'];
const GHEAD=[['h.name','শাখা প্রধানের নাম ও পদবী','text'],['h.join','শাখা প্রধান হিসাবে যোগদানের তারিখ','date'],['h.bjoin','ব্যাংকে যোগদানের তারিখ','date'],['h.bdesig','ব্যাংকে যোগদানকালীন পদবী','text'],['h.org','অর্গানোগ্রাম অনুযায়ী জনবল (জন)','number'],['h.now','বিদ্যমান জনবল (জন)','number'],['h.grade','শাখার গ্রেড','text']];

const BND='০১২৩৪৫৬৭৮৯';
const toBn=v=>String(v??'').replace(/[0-9]/g,d=>BND[d]);
const toEn=v=>String(v??'').replace(/[০-৯]/g,d=>BND.indexOf(d));
const bnName=code=>{const o=office(code);return o?(o.nameBn||o.name):code};
const bnPeriod=p=>{const x=gctx(p);return x.mon};
function gctx(period){const [y,m]=period.split('-').map(Number);const last=new Date(y,m,0).getDate();return{Y:y,m,asOn:toBn(String(last).padStart(2,'0')+'/'+String(m).padStart(2,'0')+'/'+y),mon:MBN[m-1]+'-'+toBn(y)}}
function fmtN(v){if(v===null||v===undefined||!isFinite(v))return'';return Number(v).toLocaleString('en-IN',{maximumFractionDigits:4})}
function gfmt(v,f){if(v===null||v===undefined||!isFinite(v))return f==='p'?'-':'';if(f==='p')return toBn((v*100).toFixed(2))+'%';return toBn(fmtN(v))}
function gcalc(g,g9,period){
  const f=gctx(period).m/12,c={};
  const has=k=>g[k]!==undefined&&g[k]!==null&&String(g[k]).trim()!==''&&!isNaN(parseFloat(g[k]));
  const n=k=>has(k)?parseFloat(g[k]):0;
  const val=k=>(k in c)?c[k]:(has(k)?parseFloat(g[k]):null);
  const div=(a,b)=>(a===null||b===null||!b)?null:a/b;
  for(const [,k,,ty] of S1){
    if(ty==='grow'){const p=has(k+'.t')?n(k+'.y1')+(n(k+'.t')-n(k+'.y1'))*f:null;c[k+'.p']=p;c[k+'.r']=has(k+'.a')&&p!==null?div(n(k+'.a')-n(k+'.y1'),p-n(k+'.y1')):null}
    if(ty==='flow'){const p=has(k+'.t')?n(k+'.t')*f:null;c[k+'.p']=p;c[k+'.r']=has(k+'.a')?div(n(k+'.a'),p):null}
  }
  for(const q of ['y2','y1','t','a'])c['clt.'+q]=(has('clc.'+q)||has('clo.'+q))?n('clc.'+q)+n('clo.'+q):null;
  c['clt.p']=(c['clc.p']===null&&c['clo.p']===null)?null:(c['clc.p']||0)+(c['clo.p']||0);
  c['clt.r']=div(c['clt.a'],c['clt.p']);
  c['cl.t']=has('cl.y1')?n('cl.y1')-(c['clt.t']||0):null;
  c['cl.p']=has('cl.y1')?n('cl.y1')-(c['clt.p']||0):null;
  c['cl.r']=has('cl.a')?div(n('cl.a'),c['cl.p']):null;
  for(const q of ['y2','y1','t','p','a'])c['clr.'+q]=div(val('cl.'+q),val('adv.'+q));
  c['clr.r']=div(c['clr.a'],c['clr.p']);
  YC.forEach(y=>c['mix.high.'+y]=has('mix.low.'+y)?100-n('mix.low.'+y):null);
  c['l5.total']=val('adv.a');
  c['l5.net']=c['l5.total']===null?null:c['l5.total']-n('l5.staff')-n('l5.agri');
  const tot=(keys)=>keys.some(has)?keys.reduce((s,k)=>s+n(k),0):null;
  S5C.forEach(q=>c['l5.cmT.'+q]=tot(['cm1','cm2','cm3','cm4'].map(r=>'l5.'+r+'.'+q)));
  S6C.forEach(q=>c['na.tot.'+q]=tot(S6R.map(r=>'na.'+r[1]+'.'+q)));
  S7C.forEach(q=>c['rc.tot.'+q]=tot(S7R.map(r=>'rc.'+r[1]+'.'+q)));
  const a9=(g9||[]).map(x=>parseFloat(x.amt)).filter(v=>!isNaN(v));
  c['s9.tot']=a9.length?a9.reduce((s,v)=>s+v,0):null;
  return c;
}
function gIn(r,k,edit,type){
  const v=r.g[k]??'';
  if(!edit){if(type==='text')return esc(toBn(v));if(type==='date')return esc(toBn(fmtD(v)));return v===''?'':toBn(fmtN(parseFloat(v)))}
  if(type==='text'||type==='date')return`<input class="gi gtxt" type="${type}" data-k="${k}" value="${esc(v)}" oninput="A.gset(this)">`;
  return`<input class="gi" type="text" inputmode="decimal" data-num="1" data-k="${k}" value="${esc(toBn(v))}" oninput="A.gset(this)">`;
}
const gsec=(no,t,unit)=>`<div class="gsec"><div>${toBn(no)}. ${t}</div>${unit?`<span>${unit}</span>`:''}</div>`;
function renderGlance(r,edit){
  r.g=r.g||{};r.g9=r.g9||[];
  const c=gcalc(r.g,r.g9,r.period),x=gctx(r.period),Y=x.Y;
  const E=k=>`<td class="gn">${gIn(r,k,edit)}</td>`;
  const C=(k,f)=>`<td class="gn gc"><span data-c="${k}" data-f="${f||'n'}">${gfmt(c[k],f)}</span></td>`;
  const SN='<th>সংখ্যা</th><th>পরিমাণ<br>(লক্ষ টাকা)</th>';
  let h=`<div class="bn glance"><div class="gtitle">এক নজরে ${x.asOn} ভিত্তিক তথ্যাবলী :-</div>`;
  if(edit)h+=`<div class="note n-info" style="font-family:inherit">রঙিন ঘরগুলো স্বয়ংক্রিয়ভাবে হিসাব হয়। ১ ও ৫ নং অংশের অঙ্ক কোটি টাকায়, অন্যান্য সারণির অঙ্ক লক্ষ টাকায়। বাংলা বা ইংরেজি যেকোনো অঙ্কে লেখা যাবে; সব অঙ্ক বাংলায় দেখাবে।</div>`;
  h+=`<div class="ghead">${GHEAD.map(([k,l,t])=>`<div><label>${l}</label>${edit?gIn(r,k,true,t):`<div class="gv">${gIn(r,k,false,t)||'-'}</div>`}</div>`).join('')}</div>`;
  // Section 1
  h+=gsec('1','বিভিন্ন ব্যবসায়িক সূচকের লক্ষ্যমাত্রা ও অর্জনের তথ্য','(কোটি টাকায়)');
  h+=`<div class="gscroll"><table class="gt"><tr><th>ক্রম</th><th>খাতের নাম</th><th>অর্জন/${toBn(Y-2)}</th><th>অর্জন/${toBn(Y-1)}</th><th>লক্ষ্যমাত্রা/${toBn(Y)}</th><th>আনুপাতিক লক্ষ্যমাত্রা<br>${x.asOn}</th><th>অর্জন<br>${x.asOn}</th><th>অর্জনের হার</th></tr>`;
  for(const [sl,k,lab,ty] of S1){
    let cells;
    if(ty==='grow'||ty==='flow')cells=E(k+'.y2')+E(k+'.y1')+E(k+'.t')+C(k+'.p')+E(k+'.a')+C(k+'.r','p');
    else if(ty==='sum')cells=['y2','y1','t','p','a'].map(q=>C(k+'.'+q)).join('')+C(k+'.r','p');
    else if(ty==='cl')cells=E('cl.y2')+E('cl.y1')+C('cl.t')+C('cl.p')+E('cl.a')+C('cl.r','p');
    else cells=['y2','y1','t','p','a','r'].map(q=>C(k+'.'+q,'p')).join('');
    h+=`<tr${ty==='sum'?' class="gsum"':''}><td class="gc0">${toBn(sl)}</td><td class="glab">${lab}</td>${cells}</tr>`;
  }
  h+='</table></div>';
  // Sections 2-4
  const yh=YC.map((y,i)=>`<th>${toBn(Y-2+i)} (%)</th>`).join('');
  h+=`<div class="gflex"><div>${gsec('2','আমানতের মিশ্রণ')}<table class="gt"><tr><th></th>${yh}</tr><tr><td class="glab">স্বল্প সুদের আমানত</td>${YC.map(y=>E('mix.low.'+y)).join('')}</tr><tr><td class="glab">উচ্চ সুদের আমানত</td>${YC.map(y=>C('mix.high.'+y)).join('')}</tr></table></div>
  <div>${gsec('3','কস্ট অব ফান্ড সংক্রান্ত তথ্য')}<table class="gt"><tr>${yh}</tr><tr>${YC.map(y=>E('cof.'+y)).join('')}</tr></table></div>
  <div>${gsec('4','ADR (স্টাফ ঋণ ব্যতীত)')}<table class="gt"><tr>${yh}</tr><tr>${YC.map(y=>E('adr.'+y)).join('')}</tr></table></div></div>`;
  // Section 5
  h+=gsec('5','ঋণ ও অগ্রিম সংক্রান্ত তথ্যাদি','(কোটি টাকায়)');
  h+=`<div class="gscroll"><table class="gt"><tr><th>মোট ঋণ ও অগ্রিম</th><th>স্টাফ লোন</th><th>কৃষি ও তদারকি ঋণ</th><th>স্টাফ লোন, কৃষি ও তদারকি ঋণ বাদে</th></tr><tr>${C('l5.total')}${E('l5.staff')}${E('l5.agri')}${C('l5.net')}</tr></table></div>`;
  if(edit)h+=`<div class="gnote">মোট ঋণ ও অগ্রিম স্বয়ংক্রিয়ভাবে ১-খ এর অর্জন থেকে নেওয়া হয়।</div>`;
  h+=`<div class="gscroll" style="margin-top:8px"><table class="gt"><tr><th rowspan="2" colspan="2">বিবরণ</th><th colspan="2">${toBn(Y-1)} সালে বিতরণকৃত ঋণ</th><th>লক্ষ্যমাত্রা-${toBn(Y)}</th><th colspan="2">${x.asOn} পর্যন্ত বিতরণ</th></tr><tr>${SN}<th>পরিমাণ<br>(লক্ষ টাকা)</th>${SN}</tr>`;
  for(const [sl,lab,k] of S5R){
    if(!k){h+=`<tr><td class="gc0">${toBn(sl)}</td><td class="glab" colspan="6"><b>${lab}</b></td></tr>`;continue}
    h+=`<tr${k==='cmT'?' class="gsum"':''}><td class="gc0">${toBn(sl)}</td><td class="glab">${lab}</td>${S5C.map(q=>k==='cmT'?C('l5.cmT.'+q):E('l5.'+k+'.'+q)).join('')}</tr>`;
  }
  h+='</table></div>';
  // Section 6
  h+=gsec('6','নতুন হিসাব খোলা সংক্রান্ত তথ্য');
  h+=`<div class="gscroll"><table class="gt"><tr><th rowspan="2" colspan="2">বিবরণ</th><th colspan="2">অর্জন ${toBn(Y-1)}</th><th colspan="2">লক্ষ্যমাত্রা-${toBn(Y)}</th><th colspan="2">অর্জন ${x.asOn}</th></tr><tr>${SN}${SN}${SN}</tr>`;
  for(const [sl,k,lab] of S6R)h+=`<tr><td class="gc0">${toBn(sl)}</td><td class="glab">${lab}</td>${S6C.map(q=>E('na.'+k+'.'+q)).join('')}</tr>`;
  h+=`<tr class="gsum"><td></td><td class="glab">মোট</td>${S6C.map(q=>C('na.tot.'+q)).join('')}</tr></table></div>`;
  // Section 7
  h+=gsec('7','শ্রেণীকৃত/অবলোপনকৃত ঋণ আদায় ও সমন্বয়');
  h+=`<div class="gscroll"><table class="gt"><tr><th rowspan="2" colspan="2">বিবরণ</th><th colspan="2">৩১/১২/${toBn(Y-1)} তারিখ ভিত্তিক স্থিতি</th><th colspan="2">${x.asOn} পর্যন্ত নগদ আদায়</th><th colspan="2">${x.asOn} পর্যন্ত পুনঃতফসিলের মাধ্যমে আদায়</th><th colspan="2">${x.asOn} পর্যন্ত সুদ মওকুফের মাধ্যমে আদায়</th></tr><tr>${SN}${SN}${SN}${SN}</tr>`;
  for(const [sl,k,lab] of S7R)h+=`<tr><td class="gc0">${toBn(sl)}</td><td class="glab">${lab}</td>${S7C.map(q=>E('rc.'+k+'.'+q)).join('')}</tr>`;
  h+=`<tr class="gsum"><td></td><td class="glab">সর্বমোট</td>${S7C.map(q=>C('rc.tot.'+q)).join('')}</tr></table></div>`;
  // Section 8
  h+=gsec('8','বিআরপিডি-২৩ সংক্রান্ত তথ্য');
  h+=`<div class="gscroll"><table class="gt" style="max-width:620px"><tr><th colspan="2">${x.asOn} পর্যন্ত প্রেরিত প্রস্তাব</th><th colspan="2">৩১/১২/${toBn(Y)} পর্যন্ত প্রেরণ করা যাবে</th></tr><tr>${SN}${SN}</tr><tr>${['sc','sa','pc','pa'].map(q=>E('brpd.'+q)).join('')}</tr></table></div>`;
  // Section 9
  const src=r.g9.some(z=>z._src);
  h+=gsec('9',`নতুন ঋণ হিসাবের তথ্য (সকল প্রকার কৃষি ঋণ, পার্সোনাল ঋণ, এসওডি, তদারকি ঋণ ও স্টাফ ঋণ ব্যতীত) ${x.mon} পর্যন্ত`);
  h+=`<div class="gscroll"><table class="gt"><tr><th>ক্রম</th>${src?'<th>শাখা</th>':''}<th>হিসাব নম্বর</th><th>ঋণের ধরণ</th><th>মঞ্জুরীকৃত ঋণ<br>(লক্ষ টাকা)</th><th>মঞ্জুরীর তারিখ</th>${edit?'<th></th>':''}</tr>`;
  r.g9.forEach((z,i)=>{
    const ti=(k,t)=>edit?(t==='number'?`<input class="gi" type="text" inputmode="decimal" data-num="1" value="${esc(toBn(z[k]??''))}" oninput="A.g9set(this,${i},'${k}')">`:`<input class="gi gtxt" type="${t}" value="${esc(z[k]??'')}" oninput="A.g9set(this,${i},'${k}')">`):(t==='date'?esc(toBn(fmtD(z[k]))):t==='number'?toBn(fmtN(parseFloat(z[k]))):esc(toBn(z[k])));
    h+=`<tr><td class="gc0">${toBn(i+1)}</td>${src?`<td>${esc(bnName(z._src))}</td>`:''}<td>${ti('acc','text')}</td><td>${ti('type','text')}</td><td class="gn">${ti('amt','number')}</td><td style="text-align:center">${ti('date','date')}</td>${edit?`<td><button class="sm dan" onclick="A.g9del(${i})">&times;</button></td>`:''}</tr>`;
  });
  if(!r.g9.length)h+=`<tr><td colspan="${src?6:5}" class="muted" style="text-align:center">-</td>${edit?'<td></td>':''}</tr>`;
  h+=`<tr class="gsum"><td></td>${src?'<td></td>':''}<td colspan="2" class="glab">মোট</td>${C('s9.tot')}<td></td>${edit?'<td></td>':''}</tr></table></div>`;
  if(edit)h+=`<div class="bar"><button class="sm" onclick="A.g9add()">+ ঋণ হিসাব যোগ করুন</button></div>`;
  return h+'</div>';
}
function gRecalc(){const r=curRep();if(!r)return;const c=gcalc(r.g,r.g9,r.period);document.querySelectorAll('#app [data-c]').forEach(e=>{e.textContent=gfmt(c[e.dataset.c],e.dataset.f)})}
function numIn(el){let v=el.value;if(el.dataset.num!=='1')return v;const en=toEn(v).replace(/[^0-9.\-]/g,'');const bn=toBn(en);if(bn!==v){const pos=Math.max(0,(el.selectionStart||0)-(v.length-bn.length));el.value=bn;try{el.setSelectionRange(pos,pos)}catch(e){}}return en}
A.gset=el=>{curRep().g[el.dataset.k]=numIn(el);gRecalc()};
A.g9set=(el,i,k)=>{curRep().g9[i][k]=numIn(el);gRecalc()};
A.g9add=()=>{curRep().g9.push({acc:'',type:'',amt:'',date:''});renderApp()};
A.g9del=i=>{curRep().g9.splice(i,1);renderApp()};
function validateGlance(r){
  const filled=k=>r.g[k]!==undefined&&String(r.g[k]).trim()!=='';
  if(!filled('h.name'))throw new Error('Enter the branch head name and designation (শাখা প্রধানের নাম ও পদবী).');
  if(!filled('dep.a'))throw new Error('Section 1-ক: enter the deposit achievement (আমানত অর্জন).');
  if(!filled('adv.a'))throw new Error('Section 1-খ: enter the loan and advance achievement (ঋণ ও অগ্রিম অর্জন).');
  r.g9=r.g9.filter(z=>['acc','type','amt','date'].some(k=>String(z[k]||'').trim()));
  r.g9.forEach((z,i)=>{if(!String(z.acc||'').trim()||isNaN(parseFloat(z.amt)))throw new Error('Section 9, row '+(i+1)+': account number and sanctioned amount are required.')});
  const low=['y2','y1','y0'].find(y=>filled('mix.low.'+y)&&(parseFloat(r.g['mix.low.'+y])<0||parseFloat(r.g['mix.low.'+y])>100));
  if(low)throw new Error('Section 2: low-cost deposit % must be between 0 and 100.');
}
function carryGlance(leaf,p){
  const prev=S.session.data.reports.filter(r=>r.leaf===leaf&&!r.consolidated&&r.period<p).sort((a,b)=>b.period.localeCompare(a.period))[0];
  if(!prev)return{g:{},g9:[],from:null};
  if(prev.period.slice(0,4)===p.slice(0,4))return{g:{...prev.g},g9:(prev.g9||[]).map(z=>({...z})),from:prev.period,same:true};
  const o=prev.g||{},g={};
  Object.keys(o).filter(k=>k.startsWith('h.')).forEach(k=>g[k]=o[k]);
  S1.forEach(([,k])=>{g[k+'.y2']=o[k+'.y1'];g[k+'.y1']=o[k+'.a']});
  ['mix.low','cof','adr'].forEach(b=>{g[b+'.y2']=o[b+'.y1'];g[b+'.y1']=o[b+'.y0']});
  S5R.forEach(([,,k])=>{if(k&&k!=='cmT'){g['l5.'+k+'.pc']=o['l5.'+k+'.ac'];g['l5.'+k+'.pa']=o['l5.'+k+'.aa']}});
  S6R.forEach(([,k])=>{g['na.'+k+'.pc']=o['na.'+k+'.ac'];g['na.'+k+'.pa']=o['na.'+k+'.aa']});
  Object.keys(g).forEach(k=>{if(g[k]===undefined)delete g[k]});
  return{g,g9:[],from:prev.period,same:false};
}
function consolidateGlance(got){
  const g={},g9=[],W=got.map(z=>parseFloat(z.core.g['dep.a'])||0),Wt=W.reduce((a,b)=>a+b,0);
  const keys=new Set();got.forEach(z=>Object.keys(z.core.g||{}).forEach(k=>keys.add(k)));
  for(const k of keys){
    if(k.startsWith('h.')&&k!=='h.org'&&k!=='h.now')continue;
    const vals=got.map(z=>parseFloat(z.core.g[k]));
    if(vals.every(v=>isNaN(v)))continue;
    if(/^(mix|cof|adr)\./.test(k)){let s=0,w=0;vals.forEach((v,i)=>{if(!isNaN(v)){const wi=Wt?W[i]:1;s+=v*wi;w+=wi}});g[k]=w?String(+(s/w).toFixed(4)):''}
    else g[k]=String(+vals.reduce((a,v)=>a+(isNaN(v)?0:v),0).toFixed(6));
  }
  got.forEach(z=>(z.core.g9||[]).forEach(rw=>g9.push({...rw,_src:rw._src||z.core.office})));
  return{g,g9};
}
