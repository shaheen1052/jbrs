# Makes the online variant of the Interest Waiver Calculator.
# Only offline-only options and texts are removed; calculations are untouched.
import re

def rep(s, old, new, cnt=1):
    n = s.count(old)
    assert n == cnt, ('patch target count mismatch', old[:80], n)
    return s.replace(old, new)

REGVIEW = r'''function regView(){const e=$("reglist");if(!e)return;const bn=regB(),LT={A:bn?"শস্য ঋণ":"Crop Loan",R:bn?"পল্লী ঋণ":"Rural Credit",C:bn?"সিসি (হাইপো)":"CC(H)"};
 const it=REG.items.map((x,i)=>({x,i})).sort((a,b)=>String(a.x.asof||"").localeCompare(String(b.x.asof||""))||String(a.x.name||"").localeCompare(String(b.x.name||"")));
 if(!it.length){e.innerHTML='<div class="note">'+(bn?"রেজিস্টারে এখনো কোনো ঋণগ্রহীতা নেই।":"The register is empty.")+'</div>';return}
 const f=n=>bn?bnN(n):Z(n),dd=s=>ok(s)?(bn?bnD(dmy(s)):dmy(s)):"-";
 e.innerHTML='<div class="scroll"><table><tr><th>No.</th><th class="l">Borrower</th><th class="l">Account</th><th>Type</th><th>Principal</th><th>Ledger balance</th><th>Report date</th><th></th></tr>'+
  it.map(({x,i},n)=>`<tr><td>${bnQ(n+1)}</td><td class="l">${esc(x.name)}</td><td class="l">${esc(x.acct)}</td><td>${esc(LT[x.lt]||"-")}</td><td>${f(+(x.v&&x.v[7])||0)}</td><td>${f(+(x.v&&x.v[15])||0)}</td><td>${dd(x.asof)}</td><td style="white-space:nowrap"><button class="rgb" data-rgo="${i}">${bn?"খুলুন":"Open"}</button> <button class="rgb x" data-rgdel="${i}">${bn?"মুছুন":"Remove"}</button></td></tr>`).join("")+'</table></div>'}
'''

HELP_REG_EN = '''<details><summary>Register (all borrowers)</summary><ul>
<li>Click <b>Add this borrower to the register</b> for each borrower. The register is saved online for your office automatically.</li>
<li>The register lists the borrowers of every type of loan together, in order of report date. <b>Open</b> loads a borrower back into the form; <b>Remove</b> deletes it from the register.</li>
<li><b>Combine saved data files</b> adds borrowers from data files saved earlier with the offline calculator.</li>
<li>Annexure-Ga, Annexure-Gha and the forwarding letters for several borrowers are made from the JBRS menu: <b>Recovery → Interest waiver calculator → Report</b>.</li></ul></details>'''

HELP_REG_BN = '''<details><summary>রেজিস্টার (সকল ঋণগ্রহীতা)</summary><ul>
<li>প্রতিটি ঋণগ্রহীতার জন্য <b>Add this borrower to the register</b> চাপুন। রেজিস্টার আপনার অফিসের নামে স্বয়ংক্রিয়ভাবে অনলাইনে সংরক্ষিত হয়।</li>
<li>রেজিস্টারে সব ধরণের ঋণের ঋণগ্রহীতা একসাথে, রিপোর্টের তারিখ অনুযায়ী ক্রমানুসারে দেখায়। <b>Open</b> ঋণগ্রহীতার তথ্য ফরমে খোলে; <b>Remove</b> রেজিস্টার থেকে মুছে ফেলে।</li>
<li><b>Combine saved data files</b> দিয়ে আগের অফলাইন ক্যালকুলেটরে সংরক্ষিত ডেটা ফাইল থেকে ঋণগ্রহীতা যোগ করা যায়।</li>
<li>একাধিক ঋণগ্রহীতার পরিশিষ্ট-গ, পরিশিষ্ট-ঘ ও ফরোয়ার্ডিং পত্র JBRS মেনু থেকে তৈরি করুন: <b>Recovery → Interest waiver calculator → Report</b>।</li></ul></details>'''

HIDE_CSS = ('<style>#svbox,#ffwarn,#ffpop,#regst,#regnote2,.regfs,#regre,#regbk,label.fbtn:has(#regrs),'
            '#regsec h3.dlh,#regsec .bar:has(#reglt),#regsec .bar:has(#fwbp),#regsec .bar:has(#regbk){display:none!important}</style></head>')

def patch(s):
    # header: offline sentence and browser notes
    s = rep(s, ' This app works fully offline on any computers.', '', 2)          # page text + translation key
    s = rep(s, ' এই অ্যাপটি যেকোনো কম্পিউটারে সম্পূর্ণ অফলাইনে কাজ করে।', '')
    s = rep(s, '<div class="rednote">Use this calculator in Google Chrome or Microsoft Edge.</div>', '')
    # register section
    s = rep(s, '<h2>Register (Multiple borrowers)</h2>', '<h2>Register (All borrowers)</h2>')
    s = rep(s, '<div class="rednote bnf">এই ক্যালকুলেটরটি Google Chrome বা Microsoft Edge ব্রাউজারে ব্যবহার করুন।</div>', '')
    s = re.sub(r'<div class="regtip bnf">[^<]*</div>', '', s, count=1)
    # no register file on the computer online, and no browser warning popup
    s = rep(s, 'const regFS=!!(window.showSaveFilePicker&&window.showOpenFilePicker);', 'const regFS=false;')
    s = rep(s, 'try{if(!(window.showSaveFilePicker&&window.showOpenFilePicker)){', 'try{if(false){')
    # register list: No., Borrower, Account, Type, Principal, Ledger balance, Report date (by report date)
    a = s.index('function regView(){'); b = s.index('/* the register rows of one loan type', a)
    s = s[:a] + REGVIEW + s[b:]
    # help (English)
    s = rep(s, '<li>The app works fully offline. Nothing is sent anywhere. Use Google Chrome or Microsoft Edge (Firefox also works, except linking the register to a file).</li>',
            '<li>Your work is saved online automatically under your office login in JBRS, so you can continue from any computer.</li>')
    s = rep(s, '<li>Always click <b>Save data to file</b> before you close, so you can open the work again later.</li>', '')
    s = rep(s, '<li><b>Open a saved file</b>: loads a file you saved earlier with "Save data to file".</li>',
            '<li><b>Open a saved file</b>: loads a data file saved earlier with the offline calculator. Then click <b>Add this borrower to the register</b> to keep it online.</li>')
    s = re.sub(r'<details><summary>Register \(several borrowers\)</summary>.*?</details>', lambda m: HELP_REG_EN, s, count=1, flags=re.S)
    # help (Bangla)
    s = rep(s, '<li>অ্যাপটি ইন্টারনেট ছাড়াই চলে, কোনো তথ্য কোথাও যায় না। Google Chrome বা Microsoft Edge ব্যবহার করুন (Firefox-এও চলে, শুধু রেজিস্টার ফাইলের সাথে যুক্ত করা যায় না)।</li>',
            '<li>আপনার কাজ JBRS-এ আপনার অফিসের লগইনে স্বয়ংক্রিয়ভাবে অনলাইনে সংরক্ষিত হয়; যেকোনো কম্পিউটার থেকে লগইন করে আবার কাজ করতে পারবেন।</li>')
    s = rep(s, '<li>কাজ শেষে অবশ্যই <b>Save data to file</b> চাপুন, যাতে পরে আবার খুলতে পারেন।</li>', '')
    s = rep(s, '<li><b>Open a saved file</b>: আগে "Save data to file" দিয়ে রাখা ফাইল খোলে।</li>',
            '<li><b>Open a saved file</b>: আগের অফলাইন ক্যালকুলেটরে সংরক্ষিত ডেটা ফাইল খোলে। অনলাইনে রাখতে এরপর <b>Add this borrower to the register</b> চাপুন।</li>')
    s = re.sub(r'<details><summary>রেজিস্টার \(একাধিক ঋণগ্রহীতা\)</summary>.*?</details>', lambda m: HELP_REG_BN, s, count=1, flags=re.S)
    assert 'Register (all borrowers)' in s and 'রেজিস্টার (সকল ঋণগ্রহীতা)' in s
    # hide controls the script still references but which are not used online
    s = rep(s, '</head>', HIDE_CSS)
    return s
