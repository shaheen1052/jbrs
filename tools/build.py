import re,sys,os,shutil
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src','offline_base.html')
GL=os.path.join(ROOT,'src','glance.js')
APPJS=os.path.join(ROOT,'src','app_online.js')
RCD=[os.path.join(ROOT,'src',f) for f in ('rcd3_data.js','rcd3.js','rcd4_data.js','rcd4cf_data.js','rcd4.js','loanforms.js','gaall.js','fwd.js')]
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
tree=tree.replace(_ag,"G('Agricultural and rural credit',[G('RCD-3',[L('ln_rcd3','Data entry','rcd3'),L('ln_rcd3s1','Statement-1 (Accumulated)','rcd3s1'),L('ln_rcd3s2','Statement-2 (Product-wise)','rcd3s2')]),G('RCD-4',[L('ln_rcd4','Data entry','rcd4'),L('ln_rcd4s1','Statement-1 (ছক-ক)','rcd4s1'),L('ln_rcd4s2','Statement-2 (Accumulated)','rcd4s2'),L('ln_rcd4s3','Statement-3 (Product-wise)','rcd4s3')]),G('RCD-4 Consumer Financing',[L('ln_rcd4cf','Data entry','rcd4cf'),L('ln_rcd4cfs1','Statement-1 (ছক-খ)','rcd4cfs1'),L('ln_rcd4cfs2','Statement-2 (Accumulated)','rcd4cfs2'),L('ln_rcd4cfs3','Statement-3 (Product-wise)','rcd4cfs3')])])")
_ln="L('ln_sod','Secured overdraft'),L('ln_staff','Staff loan')]}"
assert _ln in tree
def _LN(i,n): return "L('%s','%s','lf')"%(i,n)
_LFM="G('Loan Application',["+",".join([
 _LN('lf_cmsme','CMSME'),
 "G('Agricultural & Rural Credit',[G('RCD-3 Loans',["+",".join([_LN('lf_crop','Crop Loan'),_LN('lf_dairy','Dairy cow rearing (RCD Cir. 66/17)'),_LN('lf_bullfat','Bull Fattening (RCD Cir. 75/19)')])+"]),G('RCD-4 Loans',["+",".join([_LN('lf_mpsc','Multipurpose Supervisory Credit'),_LN('lf_gnkr','Grameen Nari Kormosngsthan Rin'),_LN('lf_youth','Loan for Trained Youth')])+"])])",
 "G('Consumer financing',["+",".join([_LN('lf_cfpersonal','Personal Loan'),_LN('lf_cfcredit','Consumer Credit'),_LN('lf_cfhealth','Janata Support Health Care Loan'),_LN('lf_cfpension','Janata Support Loan for Pensioner')])+"])",
 _LN('lf_sod','Secured overdraft'),
 "G('Staff loan',["+",".join([_LN('lf_stfhouse','Staff House Building Loan'),_LN('lf_stfmoto','Staff Motor Cycle Loan'),_LN('lf_stfcomp','Staff Computer Loan'),_LN('lf_execcar','Executive Car Loan')])+"])",
 "L('lf_reports','Loan Reports','lfrpt')"
])+"])"
tree=tree.replace(_ln,"L('ln_sod','Secured overdraft'),L('ln_staff','Staff loan'),"+_LFM+"]}")
tree=tree.replace(_old,"G('Interest waiver calculator',[L('rc_iwc','Data entry','iwc'),G('Report',[L('rc_iwga','Annexure-Ga','iwr'),L('rc_iwgha','Annexure-Gha','iwr'),L('rc_gaall','Annexure-Ga (All)','gaall'),L('rc_fwd','Forwarding (AO)','fwd')])])")
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
extra_css=""".top{position:sticky;top:0;z-index:60}
.side{position:sticky;top:var(--topH,58px);height:calc(100vh - var(--topH,58px));align-self:flex-start}
.lfmain{overflow:visible}
.pghead{position:sticky;top:-20px;z-index:20;background:var(--bg);padding:8px 0 6px;margin:-6px 0 10px;border-bottom:1px solid var(--line)}.pghead h2{margin:0;font-size:20px}.pghead .hrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.pghead .hrow h2{flex:1 1 auto}.pghead .bar{margin:0;gap:6px}.pghead button,.pghead select{height:28px;padding:2px 12px;font-size:13px;line-height:1.2;width:auto;min-width:0;max-width:240px}.pghead select{padding:2px 6px}
.lfform label{font-size:12px;margin:0 0 2px}.lfform input,.lfform select,.lfform textarea{padding:2px 7px;font-size:13px;height:28px;min-height:0;line-height:1.2}.lfform textarea{resize:vertical}
.lfform .row{gap:6px 10px}.lfform .fc{flex:1 1 140px;max-width:210px}.lfform .fc.ad{flex:0 0 calc((100% - 20px)/3);max-width:none}.lfform .fc.ad textarea{height:54px}@media(max-width:760px){.lfform .fc.ad{flex:1 1 100%}}.lfform .fc.w{flex:1 1 100%;max-width:none}.lfform .fc.w2{flex:1 1 240px;max-width:330px}.lfform h3{font-size:14px;margin:0 0 6px}.lfform .card{padding:10px 12px}
.ckrow span{flex:1}.ckrow{display:flex;gap:10px;align-items:flex-start;padding:7px 4px;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--text);margin:0;cursor:pointer}.ckrow input{width:18px;height:18px;margin:2px 0 0;flex:0 0 auto;padding:0}
.lfsc .lfpage{margin:0 0 10px;box-shadow:0 1px 6px rgba(0,0,0,.28);break-after:auto;page-break-after:auto}
.lfpage .has{border-bottom:none!important}
.lfpage .p-h{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px}.lfpage .p-h img{width:44px;height:auto}.lfpage .p-h .tx{text-align:left;line-height:1.3}.lfpage .p-h .b{font-size:17px;font-weight:700}
.lfpage .gtitle{font-size:14px;font-weight:700;margin:4px 0 10px}.lfpage .gtitle,.lfpad .gtitle{text-align:center}.lfpage .r3t th,.lfpad .r3t th{text-align:center}.lfpage .p-h .tx,.lfpad .p-h .tx{text-align:center}.lfpage .p-h .b,.lfpad .p-h .b{font-size:22px}.lfpage .p-h .tx div:not(.b),.lfpad .p-h .tx div:not(.b){font-size:15px}.lfpage .p-h img,.lfpad .p-h img{width:52px}.lfpage .p-sign{display:flex;justify-content:space-between;margin:40px 8mm 0;gap:40px}.lfpage .p-sign div{flex:0 0 42mm;border-top:1px solid #000;padding-top:4px;font-size:11.5px;text-align:center}
.lfpage .r3t th,.lfpage .r3t td{border:1px solid #444;padding:1px 3px;font-size:12px;color:#000;background:#fff}
.lfpage{width:210mm;height:297mm;box-sizing:border-box;background:#fff;color:#000;font-family:'KalpurushJB','Kalpurush',sans-serif;font-size:12pt;line-height:1.4;position:relative;overflow:hidden;break-after:page;page-break-after:always;break-inside:avoid}
.fwpage .fwin{padding:12mm 14mm 12mm 14mm;font-size:11pt;line-height:1.35}.fwpage .fwh{display:flex;gap:10px;align-items:flex-start;border-bottom:1.5px solid #000;padding-bottom:3mm}.fwpage .fwh img{width:20mm;height:auto;margin-top:2mm}.fwpage .fwl{flex:0 0 auto;font-size:9.5pt;line-height:1.3}.fwpage .fwb{font-size:19pt;font-weight:700;line-height:1.15}.fwpage .fwr{flex:0 0 auto;margin-left:7mm;font-size:9.5pt;line-height:1.3}.fwpage .fwa{font-size:12pt;font-weight:700}.fwpage .fwref{display:flex;justify-content:space-between;font-size:11pt;margin:2mm 0 4mm}.fwpage .fwsub{display:flex;gap:6px;margin:3mm 0;text-align:justify}.fwpage .fwsub b{white-space:nowrap}.fwpage p{margin:2mm 0}.fwpage .j{text-align:justify}.fwpage .fwt{width:100%;border-collapse:collapse;font-size:6.2pt;line-height:1.2}.fwpage .fwt th,.fwpage .fwt td{border:1px solid #000;padding:1.2mm .5mm;background:#fff}.fwpage .fwt th{text-align:center;font-weight:400;white-space:normal}.fwpage .fwt th,.fwpage .fwt td{font-size:inherit;line-height:1.2}.fwpage .fwt td{white-space:nowrap}.fwpage .fwt{table-layout:auto}.fwpage .fwt .c{text-align:center;white-space:nowrap}.fwpage .fwt td:nth-child(3){white-space:normal;min-width:30mm;max-width:42mm}.fwpage .fwt .n{text-align:right;white-space:nowrap}.fwpage .fwt .tt td{font-weight:700}.fwpage.fw2 .fwt td{padding:.6mm 1mm}.fwpage.fw3 .fwt td{padding:.2mm 1mm}.fwpage.fw4 .fwt td{padding:0 .8mm}.fwpage .fwsg{margin-top:6mm}.fwpage .fwan{margin-top:6mm;font-size:10pt}
.lfpage:last-child{break-after:auto;page-break-after:auto}.lfpage .u{text-decoration:underline}
.lfpage .lff{display:inline-block;border-bottom:1px dotted #000;text-align:center;padding:0 1mm;line-height:1.25;vertical-align:bottom;box-sizing:border-box}
.lfpage .kl{display:flex;width:161mm;min-height:5.9mm;line-height:5.9mm;align-items:flex-end}.lfpage .kb{flex:0 0 47mm;white-space:nowrap}.lfpage .kc{flex:0 0 2.5mm}.lfpage .kn{flex:0 0 auto;white-space:nowrap;margin-right:1.5mm}.lfpage .kf{flex:1;border-bottom:1px dotted #000;margin-left:1mm;margin-right:2mm;min-height:5.2mm;line-height:5.2mm;font-size:11.5pt;overflow-wrap:anywhere}
.lfpage .kr .kn:not(:first-child){margin-left:1mm}.lfpage .kh{margin:3mm 0 0}.lfpage .kp{text-align:justify;margin:1mm 0 0;line-height:6.6mm}
.lfpage .kph{position:absolute;right:0;top:11mm;width:33mm;height:28mm;border:1px solid #000;text-align:center;font-size:12pt;line-height:1.5;padding-top:3.2mm;box-sizing:border-box}
.lfpage .ka{position:relative}.lfpage .kgn{position:absolute;right:0;margin-top:-5mm;width:23mm;border:1px solid #000;font-size:8pt;line-height:1.4;text-align:center;padding:1mm;box-sizing:border-box;height:25mm}
.lfpage .kt{width:161.5mm;margin:1mm 0 0 -2mm;border-collapse:collapse}.lfpage .kt th,.lfpage .kt td{border:1px solid #333;padding:0 1.5mm;font-weight:400;font-size:11pt;line-height:1.3;vertical-align:top;background:#fff;color:#000}.lfpage .kt th{font-size:12pt;text-align:center}.lfpage .kt td:first-child{font-size:11.5pt}
.lfpage .kbx{display:flex;margin-top:2.5mm;margin-left:-2mm;width:186mm}.lfpage .kb1,.lfpage .kb2{flex:1;border:1px solid #333;padding:2mm 2.5mm;min-height:38mm;box-sizing:border-box;line-height:1.5;font-size:12pt}.lfpage .kb2{margin-left:-1px}
.lfpage .kz{text-align:left;margin:0;line-height:7mm}.lfpage .kg{text-align:justify;margin:9mm 0 0;line-height:8.1mm}.lfpage .kq .kl{width:100mm;min-height:7mm;line-height:7mm}.lfpage .kb2k{flex:0 0 30mm}.lfpage .kc2{flex:0 0 4mm}
.lfpdfhost{position:fixed;left:-400mm;top:0;z-index:-1}
@media print{#printArea.lf0{padding:0}#printArea .lfpad{padding:10mm 11mm}#printArea .lfpage .kt th,#printArea .lfpage .kt td{border:1px solid #333;padding:0 1.5mm;background:#fff}}
.menubtn{background:transparent;border:1px solid rgba(255,255,255,.7);color:#fff;font-size:20px;line-height:1;padding:5px 11px;margin-right:6px}
.sidebg{display:none}.layout.noside .side{display:none}
@media (max-width:760px){.main{overflow:visible}.pghead{top:calc(var(--topH,0px) - 6px)}.side{position:fixed;top:var(--topH,0px);left:0;bottom:0;height:auto;width:84%;max-width:330px;max-height:none;z-index:50;border-right:1px solid var(--line);border-bottom:none;box-shadow:0 0 30px rgba(0,0,0,.3);padding-top:16px}.layout:not(.noside) .sidebg{display:block;position:fixed;inset:var(--topH,0px) 0 0 0;background:rgba(0,0,0,.35);z-index:40}}
.b-NONE{background:#f1f1f1;color:#666}.b-NEW{background:#eef0ef;color:#4a5752}
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
.gnav{display:flex;justify-content:space-between;align-items:center}.gnav .caret{font-weight:700;color:var(--pc)}.grp{color:var(--pc);font-weight:700;font-size:13px;padding:8px 10px 2px}
.subleaves{margin-left:22px;border-left:2px dotted var(--pc);padding-left:4px;opacity:1}
.r3t th,.r3t td{font-size:12.5px;padding:3px 5px;color:#000}.r3t th{font-weight:700}.r3t td.gn{text-align:right;white-space:nowrap}.r3t td.gn.cn{text-align:center}.r3t .gi{min-width:56px;padding:3px 5px;text-align:right}.r3t .gi.cn{text-align:center}.r3t td.glab{min-width:180px}.r3t tr.r3no td{text-align:center;font-size:11px;color:#333;background:#fafbfa}.r3t tr.r3sec td{background:#f6f8f7}.r3t tr.r3miss td{color:#555}
.r3hd{margin-bottom:2px}.r3codes{text-align:right;font-size:12.5px;margin-bottom:2px;line-height:1.3}.r3gap{height:16px}.r3t2 td.glab{white-space:nowrap}.r3p .r3t2 td.glab{max-width:none}.r3t tr.r3caprow th{font-size:14px;text-align:center;background:#fff}.r3c{display:flex;justify-content:center;align-items:center;gap:10px;text-align:center}.r3c img{width:44px}.r3c .b{font-size:18px;font-weight:700}.r3c .o{font-size:14px}.r3r{position:absolute;right:0;top:0;text-align:right;font-size:12.5px}
.r3title{text-align:center;font-weight:700;margin:8px 0 2px;font-size:14.5px}.r3unit{text-align:right;font-size:12.5px;margin-bottom:3px}.r3cap{font-weight:700;margin:14px 0 4px;font-size:14px}
.r4sp{margin-top:16px}.r4t td.glab{white-space:nowrap}.r3p .r4t td.glab{max-width:none}.r4t th{white-space:normal}.r4nfl{display:flex;justify-content:space-between;align-items:flex-end;font-size:13px;font-weight:700;margin:6px 0 3px}.r4nfr{text-align:right;font-weight:400}
.r3p{color:#000}.r3p .r3pg{break-after:page;page-break-after:always}.r3p .r3pg:last-child{break-after:auto;page-break-after:auto}
.r3p .r3t{width:100%;border-collapse:collapse}.r3p .r3t th,.r3p .r3t td{border:1px solid #444;font-size:12px;padding:1px 2px;line-height:1.12}.r3p{line-height:1.35}.r3p .r3t td.glab{min-width:0;max-width:330px}.r3p .r3t th.r3th3{width:48px;max-width:56px}.r3p .r3t td.gn{min-width:0}.r3p .r3t th{min-width:0}.r3p .r3t tr.r3sec td,.r3p .r3t tr.r3no td{background:#fff}.r3p .r3cap{margin-top:8px}.r3p .p-sign{margin-top:46px}
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
os.makedirs(os.path.join(ROOT,'site','vendor'),exist_ok=True)
for _f in os.listdir(os.path.join(ROOT,'src','vendor')):
    shutil.copyfile(os.path.join(ROOT,'src','vendor',_f),os.path.join(ROOT,'site','vendor',_f))
shutil.copyfile(os.path.join(ROOT,'src','_worker.js'),os.path.join(ROOT,'site','_worker.js'))
print('copied _worker.js')
