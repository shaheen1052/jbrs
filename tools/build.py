import re,sys,os,shutil
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src','offline_base.html')
GL=os.path.join(ROOT,'src','glance.js')
APPJS=os.path.join(ROOT,'src','app_online.js')
RCD=[os.path.join(ROOT,'src',f) for f in ('rcd3_data.js','rcd3.js')]
OUT=os.path.join(ROOT,'site','index.html')
s=open(SRC,encoding='utf-8').read()
style=re.search(r'<style>([\s\S]*?)</style>',s).group(1)
logo=re.search(r"^const LOGO='[^']*';$",s,re.M).group(0)
favicon=re.search(r'<link rel="icon"[^>]*>',s).group(0)
siraj=re.search(r'^const SIRAJ_BRANCHES=.*;$',s,re.M).group(0)
tree=s[s.index("const L=(id,name,tpl)=>"):s.index("}));",s.index("const LEAVES={};"))+4]
tree=tree.replace("'audit')","null)")
_old="L('rc_iwc','Interest waiver calculation','iwc')"
assert _old in tree
_ag="G('Agricultural credit',[L('ln_ag_rcd3','RCD-3'),L('ln_ag_rcd4','RCD-4')]),G('Rural credit',[L('ln_rc_rcd3','RCD-3'),L('ln_rc_rcd4','RCD-4'),L('ln_rc_cf','Consumer financing')])"
assert _ag in tree
tree=tree.replace(_ag,"G('Agricultural and rural credit',[G('RCD-3',[L('ln_rcd3','Data entry','rcd3'),L('ln_rcd3s1','Statement-1 (Accumulated)','rcd3s1'),L('ln_rcd3s2','Statement-2 (Product-wise)','rcd3s2')]),L('ln_rcd4','RCD-4'),L('ln_rcd4cf','RCD-4 Consumer Financing')])")
tree=tree.replace(_old,"G('Interest waiver calculator',[L('rc_iwc','Data entry','iwc'),G('Report',[L('rc_iwga','Annexure-Ga','iwr'),L('rc_iwgha','Annexure-Gha','iwr')])])")
_lb=tree.index('const LEAVES={};')
tree=tree[:_lb]+"""const LEAVES={};
function addLeaves(items,pillar,prefix){items.forEach(it=>{if(it.group)addLeaves(it.items,pillar,(prefix?prefix+' / ':'')+it.group);else LEAVES[it.id]={...it,pillar,title:prefix?prefix+' ('+it.name+')':it.name}})}
TREE.forEach(p=>addLeaves(p.items,p.name,''));
"""  # audit sample format not used online
import base64
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from patch_iwc import patch
_b=re.search(r'<script type="application/octet-stream" id="iwc-src">([\s\S]*?)</script>',s).group(1).strip()
_calc=patch(base64.b64decode(_b).decode('utf-8'))
iwc='<script type="application/octet-stream" id="iwc-src">'+base64.b64encode(_calc.encode('utf-8')).decode()+'</script>'
g=open(GL,encoding='utf-8').read()
core=g[:g.index('function carryGlance')]
cons=g[g.index('function consolidateGlance'):]
cons=cons[:cons.index('\n}\n')+3]
app=open(APPJS,encoding='utf-8').read()
rcd='\n'.join(open(f,encoding='utf-8').read() for f in RCD)
extra_css=""".b-NONE{background:#f1f1f1;color:#666}.b-NEW{background:#eef0ef;color:#4a5752}
.stats .stat .n{font-size:28px}
.side{padding:12px 10px}
.nav.topnav{font-weight:600;padding:8px 10px}.nav.topnav.on{background:var(--brand);color:#fff}
.pillar{margin-top:10px}
.pillar>.nav.pnav{display:flex;justify-content:space-between;align-items:center;background:var(--pcl);color:var(--pc);font-weight:700;font-size:14.5px;border-left:4px solid var(--pc);border-radius:0;padding:8px 10px}
.pillar>.nav.pnav:hover{filter:brightness(.97)}
.pnav .caret{font-size:16px;line-height:1;opacity:.8}
.leaves{margin-left:24px;border-left:2px solid var(--pcl);padding-left:6px;margin-top:4px}
.leaves .nav{font-size:13.5px;padding:5px 10px;color:#22302c;font-weight:400}
.leaves .nav:hover{background:var(--pcl)}
.leaves .nav.on{background:var(--pc);color:#fff;font-weight:600}
.leaves .nav.on .pend{color:#fff;border-color:rgba(255,255,255,.6)}
.grp{color:var(--pc);font-weight:700;font-size:13px;padding:8px 10px 2px}
.subleaves{margin-left:22px;border-left:2px dotted var(--pc);padding-left:4px;opacity:1}
.r3t th,.r3t td{font-size:12.5px;padding:3px 5px}.r3t td.gn{min-width:58px}.r3t .gi{min-width:56px;padding:3px 5px}.r3t td.glab{min-width:200px}.r3t tr.r3no td{text-align:center;font-size:11px;color:var(--muted);background:#fafbfa}.r3t tr.r3sec td{background:#f6f8f7}.r3t tr.r3miss td{color:#9aa}
.r3hd{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.r3l{display:flex;align-items:center;gap:10px}.r3l img{width:44px}.r3l .b{font-size:17px;font-weight:700}.r3r{text-align:right;font-size:12.5px}
.r3title{text-align:center;font-weight:700;margin:8px 0 6px;font-size:14px}.r3title span{float:right;font-weight:400;font-size:12px}.r3cap{font-weight:700;margin:16px 0 4px}
@media print{#printArea .r3t th,#printArea .r3t td{font-size:9px;padding:2px 3px;min-width:0}#printArea .r3t td.glab{min-width:0}#printArea .r3cap{break-after:avoid}#printArea .r3t{break-inside:auto}#printArea .r3t tr{break-inside:avoid}}
.iwcbar{font-size:13px;padding:7px 12px;border-radius:8px;margin:8px 0}.iwcbar.ok{background:var(--ok-l);color:var(--ok)}.iwcbar.busy{background:var(--info-l);color:var(--info)}.iwcbar.bad{background:var(--danger-l);color:var(--danger)}
"""
html=f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>JBRS</title>
{favicon}
<style>{style}{extra_css}</style>
</head>
<body>
<div id="app"></div>
<div id="toast"></div>
<div id="modal"></div>
<div id="printArea"></div>
<script>
"use strict";
{logo}
const A={{}};
{siraj}
{tree}
{core}
{cons}
{rcd}
{app}
</script>
{iwc}
</body>
</html>
"""
import os
os.makedirs(os.path.dirname(OUT),exist_ok=True)
open(OUT,'w',encoding='utf-8').write(html)
print('built',len(html))
shutil.copyfile(os.path.join(ROOT,'src','_worker.js'),os.path.join(ROOT,'site','_worker.js'))
print('copied _worker.js')
