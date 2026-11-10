/* ================= Bijoy (SutonnyMJ) <-> Unicode Bangla ================= */
const BJ_H='্';
// Bijoy sequence -> Unicode (consonants, vowels, signs, conjuncts and phala forms)
const BJ_MAP={
 'i¨':'র‍্য','ª¨':'্র্য','°':'ক্ক','±':'ক্ট','³':'ক্ত','K¡':'ক্ব','¯Œ':'স্ক্র','µ':'ক্র','K¬':'ক্ল','¶':'ক্ষ','ÿ':'ক্ষ','·':'ক্স','¸':'গু','»':'গ্ধ',
 'Mœ':'গ্ন','M¥':'গ্ম','Mø':'গ্ল','¼':'ঙ্ক','•¶':'ঙ্ক্ষ','•L':'ঙ্খ','½':'ঙ্গ','•N':'ঙ্ঘ','”P':'চ্চ','”Q¡':'চ্ছ্ব','”Q':'চ্ছ','”T':'চ্ঞ','¾¡':'জ্জ্ব',
 '¾':'জ্জ','À':'জ্ঝ','Á':'জ্ঞ','R¡':'জ্ব','Â':'ঞ্চ','Ã':'ঞ্ছ','Ä':'ঞ্জ','Å':'ঞ্ঝ','Æ':'ট্ট','U¡':'ট্ব','U¥':'ট্ম','Ç':'ড্ড','È':'ণ্ট','É':'ণ্ঠ',
 'Ý':'ন্স','Ê':'ণ্ড','š‘':'ন্তু','Y^':'ণ্ব','Ë¡':'ত্ত্ব','Ë':'ত্ত','Ì':'ত্থ','Zœ':'ত্ন','Z¥':'ত্ম','š—¡':'ন্ত্ব','Z¡':'ত্ব','Î':'ত্র','_¡':'থ্ব',
 '˜M':'দ্গ','˜N':'দ্ঘ','Ï':'দ্দ','×':'দ্ধ','˜¡':'দ্ব','Ø':'দ্ব','™¢':'দ্ভ','Ù':'দ্ম','`ª“':'দ্রু','aŸ':'ধ্ব','a¥':'ধ্ম','›U':'ন্ট','Ú':'ন্ঠ','Û':'ন্ড',
 'š¿':'ন্ত্র','š—':'ন্ত','¯¿':'স্ত্র','š’':'ন্থ','›`':'ন্দ','›Ø':'ন্দ্ব','Ü':'ন্ধ','bœ':'ন্ন','š^':'ন্ব','b¥':'ন্ম','Þ':'প্ট','ß':'প্ত','cœ':'প্ন',
 'à':'প্প','cø':'প্ল','á':'প্স','d¬':'ফ্ল','â':'ব্জ','ã':'ব্দ','ä':'ব্ধ','eŸ':'ব্ব','eø':'ব্ল','å':'ভ্র','gœ':'ম্ন','¤ú':'ম্প','ç':'ম্ফ','¤^':'ম্ব',
 '¤¢':'ম্ভ','¤£':'ম্ভ্র','¤§':'ম্ম','¤ø':'ম্ল','iæ':'রু','iƒ':'রূ','é':'ল্ক','ê':'ল্গ','ë':'ল্ট','ì':'ল্ড','í':'ল্প','î':'ল্ফ','j¦':'ল্ব','j¥':'ল্ম',
 'jø':'ল্ল','ï':'শু','ð':'শ্চ','kœ':'শ্ন','k¦':'শ্ব','k¥':'শ্ম','kø':'শ্ল','®‹':'ষ্ক','®Œ':'ষ্ক্র','ó':'ষ্ট','ô':'ষ্ঠ','ò':'ষ্ণ','®ú':'ষ্প','õ':'ষ্ফ',
 '®§':'ষ্ম','¯‹':'স্ক','÷':'স্ট','ö':'স্খ','¯Í':'স্ত','¯‘':'স্তু','¯’':'স্থ','¯œ':'স্ন','¯ú':'স্প','ù':'স্ফ','¯^':'স্ব','¯§':'স্ম','¯ø':'স্ল','û':'হু',
 'nè':'হ্ণ','nŸ':'হ্ব','ý':'হ্ন','þ':'হ্ম','n¬':'হ্ল','ü':'হৃ','Av':'আ',
 'A':'অ','B':'ই','C':'ঈ','D':'উ','E':'ঊ','F':'ঋ','G':'এ','H':'ঐ','I':'ও','J':'ঔ','K':'ক','L':'খ','M':'গ','N':'ঘ','O':'ঙ','P':'চ','Q':'ছ','R':'জ',
 'S':'ঝ','T':'ঞ','U':'ট','V':'ঠ','W':'ড','X':'ঢ','Y':'ণ','Z':'ত','_':'থ','`':'দ','a':'ধ','b':'ন','c':'প','d':'ফ','e':'ব','f':'ভ','g':'ম','h':'য',
 'i':'র','j':'ল','k':'শ','l':'ষ','m':'স','n':'হ','o':'\u09dc','p':'\u09dd','q':'\u09df','r':'ৎ','s':'ং','t':'ঃ','u':'ঁ',
 '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯',
 'v':'া','x':'ী','y':'ু','z':'ু','æ':'ু','~':'ূ','ƒ':'ূ','„':'ৃ','…':'ৃ','Š':'ৗ','|':'।','&':'্','$':'৳',
 '^':'্ব','¡':'্ব','¦':'্ব','Ÿ':'্ব','‘':'্তু','’':'্থ','‹':'্ক','Œ':'্ক্র','—':'্ত','Í':'্ত','“':'্রু','¨':'্য','ª':'্র','«':'্র','Ö':'্র',
 '¬':'্ল','ø':'্ল','œ':'্ন','¥':'্ম','§':'্ম','ú':'্প','¢':'্ভ','£':'্ভ্র','š':'ন্','›':'ন্','¤':'ম্','®':'ষ্','¯':'স্','˜':'দ্','™':'দ্','•':'ঙ্',
 'Ò':'“','Ó':'”','Ô':'‘','Õ':'’','Ñ':'—'
};
const BJ_PRE={'w':'ি','‡':'ে','†':'ে','‰':'ৈ','ˆ':'ৈ'};
const BJ_KEYS=Object.keys(BJ_MAP).sort((a,b)=>b.length-a.length);
const BJ_CONS='কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ\u09dc\u09dd\u09dfৎ';
const bjFix=t=>t.replace(/\u09a1\u09bc/g,'\u09dc').replace(/\u09a2\u09bc/g,'\u09dd').replace(/\u09af\u09bc/g,'\u09df');
const BJ_KARS='ািীুূৃেৈোৌৗ';
const bjIsC=c=>!!c&&BJ_CONS.includes(c);
/* Bijoy text -> Unicode */
function bj2u(src){
  const s=String(src==null?'':src);let t='';
  for(let i=0;i<s.length;){
    const ch=s[i];
    if(BJ_PRE[ch]){t+='\x01'+BJ_PRE[ch];i++;continue}
    if(ch==='©'){t+='\x02';i++;continue}
    let k=null;for(const key of BJ_KEYS)if(s.startsWith(key,i)){k=key;break}
    if(k){t+=BJ_MAP[k];i+=k.length}else{t+=ch;i++}
  }
  t=t.split(BJ_H+BJ_H).join(BJ_H);
  // pre-base vowel signs: move after the consonant cluster that follows
  let g=0;while(t.includes('\x01')&&g++<500){
    const i=t.indexOf('\x01');let k=t[i+1],j=i+2;
    if(bjIsC(t[j])){j++;while(j+1<t.length&&(t[j]===BJ_H||(t[j]==='‍'&&t[j+1]===BJ_H))&&(bjIsC(t[j+1])||bjIsC(t[j+2]))){j+=t[j]==='‍'?3:2}}
    // a reph typed between kar and cluster stays with the cluster
    let rest=t.slice(j),seg=t.slice(i+2,j);
    if(k==='ে'&&rest[0]==='া'){k='ো';rest=rest.slice(1)}else if(k==='ে'&&rest[0]==='ৗ'){k='ৌ';rest=rest.slice(1)}
    t=t.slice(0,i)+seg+k+rest;
  }
  // reph: put "র্" in front of the cluster it follows (kars between stay after)
  g=0;while(t.includes('\x02')&&g++<500){
    const i=t.indexOf('\x02');let j=i;while(j>0&&BJ_KARS.includes(t[j-1]))j--;const kars=t.slice(j,i),j0=j;
    if(j>0&&bjIsC(t[j-1])){j--;while(j>=2&&t[j-1]===BJ_H&&bjIsC(t[j-2]))j-=2}
    t=t.slice(0,j)+'র'+BJ_H+t.slice(j,j0)+kars+t.slice(i+1);
  }
  return t.replace(/ ঃ/g,'ঃ').split('অা').join('আ').split('ঁা').join('াঁ').split('ুু').join('ু').split('ে্').join('্').replace(/\x01/g,'');
}
/* Unicode -> Bijoy (SutonnyMJ) */
const BJ_U={};Object.entries(BJ_MAP).forEach(([b,u])=>{if(!(u in BJ_U))BJ_U[u]=b});
Object.assign(BJ_U,{'ক্ষ':'ÿ','দ্ব':'Ø','ঙ':'O','্ব':'¦','্র':'ª','্ল':'ø','্ম':'¥','ু':'y','ূ':'~','ৃ':'„','র‍্য':'i¨','—':'Ñ','প্র':'cÖ','গ্র':'MÖ','শ্র':'kÖ','ফ্র':'d«',
 'ব্ব':'eŸ','ধ্ব':'aŸ','হ্ব':'nŸ','শ্ব':'k¦','ল্ব':'j¦','ত্ব':'Z¡','ক্ব':'K¡','জ্ব':'R¡','ট্ব':'U¡','থ্ব':'_¡','স্ব':'¯^','ম্ব':'¤^','ন্ব':'š^','ণ্ব':'Y^'});
const BJ_UKEYS=Object.keys(BJ_U).filter(k=>k.length>1&&(bjIsC(k[0])||k[0]==='র')).sort((a,b)=>b.length-a.length);
const BJ_PH={'য':'¨','র':'ª','ব':'¦','ল':'ø','ম':'¥','ন':'œ'};
const BJ_KAR_SP={'রু':'iæ','রূ':'iƒ','শু':'ï','হু':'û','গু':'¸','হৃ':'ü','ন্তু':'š‘','স্তু':'¯‘','দ্রু':'`ª“'};
function bjCluster(c){
  let o='';for(let j=0;j<c.length;){
    let k=null;for(const key of BJ_UKEYS)if(c.startsWith(key,j)&&!(key.endsWith(BJ_H)&&BJ_PH[c[j+key.length]]&&(j+key.length+1>=c.length||c[j+key.length+1]===BJ_H))){k=key;break}
    if(k){o+=BJ_U[k];j+=k.length;continue}
    if(c[j]===BJ_H){const x=c[j+1];if(x&&BJ_PH[x]&&(j+2>=c.length||c[j+2]===BJ_H)){o+=BJ_PH[x];j+=2;continue}o+='&';j++;continue}
    o+=BJ_U[c[j]]!==undefined?BJ_U[c[j]]:c[j];j++;
  }return o;
}
function u2bj(src){
  const t=bjFix(String(src==null?'':src)).replace(/\u200c/g,'').replace(/র\u200d্য/g,'\x03').replace(/\u200d/g,'');let o='';
  const POST={'া':'v','ী':'x','ু':'y','ূ':'~','ৃ':'„','ৗ':'Š'},PRE={'ি':'w','ে':'‡','ৈ':'‰'};
  for(let i=0;i<t.length;){
    const ch=t[i];
    if(ch==='\x03'||bjIsC(ch)){
      let reph=false;if(ch==='র'&&t[i+1]===BJ_H&&bjIsC(t[i+2])){reph=true;i+=2}
      let c=t[i]==='\x03'?'র‍্য':t[i];i++;
      while(t[i]===BJ_H&&bjIsC(t[i+1])){c+=BJ_H+t[i+1];i+=2}
      if(t[i]===BJ_H&&!bjIsC(t[i+1])){c+=BJ_H;i++}
      let kar=BJ_KARS.includes(t[i])?t[i]:'';if(kar)i++;
      let cb;if(kar&&BJ_KAR_SP[c+kar]){cb=BJ_KAR_SP[c+kar];kar=''}else cb=bjCluster(c);
      const rp=reph?'©':'';
      if(kar==='ো')o+='‡'+cb+rp+'v';else if(kar==='ৌ')o+='‡'+cb+rp+'Š';else if(PRE[kar])o+=PRE[kar]+cb+rp;else o+=cb+rp+(POST[kar]||'');
      continue;
    }
    if(PRE[ch]){o+=PRE[ch];i++;continue}
    if(POST[ch]){o+=POST[ch];i++;continue}
    o+=BJ_U[ch]!==undefined?BJ_U[ch]:ch;i++;
  }return o;
}
/* does this text look like Bijoy (not Unicode Bangla, not plain English)? */
const bjLooks=t=>{t=String(t==null?'':t);return!!t&&!/[ঀ-৿]/.test(t)&&/[¡-ÿŒœŠšŸƒˆ˜–-›]|Av|\b[A-Za-z]*[wxv‡]\b/.test(t)};
