/* ================= JBRS ONLINE APP ================= */
const APP={name:'JB Reporting System',short:'JBRS',version:'Online 1.0',bank:'Janata Bank PLC.',dev:'Developed by - Md. Shaheen Mahmud, Principal Officer, 024365'};
const LEVELS={HO:'Head Office',DIV:'Divisional Office',AREA:'Area Office',BR:'Branch'};
const ROLES={ADMIN:'Admin',AREA:'Area Office',BRANCH:'Branch'};
const DEFAULT_PW='12345678';
const IDLE_MIN=30;
const STATUS_TXT={NONE:'Not started',DRAFT:'Draft (not submitted)',RETURNED:'Returned for correction',SUBMITTED:'Submitted'};
const STATUS_BN={NONE:'শুরু হয়নি',DRAFT:'খসড়া',RETURNED:'সংশোধনের জন্য ফেরত',SUBMITTED:'দাখিলকৃত'};

const S={token:null,user:null,offices:[],view:{},cur:null,dirty:false,idleTimer:null,autoTimer:null,open:{}};
try{S.token=sessionStorage.getItem('jbrs_t')}catch(e){}
// A is declared in the prelude

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDT=s=>{if(!s)return'';const d=new Date(s);return d.toLocaleDateString('en-GB')+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})};
const fmtD=s=>{if(!s)return'';const p=String(s).split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:s};
const fmtPeriod=p=>{if(!p)return'';const [y,m]=p.split('-');return new Date(+y,+m-1,1).toLocaleDateString('en-GB',{month:'long',year:'numeric'})};
function prevMonth(){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
function toast(msg,err){const d=document.createElement('div');if(err)d.className='err';d.textContent=msg;$('#toast').appendChild(d);setTimeout(()=>d.remove(),err?6000:3500)}
function modal(html){$('#modal').innerHTML=`<div class="modalbg"><div class="modal">${html}</div></div>`}
function closeModal(){$('#modal').innerHTML=''}
async function run(fn){try{await fn()}catch(e){console.error(e);if(e.message!=='Session ended')toast(e.message||String(e),true)}}
function shell(h){$('#app').innerHTML=h}
const office=code=>S.offices.find(o=>o.code===code);
const officeName=code=>{const o=office(code);return o?o.name:code};
const curRep=()=>S.cur;

/* ---------- password stretching (in the browser) ---------- */
const te=new TextEncoder();
const b64=buf=>{const a=new Uint8Array(buf);let s='';for(let i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)};
async function pwKey(id,pw){
  const base=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:te.encode('JBRS-ONLINE|'+String(id).toLowerCase()),iterations:150000,hash:'SHA-256'},base,256);
  return b64(bits);
}

/* ---------- server calls ---------- */
async function api(path,opt){
  opt=opt||{};
  let r;
  try{r=await fetch('/api'+path,{method:opt.method||'GET',headers:{'content-type':'application/json',...(S.token?{authorization:'Bearer '+S.token}:{})},body:opt.body?JSON.stringify(opt.body):undefined})}
  catch(e){throw new Error('No internet connection, or the server cannot be reached. Your entries on screen are kept; try again.')}
  let j={};try{j=await r.json()}catch(e){}
  if(r.status===401&&S.user){endSession('Your session has ended. Please log in again.');throw new Error('Session ended')}
  if(!r.ok)throw new Error(j.error||('Server error '+r.status));
  return j;
}
function endSession(msg){
  S.token=null;S.user=null;S.cur=null;S.dirty=false;try{sessionStorage.removeItem('jbrs_t')}catch(e){}
  clearTimeout(S.idleTimer);clearInterval(S.autoTimer);closeModal();showLogin(msg);
}
function armIdle(){clearTimeout(S.idleTimer);S.idleTimer=setTimeout(()=>{if(S.user){if(S.dirty)run(A.save);setTimeout(()=>run(A.logout),1500)}},IDLE_MIN*60000)}
['click','keydown'].forEach(e=>document.addEventListener(e,()=>{if(S.user)armIdle()}));
window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue=''}});

/* ---------- start ---------- */
async function boot(){
  if(!window.crypto||!crypto.subtle){shell(`<div class="center"><div class="card login"><h2>Browser not supported</h2><p>Please open this link in a recent Google Chrome or Microsoft Edge.</p></div></div>`);return}
  shell(`<div class="center"><div class="muted">Connecting...</div></div>`);
  let st;try{st=await api('/status')}catch(e){shell(`<div class="center"><div class="card login">${brand()}<div class="note n-dan">${esc(e.message)}</div><button class="pri" onclick="boot()">Try again</button></div></div>`);return}
  if(st.needsSetup)return showSetup();
  if(S.token){try{await loadMe();return go({page:'dash'})}catch(e){if(e.message==='Session ended')return}}
  showLogin();
}
async function loadMe(){
  const j=await api('/me');
  S.user=j.user;S.offices=j.offices.map(o=>({code:o.code,name:o.name,nameBn:o.name_bn,level:o.level,parent:o.parent}));
  armIdle();
}
function brand(sub){return`<div class="brandline"><img class="logoimg" src="${LOGO}" alt="JB"><div><h1>${APP.name} (${APP.short})</h1><div class="muted small">${APP.bank}${sub?' &middot; '+sub:''}</div></div></div>`}

function showLogin(msg){
  shell(`<div class="center"><div><div class="card login">${brand()}
  <div class="fld"><label>Branch / office code</label><input id="l_id" autocomplete="username" placeholder="e.g. 0469"></div>
  <div class="fld"><label>Password</label><input id="l_pw" type="password" autocomplete="current-password" onkeydown="if(event.key==='Enter')run(A.login)"></div>
  ${msg?`<div class="note n-dan">${esc(msg)}</div>`:''}
  <button class="pri" id="l_btn" style="width:100%" onclick="run(A.login)">Log in</button>
  </div><div class="dev">${APP.dev}</div></div></div>`);
  $('#l_id').focus();
}
A.login=async()=>{
  const id=$('#l_id').value.trim(),pw=$('#l_pw').value;
  if(!id||!pw)return showLogin('Enter your code and password.');
  const b=$('#l_btn');b.disabled=true;b.textContent='Checking...';
  try{
    const key=await pwKey(id,pw);
    const j=await api('/login',{method:'POST',body:{id,key}});
    S.token=j.token;try{sessionStorage.setItem('jbrs_t',j.token)}catch(e){}
    S.pwCache=null;
    await loadMe();go({page:'dash'});
  }catch(e){showLogin(e.message)}
};
A.logout=async()=>{
  if(S.dirty&&!confirm('You have unsaved changes. Log out anyway?'))return;
  try{await api('/logout',{method:'POST'})}catch(e){}
  S.dirty=false;endSession();
};

/* ---------- first-time setup ---------- */
function showSetup(){
  shell(`<div class="center"><div class="card" style="max-width:560px;width:100%">${brand('First-time setup')}
  <p>This creates the online system for <b>Sirajganj Area</b>: the Area Office (login <b>5038</b>) and its 24 branches (login = branch code). All of them start with the password <b>${DEFAULT_PW}</b>.</p>
  <p>It also creates the <b>admin</b> login for you, which manages passwords and sees all offices.</p>
  <div class="fld"><label>Admin password (minimum 10 characters, keep it safe)</label><input id="s_pw" type="password"></div>
  <div class="fld"><label>Confirm admin password</label><input id="s_pw2" type="password"></div>
  <div id="s_prog" class="muted small"></div>
  <div class="bar"><button class="pri" id="s_btn" onclick="run(A.setup)">Create the system</button></div></div></div>`);
}
A.setup=async()=>{
  const pw=$('#s_pw').value,pw2=$('#s_pw2').value;
  if(pw.length<10)throw new Error('Admin password must be at least 10 characters.');
  if(pw!==pw2)throw new Error('Passwords do not match.');
  $('#s_btn').disabled=true;
  const offices=[{code:'HO',name:'Head Office',name_bn:'প্রধান কার্যালয়, ঢাকা',level:'HO',parent:null},
    {code:'BOGURA',name:'Bogura Division',name_bn:'বিভাগীয় কার্যালয়, বগুড়া',level:'DIV',parent:'HO'},
    {code:'5038',name:'Sirajganj Area Office',name_bn:'এরিয়া অফিস, সিরাজগঞ্জ',level:'AREA',parent:'BOGURA'},
    ...SIRAJ_BRANCHES.map(([c,n,bn])=>({code:c,name:n,name_bn:bn,level:'BR',parent:'5038'}))];
  const list=[{id:'admin',office:null,role:'ADMIN',name:'Administrator',pw,is_default:0},{id:'5038',office:'5038',role:'AREA',name:'Sirajganj Area Office',pw:DEFAULT_PW,is_default:1},
    ...SIRAJ_BRANCHES.map(([c,n])=>({id:c,office:c,role:'BRANCH',name:n,pw:DEFAULT_PW,is_default:1}))];
  const users=[];
  for(let i=0;i<list.length;i++){$('#s_prog').textContent='Preparing login '+(i+1)+' of '+list.length+'...';const x=list[i];users.push({id:x.id,office:x.office,role:x.role,name:x.name,is_default:x.is_default,key:await pwKey(x.id,x.pw)})}
  $('#s_prog').textContent='Saving...';
  await api('/setup',{method:'POST',body:{offices,users}});
  toast('System created. Log in with admin or any office code.');showLogin();
};

/* ---------- navigation ---------- */
const isBranch=()=>S.user.role==='BRANCH',isArea=()=>S.user.role==='AREA',isAdmin=()=>S.user.role==='ADMIN';
const myOffice=()=>office(S.user.office);
function childBranches(){return S.offices.filter(o=>o.level==='BR'&&(isAdmin()||o.parent===S.user.office)).sort((a,b)=>a.name.localeCompare(b.name))}
function go(v){
  if(IWC.pending.size&&!confirm('Calculator changes are still being saved online. Leave anyway?'))return;
  if(S.dirty&&!confirm('You have unsaved changes on this report. Leave without saving?'))return;
  S.dirty=false;clearInterval(S.autoTimer);S.view=v;renderApp();window.scrollTo(0,0);
}
function renderApp(){
  const v=S.view,u=S.user,o=myOffice();
  const nav=(p,label)=>`<button class="nav topnav ${v.page===p?'on':''}" onclick="go({page:'${p}'})">${label}</button>`;
  const leafBtn=l=>`<button class="nav ${v.leaf===l.id?'on':''}" onclick="go({page:'leaf',leaf:'${l.id}'})">${esc(l.name)}${!l.tpl?'<span class="pend">pending</span>':''}</button>`;
  const side=`${nav('dash','Dashboard')}
   ${isAdmin()?nav('users','Users and passwords')+nav('audit','Activity log'):''}
   ${TREE.map(p=>{const c=PCOL[p.id]||PCOL._;const shut=S.open[p.id]===false;return`<div class="pillar" style="--pc:${c[0]};--pcl:${c[1]}"><button class="nav pnav" onclick="A.togglePillar('${p.id}')"><span>${esc(p.name)}</span><span class="caret" id="pc_${p.id}">${shut?'+':'&minus;'}</span></button><div class="leaves" id="pl_${p.id}" style="${shut?'display:none':''}">
   ${menuItems(p.items,leafBtn)}</div></div>`}).join('')}
   <div style="margin-top:12px;border-top:1px solid var(--line);padding-top:8px">${nav('settings','Settings')}</div>`;
  let main='';
  try{
    if(v.page==='dash')main=pageDash();else if(v.page==='leaf')main=pageLeaf();else if(v.page==='report')main=pageReport();
    else if(v.page==='view')main=pageView();else if(v.page==='users')main=pageUsers();else if(v.page==='audit')main=pageAudit();else if(v.page==='settings')main=pageSettings();
  }catch(e){main=`<div class="card">${esc(e.message)}</div>`}
  shell(`<div class="top"><img class="toplogo" src="${LOGO}" alt="JB"><div><div class="t1">${APP.name} (${APP.short})</div><div class="small" style="opacity:.85">${o?esc(o.name)+' &middot; '+LEVELS[o.level]:'Administrator'}</div></div><div class="sp"></div>
  <div class="who">${esc(u.name)} (${esc(u.id)})<br><b>${ROLES[u.role]}</b></div><button onclick="run(A.logout)">Log out</button></div>
  <div class="layout"><div class="side">${side}</div><div class="main" id="main">${main}<div class="dev">${APP.dev}</div></div></div>`);
  if(v.after){const f=v.after;v.after=null;run(f)}
}
function menuItems(items,leafBtn){return items.map(it=>it.group?`<div class="grp">${esc(it.group)}</div><div class="subleaves">${menuItems(it.items,leafBtn)}</div>`:leafBtn(it)).join('')}
A.togglePillar=id=>{const el=$('#pl_'+id);const hide=el.style.display!=='none';el.style.display=hide?'none':'';S.open[id]=!hide;const c=$('#pc_'+id);if(c)c.innerHTML=hide?'+':'&minus;'};
const PCOL={dep:['#1d5fa8','#e7f0fb'],loan:['#2e7d32','#e8f5e9'],acc:['#6a3fb5','#f0ebfa'],rec:['#b55400','#fdf0e2'],aud:['#b42318','#fdecea'],_:['#0a7aa6','#e2f4fb']};
function setMain(h){const m=$('#main');if(m)m.innerHTML=h+`<div class="dev">${APP.dev}</div>`}

/* ---------- dashboard ---------- */
function pageDash(){
  const warn=S.user.is_default?`<div class="note n-warn">You are using the default password. Please change it now from <a class="lk" onclick="A.pwPrompt()">Change password</a>.</div>`:'';
  S.view.after=A.loadDash;
  return`<h2>Dashboard</h2>${warn}<div id="dashBody" class="card muted">Loading...</div>`;
}
A.loadDash=async()=>{
  const p=prevMonth();
  if(isBranch()){
    const j=await api('/reports?leaf=gl_branch&office='+encodeURIComponent(S.user.office));
    const r=j.reports.find(x=>x.period===p);const st=r?r.status:'NONE';
    $('#dashBody').outerHTML=`<div class="card"><h3 style="margin-top:0">At a glance (এক নজরে), ${fmtPeriod(p)}</h3><p><span class="badge b-${st}">${STATUS_TXT[st]}</span></p>
    ${r&&r.status==='RETURNED'?`<div class="note n-warn"><b>Returned by Area Office:</b> ${esc(r.note)}</div>`:''}
    <button class="pri" onclick="A.openOwn('gl_branch','${p}')">${r?'Open report':'Start report'}</button></div>`;
  }else{
    const kids=childBranches();
    const j=await api('/reports?leaf=gl_branch&period='+p);
    const sub=j.reports.filter(x=>x.status==='SUBMITTED'&&kids.some(k=>k.code===x.office)).length;
    $('#dashBody').outerHTML=`<div class="stats"><div class="card stat"><div class="n">${sub} / ${kids.length}</div><div class="l">Branches submitted At a glance for ${fmtPeriod(p)}</div></div></div>
    <button class="pri" onclick="go({page:'leaf',leaf:'gl_branch',period:'${p}'})">See branch status</button>
    ${isAdmin()?`<div class="card" style="margin-top:14px"><h3 style="margin-top:0">Data import</h3><p class="muted">RCD-3, RCD-4 and RCD-4 Consumer Financing for September 2026, taken from the Area Office Excel workbook (24 branches and the Area Office allocation). Existing online reports are never overwritten.</p><button onclick="run(A.r3import)">Import RCD-3 September 2026</button> <button onclick="run(A.r4import)">Import RCD-4 September 2026</button> <button onclick="run(()=>A.r4import(true))">Import RCD-4 Consumer Financing September 2026</button></div>`:''}`;
  }
};

/* ---------- leaf pages ---------- */
function pageLeaf(){
  const l=LEAVES[S.view.leaf];const head=`<div class="muted small">${esc(l.pillar)}</div><h2>${esc(l.title)}</h2>`;
  if(l.tpl==='iwc')return pageIwc(l);
  if(l.tpl==='iwr')return pageIwr(l);
  if(l.tpl&&l.tpl.startsWith('rcd3'))return pageRcd3(l);
  if(l.tpl&&l.tpl.startsWith('rcd4'))return pageRcd4(l);
  if(!l.tpl)return head+`<div class="card"><p><b>Format pending.</b> This report will be added when its format is digitised.</p></div>`;
  const p=S.view.period||prevMonth();
  let h=head;
  if(!isAdmin())h+=`<div class="card"><h3 style="margin-top:0">${isBranch()?'Your report':'Area Office report (consolidated)'}</h3><div class="row"><div style="max-width:220px"><label>Reporting month</label><input type="month" id="own_p" value="${p}"></div><div style="flex:0"><button class="pri" onclick="run(()=>A.openOwn('${l.id}',$('#own_p').value))">Open</button></div></div><div id="ownList" class="muted small" style="margin-top:10px">Loading...</div></div>`;
  if(!isBranch())h+=`<div class="card" style="margin-top:14px"><div class="row"><div style="max-width:220px"><label>Month</label><input type="month" id="grid_p" value="${p}" onchange="go({page:'leaf',leaf:'${l.id}',period:this.value})"></div></div><div id="grid" style="margin-top:12px" class="muted">Loading branch status...</div></div>`;
  S.view.after=A.loadLeaf;
  return h;
}
A.loadLeaf=async()=>{
  const leaf=S.view.leaf,p=S.view.period||prevMonth();
  if(!isAdmin()){
    const j=await api('/reports?leaf='+leaf+'&office='+encodeURIComponent(S.user.office));
    const el=$('#ownList');if(el)el.innerHTML=j.reports.length?`<table><tr><th>Month</th><th>Status</th><th>Last saved</th></tr>${j.reports.map(r=>`<tr class="click" onclick="run(()=>A.openOwn('${leaf}','${r.period}'))"><td>${fmtPeriod(r.period)}</td><td><span class="badge b-${r.status}">${STATUS_TXT[r.status]}</span></td><td>${fmtDT(r.updated)}</td></tr>`).join('')}</table>`:'No reports yet.';
  }
  if(!isBranch())await loadGrid(leaf,p);
};
async function loadGrid(leaf,p){
  const kids=childBranches();
  const [meta,col]=await Promise.all([api('/reports?leaf='+leaf+'&period='+p),api('/collect?leaf='+leaf+'&period='+p)]);
  S.collect={leaf,period:p,list:col.reports};
  const by={};meta.reports.forEach(r=>by[r.office]=r);
  const n=kids.filter(k=>by[k.code]&&by[k.code].status==='SUBMITTED').length;
  let h=`<div class="note ${n===kids.length?'n-ok':'n-info'}"><b>${n} of ${kids.length}</b> branches have submitted for ${fmtPeriod(p)}.</div>
  <div class="bar">${isArea()?`<button class="pri" onclick="run(A.consolidate)" ${n?'':'disabled'}>Make consolidated report from submitted branches</button>`:''}
  <button onclick="A.csv()" ${n?'':'disabled'}>Download all submitted branches (Excel)</button><button onclick="A.printSummary()" ${n?'':'disabled'}>Print branch-wise summary</button></div>
  <div class="gscroll"><table><tr><th>Code</th><th>Branch</th><th>Status</th><th>Last saved</th><th>Submitted</th><th></th></tr>`;
  for(const k of kids){const r=by[k.code];const st=r?r.status:'NONE';
    h+=`<tr><td>${esc(k.code)}</td><td class="bn">${esc(k.nameBn||k.name)}</td><td><span class="badge b-${st}">${STATUS_TXT[st]}</span>${r&&r.note&&st==='RETURNED'?`<div class="muted small">${esc(r.note)}</div>`:''}</td><td class="small">${r?fmtDT(r.updated):''}</td><td class="small">${r&&st==='SUBMITTED'?fmtDT(r.submitted):''}</td>
    <td style="white-space:nowrap">${st==='SUBMITTED'?`<button class="sm" onclick="go({page:'view',office:'${k.code}',leaf:'${leaf}',period:'${p}'})">View</button> <button class="sm dan" onclick="A.returnPrompt('${k.code}','${leaf}','${p}')">Return</button>`:''}</td></tr>`}
  h+='</table></div>';
  if(n)h+=`<h3>Branch-wise summary (কোটি টাকায়)</h3><div class="gscroll">${summaryTable(col.reports,p)}</div>`;
  const g=$('#grid');if(g)g.innerHTML=h;
}
function summaryTable(list,p){
  const rows=list.map(x=>({o:office(x.office),c:gcalc(x.data.g||{},x.data.g9||[],p),g:x.data.g||{}})).sort((a,b)=>(a.o?a.o.name:'').localeCompare(b.o?b.o.name:''));
  const v=(r,k)=>{const n=parseFloat(r.g[k]);return isNaN(n)?null:n};
  let h=`<table class="gt bn"><tr><th rowspan="2">ক্রম</th><th rowspan="2">শাখা</th><th colspan="3">আমানত</th><th colspan="3">ঋণ ও অগ্রিম</th><th colspan="2">পরিচালন মুনাফা</th><th colspan="2">শ্রেণীকৃত ঋণ</th></tr>
  <tr><th>আনুপাতিক লক্ষ্যমাত্রা</th><th>অর্জন</th><th>হার</th><th>আনুপাতিক লক্ষ্যমাত্রা</th><th>অর্জন</th><th>হার</th><th>অর্জন</th><th>হার</th><th>স্থিতি</th><th>হার</th></tr>`;
  rows.forEach((r,i)=>{h+=`<tr><td class="gc0">${toBn(i+1)}</td><td class="glab">${esc(r.o?(r.o.nameBn||r.o.name):'')}</td><td class="gn">${gfmt(r.c['dep.p'])}</td><td class="gn">${gfmt(v(r,'dep.a'))}</td><td class="gn">${gfmt(r.c['dep.r'],'p')}</td><td class="gn">${gfmt(r.c['adv.p'])}</td><td class="gn">${gfmt(v(r,'adv.a'))}</td><td class="gn">${gfmt(r.c['adv.r'],'p')}</td><td class="gn">${gfmt(v(r,'op.a'))}</td><td class="gn">${gfmt(r.c['op.r'],'p')}</td><td class="gn">${gfmt(v(r,'cl.a'))}</td><td class="gn">${gfmt(r.c['clr.a'],'p')}</td></tr>`});
  const t=consolidateGlance(list.map(x=>({core:{g:x.data.g||{},g9:x.data.g9||[],office:x.office}})));const tc=gcalc(t.g,t.g9,p);const tv=k=>{const n=parseFloat(t.g[k]);return isNaN(n)?null:n};
  h+=`<tr class="gsum"><td></td><td class="glab">মোট</td><td class="gn">${gfmt(tc['dep.p'])}</td><td class="gn">${gfmt(tv('dep.a'))}</td><td class="gn">${gfmt(tc['dep.r'],'p')}</td><td class="gn">${gfmt(tc['adv.p'])}</td><td class="gn">${gfmt(tv('adv.a'))}</td><td class="gn">${gfmt(tc['adv.r'],'p')}</td><td class="gn">${gfmt(tv('op.a'))}</td><td class="gn">${gfmt(tc['op.r'],'p')}</td><td class="gn">${gfmt(tv('cl.a'))}</td><td class="gn">${gfmt(tc['clr.a'],'p')}</td></tr></table>`;
  return h;
}
A.returnPrompt=(o,leaf,p)=>modal(`<h2>Return to ${esc(officeName(o))}</h2><p class="muted small">The branch can then correct and submit again.</p><div class="fld"><label>Reason (required)</label><textarea id="ret_c" rows="3"></textarea></div><div class="bar"><button class="dan" onclick="run(()=>A.doReturn('${o}','${leaf}','${p}'))">Return</button><button onclick="closeModal()">Cancel</button></div>`);
A.doReturn=async(o,leaf,p)=>{const note=$('#ret_c').value.trim();if(!note)throw new Error('Write the reason for returning.');await api('/report/return',{method:'POST',body:{office:o,leaf,period:p,note}});closeModal();toast('Returned to the branch.');go({page:'leaf',leaf,period:p})};

/* ---------- own report editor ---------- */
A.openOwn=async(leaf,p)=>{
  if(!p)throw new Error('Choose the month.');
  const j=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+leaf+'&period='+p);
  let r;
  if(j.report){r={office:S.user.office,leaf,period:p,status:j.report.status,note:j.report.note,updated:j.report.updated,submitted:j.report.submitted,g:(j.report.data&&j.report.data.g)||{},g9:(j.report.data&&j.report.data.g9)||[],sources:(j.report.data&&j.report.data.sources)||null}}
  else{
    r={office:S.user.office,leaf,period:p,status:'NEW',g:{},g9:[]};
    const list=await api('/reports?leaf='+leaf+'&office='+encodeURIComponent(S.user.office));
    const prev=list.reports.filter(x=>x.period<p).sort((a,b)=>b.period.localeCompare(a.period))[0];
    if(prev){const pj=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+leaf+'&period='+prev.period);if(pj.report&&pj.report.data){const cf=carryFrom(pj.report.data,prev.period,p);r.g=cf.g;r.g9=cf.g9;toast((cf.same?'Figures copied from ':'Branch details and last year\'s achievements carried from ')+fmtPeriod(prev.period)+'. Update them for '+fmtPeriod(p)+'.')}}
  }
  S.cur=r;S.dirty=false;S.view={page:'report',leaf,period:p};renderApp();window.scrollTo(0,0);
};
function carryFrom(o0,prevP,p){
  const o=o0.g||{};
  if(prevP.slice(0,4)===p.slice(0,4))return{g:{...o},g9:(o0.g9||[]).map(z=>({...z})),same:true};
  const g={};
  Object.keys(o).filter(k=>k.startsWith('h.')).forEach(k=>g[k]=o[k]);
  S1.forEach(([,k])=>{g[k+'.y2']=o[k+'.y1'];g[k+'.y1']=o[k+'.a']});
  ['mix.low','cof','adr'].forEach(b=>{g[b+'.y2']=o[b+'.y1'];g[b+'.y1']=o[b+'.y0']});
  S5R.forEach(([,,k])=>{if(k&&k!=='cmT'){g['l5.'+k+'.pc']=o['l5.'+k+'.ac'];g['l5.'+k+'.pa']=o['l5.'+k+'.aa']}});
  S6R.forEach(([,k])=>{g['na.'+k+'.pc']=o['na.'+k+'.ac'];g['na.'+k+'.pa']=o['na.'+k+'.aa']});
  Object.keys(g).forEach(k=>{if(g[k]===undefined)delete g[k]});
  return{g,g9:[],same:false};
}
const canEdit=r=>r.status==='NEW'||r.status==='DRAFT'||r.status==='RETURNED';
function pageReport(){
  const r=S.cur;if(!r)return'<div class="card">Report not open.</div>';
  const l=LEAVES[r.leaf],ed=canEdit(r);
  let h=`<div class="muted small"><a class="lk" onclick="go({page:'leaf',leaf:'${r.leaf}',period:'${r.period}'})">${esc(l.pillar)} / ${esc(l.title)}</a></div>
  <h2><span class="bn">এক নজরে &middot; ${bnPeriod(r.period)}</span> <span class="badge b-${r.status==='NEW'?'NONE':r.status}">${r.status==='NEW'?'New':STATUS_TXT[r.status]}</span> <span id="saveState" class="muted small"></span></h2>
  ${r.status==='RETURNED'?`<div class="note n-warn"><b>Returned by Area Office:</b> ${esc(r.note)}</div>`:''}
  ${r.status==='SUBMITTED'?`<div class="note n-ok">Submitted on ${fmtDT(r.submitted)}. It is locked; ${isBranch()?'the Area Office can return it if a correction is needed.':'it is final.'}</div>`:''}
  ${r.sources?`<div class="note n-info">Consolidated from ${r.sources.length} submitted branch report(s).</div>`:''}`;
  h+=renderGlance(r,ed);
  const b=[];
  if(ed){b.push(`<button onclick="run(A.save)">Save</button>`,`<button class="pri" onclick="run(A.submit)">Save and submit${isArea()?' (final)':' to Area Office'}</button>`)}
  b.push(`<button onclick="A.printCur()">Print</button>`);
  h+=`<div class="bar">${b.join('')}</div>`;
  if(ed){clearInterval(S.autoTimer);S.autoTimer=setInterval(()=>{if(S.dirty)run(()=>A.save(true))},60000)}
  return h;
}
const _gset=A.gset,_g9set=A.g9set,_g9add=A.g9add,_g9del=A.g9del;
A.gset=el=>{_gset(el);markDirty()};A.g9set=(el,i,k)=>{_g9set(el,i,k);markDirty()};
A.g9add=()=>{_g9add();markDirty()};A.g9del=i=>{_g9del(i);markDirty()};
function markDirty(){S.dirty=true;const s=$('#saveState');if(s)s.textContent='Unsaved changes'}
A.save=async quiet=>{
  const r=S.cur;if(!r||!canEdit(r))return;
  await api('/report',{method:'PUT',body:{leaf:r.leaf,period:r.period,data:{g:r.g,g9:r.g9,sources:r.sources||undefined}}});
  if(r.status==='NEW')r.status='DRAFT';S.dirty=false;
  const s=$('#saveState');if(s)s.textContent='Saved '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  if(quiet!==true)toast('Saved.');
};
A.submit=async()=>{
  const r=S.cur;validateGlance(r);
  if(!confirm(isBranch()?'Submit this report to the Area Office? After submitting you cannot change it unless the Area Office returns it.':'Submit this consolidated report as final?'))return;
  await A.save(true);
  await api('/report/submit',{method:'POST',body:{leaf:r.leaf,period:r.period}});
  toast('Submitted.');S.dirty=false;await A.openOwn(r.leaf,r.period);
};
A.consolidate=async()=>{
  const c=S.collect;if(!c||!c.list.length)throw new Error('No submitted branch reports for this month.');
  const own=await api('/report?office='+encodeURIComponent(S.user.office)+'&leaf='+c.leaf+'&period='+c.period);
  if(own.report&&own.report.status==='SUBMITTED')throw new Error('Your consolidated report for this month is already submitted.');
  if(own.report&&!confirm('Replace the figures in your consolidated report with the latest submitted branch data? Your header details are kept.'))return;
  const t=consolidateGlance(c.list.map(x=>({core:{g:x.data.g||{},g9:x.data.g9||[],office:x.office}})));
  const keepH=own.report&&own.report.data?Object.fromEntries(Object.entries(own.report.data.g||{}).filter(([k])=>k.startsWith('h.'))):{};
  S.cur={office:S.user.office,leaf:c.leaf,period:c.period,status:own.report?own.report.status:'NEW',note:own.report?own.report.note:null,g:{...t.g,...keepH},g9:t.g9,sources:c.list.map(x=>x.office)};
  S.view={page:'report',leaf:c.leaf,period:c.period};renderApp();markDirty();
  const kids=childBranches().filter(k=>!c.list.some(x=>x.office===k.code));
  toast('Consolidated from '+c.list.length+' branches.'+(kids.length?' Not yet submitted: '+kids.length+'.':'')+' Click Save to keep it.');
};

/* ---------- view another office's report ---------- */
function pageView(){S.view.after=A.loadView;return`<div id="vbody" class="card muted">Loading...</div>`}
A.loadView=async()=>{
  const v=S.view;const j=await api('/report?office='+encodeURIComponent(v.office)+'&leaf='+v.leaf+'&period='+v.period);
  if(!j.report||!j.report.data){$('#vbody').outerHTML='<div class="card">This report has not been submitted yet.</div>';return}
  const r={office:v.office,leaf:v.leaf,period:v.period,status:j.report.status,submitted:j.report.submitted,g:j.report.data.g||{},g9:j.report.data.g9||[]};
  S.viewRep=r;
  $('#vbody').outerHTML=`<div class="muted small"><a class="lk" onclick="go({page:'leaf',leaf:'${v.leaf}',period:'${v.period}'})">Back to branch status</a></div>
  <h2><span class="bn">${esc(office(v.office)?.nameBn||officeName(v.office))} &middot; এক নজরে &middot; ${bnPeriod(v.period)}</span></h2>
  <div class="note n-ok">Submitted on ${fmtDT(r.submitted)}.</div>${renderGlance(r,false)}
  <div class="bar"><button onclick="A.printView()">Print</button>${r.status==='SUBMITTED'&&!isBranch()?`<button class="dan" onclick="A.returnPrompt('${v.office}','${v.leaf}','${v.period}')">Return for correction</button>`:''}</div>`;
};

/* ---------- printing ---------- */
function printGlanceOnline(r){
  const o=office(r.office);
  return`<div class="bn"><div class="p-h"><img src="${LOGO}" alt=""><div class="tx"><div class="b">জনতা ব্যাংক পিএলসি.</div><div>${esc(o?(o.nameBn||o.name):r.office)}${r.sources?' (একীভূত)':''}</div></div></div>${renderGlance(r,false)}
  <div class="p-end"><div class="p-sign"><div>কর্মকর্তা</div><div>${o&&o.level==='BR'?'ব্যবস্থাপক':'অফিস প্রধান'}</div></div></div></div>`;
}
A.printCur=()=>{$('#printArea').innerHTML=printGlanceOnline(S.cur);window.print()};
A.printView=()=>{$('#printArea').innerHTML=printGlanceOnline(S.viewRep);window.print()};
A.printSummary=()=>{
  const c=S.collect;const o=myOffice();
  $('#printArea').innerHTML=`<div class="bn"><div class="p-h"><img src="${LOGO}" alt=""><div class="tx"><div class="b">জনতা ব্যাংক পিএলসি.</div><div>${esc(o?(o.nameBn||o.name):'')}</div></div></div>
  <div class="gtitle">শাখাভিত্তিক এক নজরে তথ্য, ${gctx(c.period).asOn} (কোটি টাকায়)</div>${summaryTable(c.list,c.period)}
  <div class="p-end"><div class="p-sign"><div>কর্মকর্তা</div><div>অফিস প্রধান</div></div></div></div>`;
  window.print();
};

/* ---------- Excel (CSV) download ---------- */
function csvFields(){
  const f=[];const Yl=['অর্জন/পূর্ববর্তী-২','অর্জন/পূর্ববর্তী-১','লক্ষ্যমাত্রা','অর্জন'];
  GHEAD.forEach(([k,l])=>f.push([k,l]));
  S1.forEach(([sl,k,lab,ty])=>{if(ty==='grow'||ty==='flow'){['y2','y1','t','a'].forEach((q,i)=>f.push([k+'.'+q,'১'+sl+' '+lab+' - '+Yl[i]]));f.push(['c:'+k+'.p','১'+sl+' '+lab+' - আনুপাতিক লক্ষ্যমাত্রা']);f.push(['c:'+k+'.r','১'+sl+' '+lab+' - অর্জনের হার'])}
    else if(ty==='cl'){['y2','y1','a'].forEach((q,i)=>f.push(['cl.'+q,'১'+sl+' '+lab+' - '+['অর্জন/পূর্ববর্তী-২','অর্জন/পূর্ববর্তী-১','অর্জন'][i]]))}});
  YC.forEach((y,i)=>f.push(['mix.low.'+y,'২ স্বল্প সুদের আমানত % ('+['পূর্ববর্তী-২','পূর্ববর্তী-১','চলতি'][i]+')']));
  YC.forEach((y,i)=>f.push(['cof.'+y,'৩ কস্ট অব ফান্ড % ('+['পূর্ববর্তী-২','পূর্ববর্তী-১','চলতি'][i]+')']));
  YC.forEach((y,i)=>f.push(['adr.'+y,'৪ ADR % ('+['পূর্ববর্তী-২','পূর্ববর্তী-১','চলতি'][i]+')']));
  f.push(['l5.staff','৫ স্টাফ লোন'],['l5.agri','৫ কৃষি ও তদারকি ঋণ']);
  const c5={pc:'গত বছর সংখ্যা',pa:'গত বছর পরিমাণ',ta:'লক্ষ্যমাত্রা পরিমাণ',ac:'অর্জন সংখ্যা',aa:'অর্জন পরিমাণ'};
  S5R.forEach(([sl,lab,k])=>{if(k&&k!=='cmT')S5C.forEach(q=>f.push(['l5.'+k+'.'+q,'৫ '+lab+' - '+c5[q]]))});
  const c6={pc:'গত বছর সংখ্যা',pa:'গত বছর পরিমাণ',tc:'লক্ষ্যমাত্রা সংখ্যা',ta:'লক্ষ্যমাত্রা পরিমাণ',ac:'অর্জন সংখ্যা',aa:'অর্জন পরিমাণ'};
  S6R.forEach(([sl,k,lab])=>S6C.forEach(q=>f.push(['na.'+k+'.'+q,'৬ '+lab+' - '+c6[q]])));
  const c7={bc:'স্থিতি সংখ্যা',ba:'স্থিতি পরিমাণ',cc:'নগদ আদায় সংখ্যা',ca:'নগদ আদায় পরিমাণ',rc:'পুনঃতফসিল সংখ্যা',ra:'পুনঃতফসিল পরিমাণ',wc:'সুদ মওকুফ সংখ্যা',wa:'সুদ মওকুফ পরিমাণ'};
  S7R.forEach(([sl,k,lab])=>S7C.forEach(q=>f.push(['rc.'+k+'.'+q,'৭ '+lab+' - '+c7[q]])));
  f.push(['brpd.sc','৮ বিআরপিডি-২৩ প্রেরিত সংখ্যা'],['brpd.sa','৮ বিআরপিডি-২৩ প্রেরিত পরিমাণ'],['brpd.pc','৮ বিআরপিডি-২৩ প্রেরণযোগ্য সংখ্যা'],['brpd.pa','৮ বিআরপিডি-২৩ প্রেরণযোগ্য পরিমাণ'],['c:s9.tot','৯ নতুন ঋণ মঞ্জুরী মোট (লক্ষ টাকা)']);
  return f;
}
A.csv=()=>{
  const c=S.collect;const f=csvFields();
  const q=v=>{const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
  const lines=[['শাখার কোড','শাখার নাম',...f.map(x=>x[1])].map(q).join(',')];
  c.list.slice().sort((a,b)=>officeName(a.office).localeCompare(officeName(b.office))).forEach(x=>{
    const g=x.data.g||{},cc=gcalc(g,x.data.g9||[],c.period);
    lines.push([x.office,office(x.office)?.nameBn||officeName(x.office),...f.map(([k])=>{if(k.startsWith('c:')){const v=cc[k.slice(2)];return v===null||v===undefined||!isFinite(v)?'':(k.endsWith('.r')?+(v*100).toFixed(2):+v.toFixed(4))}return g[k]??''})].map(q).join(','));
  });
  const blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='JBRS_AtAGlance_'+c.period+'_all_branches.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
};

/* ---------- settings / password ---------- */
function pageSettings(){
  return`<h2>Settings</h2><div class="card"><h3 style="margin-top:0">My login</h3><p>${esc(S.user.name)} &middot; ${esc(S.user.id)} &middot; ${ROLES[S.user.role]}</p><button onclick="A.pwPrompt()">Change password</button>
  <div class="muted small" style="margin-top:6px">Your password works on any computer. If you forget it, the admin can reset it to the default.</div></div>
  <div class="card" style="margin-top:12px"><h3 style="margin-top:0">About</h3><p class="small">${APP.name} ${APP.version}</p></div>`;
}
A.pwPrompt=()=>modal(`<h2>Change password</h2><div class="fld"><label>Current password</label><input id="c_old" type="password"></div><div class="fld"><label>New password (minimum 8 characters, letters and numbers)</label><input id="c_new" type="password"></div><div class="fld"><label>Confirm new password</label><input id="c_new2" type="password"></div><div class="bar"><button class="pri" id="c_btn" onclick="run(A.changePw)">Save</button><button onclick="closeModal()">Cancel</button></div>`);
A.changePw=async()=>{
  const o=$('#c_old').value,n=$('#c_new').value,n2=$('#c_new2').value;
  if(n.length<8||!/[A-Za-z]/.test(n)||!/[0-9]/.test(n))throw new Error('New password needs at least 8 characters with letters and numbers.');
  if(n!==n2)throw new Error('New passwords do not match.');if(n===o)throw new Error('New password must be different.');
  if(n===DEFAULT_PW)throw new Error('Do not use the default password.');
  $('#c_btn').disabled=true;
  try{await api('/password',{method:'POST',body:{oldKey:await pwKey(S.user.id,o),newKey:await pwKey(S.user.id,n)}})}finally{const b=$('#c_btn');if(b)b.disabled=false}
  S.user.is_default=0;closeModal();toast('Password changed. Use the new password on every computer.');if(S.view.page==='dash')renderApp();
};

/* ---------- admin ---------- */
function pageUsers(){S.view.after=A.loadUsers;return`<h2>Users and passwords</h2><div id="ubody" class="card muted">Loading...</div>`}
A.loadUsers=async()=>{
  const j=await api('/admin/users');
  $('#ubody').outerHTML=`<p class="muted">Reset sets the password back to <b>${DEFAULT_PW}</b> and logs the user out everywhere.</p><div class="card" style="padding:0;overflow:auto"><table><tr><th>Login</th><th>Office</th><th>Role</th><th>Password</th><th>Last login</th><th>Status</th><th></th></tr>
  ${j.users.map(u=>`<tr><td>${esc(u.id)}</td><td>${esc(u.office?officeName(u.office):'-')}</td><td>${ROLES[u.role]}</td><td>${u.is_default?'<span class="badge b-RETURNED">Default</span>':'<span class="badge b-SUBMITTED">Changed</span>'}</td><td class="small">${fmtDT(u.last_login)}</td><td>${u.active?'Active':'<b>Disabled</b>'}</td>
  <td style="white-space:nowrap">${u.role!=='ADMIN'?`<button class="sm" onclick="run(()=>A.reset('${esc(u.id)}'))">Reset password</button> <button class="sm ${u.active?'dan':''}" onclick="run(()=>A.active('${esc(u.id)}',${u.active?0:1}))">${u.active?'Disable':'Enable'}</button>`:''}</td></tr>`).join('')}</table></div>`;
};
A.reset=async id=>{if(!confirm('Reset the password of '+id+' to '+DEFAULT_PW+'?'))return;await api('/admin/reset',{method:'POST',body:{id,key:await pwKey(id,DEFAULT_PW)}});toast('Password reset for '+id+'.');A.loadUsersAgain()};
A.active=async(id,on)=>{await api('/admin/active',{method:'POST',body:{id,active:!!on}});toast(on?'Enabled.':'Disabled.');A.loadUsersAgain()};
A.loadUsersAgain=()=>go({page:'users'});
function pageAudit(){S.view.after=async()=>{const j=await api('/admin/audit');$('#abody').outerHTML=`<div class="card hist">${j.audit.map(a=>`<div>${fmtDT(a.at)} &middot; <b>${esc(a.user)}</b> &middot; ${esc(a.action)}${a.detail?' &middot; '+esc(a.detail):''}</div>`).join('')||'Nothing yet.'}</div>`};return`<h2>Activity log</h2><div id="abody" class="card muted">Loading...</div>`}

/* ---------- interest waiver calculator ---------- */
/* ---------- interest waiver calculator, saved online ---------- */
let IWC_HTML=null;
const IWC_REGK='iw-register-v1',IWC_STATE=['exit-policy-v3','iw-typemap','iw-lang'];
const IWC_LT={A:'শস্য ঋণ',R:'পল্লী ঋণ',C:'সিসি (হাইপো)'};
const IWC={mode:null,synced:{},pending:new Map(),busy:false,timer:null,retry:null,failed:false};
function iwcSource(){
  if(!IWC_HTML){const bin=atob($('#iwc-src').textContent.trim());const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);IWC_HTML=new TextDecoder('utf-8').decode(u)}
  return IWC_HTML;
}
// Runs first inside the calculator: its browser storage is replaced by the JBRS bridge.
const IWC_SHIM=`<script>(function(){var B=window.parent&&window.parent.IWC_BRIDGE;if(!B)return;var m=B.store;
var ls={getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null},setItem:function(k,v){v=String(v);m[k]=v;B.set(k,v)},removeItem:function(k){delete m[k];B.remove(k)},clear:function(){},key:function(i){return Object.keys(m)[i]||null},get length(){return Object.keys(m).length}};
try{Object.defineProperty(window,'localStorage',{value:ls,configurable:true})}catch(e){}
})();<\/script>`;
function pageIwc(l){
  const head=`<div class="muted small">${esc(l.pillar)}</div>`;
  if(isBranch()){S.view.after=()=>openIwc('own');return head+`<div id="iwcBar" class="iwcbar"></div><div id="iwcWrap"><div class="card muted">Loading calculator...</div></div>`}
  const tab=S.view.tab||(isAdmin()?'cases':'own');
  const tabs=`<div class="tabs">${isArea()?`<button class="tab ${tab==='own'?'on':''}" onclick="go({page:'leaf',leaf:'${l.id}',tab:'own'})">Area Office calculator</button>`:''}<button class="tab ${tab==='cases'?'on':''}" onclick="go({page:'leaf',leaf:'${l.id}',tab:'cases'})">Branch cases</button></div>`;
  if(tab==='own'){S.view.after=()=>openIwc('own');return head+tabs+`<div id="iwcBar" class="iwcbar"></div><div id="iwcWrap"><div class="card muted">Loading calculator...</div></div>`}
  if(S.view.viewOffice){const vo=S.view.viewOffice;S.view.after=()=>openIwc('view',vo);return head+tabs+`<div class="note n-warn"><b>View only:</b> ${vo==='all'?'all branches':esc(officeName(vo))}. You can open cases, see reports and make PDFs or Excel, but changes here are <b>not saved</b>. <a class="lk" onclick="go({page:'leaf',leaf:'${l.id}',tab:'cases'})">Back to the list</a></div><div id="iwcBar" class="iwcbar"></div><div id="iwcWrap"><div class="card muted">Loading calculator...</div></div>`}
  S.view.after=A.loadIwcCases;
  return head+tabs+`<div id="iwcCases" class="card muted">Loading cases...</div>`;
}
A.loadIwcCases=async()=>{
  const j=await api('/iwc/cases?office=all');const kids=childBranches();const leaf=S.view.leaf;
  const by={};j.cases.forEach(c=>(by[c.office]=by[c.office]||[]).push(c));
  let h=`<p class="muted">Cases are the borrowers each branch has added to the calculator's register (রেজিস্টার). Open them in the calculator to see the reports or make combined পরিশিষ্ট-গ / ঘ.</p>
  <div class="bar"><button class="pri" onclick="go({page:'leaf',leaf:'${leaf}',tab:'cases',viewOffice:'all'})" ${j.cases.length?'':'disabled'}>Open all branches in calculator (${j.cases.length} cases)</button></div>
  <table><tr><th>Code</th><th>Branch</th><th>Cases</th><th>Last saved</th><th></th></tr>`;
  for(const k of kids){const cs=by[k.code]||[];const last=cs.map(c=>c.updated).sort().pop();
    h+=`<tr><td>${esc(k.code)}</td><td class="bn">${esc(k.nameBn||k.name)}</td><td>${cs.length}</td><td class="small">${fmtDT(last)}</td><td>${cs.length?`<button class="sm" onclick="go({page:'leaf',leaf:'${leaf}',tab:'cases',viewOffice:'${k.code}'})">Open in calculator</button>`:''}</td></tr>`}
  h+='</table>';
  if(j.cases.length)h+=`<h3>All cases</h3><div class="gscroll"><table class="bn"><tr><th>শাখা</th><th>ঋণগ্রহীতা</th><th>হিসাব নম্বর</th><th>ঋণের ধরণ</th><th>সংরক্ষণ</th></tr>${j.cases.map(c=>`<tr><td>${esc(office(c.office)?.nameBn||c.office)}</td><td>${esc(c.name)}</td><td>${esc(c.acct)}</td><td>${esc(IWC_LT[c.lt]||c.lt)}</td><td class="small">${fmtDT(c.updated)}</td></tr>`).join('')}</table></div>`;
  $('#iwcCases').outerHTML=`<div class="card">${h}</div>`;
};
async function openIwc(mode,office){
  const w=$('#iwcWrap');if(!w)return;
  let store={},viewOnly=mode!=='own';
  IWC.mode=mode;IWC.synced={};IWC.pending.clear();IWC.failed=false;
  if(mode==='own'){
    const j=await api('/iwc/load');
    IWC_STATE.forEach(k=>{if(j.state[k]!=null)store[k]=j.state[k]});
    j.items.forEach(it=>IWC.synced[it.key]=JSON.stringify(it));
    store[IWC_REGK]=JSON.stringify({app:'iw-register',ver:1,items:j.items});
  }else{
    const j=await api('/iwc/items?office='+encodeURIComponent(office));
    store[IWC_REGK]=JSON.stringify({app:'iw-register',ver:1,items:j.cases.map(c=>c.item)});
  }
  window.IWC_BRIDGE={store,viewOnly,set:(k,v)=>iwcChanged(k,v),remove:k=>{}};
  let src;try{src=iwcSource()}catch(e){w.innerHTML='<div class="card">The calculator could not be loaded.</div>';return}
  const f=document.createElement('iframe');f.title='Interest Waiver Calculator';
  f.style.cssText='width:100%;height:calc(100vh - 210px);min-height:600px;border:1px solid var(--line);border-radius:10px;background:#fff';
  f.onload=()=>{try{const d=f.contentWindow.document;['click','keydown','input'].forEach(ev=>d.addEventListener(ev,()=>{if(S.user)armIdle()}))}catch(e){}};
  f.srcdoc=src.replace(/<head[^>]*>/i,m=>m+IWC_SHIM);
  w.innerHTML='';w.appendChild(f);
  iwcStatus();
}
function iwcChanged(k,v){
  if(IWC.mode!=='own')return;
  if(k===IWC_REGK){
    let reg;try{reg=JSON.parse(v)}catch(e){return}
    const now={};(reg.items||[]).forEach(it=>{if(it&&it.key)now[it.key]=it});
    for(const [key,it] of Object.entries(now)){const js=JSON.stringify(it);if(IWC.synced[key]!==js)IWC.pending.set('c:'+key,{t:'case',key,item:it,js})}
    for(const key of Object.keys(IWC.synced))if(!now[key])IWC.pending.set('c:'+key,{t:'del',key});
  }else if(IWC_STATE.includes(k))IWC.pending.set('s:'+k,{t:'state',k,v});
  else return;
  clearTimeout(IWC.timer);IWC.timer=setTimeout(iwcFlush,1200);iwcStatus();
}
async function iwcFlush(){
  if(IWC.busy||IWC.mode!=='own')return;IWC.busy=true;clearTimeout(IWC.retry);
  try{
    while(IWC.pending.size){
      const [id,job]=IWC.pending.entries().next().value;
      if(job.t==='case')await api('/iwc/case',{method:'PUT',body:{item:job.item}});
      else if(job.t==='del')await api('/iwc/delete',{method:'POST',body:{key:job.key}});
      else await api('/iwc/state',{method:'PUT',body:{k:job.k,v:job.v}});
      if(IWC.pending.get(id)===job)IWC.pending.delete(id);
      if(job.t==='case')IWC.synced[job.key]=job.js;else if(job.t==='del')delete IWC.synced[job.key];
    }
    IWC.failed=false;
  }catch(e){IWC.failed=e.message||'error';if(e.message!=='Session ended')IWC.retry=setTimeout(iwcFlush,15000)}
  finally{IWC.busy=false;iwcStatus();if(IWC.pending.size&&!IWC.failed)iwcFlush()}
}
function iwcStatus(){
  const b=$('#iwcBar');if(!b)return;
  if(IWC.mode!=='own'){b.innerHTML='';return}
  const n=IWC.pending.size;
  b.className='iwcbar '+(IWC.failed?'bad':n?'busy':'ok');
  b.textContent=IWC.failed?'Not saved online yet ('+IWC.failed+'). Retrying automatically; keep this page open.':n?'Saving online...':'All calculator data is saved online for '+(myOffice()?myOffice().name:'your office')+'.';
}
/* ---------- Annexure-Ga / Gha and forwarding letters for many borrowers ---------- */
const IWR={items:[],engine:null};
function pageIwr(l){
  const GH=l.id==='rc_iwgha';
  const head=`<div class="muted small">${esc(l.pillar)} / Interest waiver calculator / Report</div><h2>${GH?'Annexure-Gha (পরিশিষ্ট-ঘ)':'Annexure-Ga (পরিশিষ্ট-গ)'}</h2>`;
  const of=S.view.iof||(isBranch()?S.user.office:'all'),lt=S.view.ilt||'A';
  const opts=isBranch()?[]:[['all','All offices (all branches'+(isArea()?' and Area Office':'')+')'],...(isArea()?[[S.user.office,'Area Office (own cases)']]:[]),...childBranches().map(k=>[k.code,k.code+' - '+k.name])];
  S.view.after=A.loadIwr;
  return head+`<div class="card"><div class="row">${isBranch()?'':`<div style="flex:2"><label>Office</label><select id="iw_of" onchange="A.iwrSet()">${opts.map(([v,t])=>`<option value="${esc(v)}" ${v===of?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`}
  <div><label>Type of loan</label><select id="iw_lt" onchange="A.iwrSet()">${Object.entries({A:'Crop Loan (শস্য ঋণ)',R:'Rural Credit (পল্লী ঋণ)',C:'CC(H) (সিসি হাইপো)'}).map(([v,t])=>`<option value="${v}" ${v===lt?'selected':''}>${t}</option>`).join('')}</select></div></div>
  <div id="iwrList" class="muted" style="margin-top:12px">Loading borrowers...</div></div><div id="iwrEngine" style="position:absolute;left:-10000px;top:0;width:1200px;height:900px;overflow:hidden" aria-hidden="true"></div>`;
}
A.iwrSet=()=>{const o=$('#iw_of');go({...S.view,after:null,iof:o?o.value:S.user.office,ilt:$('#iw_lt').value})};
A.loadIwr=async()=>{
  const of=S.view.iof||(isBranch()?S.user.office:'all'),lt=S.view.ilt||'A';
  const j=await api('/iwc/items?office='+encodeURIComponent(of));
  IWR.items=j.cases.map(c=>({office:c.office,item:c.item})).filter(c=>c.item&&c.item.lt===lt).sort((a,b)=>String(a.item.asof||'').localeCompare(String(b.item.asof||''))||String(a.item.name||'').localeCompare(String(b.item.name||'')));
  const el=$('#iwrList');if(!el)return;
  if(!IWR.items.length){el.innerHTML='<div class="note n-info">No borrowers of this type of loan in the register'+(of==='all'?'':' of this office')+' yet.</div>';return}
  const multi=new Set(IWR.items.map(c=>c.office)).size>1;
  const n=v=>toBn(fmtN(+v||0)),dd=v=>v?toBn(fmtD(v)):'-';
  let h=`<table class="gt bn"><tr><th><input type="checkbox" id="iw_all" checked onchange="document.querySelectorAll('.iw_sel').forEach(x=>x.checked=this.checked)" title="Tick all / none"></th><th>ক্র.</th>${multi?'<th>শাখা</th>':''}<th>ঋণগ্রহীতা</th><th>হিসাব নং</th><th>আসল</th><th>লেজার বকেয়া</th><th>রিপোর্টের তারিখ</th></tr>`;
  IWR.items.forEach((c,i)=>{const x=c.item,v=x.v||[];h+=`<tr><td class="gc0"><input type="checkbox" class="iw_sel" data-i="${i}" checked></td><td class="gc0">${toBn(i+1)}</td>${multi?`<td>${esc(office(c.office)?.nameBn||officeName(c.office))}</td>`:''}<td class="glab">${esc(x.name)}</td><td>${esc(toBn(x.acct))}</td><td class="gn">${n(v[7])}</td><td class="gn">${n(v[15])}</td><td class="gc0" style="width:auto">${dd(x.asof)}</td></tr>`});
  h+=`</table>
  ${S.view.leaf==='rc_iwgha'?`<h3>পরিশিষ্ট-ঘ (ticked borrowers, one row per branch)</h3><div class="bar"><button class="pri" onclick="run(()=>A.iwrRun('gha'))">পরিশিষ্ট-ঘ (পিডিএফ)</button><button class="pri" onclick="run(()=>A.iwrRun('xgha'))">পরিশিষ্ট-ঘ (এক্সেল)</button></div>`:`<h3>পরিশিষ্ট-গ (ticked borrowers)</h3><div class="bar"><button class="pri" onclick="run(()=>A.iwrRun('ga'))">পরিশিষ্ট-গ (পিডিএফ)</button><button class="pri" onclick="run(()=>A.iwrRun('xga'))">পরিশিষ্ট-গ (এক্সেল)</button></div>`}
  <h3>Forwarding letters (ticked borrowers)</h3><div class="bar"><button onclick="run(()=>A.iwrRun('fwbp'))">শাখার ফরোয়ার্ডিং (পিডিএফ)</button><button onclick="run(()=>A.iwrRun('fwbw'))">শাখার ফরোয়ার্ডিং (ওয়ার্ড)</button>${isBranch()?'':`<button onclick="run(()=>A.iwrRun('fwap'))">এরিয়া অফিসের ফরোয়ার্ডিং (পিডিএফ)</button><button onclick="run(()=>A.iwrRun('fwaw'))">এরিয়া অফিসের ফরোয়ার্ডিং (ওয়ার্ড)</button>`}</div>
  <div id="iwrMsg" class="note n-info" style="display:none"></div>`;
  el.className='';el.innerHTML=h;
};
async function iwrEngine(){
  const box=$('#iwrEngine');if(!box)throw new Error('Page closed.');
  if(IWR.engine&&box.contains(IWR.engine))return IWR.engine;
  IWC.mode='view';
  window.IWC_BRIDGE={store:{},viewOnly:true,set:()=>{},remove:()=>{}};
  const f=document.createElement('iframe');f.title='Report engine';f.style.cssText='width:1200px;height:900px;border:0';
  f.srcdoc=iwcSource().replace(/<head[^>]*>/i,m=>m+IWC_SHIM);box.innerHTML='';box.appendChild(f);
  for(let i=0;i<120;i++){await new Promise(r=>setTimeout(r,250));try{const w=f.contentWindow;if(w.document.readyState==='complete'&&typeof w.regPdf==='function'&&w.document.getElementById('reglt'))return(IWR.engine=f)}catch(e){}}
  throw new Error('The report engine did not start. Reload the page and try again.');
}
A.iwrRun=async kind=>{
  const pick=[...document.querySelectorAll('.iw_sel')].filter(x=>x.checked).map(x=>IWR.items[+x.dataset.i]);
  if(!pick.length)throw new Error('Tick at least one borrower.');
  const msg=$('#iwrMsg'),btns=[...document.querySelectorAll('#iwrList button')];
  msg.style.display='';msg.className='note n-info';msg.textContent='Preparing... please wait.';btns.forEach(b=>b.disabled=true);
  try{
    const f=await iwrEngine(),w=f.contentWindow;
    w.__JB_ITEMS=pick.map(c=>({...c.item,sel:true}));w.__JB_LT=S.view.ilt||'A';
    w.eval('REG.items=window.__JB_ITEMS;document.getElementById("reglt").value=window.__JB_LT;document.getElementById("regmsg").textContent="";');
    const call={ga:()=>w.regPdf('ga'),gha:()=>w.regPdf('gha'),xga:()=>w.regXl('ga'),xgha:()=>w.regXl('gha'),fwbp:()=>w.fwPdf('br'),fwbw:()=>w.fwWord('br'),fwap:()=>w.fwPdf('ao'),fwaw:()=>w.fwWord('ao')}[kind];
    await call();
    const m=(w.document.getElementById('regmsg').textContent||'').trim();
    msg.className='note '+(m?'n-warn':'n-ok');msg.textContent=m||'Done. Check your downloads.';
  }catch(e){msg.className='note n-dan';msg.textContent=e.message||String(e)}
  finally{btns.forEach(b=>b.disabled=false)}
};
window.addEventListener('beforeunload',e=>{if(IWC.pending.size){e.preventDefault();e.returnValue=''}});
boot();
