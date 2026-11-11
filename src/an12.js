/* ================= Interest waiver: Annexure-2 (branch) and Annexure-1 (Area Office) =================
   Circular 1411/26 (02/07/2026), RCD-3 letter 10/11/2026: SutonnyMJ size 11, 0.00, dd/mm/yyyy,
   CIBTCA = ledger balance - interest suspense (zero for written-off loans); zero-CIBTCA loans go to the
   "Without CIBTCA" sheet. Each loan is marked RCD-3 or RCD-4 by the branch; reports are made per department. */
const AN={leaf:'rc_an2',p:'2026-06',div:'বগুড়া',area:'সিরাজগঞ্জ',rcd:'RCD-3',rep:'',br:'all',cur:null,list:null};
const AN_SUBJ='বিষয়ঃ নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখ ০২/০৭/২০২৬ অনুযায়ী বিশেষ এক্সিট সুবিধার আওতায় কৃষি ও পল্লী ঋণসমূহের ৩০/০৬/২০২৬ জুন ভিত্তিক ক্ষতি হিসাবে শ্রেণিকৃত অনাদায়ী ঋণ হিসাবের তথ্যাদি।';
const AN_N2='*বি.দ্র.: অবলোপনকৃত ঋণের ক্ষেত্রে যাচিত CIBTCA এর পরিমাণ অবশ্যই শূণ্য(০) হবে।';
const AN_N1='*বি.দ্র.: অবলোপনকৃত ঋণের ক্ষেত্রে যাচিত CIBTCA এর পরিমাণ অবশ্যই শূণ্য(০) হবে এবং লেজার স্থিতি থাকলে তা মোট মওকুফযোগ্য টাকার সাথে যোগ করতে হবে।';
const AN_NGA='বিঃ দ্রঃ- নির্দেশ বিজ্ঞপ্তি নং- ১৪১১/২৬ তারিখঃ ০২/০৭/২০২৬ মোতাবেক সুদ মওকুফের নিমিত্ত ২০ নং কলামে উল্লিখিত CIBTCA এর পরিমাণ সঠিক রয়েছে।';
const AN_F=[ // data-entry columns: key, label, kind (t text, d date, n amount, c calculated, b yes/no, s RCD), width
 ['nm','ঋণ গ্রহীতার নাম','t',170],['ac','হিসাব নং','t',130],['ty','ঋণের ধরণ/ প্রকৃতি','t',80],['dd','ঋণ বিতরণের তারিখ','d',100],['cd','ক্ষতি হিসাবে শ্রেণীকরণের তারিখ','d',100],
 ['p','আসল (মূলঋণ)','n'],['i','আরোপিত সুদ','n'],['o','আরোপিত অন্যান্য খরচ','n'],['tot','মোট দায়','c'],
 ['pp','পরিশোধ: আসল','n'],['pi','পরিশোধ: সুদ','n'],['po','পরিশোধ: অন্যান্য খরচ','n'],['paid','মোট পরিশোধ','c'],['led','লেজার বকেয়া','c'],
 ['g','অনারোপিত সাধারণ সুদ','n'],['pe','অনারোপিত দণ্ড সুদ','n'],['su','ইন্টারেস্ট সাসপেন্স','n'],['cib','যাচিত CIBTCA','c'],['cof','কস্ট অব ফান্ড','n'],
 ['wo','অবলোপনকৃত?','b',40],['rcd','RCD','s',86]];
const anR2=v=>Math.round((+v||0)*100)/100;
function anCalc(r){
  const n=k=>anR2(r[k]);const tot=anR2(n('p')+n('i')+n('o')),paid=anR2(n('pp')+n('pi')+n('po')),led=anR2(tot-paid),rp=anR2(n('p')-n('pp'));
  return{tot,paid,led,rp,cib:r.wo?0:anR2(led-n('su')),ga20:anR2(led-rp-n('su'))};
}
const anBn=code=>{const o=office(code);if(!o)return code;return String(o.nameBn||o.name_bn||o.name).split(/\s*,\s*/)[0].replace(/\s*শাখা\s*$/,'').trim()};
const anEnD=t=>String(t==null?'':t).replace(/[০-৯]/g,d=>d.charCodeAt(0)-0x9E6);
function anDate(v){
  if(v instanceof Date)return gaDmy(v);
  const t=anEnD(v).trim();const m=t.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2,4})$/);
  if(m){let y=+m[3];if(y<100)y+=2000;return String(m[1]).padStart(2,'0')+'/'+String(m[2]).padStart(2,'0')+'/'+y}
  const m2=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m2)return m2[3]+'/'+m2[2]+'/'+m2[1];
  return t;
}
const anAc=v=>{const t=anEnD(v).replace(/\s/g,'');return/^100\d{9}$/.test(t)?'0'+t:t};
const anNum=v=>{const x=gaNum(v);return isNaN(x)?0:anR2(x)};

/* ---------- reading Excel files: Annexure-Ga (calculator) or Annexure-2, Unicode or Bijoy ---------- */
async function anReadFile(f){
  await gaLoadLib();const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});const out=[];let kind='',upz='';
  for(const sn of wb.SheetNames){
    const a=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true});
    const nr=a.findIndex(r=>anEnD(r[0]).trim()==='1'&&anEnD(r[1]).trim()==='2'&&anEnD(r[2]).trim()==='3');if(nr<0)continue;
    const cnt=a[nr].filter(c=>String(c).trim()!=='').length,uni=a.slice(0,nr).some(r=>r.some(c=>/[ঀ-৿]/.test(String(c))));
    const tx=v=>{v=v instanceof Date?gaDmy(v):String(v==null?'':v).trim();if(!v||/[ঀ-৿]/.test(v))return v;return(uni?bjLooks(v):/[A-Za-z¡-ÿ–-›]/.test(v))?bj2u(v).trim():v};
    const head=a.slice(0,nr).map(r=>r.map(tx).join(' ')).join(' ');
    let k=cnt>=21?'ga':'';
    if(!k)continue;kind=k;
    const um=head.match(/উপজেলা\s*[:ঃ]\s*([^\s|,।]+)/);if(um&&!upz)upz=um[1];
    for(const r of a.slice(nr+1)){
      const nmi=k==='ga'?1:3,nm=tx(r[nmi]);const first=tx(r[0])+' '+tx(r[1])+' '+tx(r[2]);
      if(!nm||/মোট/.test(first+' '+nm))continue;
      if(!anEnD(tx(r[k==='ga'?2:4])).trim()&&!anNum(r[k==='ga'?6:8]))continue;
      if(k==='ga'){
        const w=tx(r[21]).replace(/[\s।.]/g,'');
        out.push({nm,ac:anAc(tx(r[2])),ty:tx(r[3]),dd:anDate(r[4]),cd:anDate(r[5]),p:anNum(r[6]),i:anNum(r[7]),o:anNum(r[8]),pp:anNum(r[10]),pi:anNum(r[11]),po:anNum(r[12]),
          g:anNum(r[16]),pe:anNum(r[17]),su:anNum(r[18]),cof:anNum(r[20]),wo:/^(হ্যাঁ|হ্যা|হাঁ|yes|y)$/i.test(w)?1:0,rcd:''});
      }else{
        const p=anNum(r[8]),paid=anNum(r[12]),pp=Math.min(p,paid);
        out.push({nm,ac:anEnD(tx(r[4])),ty:tx(r[5]),dd:anDate(r[6]),cd:anDate(r[7]),p,i:anNum(r[9]),o:anNum(r[10]),pp,pi:anR2(paid-pp),po:0,
          g:anNum(r[14]),pe:anNum(r[15]),su:anNum(r[16]),cof:anNum(r[18]),wo:0,rcd:''});
      }
    }
    if(k==='ga')break;   // the calculator file has one customer-wise sheet; Annexure-2 has CIBTCA + Without CIBTCA
  }
  return{rows:out,kind,upz};
}

/* ---------- report specs (one per sheet / list) ---------- */
const AN_GREY='#C0C0C0',AN_TOT='#FFCC99';
const anHead=(t,o={})=>({v:t,t:'h',...o});
function anLists(rows){const c=rows.filter(r=>anCalc(r).cib>0.004),w=rows.filter(r=>!(anCalc(r).cib>0.004));return[['CIBTCA',c],['Without CIBTCA',w]]}
const anTop=(annex,lines)=>[{t:'জনতা ব্যাংক পিএলসি.',sz:16,b:1},{t:'বিভাগীয় কার্যালয়, '+AN.div+'।',sz:12,b:1,u:1},{t:annex,al:'r',sz:12,b:1,u:1},...(lines||[]),{t:AN_SUBJ,sz:12,b:1,u:1,h:36}];
function anSpec2(list,rows,groups){   // Annexure-2; groups: [{name, rows}] by branch
  const star=list==='CIBTCA'?'* ':'',W=[6,10,12,20,16,10,11.5,11.5,12,12,10,13,12,13,12,11.5,11.5,12.5,12.5];
  const head=[[anHead('ক্র.নং.',{rs:2}),anHead('এরিয়ার নাম',{rs:2}),anHead('শাখার নাম',{rs:2}),anHead('ঋণ গ্রহীতার নাম',{rs:2}),anHead('হিসাব নং',{rs:2}),anHead('ঋণের ধরণ/ প্রকৃতি',{rs:2}),anHead('ঋণ বিতরণের তারিখ',{rs:2}),anHead('ক্ষতি হিসাবে শ্রেণীকরণের তারিখ',{rs:2}),anHead('মূলঋণ',{rs:2}),anHead('আরোপিত দায়',{cs:2}),anHead('মোট দায়',{rs:2}),anHead('মোট পরিশোধ',{rs:2}),anHead('লেজার বকেয়া',{rs:2}),anHead('অনারোপিত সুদ',{cs:2}),anHead('ইন্টারেস্ট সাসপেন্স এর পরিমাণ',{rs:2}),anHead(star+'যাচিত CIBTCA এর পরিমাণ',{rs:2}),anHead('কস্ট অব ফান্ড এর পরিমাণ',{rs:2})],
    [anHead('সুদ'),anHead('অন্যান্য খরচ'),anHead('সাধারণ সুদ'),anHead('দণ্ড সুদ')],
    Array.from({length:19},(_,c)=>anHead({11:'১২= (৯+১০+১১)',13:'১৪=(১২-১৩)',17:'১৮=(১৪-১৭)'}[c]||toBn(c+1),{fill:AN_GREY,num:1}))];
  const body=[],T=new Array(19).fill(0);let sl=0;
  const amt=(r,c)=>{const k=anCalc(r);return[r.p,r.i,r.o,k.tot,k.paid,k.led,r.g,r.pe,r.su,k.cib,r.cof][c-8]};
  groups.forEach(g=>{
    const S=new Array(19).fill(0);
    g.rows.forEach(r=>{sl++;const cells=[{v:sl,t:'i'},{v:AN.area,t:'x'},{v:g.name,t:'x'},{v:r.nm,t:'s'},{v:toBn(r.ac),t:'x'},{v:r.ty,t:'x'},{v:toBn(r.dd),t:'x'},{v:toBn(r.cd),t:'x'}];
      for(let c=8;c<19;c++){const v=anR2(amt(r,c));cells.push({v,t:'n'});S[c]=anR2(S[c]+v)}body.push({cells})});
    body.push({k:'s',cells:[{v:g.name+' শাখার উপমোট',t:'x',cs:8,b:1},...S.slice(8).map(v=>({v,t:'n',b:1}))]});
    for(let c=8;c<19;c++)T[c]=anR2(T[c]+S[c]);
  });
  body.push({k:'t',cells:[{v:toBn(sl)+' টি ঋণের সর্বমোট',t:'x',cs:8,b:1},...T.slice(8).map(v=>({v,t:'n',b:1}))]});
  return{sheet:list,label:list,ncol:19,W,lines:anTop('পরিশিষ্ট-০২',[]).concat([{t:'(টাকার অংকে)',al:'r',sz:11}]),head,body,notes:star?[AN_N2]:[],signs:[]};
}
function anSpec1(list,groups){   // Annexure-1: one row per branch and loan type
  const star=list==='CIBTCA'?'* ':'',W=[6,11,11,13,12,7,12,12,10,13,13,12.5,12.5,12,13,12.5,13,14,13];
  const head=[[anHead('ক্রঃ নং',{rs:2}),anHead('বিভাগের নাম',{rs:2}),anHead('এরিয়ার নাম',{rs:2}),anHead('শাখার নাম',{rs:2}),anHead('ঋণের ধরণ /প্রকৃতি',{rs:2}),anHead('ঋণ সংখ্যা',{rs:2}),anHead('আসল',{rs:2}),anHead('আরোপিত দায়',{cs:2}),anHead('মোট দায়',{rs:2}),anHead('মোট পরিশোধ',{rs:2}),anHead('লেজার বকেয়া',{rs:2}),anHead('অনারোপিত দায়',{cs:2}),anHead('মোট অনারোপিত সুদ',{rs:2}),anHead('ইন্টারেস্ট সাসপেন্স এর পরিমাণ',{rs:2}),anHead('যাচিত CIBTCA এর পরিমাণ',{rs:2}),anHead(star+'মোট মওকুফযোগ্য টাকার পরিমাণ',{rs:2}),anHead('কস্ট অব ফান্ড এর পরিমাণ',{rs:2})],
    [anHead('সুদ'),anHead('অন্যান্য খরচ'),anHead('সাধারণ সুদ'),anHead('দণ্ড সুদ')],
    Array.from({length:19},(_,c)=>anHead({9:'১০=(৬+৭+৮)',11:'১২=(১০-১১)',16:'১৭=(১২-১৬)',17:'১৮=(১৫+১৬+১৭)'}[c]||toBn(c+1),{fill:AN_GREY,num:1}))];
  const body=[],A=new Array(19).fill(0);let sl=0,nb=0;
  groups.forEach(g=>{
    const types=[...new Set(g.rows.map(r=>r.ty||''))];if(g.rows.length)nb++;
    types.forEach(ty=>{const rs=g.rows.filter(r=>(r.ty||'')===ty),v=new Array(19).fill(0);
      rs.forEach(r=>{const k=anCalc(r);v[5]+=1;v[6]+=+r.p||0;v[7]+=+r.i||0;v[8]+=+r.o||0;v[9]+=k.tot;v[10]+=k.paid;v[11]+=k.led;v[12]+=+r.g||0;v[13]+=+r.pe||0;v[15]+=+r.su||0;v[16]+=k.cib;v[18]+=+r.cof||0;if(r.wo)v[17]+=k.led});
      for(let c=6;c<19;c++)v[c]=anR2(v[c]);v[14]=anR2(v[12]+v[13]);v[17]=anR2(v[14]+v[15]+v[16]+v[17]);
      sl++;body.push({cells:[{v:sl,t:'i'},{v:AN.div,t:'x'},{v:AN.area,t:'x'},{v:g.name,t:'x'},{v:ty,t:'x'},{v:v[5],t:'i'},...v.slice(6).map(x=>({v:x,t:'n'}))]});
      for(let c=5;c<19;c++)A[c]=anR2(A[c]+v[c]);
    });
  });
  const tot=lb=>[{v:lb,t:'x',cs:5,b:1},{v:A[5],t:'i',b:1},...A.slice(6).map(v=>({v,t:'n',b:1}))];
  body.push({k:'s',cells:tot(AN.area+' এরিয়ার উপমোট')});body.push({k:'t',cells:tot(toBn(nb)+' টি শাখার সর্বমোট')});
  return{sheet:list,label:list,ncol:19,W,lines:anTop('পরিশিষ্ট-০১',[]).concat([{t:'(টাকার অংকে)',al:'r',sz:11}]),head,body,notes:star?[AN_N1]:[],signs:[]};
}
function anSpecGa(groups,area){   // Annexure-Ga in the calculator format (branch: one branch; area: with a branch column)
  const ex=area?1:0,FILL=FW_GAFILL;
  const h1=[['ক্র.নং.',0],...(area?[['শাখা',-1]]:[]),['ঋণ গ্রহীতার নাম',1],['হিসাব নং',2],['ঋণের ধরণ/ প্রকৃতি',3],['ঋণ বিতরণের তারিখ',4],['ক্ষতি হিসাবে শ্রেণীকরণের তারিখ',5],['আসল',6]].map(([t,c])=>anHead(t,{rs:2,fill:FILL[c]||''}));
  const head=[[...h1,anHead('আরোপিত দায়',{cs:2,fill:FILL[7]}),anHead('মোট দায়',{rs:2,fill:FILL[9]}),anHead('পরিশোধ',{cs:3,fill:FILL[10]}),anHead('মোট পরিশোধ',{rs:2,fill:FILL[13]}),anHead('লেজার বকেয়া',{rs:2,fill:FILL[14]}),anHead('আদায়যোগ্য আসল',{rs:2,fill:FILL[15]}),anHead('অনারোপিত সুদ',{cs:2}),anHead('ইন্টারেস্ট সাসপেন্স এর পরিমাণ',{rs:2,fill:FILL[18]}),anHead('যাচিত CIBTCA এর পরিমাণ',{rs:2,fill:FILL[19]}),anHead('কস্ট অব ফান্ড এর পরিমাণ',{rs:2,fill:FILL[20]}),anHead('অবলোপনকৃত কি’না?',{rs:2})],
    [anHead('সুদ',{fill:FILL[7]}),anHead('অন্যান্য খরচ',{fill:FILL[8]}),anHead('আসল',{fill:FILL[10]}),anHead('সুদ',{fill:FILL[11]}),anHead('অন্যান্য খরচ',{fill:FILL[12]}),anHead('সাধারণ সুদ'),anHead('দণ্ড সুদ')],
    [anHead('১',{fill:'#D9D9D9',num:1}),...(area?[anHead('০',{fill:'#D9D9D9',num:1})]:[]),...Array.from({length:21},(_,c0)=>{const c=c0+1;return anHead(FW_GANUM[c]||toBn(c+1),{fill:'#D9D9D9',num:1})})]];
  const body=[],T=new Array(22).fill(0);let sl=0;
  groups.forEach(g=>g.rows.forEach(r=>{const k=anCalc(r);sl++;const a=[r.p,r.i,r.o,k.tot,r.pp,r.pi,r.po,k.paid,k.led,k.rp,r.g,r.pe,r.su,k.ga20,r.cof].map(anR2);
    a.forEach((v,j)=>T[6+j]=anR2(T[6+j]+v));
    body.push({cells:[{v:sl,t:'i'},...(area?[{v:g.name,t:'x'}]:[]),{v:r.nm,t:'s'},{v:toBn(r.ac),t:'x'},{v:r.ty,t:'x'},{v:toBn(r.dd),t:'x'},{v:toBn(r.cd),t:'x'},...a.map(v=>({v,t:'n'})),{v:r.wo?'হ্যাঁ':'না',t:'x'}]})}));
  body.push({k:'t',cells:[{v:'সর্বমোট',t:'x',cs:6+ex,b:1},...T.slice(6,21).map(v=>({v,t:'n',b:1})),{v:'',t:'x',b:1}]});
  const g0=groups[0]||{},loc=area?{}:{upz:g0.upz||'',dist:g0.dist||''};
  const lines=[{t:'জনতা ব্যাংক পিএলসি.',sz:16,b:1},{t:'পরিশিষ্ট-গ',al:'r',sz:12,b:1,u:1},{t:AN_SUBJ,sz:12,b:1,u:1,h:36},{t:'এরিয়া অফিসের নামঃ '+AN.area,al:'l',sz:11,b:1},
    ...(area?[]:[{t:'শাখার নামঃ '+(g0.name||'')+'          উপজেলাঃ '+loc.upz+'          জেলাঃ '+loc.dist,al:'l',sz:11,b:1}]),{t:'(টাকার অংকে)',al:'r',sz:11}];
  const W=[6,...(area?[12]:[]),22,16,10,11,11,11.5,11.5,9,12,11,11,9,12,12,11.5,12,11,12,12.5,12,10];
  return{sheet:'Annexure-Ga',label:'',ncol:22+ex,W,lines,head,body,notes:[AN_NGA],signs:area?['এরিয়া অফিস সংশ্লিষ্ট কর্মকর্তা','এরিয়া অফিস প্রধান']:['কর্মকর্তা (সংশ্লিষ্ট শাখা)','ব্যবস্থাপক (সংশ্লিষ্ট শাখা)']};
}
/* place header/body cells on a grid, honouring row and column spans */
function anPlace(rows){const occ={},out=[];rows.forEach((cells,r)=>{let c=0;cells.forEach(cell=>{while(occ[r+','+c])c++;const cs=cell.cs||1,rs=cell.rs||1;
  for(let i=0;i<rs;i++)for(let j=0;j<cs;j++)occ[(r+i)+','+(c+j)]=1;out.push({r,c,cell});c+=cs})});return out}

/* ---------- PDF / screen pages ---------- */
const anNf=v=>toBn((+v||0).toFixed(2));
function anHtml(specs,per){
  let h='';
  specs.forEach(sp=>{
    const data=sp.body,PER=per||16,pn=Math.max(1,Math.ceil(data.length/PER));
    for(let p=0;p<pn;p++){
      const last=p===pn-1,rs=data.slice(p*PER,(p+1)*PER);
      const lines=sp.lines.map(l=>`<div style="text-align:${l.al==='r'?'right':l.al==='l'?'left':'center'};font-size:${Math.max(9,(l.sz||11)-2)}pt;${l.b?'font-weight:700;':''}${l.u?'text-decoration:underline;':''}${l.h?'margin:1.5mm 0;':''}">${esc(l.t).replace(/ {2,}/g,m=>'&nbsp;'.repeat(m.length))}</div>`).join('');
      const th=sp.head.map(row=>`<tr>${row.map(c=>`<th${c.cs?` colspan="${c.cs}"`:''}${c.rs?` rowspan="${c.rs}"`:''} style="${c.fill?'background:'+c.fill+';':''}${c.num?'font-size:.9em;':''}">${esc(c.v)}</th>`).join('')}</tr>`).join('');
      const td=rs.map(row=>`<tr style="${row.k==='s'?'background:'+AN_GREY+';font-weight:700':row.k==='t'?'background:'+AN_TOT+';font-weight:700':''}">${row.cells.map(c=>`<td${c.cs?` colspan="${c.cs}"`:''} style="text-align:${c.t==='n'?'right':c.t==='s'?'left;white-space:nowrap':'center'}">${c.t==='n'?anNf(c.v):c.t==='i'?toBn(c.v):esc(c.v)}</td>`).join('')}</tr>`).join('');
      h+=`<div class="lfpage fwpage fwland"><div class="fwin" style="padding:8mm 8mm">${lines}${sp.label?`<div style="font-size:9pt;font-weight:700;margin-top:-4mm">তালিকা: ${esc(sp.label)}</div>`:''}${pn>1?`<div style="font-size:8.5pt;text-align:right">পাতা ${toBn(p+1)}/${toBn(pn)}</div>`:''}
      <table class="fwt" style="table-layout:auto">${th}${td}</table>
      ${last?sp.notes.map(n=>`<p style="font-size:9.5pt;margin:3mm 0 0">${esc(n)}</p>`).join('')+(sp.signs.length?`<div style="display:flex;justify-content:space-around;margin-top:16mm;font-size:10pt;text-align:center">${sp.signs.map(t=>`<div>${esc(t)}<br>(নামসহ সীল মোহর)</div>`).join('')}</div>`:''):''}
      </div></div>`;
    }
  });
  return h;
}

/* ---------- Excel writer (Unicode / SutonnyMJ) ---------- */
function anXlsx(specs,sut){
  const FONT=sut?'SutonnyMJ':'Kalpurush',xe=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const L=i=>{let s='';i++;while(i){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=(i-m-1)/26}return s};
  const fonts=[],fills=['none','gray125'],xfs=[],fk={},flk={},xk={};
  const fontId=(sz,b,u)=>{const k=sz+'|'+b+'|'+u;if(!(k in fk)){fk[k]=fonts.length;fonts.push(`<font>${b?'<b/>':''}${u?'<u/>':''}<sz val="${sz}"/><name val="${FONT}"/><family val="2"/></font>`)}return fk[k]};
  const fillId=c=>{if(!c)return 0;if(!(c in flk)){flk[c]=fills.length;fills.push(c)}return flk[c]};
  fontId(11,0,0);xfs.push('<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>');xk['def']=0;
  const sty=o=>{const k=JSON.stringify(o);if(!(k in xk)){const nf=o.nf==='n'?164:o.nf==='i'?165:0;
    xfs.push(`<xf numFmtId="${nf}" fontId="${fontId(o.sz||11,o.b?1:0,o.u?1:0)}" fillId="${fillId(o.fill)}" borderId="${o.bd?1:0}" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${o.al||'center'}" vertical="center"${o.wr?' wrapText="1"':''}/></xf>`);xk[k]=xfs.length-1}return xk[k]};
  const txt=(t,o)=>{t=String(t==null?'':t);if(!sut)return`<is><t xml:space="preserve">${xe(t)}</t></is>`;
    const parts=t.split(/([A-Za-z][A-Za-z\s\-]*[A-Za-z]|[A-Za-z])/).filter(x=>x!=='');if(parts.length===1&&!/[A-Za-z]/.test(t))return`<is><t xml:space="preserve">${xe(u2bj(t))}</t></is>`;
    const rp=f=>`<rPr>${o.b?'<b/>':''}${o.u?'<u/>':''}<sz val="${o.sz||11}"/><rFont val="${f}"/><family val="${f===FONT?2:1}"/></rPr>`;
    return'<is>'+parts.map(x=>/[A-Za-z]/.test(x)?`<r>${rp('Times New Roman')}<t xml:space="preserve">${xe(x)}</t></r>`:`<r>${rp(FONT)}<t xml:space="preserve">${xe(u2bj(x))}</t></r>`).join('')+'</is>'};
  const sheets=specs.map(sp=>{
    const N=sp.ncol,rows={},HT={},merges=[];let r=1;
    const put=(r,c,x)=>{(rows[r]=rows[r]||{})[c]=x};
    const S_=(r,c,t,o)=>put(r,c,`<c r="${L(c)}${r}" s="${sty(o)}" t="inlineStr">${txt(t,o)}</c>`),B_=(r,c,o)=>put(r,c,`<c r="${L(c)}${r}" s="${sty(o)}"/>`),
      N_=(r,c,n,o)=>put(r,c,`<c r="${L(c)}${r}" s="${sty(o)}"><v>${anR2(n)}</v></c>`);
    sp.lines.forEach(l=>{const o={sz:l.sz||11,b:l.b,u:l.u,al:l.al==='r'?'right':l.al==='l'?'left':'center',wr:!!l.h};
      const c0=l.al==='r'?N-4:0;S_(r,c0,l.t,o);merges.push(L(c0)+r+':'+L(N-1)+r);HT[r]=l.h||(l.sz>=14?22:18);r++});
    const H0=r,pl=anPlace(sp.head);
    pl.forEach(({r:rr,c,cell})=>{const o={sz:cell.num?9:11,b:cell.num?1:0,bd:1,wr:1,fill:cell.fill||''};S_(H0+rr,c,cell.v,o);
      const cs=cell.cs||1,rs=cell.rs||1;if(cs>1||rs>1){merges.push(L(c)+(H0+rr)+':'+L(c+cs-1)+(H0+rr+rs-1));for(let i=0;i<rs;i++)for(let j=0;j<cs;j++)if(i||j)B_(H0+rr+i,c+j,o)}});
    HT[H0]=30;HT[H0+1]=44;HT[H0+sp.head.length-1]=16;r=H0+sp.head.length;
    sp.body.forEach(row=>{const fill=row.k==='s'?AN_GREY:row.k==='t'?AN_TOT:'';let c=0;
      row.cells.forEach(cell=>{const b=cell.b?1:0,cs=cell.cs||1;
        if(cell.t==='n')N_(r,c,cell.v,{nf:'n',al:'right',bd:1,b,fill});else if(cell.t==='i')N_(r,c,cell.v,{nf:'i',al:'center',bd:1,b,fill});
        else S_(r,c,cell.v,{al:cell.t==='s'?'left':'center',bd:1,b,fill});
        if(cs>1){merges.push(L(c)+r+':'+L(c+cs-1)+r);for(let j=1;j<cs;j++)B_(r,c+j,{bd:1,b,fill,al:'center'})}c+=cs});
      HT[r]=20;r++});
    r++;sp.notes.forEach(n=>{S_(r,0,n,{al:'left',wr:1,sz:11});merges.push('A'+r+':'+L(N-1)+r);HT[r]=22;r++});
    if(sp.signs.length){r+=4;const step=Math.floor(N/sp.signs.length);sp.signs.forEach((t,i)=>{const c=i*step+Math.floor(step/2)-1;
      S_(r,c,t,{sz:11});merges.push(L(c)+r+':'+L(c+2)+r);S_(r+1,c,'(নামসহ সীল মোহর)',{sz:11});merges.push(L(c)+(r+1)+':'+L(c+2)+(r+1))});r+=2}
    const xml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView workbookViewId="0" zoomScale="90"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${sp.W.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${Object.keys(rows).map(Number).sort((a,b)=>a-b).map(rr=>`<row r="${rr}"${HT[rr]?` ht="${HT[rr]}" customHeight="1"`:''}>${Object.keys(rows[rr]).map(Number).sort((a,b)=>a-b).map(c=>rows[rr][c]).join('')}</row>`).join('')}</sheetData><mergeCells count="${merges.length}">${merges.map(m=>`<mergeCell ref="${m}"/>`).join('')}</mergeCells><pageMargins left="0.25" right="0.25" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`;
    return{xml,name:sp.sheet};
  });
  const NF=sut?'<numFmt numFmtId="164" formatCode="0.00"/><numFmt numFmtId="165" formatCode="0"/>':'<numFmt numFmtId="164" formatCode="[$-5000445]0.00"/><numFmt numFmtId="165" formatCode="[$-5000445]0"/>';
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2">${NF}</numFmts><fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills.map(f=>f==='none'||f==='gray125'?`<fill><patternFill patternType="${f}"/></fill>`:`<fill><patternFill patternType="solid"><fgColor rgb="FF${f.slice(1)}"/><bgColor indexed="64"/></patternFill></fill>`).join('')}</fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',used=new Set(),nm=sheets.map((s,i)=>{let n=String(s.name).replace(/[\[\]:*?\/\\]/g,' ').slice(0,30)||'Sheet'+(i+1);while(used.has(n))n=n.slice(0,27)+'-'+(i+1);used.add(n);return n});
  return xZip([['[Content_Types].xml',H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml',H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+nm.map((n,i)=>`<sheet name="${xe(n)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>'],
    ['xl/_rels/workbook.xml.rels',H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml',styles],...sheets.map((s,i)=>['xl/worksheets/sheet'+(i+1)+'.xml',s.xml])]);
}
const anSave=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove()};

/* ---------- building the chosen report ---------- */
const anFilt=rows=>AN.rcd==='all'?rows:rows.filter(r=>r.rcd===AN.rcd);
function anGroups(){   // [{code,name,upz,dist,rows}] for the report in view
  const src=isBranch()?[{code:S.user.office,v:AN.cur?AN.cur.data:{}}]:(AN.list||[]).filter(x=>AN.br==='all'||x.code===AN.br);
  return src.map(x=>{const l=fwLoc(x.code);return{code:x.code,name:anBn(x.code),upz:(x.v&&x.v.upz)||l.upz,dist:l.dist,rows:anFilt((x.v&&x.v.rows)||[])}})
    .filter(g=>g.rows.length).sort((a,b)=>String((office(a.code)||{}).name).localeCompare(String((office(b.code)||{}).name),'en'));
}
function anSpecs(){
  const gs=anGroups(),rep=AN.rep||(isBranch()?'a2':'a1');if(!gs.length)return[];
  if(rep==='ga')return[anSpecGa(gs,!isBranch())];
  return anLists(gs.flatMap(g=>g.rows)).map(([list])=>{const sub=gs.map(g=>({...g,rows:anLists(g.rows).find(x=>x[0]===list)[1]})).filter(g=>g.rows.length);
    if(!sub.length)return null;return rep==='a1'?anSpec1(list,sub):anSpec2(list,null,sub)}).filter(Boolean);
}
const anFile=ext=>{const rep=AN.rep||(isBranch()?'a2':'a1');return'JBRS_'+({a1:'Annexure-1',a2:'Annexure-2',ga:'Annexure-Ga'}[rep])+'_'+(AN.rcd==='all'?'All':AN.rcd)+'_'+(isBranch()?S.user.office:AN.br==='all'?'Sirajganj':AN.br)+ext};
A.anOut=async w=>{
  if(isBranch()&&S.dirty)await A.anSave(true);
  const sp=anSpecs();if(!sp.length)return toast('No loans for '+(AN.rcd==='all'?'this report':AN.rcd)+' yet.');
  if(w==='view'){const v=$('#anview');v.innerHTML=anHtml(sp);await fwFitZoom(v);v.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(w==='xu'||w==='xs'){anSave(anXlsx(sp,w==='xs'),anFile(w==='xs'?'_SutonnyMJ.xlsx':'_Unicode.xlsx'));return toast('Excel downloaded.')}
  return fwOut(anHtml(sp),w==='print'?'print':'pdf',anFile('.pdf'),true);
};
const anBar=opts=>{if(!opts.some(o=>o[0]===AN.rep))AN.rep=opts[0][0];if(isBranch())AN.br='all';return`<div class="bar" style="flex-wrap:wrap;align-items:flex-end;gap:8px">
  <div><label>Report</label><select onchange="AN.rep=this.value">${opts.map(([v,t])=>`<option value="${v}" ${(AN.rep||opts[0][0])===v?'selected':''}>${t}</option>`).join('')}</select></div>
  <div><label>Department</label><select onchange="AN.rcd=this.value">${['RCD-3','RCD-4','all'].map(v=>`<option value="${v}" ${AN.rcd===v?'selected':''}>${v==='all'?'Both (RCD-3 + RCD-4)':v}</option>`).join('')}</select></div>
  ${isBranch()?'':`<div><label>Branch</label><select onchange="AN.br=this.value">${[['all','All branches'],...(AN.list||[]).map(x=>[x.code,x.code+' - '+anBn(x.code)])].map(([v,t])=>`<option value="${v}" ${AN.br===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`}
  <button onclick="run(()=>A.anOut('view'))">View</button><button onclick="run(()=>A.anOut('xu'))">Excel (Unicode)</button><button onclick="run(()=>A.anOut('xs'))">Excel (SutonnyMJ)</button><button class="pri" onclick="run(()=>A.anOut('pdf'))">PDF</button><button onclick="run(()=>A.anOut('print'))">Print</button></div>`};

/* ---------- branch page: Annexure-2 data entry ---------- */
function pageAn2(l){
  AN.rep='';AN.br='all';
  if(!isBranch()){S.view.after=anAreaLoad;return pageAn1Shell('Annexure-2 (all branches)')}
  S.view.after=anOpen;
  return`<div class="pghead"><div class="hrow"><h2>Annexure-2 (পরিশিষ্ট-০২)</h2></div></div><div class="muted small">Special exit facility, circular 1411/26: loans classified as loss, as on 30/06/2026.</div><div id="anbody" class="card muted" style="margin-top:10px">Loading...</div><div id="anview" class="lfsc" style="margin-top:12px;overflow:auto"></div>`;
}
const AN_NK=['p','i','o','pp','pi','po','g','pe','su','cof'],AN_LBL=Object.fromEntries(AN_F.map(f=>[f[0],f[1]]));
const anBlank=()=>({nm:'',ac:'',ty:'',dd:'',cd:'',p:0,i:0,o:0,pp:0,pi:0,po:0,g:0,pe:0,su:0,cof:0,wo:0,rcd:''});
const anEmpty=r=>!r.nm&&!r.ac&&!r.ty&&!r.dd&&!r.cd&&!r.rcd&&!r.wo&&!(r._bad&&Object.keys(r._bad).length)&&AN_NK.every(k=>!(+r[k]));
function anDOk(t){const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t||'');if(!m)return false;const d=+m[1],mo=+m[2],y=+m[3];return y>=1950&&y<=2100&&mo>=1&&mo<=12&&d>=1&&d<=new Date(y,mo,0).getDate()}
const anDKey=t=>t.split('/').reverse().join('');
function anErrors(send){const e=[];AN.cur.data.rows.forEach((r,i)=>{if(anEmpty(r))return;
  Object.keys(r._bad||{}).forEach(k=>e.push([i,k,'সংখ্যা সঠিক নয়']));
  ['dd','cd'].forEach(k=>{if(r[k]&&!anDOk(r[k]))e.push([i,k,'তারিখ dd/mm/yyyy নয়'])});
  if(anDOk(r.dd)&&anDOk(r.cd)&&anDKey(r.cd)<anDKey(r.dd))e.push([i,'cd','বিতরণের তারিখের আগে']);
  if(send){if(!r.nm)e.push([i,'nm','খালি']);if(!r.ac)e.push([i,'ac','খালি']);if(!r.dd)e.push([i,'dd','খালি']);if(!r.cd)e.push([i,'cd','খালি']);if(!r.rcd)e.push([i,'rcd','RCD-3 / RCD-4 বাছাই করুন']);if(r.ac&&!/^0100\d{9}$/.test(r.ac))e.push([i,'ac','১৩ অঙ্কের হিসাব নং, ০১০০ দিয়ে শুরু, শুধু সংখ্যা'])}});return e}
function anShowErr(e){AN.errOn=e.length?AN.errOn:0;document.querySelectorAll('#antab .anerr').forEach(x=>x.classList.remove('anerr'));
  e.forEach(([i,k])=>{const tr=document.querySelector(`#antab tr[data-i="${i}"]`);const td=tr&&tr.children[AN_F.findIndex(f=>f[0]===k)+(anEd()?2:1)];if(td)td.classList.add('anerr')});
  const b=$('#anerr');if(b)b.innerHTML=e.length?`<div class="note n-warn"><b>Please correct the red cells:</b> ${e.slice(0,12).map(([i,k,m])=>'Row '+toBn(i+1)+': '+esc(AN_LBL[k])+' ('+m+')').join('; ')}${e.length>12?' ...':''}</div>`:''}
function anDIn(el,ev){if(ev&&ev.inputType&&ev.inputType.startsWith('delete'))return;let v=anEnD(el.value).replace(/[.\-]/g,'/').replace(/[^\d\/]/g,'');if(/^\d{2}$/.test(v)||/^\d{1,2}\/\d{2}$/.test(v))v+='/';el.value=v.slice(0,10)}
function anFit(){const t=$('#antab'),g=$('#anscr'),top=$('#antop');if(!t||!g||!top)return;top.firstChild.style.width=t.scrollWidth+'px';top.style.display=t.scrollWidth>g.clientWidth+2?'':'none'}
if(!window.anFitOn){window.anFitOn=1;window.addEventListener('resize',()=>{if($('#antab'))anFit()})}
async function anOpen(){
  const j=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+AN.leaf+'&period='+AN.p);
  const r=j.report;AN.cur={status:r?r.status:'NEW',note:r&&r.note,submitted:r&&r.submitted,data:(r&&r.data)||{rows:[]}};
  if(!AN.cur.data.rows)AN.cur.data.rows=[];if(anEd()&&!AN.cur.data.rows.length)AN.cur.data.rows.push(anBlank());
  S.dirty=false;if(anEd()){const L=$('.layout');if(L)L.classList.add('noside')}anRender();
}
const anEd=()=>AN.cur&&canEdit(AN.cur);
function anCellIn(r,i,f){
  const [k,,t,w]=f,v=r[k],ed=anEd();
  if(t==='c'){const x=anCalc(r)[k];return`<td class="gn gc" data-c="${k}">${toBn(x.toFixed(2))}</td>`}
  if(!ed){if(t==='b')return`<td class="c">${v?'হ্যাঁ':'না'}</td>`;if(t==='n')return`<td class="gn">${toBn((+v||0).toFixed(2))}</td>`;return`<td>${esc(t==='d'||k==='ac'?toBn(v||''):v||'')}</td>`}
  if(t==='b')return`<td class="c"><input type="checkbox" ${v?'checked':''} onchange="A.anSet(${i},'${k}',this.checked?1:0)"></td>`;
  if(t==='s')return`<td><select style="width:${w}px" onchange="A.anSet(${i},'${k}',this.value)"><option value="">-</option>${['RCD-3','RCD-4'].map(x=>`<option ${v===x?'selected':''}>${x}</option>`).join('')}</select></td>`;
  const val=t==='n'?(r._bad&&r._bad[k]!==undefined?r._bad[k]:v?String(v):''):(v||'');
  return`<td><input class="gi${t==='n'?'':' gl'}" style="width:${w||92}px${t==='n'?';text-align:right':''}" value="${esc(val)}" ${t==='n'?'inputmode="decimal"':t==='d'?'placeholder="dd/mm/yyyy" maxlength="10" inputmode="numeric" oninput="anDIn(this,event)"':''} onchange="A.anSet(${i},'${k}',this.value)"></td>`;
}
function anTotRow(rows){const t={};AN_F.forEach(([k,,ty])=>{if(ty==='n'||ty==='c')t[k]=anR2(rows.reduce((s,r)=>s+(ty==='c'?anCalc(r)[k]:(+r[k]||0)),0))});
  return`<tr class="gsum" id="antot">${anEd()?'<td></td>':''}<td></td><td class="glab">মোট (${toBn(rows.filter(r=>!anEmpty(r)).length)} টি ঋণ)</td>${AN_F.slice(1).map(([k,,ty])=>ty==='n'||ty==='c'?`<td class="gn">${toBn(t[k].toFixed(2))}</td>`:'<td></td>').join('')}</tr>`}
function anRender(){
  const sc=document.scrollingElement,y=sc.scrollTop,g0=$('#anscr'),sl=g0?g0.scrollLeft:0;
  const c=AN.cur,ed=anEd(),rows=c.data.rows,st=c.status==='NEW'?'NONE':c.status;
  const miss=rows.filter(r=>!r.rcd).length;
  $('#anbody').outerHTML=`<div id="anbody" class="card"><div><span class="badge b-${st}">${c.status==='NEW'?'New':STATUS_TXT[c.status]}</span> <span id="saveState" class="muted small"></span>
  ${c.status==='RETURNED'?`<div class="note n-warn"><b>Returned by Area Office:</b> ${esc(c.note)}</div>`:''}${c.status==='SUBMITTED'?`<div class="note n-ok">Sent to the Area Office on ${fmtDT(c.submitted)}. Locked; the Area Office can return it if a correction is needed.</div>`:''}
  ${ed?`<div class="note n-info">Upload your Annexure-Ga Excel file (Unicode or Bijoy/SutonnyMJ), or add the loans by hand. Grey columns are calculated. CIBTCA = লেজার বকেয়া − ইন্টারেস্ট সাসপেন্স (শূন্য for written-off loans); loans with zero CIBTCA go to the "Without CIBTCA" list. Choose RCD-3 or RCD-4 for every loan in the last column.${miss?` <b>${toBn(miss)} loan(s) still need RCD-3/RCD-4.</b>`:''}</div>`:''}</div>
  ${ed?`<div class="bar" style="flex-wrap:wrap;gap:8px;align-items:center"><input type="file" id="anfile" accept=".xls,.xlsx,.csv" multiple style="display:none" onchange="run(()=>A.anUp(this))"><button onclick="$('#anfile').click()">Upload Annexure-Ga</button><button onclick="A.anAdd()">Add borrower</button><span style="margin-left:6px">উপজেলা: <input style="width:120px" value="${esc(c.data.upz||'')}" onchange="AN.cur.data.upz=this.value.trim();markDirty()"></span></div>`:''}
  <div id="anerr"></div><div id="antop" class="antop" onscroll="$('#anscr').scrollLeft=this.scrollLeft"><div></div></div><div class="gscroll anscr" id="anscr" onscroll="$('#antop').scrollLeft=this.scrollLeft"><table class="gt" id="antab"><thead><tr>${ed?'<th></th>':''}<th>ক্র.</th>${AN_F.map(f=>`<th${f[2]==='c'?' class="gc"':''}>${esc(f[1])}</th>`).join('')}</tr></thead><tbody>
  ${rows.map((r,i)=>`<tr data-i="${i}">${ed?`<td class="c"><a href="#" class="andel" title="Remove this row" onclick="A.anDel(${i});return false">&times;</a></td>`:''}<td class="c">${toBn(i+1)}</td>${AN_F.map(f=>anCellIn(r,i,f)).join('')}</tr>`).join('')}
  ${anTotRow(rows)}</tbody></table></div>
  ${rows.length?'':'<p class="muted">No loans yet.</p>'}
  ${ed?`<div class="bar"><button onclick="run(A.anSave)">Save</button><button class="pri" onclick="run(A.anSubmit)">Send to Area Office</button></div>`:''}
  <h3 style="margin:16px 0 4px">Report</h3>${anBar([['a2','Annexure-2 (পরিশিষ্ট-০২)'],['ga','Annexure-Ga (পরিশিষ্ট-গ)']])}</div>`;
  if(ed){clearInterval(S.autoTimer);S.autoTimer=setInterval(()=>{if(S.dirty)run(()=>A.anSave(true))},60000)}
  anFit();sc.scrollTop=y;const g1=$('#anscr');if(g1){g1.scrollLeft=sl;$('#antop').scrollLeft=sl}if(AN.errOn)anShowErr(anErrors(AN.errOn===2));
}
A.anSet=(i,k,v)=>{
  const r=AN.cur.data.rows[i],f=AN_F.find(x=>x[0]===k);if(!r||!f)return;
  if(f[2]==='n'){const raw=anEnD(v).trim(),x=gaNum(raw);r._bad=r._bad||{};if(raw&&(isNaN(x)||x<0))r._bad[k]=raw;else{delete r._bad[k];r[k]=raw?anR2(x):0}}else if(f[2]==='d')r[k]=anDate(v);else if(k==='ac')r[k]=anAc(v);else r[k]=typeof v==='string'?v.trim():v;
  markDirty();const tr=document.querySelector(`#antab tr[data-i="${i}"]`);
  if(tr){const k2=anCalc(r);tr.querySelectorAll('td[data-c]').forEach(td=>td.textContent=toBn(k2[td.dataset.c].toFixed(2)));if(f[2]==='d'){const inp=tr.children[AN_F.indexOf(f)+(anEd()?2:1)].querySelector('input');if(inp)inp.value=r[k]}}
  const t=$('#antot');if(t)t.outerHTML=anTotRow(AN.cur.data.rows);if(AN.errOn)anShowErr(anErrors(AN.errOn===2));
};
A.anAdd=()=>{AN.cur.data.rows.push(anBlank());anRender();const n=document.querySelector(`#antab tr[data-i="${AN.cur.data.rows.length-1}"] input`);if(n){n.scrollIntoView({block:'nearest'});n.focus()}};
A.anDel=i=>{const r=AN.cur.data.rows[i];if(!confirm('Remove '+(r.nm||'this row')+'?'))return;AN.cur.data.rows.splice(i,1);if(!AN.cur.data.rows.length)AN.cur.data.rows.push(anBlank());markDirty();anRender()};
A.anUp=async inp=>{
  const fl=[...inp.files];inp.value='';if(!fl.length)return;let add=[],kinds=[];
  for(const f of fl){const x=await anReadFile(f);if(!x.kind){toast(f.name+': not an Annexure-Ga file (the column-number row 1, 2, 3 ... was not found).');continue}
    add=add.concat(x.rows);kinds.push(f.name+' ('+(x.kind==='ga'?'Annexure-Ga':'Annexure-2')+', '+x.rows.length+' loans)');if(x.upz&&!AN.cur.data.upz)AN.cur.data.upz=x.upz}
  if(!add.length)return toast('No loans found in the file.');
  AN.cur.data.rows=AN.cur.data.rows.filter(r=>!anEmpty(r));const rows=AN.cur.data.rows,key=r=>String(r.ac||'').replace(/\D/g,''),idx={};rows.forEach((r,i)=>{if(key(r))idx[key(r)]=i});
  const rep=add.filter(r=>key(r)&&idx[key(r)]!==undefined);
  if(!confirm(kinds.join('\n')+'\n\n'+add.length+' loan(s) read.'+(rep.length?' '+rep.length+' already in the list (same account number) will be replaced; their RCD choice is kept.':'')+'\n\nContinue?'))return;
  add.forEach(r=>{const k=key(r);if(k&&idx[k]!==undefined){const o=rows[idx[k]];r.rcd=o.rcd;if(!r.wo)r.wo=o.wo;rows[idx[k]]=r}else{rows.push(r);if(k)idx[k]=rows.length-1}});
  markDirty();anRender();await A.anSave(true);toast(add.length+' loan(s) added. Choose RCD-3 / RCD-4 for each loan, then Save.');
};
A.anSave=async quiet=>{
  const c=AN.cur;if(!c||!anEd())return;
  const e=anErrors(false);if(e.length){AN.errOn=AN.errOn||1;anShowErr(e);const s=$('#saveState');if(s)s.textContent='Not saved: correct the red cells.';if(quiet===true)return;throw new Error('Not saved. Please correct the red cells.')}
  const data={...c.data,rows:c.data.rows.filter(r=>!anEmpty(r)).map(({_bad,...r})=>r)};
  await api('/report',{method:'PUT',body:{leaf:AN.leaf,period:AN.p,data}});if(AN.errOn!==2)anShowErr([]);if(c.status==='NEW')c.status='DRAFT';S.dirty=false;
  const s=$('#saveState');if(s)s.textContent='Saved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});if(quiet!==true)toast('Saved.');
};
A.anSubmit=async()=>{
  const rows=AN.cur.data.rows.filter(r=>!anEmpty(r));if(!rows.length)throw new Error('Add the loans first.');
  const e=anErrors(true);if(e.length){AN.errOn=2;anShowErr(e);throw new Error('Not sent. Please correct the red cells.')}AN.errOn=0;
  if(!confirm('Send Annexure-2 ('+rows.length+' loans) to the Area Office? After sending you cannot change it unless the Area Office returns it.'))return;
  await A.anSave(true);await api('/report/submit',{method:'POST',body:{leaf:AN.leaf,period:AN.p}});toast('Sent to the Area Office.');S.dirty=false;anOpen();
};

/* ---------- Area Office page: Annexure-1 ---------- */
function pageAn1(l){AN.rep='';AN.br='all';if(isBranch())return'<div class="card">Annexure-1 is prepared by the Area Office.</div>';S.view.after=anAreaLoad;return pageAn1Shell('Annexure-1 (পরিশিষ্ট-০১)')}
const pageAn1Shell=t=>`<div class="pghead"><div class="hrow"><h2>${t}</h2></div></div><div id="anbody" class="card muted">Loading...</div><div id="anview" class="lfsc" style="margin-top:12px;overflow:auto"></div>`;
async function anAreaLoad(){
  const kids=childBranches(),[m,c]=await Promise.all([api('/reports?leaf='+AN.leaf+'&period='+AN.p),api('/collect?leaf='+AN.leaf+'&period='+AN.p)]);
  const by={};m.reports.forEach(r=>by[r.office]=r);
  AN.list=c.reports.filter(x=>kids.some(k=>k.code===x.office)).map(x=>({code:x.office,v:x.data||{}}));
  const n=kids.filter(k=>by[k.code]&&by[k.code].status==='SUBMITTED').length,cnt=code=>{const x=AN.list.find(y=>y.code===code);return x&&x.v.rows?x.v.rows.length:''};
  const rows=kids.slice().sort((a,b)=>a.name.localeCompare(b.name,'en')).map(k=>{const r=by[k.code],st=r?r.status:'NONE';
    return`<tr><td>${k.code}</td><td class="bn">${esc(anBn(k.code))}</td><td><span class="badge b-${st}">${STATUS_TXT[st]}</span>${r&&st==='RETURNED'&&r.note?`<div class="muted small">${esc(r.note)}</div>`:''}</td><td class="c">${st==='SUBMITTED'?toBn(cnt(k.code)):''}</td><td class="small">${r?fmtDT(r.updated):''}</td><td>${st==='SUBMITTED'?`<button class="sm dan" onclick="A.returnPrompt('${k.code}','${AN.leaf}','${AN.p}')">Return</button>`:''}</td></tr>`}).join('');
  $('#anbody').outerHTML=`<div id="anbody" class="card"><div class="note ${n===kids.length?'n-ok':'n-info'}"><b>${n} of ${kids.length}</b> branches have sent Annexure-2. Reports include sent (submitted) branches only.</div>
  <details${n?'':' open'}><summary style="cursor:pointer"><b>Branch status</b></summary><div class="gscroll"><table><tr><th>Code</th><th>Branch</th><th>Status</th><th>Loans</th><th>Last saved</th><th></th></tr>${rows}</table></div></details>
  <h3 style="margin:14px 0 4px">Report</h3>${anBar([['a1','Annexure-1 (পরিশিষ্ট-০১)'],['a2','Annexure-2 (পরিশিষ্ট-০২), branch-wise loans'],['ga','Annexure-Ga (পরিশিষ্ট-গ), all loans']])}</div>`;
}
