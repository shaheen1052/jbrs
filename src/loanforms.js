/* ================= Loan application forms and documents (Bangla) ================= */
const LF_BN0=['শূন্য','এক','দুই','তিন','চার','পাঁচ','ছয়','সাত','আট','নয়','দশ','এগার','বার','তের','চৌদ্দ','পনের','ষোল','সতের','আঠার','ঊনিশ','বিশ','একুশ','বাইশ','তেইশ','চব্বিশ','পঁচিশ','ছাব্বিশ','সাতাশ','আটাশ','ঊনত্রিশ','ত্রিশ','একত্রিশ','বত্রিশ','তেত্রিশ','চৌত্রিশ','পঁয়ত্রিশ','ছত্রিশ','সাঁইত্রিশ','আটত্রিশ','ঊনচল্লিশ','চল্লিশ','একচল্লিশ','বিয়াল্লিশ','তেতাল্লিশ','চুয়াল্লিশ','পঁয়তাল্লিশ','ছেচল্লিশ','সাতচল্লিশ','আটচল্লিশ','ঊনপঞ্চাশ','পঞ্চাশ','একান্ন','বায়ান্ন','তিপ্পান্ন','চুয়ান্ন','পঞ্চান্ন','ছাপ্পান্ন','সাতান্ন','আটান্ন','ঊনষাট','ষাট','একষট্টি','বাষট্টি','তেষট্টি','চৌষট্টি','পঁয়ষট্টি','ছেষট্টি','সাতষট্টি','আটষট্টি','ঊনসত্তর','সত্তর','একাত্তর','বাহাত্তর','তিয়াত্তর','চুয়াত্তর','পঁচাত্তর','ছিয়াত্তর','সাতাত্তর','আটাত্তর','ঊনআশি','আশি','একাশি','বিরাশি','তিরাশি','চুরাশি','পঁচাশি','ছিয়াশি','সাতাশি','আটাশি','ঊননব্বই','নব্বই','একানব্বই','বিরানব্বই','তিরানব্বই','চুরানব্বই','পঁচানব্বই','ছিয়ানব্বই','সাতানব্বই','আটানব্বই','নিরানব্বই'];
function lfWords(n){
  n=Math.floor(Number(n));if(!isFinite(n)||n<=0)return n===0?'শূন্য':'';
  const out=[];
  const part=(v,name)=>{if(v>0)out.push(LF_BN0[v]+(name?' '+name:''))};
  part(Math.floor(n/1e7)%1000,'কোটি');n%=1e7;
  part(Math.floor(n/1e5),'লক্ষ');n%=1e5;
  part(Math.floor(n/1e3),'হাজার');n%=1e3;
  part(Math.floor(n/100),'শত');n%=100;
  if(n>0)out.push(LF_BN0[n]);
  return out.join(' ');
}
const lfTaka=v=>{const n=parseFloat(String(v||'').replace(/,/g,''));if(!isFinite(n)||n<=0)return'';return toBn(n.toLocaleString('en-IN'))+'/- ('+lfWords(n)+') টাকা'};
const lfDate=v=>v?toBn(fmtD(v)):'';
const lfv=(d,k)=>{const x=d[k];return x===undefined||x===null||x===''?'':toBn(String(x))};

/* ---------- field sets ---------- */
const lfT=(k,l,w)=>({k,l,t:'text',w});
const lfN=(k,l,w)=>({k,l,t:'num',w});
const lfD=(k,l,w)=>({k,l,t:'date',w});
const lfS=(k,l,o,w)=>({k,l,t:'sel',o,w});
const lfA=(k,l)=>({k,l,t:'area',w:'full'});
const LF_SEC={
  app:{h:'আবেদনকারীর তথ্য',f:[lfT('a_name','আবেদনকারীর নাম'),lfT('a_acct','হিসাব নম্বর'),lfT('a_father','পিতার নাম'),lfT('a_mother','মাতার নাম'),lfT('a_spouse','স্বামী/স্ত্রীর নাম'),lfD('a_dob','জন্ম তারিখ'),lfT('a_nid','জাতীয় পরিচয়পত্র নম্বর'),lfT('a_tin','টিআইএন (যদি থাকে)'),lfT('a_mobile','মোবাইল নম্বর'),lfT('a_occ','পেশা'),lfA('a_pres','বর্তমান ঠিকানা'),lfA('a_perm','স্থায়ী ঠিকানা')]},
  loan:{h:'ঋণের বিবরণ',f:[lfS('l_kind','ঋণের ধরন',['নতুন ঋণ','নবায়ন','সীমা বৃদ্ধি']),lfN('l_amt','আবেদনকৃত ঋণের পরিমাণ (টাকা)'),lfN('l_months','মেয়াদ (মাস)'),lfS('l_mode','পরিশোধ পদ্ধতি',['মাসিক কিস্তি','ত্রৈমাসিক কিস্তি','অর্ধবার্ষিক কিস্তি','এককালীন (মেয়াদান্তে)','চাহিদা অনুযায়ী (সীমা)']),lfN('l_rate','সুদের হার (% বার্ষিক)'),lfD('l_date','আবেদনের তারিখ'),lfA('l_purpose','ঋণের উদ্দেশ্য')]},
  sec:{h:'জামানতের বিবরণ',f:[lfS('s_type',"জামানতের ধরন",['স্থাবর সম্পত্তি বন্ধক','এফডিআর/ডিপিএস লিয়েন','হাইপোথিকেশন (মজুদ/যন্ত্রপাতি)','ব্যক্তিগত জামিন','বেতন/পেনশন','অন্যান্য']),lfN('s_val','জামানতের মূল্য (টাকা)'),lfA('s_desc','জামানতের বিবরণ (দাগ নং, খতিয়ান, পরিমাণ/এফডিআর নং ইত্যাদি)')]},
  g1:{h:'জামিনদার-১',f:[lfT('g1_name','নাম'),lfT('g1_father','পিতার নাম'),lfT('g1_nid','জাতীয় পরিচয়পত্র নম্বর'),lfT('g1_mobile','মোবাইল নম্বর'),lfT('g1_occ','পেশা'),lfA('g1_addr','ঠিকানা')]},
  g2:{h:'জামিনদার-২',f:[lfT('g2_name','নাম'),lfT('g2_father','পিতার নাম'),lfT('g2_nid','জাতীয় পরিচয়পত্র নম্বর'),lfT('g2_mobile','মোবাইল নম্বর'),lfT('g2_occ','পেশা'),lfA('g2_addr','ঠিকানা')]}
};
const LF_COMMON_DOCS=['আবেদনকারীর ২ কপি পাসপোর্ট সাইজ ছবি','আবেদনকারীর জাতীয় পরিচয়পত্রের ফটোকপি','জামিনদারদের ছবি ও জাতীয় পরিচয়পত্রের ফটোকপি','টিআইএন সনদ (প্রযোজ্য ক্ষেত্রে)','সিআইবি রিপোর্ট','হালনাগাদ ব্যাংক স্টেটমেন্ট','স্ট্যাম্পে ডিমান্ড প্রমিসরি নোট ও অন্যান্য চুক্তিপত্র'];
const lfStaffEx=x=>({h:'কর্মকর্তা/কর্মচারীর তথ্য',f:[lfT('x_empid','কর্মকর্তা/কর্মচারী আইডি'),lfT('x_desig','পদবী'),lfT('x_posting','বর্তমান কর্মস্থল'),lfD('x_join','চাকরিতে যোগদানের তারিখ'),lfD('x_ret','অবসরের সম্ভাব্য তারিখ'),lfN('x_basic','মূল বেতন (টাকা)'),lfN('x_gross','মোট বেতন (টাকা)'),lfN('x_pf','ভবিষ্য তহবিলে জমা (টাকা)'),...x]});
const LF_STAFF_DOCS=['চাকরির নিয়োগপত্র ও সর্বশেষ বেতন সনদ','বেতন থেকে কর্তনের অঙ্গীকারপত্র','অবসরকালীন সুবিধা/ভবিষ্য তহবিল বন্ধকের সম্মতিপত্র','নিয়ন্ত্রণকারী কর্মকর্তার সুপারিশ'];
const lfAgriEx=x=>({h:'কৃষি তথ্য',f:[...x,lfN('x_land','আবাদযোগ্য/ব্যবহৃত জমির পরিমাণ (শতাংশ)'),lfS('x_own','জমির মালিকানা',['নিজস্ব','বর্গা','লিজ']),lfN('x_cost','মোট আনুমানিক ব্যয় (টাকা)'),lfN('x_yield','প্রত্যাশিত আয় (টাকা)'),lfA('x_loc','অবস্থান (মৌজা, দাগ নং/খামারের ঠিকানা)')]});
const LF_AGRI_DOCS=['জমির মালিকানা দলিল/খতিয়ান/খাজনার রসিদ','বর্গা/লিজ চুক্তিপত্র (প্রযোজ্য ক্ষেত্রে)','কৃষি/প্রাণিসম্পদ কর্মকর্তা/ইউনিয়ন পরিষদের প্রত্যয়নপত্র','কৃষক পরিচয়পত্র/কৃষি উপকরণ সহায়তা কার্ড (থাকলে)'];
const LF_TYPES={
  cmsme:{name:'সিএমএসএমই ঋণ',en:'CMSME',leaf:'lf_cmsme',
    ex:{h:'প্রতিষ্ঠানের তথ্য',f:[lfT('x_firm','প্রতিষ্ঠানের নাম'),lfS('x_cat','প্রতিষ্ঠানের ধরন',['কুটির','মাইক্রো','ক্ষুদ্র','মাঝারি']),lfS('x_sector','খাত',['উৎপাদন','সেবা','ব্যবসা']),lfT('x_lic','ট্রেড লাইসেন্স নম্বর'),lfT('x_est','প্রতিষ্ঠার সাল'),lfN('x_emp','কর্মচারীর সংখ্যা'),lfN('x_turn','বার্ষিক বিক্রয় (টাকা)'),lfN('x_capital','বিনিয়োগকৃত মূলধন (টাকা)'),lfA('x_addr','ব্যবসার ঠিকানা'),lfA('x_nature','ব্যবসার প্রকৃতি')]},
    docs:['হালনাগাদ ট্রেড লাইসেন্স','বিন (BIN)/ভ্যাট নিবন্ধন (প্রযোজ্য ক্ষেত্রে)','প্রতিষ্ঠানের ব্যবসায়িক কার্যক্রমের তথ্য ও বিক্রয় বিবরণী','মালিকানা ও অংশীদারি দলিল (প্রযোজ্য ক্ষেত্রে)','জামানতের মালিকানা দলিল, খতিয়ান, খাজনার রসিদ, নামজারি']},
  crop:{name:'শস্য ঋণ',en:'RCD-3 - Crop Loan',leaf:'lf_crop',ex:lfAgriEx([lfT('x_crop','ফসলের নাম'),lfS('x_season','মৌসুম',['রবি','খরিফ-১','খরিফ-২','সারা বছর'])]),docs:LF_AGRI_DOCS},
  dairy:{name:'দুগ্ধবতী গাভী পালন ঋণ (আরসিডি সার্কুলার ৬৬/১৭)',en:'RCD-3 - Dairy cow rearing (RCD Cir. 66/17)',leaf:'lf_dairy',ex:lfAgriEx([lfN('x_cows','গাভীর সংখ্যা'),lfT('x_breed','গাভীর জাত'),lfT('x_shed','গোয়ালঘর/খামারের অবস্থা')]),docs:[...LF_AGRI_DOCS,'গাভী ক্রয়ের কোটেশন/হাটের রসিদ']},
  bullfat:{name:'ষাঁড় মোটাতাজাকরণ ঋণ (আরসিডি সার্কুলার ৭৫/১৯)',en:'RCD-3 - Bull Fattening (RCD Cir. 75/19)',leaf:'lf_bullfat',ex:lfAgriEx([lfN('x_bulls','ষাঁড়ের সংখ্যা'),lfT('x_breed','ষাঁড়ের জাত'),lfN('x_period','মোটাতাজাকরণের মেয়াদ (মাস)')]),docs:[...LF_AGRI_DOCS,'ষাঁড় ক্রয়ের কোটেশন/হাটের রসিদ']},
  mpsc:{name:'বহুমুখী তদারকি ঋণ',en:'RCD-4 - Multipurpose Supervisory Credit',leaf:'lf_mpsc',ex:lfAgriEx([lfA('x_acts','প্রস্তাবিত কার্যক্রমসমূহ')]),docs:LF_AGRI_DOCS},
  gnkr:{name:'গ্রামীণ নারী কর্মসংস্থান ঋণ',en:'RCD-4 - Grameen Nari Kormosngsthan Rin',leaf:'lf_gnkr',ex:lfAgriEx([lfT('x_activity','কর্মসংস্থানমূলক কার্যক্রম'),lfT('x_group','সমিতি/দলের নাম (যদি থাকে)')]),docs:[...LF_AGRI_DOCS,'ঋণ গ্রহীতার প্রকল্প প্রস্তাব']},
  youth:{name:'প্রশিক্ষণপ্রাপ্ত যুবকদের ঋণ',en:'RCD-4 - Loan for Trained Youth',leaf:'lf_youth',ex:lfAgriEx([lfT('x_training','প্রশিক্ষণের নাম'),lfT('x_tinst','প্রশিক্ষণ প্রদানকারী প্রতিষ্ঠান'),lfD('x_tcert','প্রশিক্ষণ সনদের তারিখ'),lfT('x_activity','প্রস্তাবিত কার্যক্রম')]),docs:[...LF_AGRI_DOCS,'প্রশিক্ষণ সনদের ফটোকপি']},
  cfpersonal:{name:'পার্সোনাল লোন',en:'Consumer financing - Personal Loan',leaf:'lf_cfpersonal',
    ex:{h:'আয় ও কর্মস্থলের তথ্য',f:[lfT('x_employer','কর্মস্থল/নিয়োগকর্তা'),lfT('x_desig','পদবী'),lfN('x_income','মাসিক নীট আয় (টাকা)'),lfN('x_emi','বিদ্যমান মাসিক কিস্তি (টাকা)'),lfD('x_join','চাকরি/ব্যবসা শুরুর তারিখ'),lfA('x_use','ঋণের অর্থ ব্যবহারের খাত')]},
    docs:['আয়ের প্রমাণপত্র (বেতন সনদ/ব্যবসার তথ্য)','কর্মস্থলের পরিচয়পত্র/প্রত্যয়নপত্র','ঠিকানার প্রমাণ (ইউটিলিটি বিল ইত্যাদি)']},
  cfcredit:{name:'কনজ্যুমার ক্রেডিট',en:'Consumer financing - Consumer Credit',leaf:'lf_cfcredit',
    ex:{h:'ক্রয় ও আয়ের তথ্য',f:[lfT('x_item','পণ্যের নাম/বিবরণ'),lfT('x_vendor','বিক্রেতা প্রতিষ্ঠান'),lfN('x_price','পণ্যের মূল্য (টাকা)'),lfN('x_down','ডাউন পেমেন্ট (টাকা)'),lfN('x_income','মাসিক আয় (টাকা)'),lfN('x_emi','বিদ্যমান মাসিক কিস্তি (টাকা)'),lfT('x_employer','কর্মস্থল/নিয়োগকর্তা')]},
    docs:['পণ্যের কোটেশন/প্রোফর্মা ইনভয়েস','আয়ের প্রমাণপত্র (বেতন সনদ/ব্যবসার তথ্য)','কর্মস্থলের পরিচয়পত্রের ফটোকপি/প্রত্যয়নপত্র','ঠিকানার প্রমাণ (ইউটিলিটি বিল ইত্যাদি)']},
  cfhealth:{name:'জনতা সাপোর্ট হেলথ কেয়ার লোন',en:'Consumer financing - Janata Support Health Care Loan',leaf:'lf_cfhealth',
    ex:{h:'চিকিৎসা ও আয়ের তথ্য',f:[lfT('x_patient','রোগীর নাম'),lfT('x_rel','আবেদনকারীর সাথে সম্পর্ক'),lfT('x_hosp','হাসপাতাল/ক্লিনিকের নাম'),lfT('x_doc','চিকিৎসকের নাম'),lfN('x_cost','চিকিৎসার আনুমানিক ব্যয় (টাকা)'),lfN('x_income','মাসিক আয় (টাকা)'),lfN('x_emi','বিদ্যমান মাসিক কিস্তি (টাকা)'),lfT('x_employer','কর্মস্থল/নিয়োগকর্তা')]},
    docs:['চিকিৎসকের প্রেসক্রিপশন/চিকিৎসা প্রতিবেদন','হাসপাতাল/ক্লিনিকের ব্যয়ের প্রাক্কলন (এস্টিমেট)','আয়ের প্রমাণপত্র (বেতন সনদ/ব্যবসার তথ্য)','রোগীর সাথে সম্পর্কের প্রমাণ (প্রযোজ্য ক্ষেত্রে)']},
  cfpension:{name:'জনতা সাপোর্ট লোন ফর পেনশনার',en:'Consumer financing - Janata Support Loan for Pensioner',leaf:'lf_cfpension',
    ex:{h:'পেনশন সংক্রান্ত তথ্য',f:[lfT('x_ppo','পেনশন পেমেন্ট অর্ডার (পিপিও) নম্বর'),lfT('x_ptype','পেনশনের ধরন'),lfT('x_last','সর্বশেষ কর্মস্থল ও পদবী'),lfD('x_ret','অবসরের তারিখ'),lfN('x_pension','মাসিক পেনশন (টাকা)'),lfT('x_pbank','পেনশন উত্তোলনের হিসাব/শাখা'),lfN('x_emi','বিদ্যমান মাসিক কিস্তি (টাকা)'),lfA('x_use','ঋণের অর্থ ব্যবহারের খাত')]},
    docs:['পেনশন পেমেন্ট অর্ডার (পিপিও) এর ফটোকপি','পেনশন উত্তোলনের হিসাবের সর্বশেষ স্টেটমেন্ট','অবসর গ্রহণের আদেশ/পরিচয়পত্র','পেনশন কর্তনের/উত্তোলনের অঙ্গীকারপত্র']},
  sod:{name:'সিকিউরড ওভারড্রাফট (এসওডি)',en:'Secured overdraft',leaf:'lf_sod',
    ex:{h:'জামানতকৃত আমানতের তথ্য',f:[lfS('x_inst','আমানতের ধরন',['এফডিআর','ডিপিএস','সঞ্চয়পত্র','অন্যান্য']),lfT('x_no','আমানত/হিসাব নম্বর'),lfN('x_dep','আমানতের পরিমাণ (টাকা)'),lfD('x_open','খোলার তারিখ'),lfD('x_mat','মেয়াদপূর্তির তারিখ'),lfN('x_margin','মার্জিন (%)'),lfT('x_depo','আমানতকারীর নাম (যদি ভিন্ন হয়)')]},
    docs:['এফডিআর/আমানতের মূল রসিদ (লিয়েন চিহ্নিত)','লিয়েন ও সেট-অফ চুক্তিপত্র','তৃতীয় পক্ষের আমানত হলে আমানতকারীর সম্মতিপত্র']},
  stfhouse:{name:'কর্মকর্তা/কর্মচারী গৃহ নির্মাণ ঋণ',en:'Staff House Building Loan',leaf:'lf_stfhouse',ex:lfStaffEx([lfS('x_hkind','ঋণের উদ্দেশ্য',['জমিতে বাড়ি নির্মাণ','ফ্ল্যাট/বাড়ি ক্রয়','বাড়ি সম্প্রসারণ/মেরামত']),lfN('x_cost','মোট আনুমানিক ব্যয় (টাকা)'),lfA('x_loc','জমি/ফ্ল্যাটের অবস্থান ও বিবরণ')]),docs:[...LF_STAFF_DOCS,'জমি/ফ্ল্যাটের মালিকানা দলিল, খতিয়ান, খাজনার রসিদ','নকশা ও ব্যয়ের প্রাক্কলন']},
  stfmoto:{name:'কর্মকর্তা/কর্মচারী মোটর সাইকেল ঋণ',en:'Staff Motor Cycle Loan',leaf:'lf_stfmoto',ex:lfStaffEx([lfT('x_model','মোটর সাইকেলের মডেল ও সিসি'),lfT('x_vendor','বিক্রেতা প্রতিষ্ঠান'),lfN('x_price','মূল্য (টাকা)')]),docs:[...LF_STAFF_DOCS,'মোটর সাইকেলের কোটেশন/প্রোফর্মা ইনভয়েস','ড্রাইভিং লাইসেন্সের ফটোকপি']},
  stfcomp:{name:'কর্মকর্তা/কর্মচারী কম্পিউটার ঋণ',en:'Staff Computer Loan',leaf:'lf_stfcomp',ex:lfStaffEx([lfT('x_item','কম্পিউটারের বিবরণ'),lfT('x_vendor','বিক্রেতা প্রতিষ্ঠান'),lfN('x_price','মূল্য (টাকা)')]),docs:[...LF_STAFF_DOCS,'কম্পিউটারের কোটেশন/প্রোফর্মা ইনভয়েস']},
  execcar:{name:'নির্বাহী গাড়ি ঋণ',en:'Executive Car Loan',leaf:'lf_execcar',ex:lfStaffEx([lfT('x_grade','পদমর্যাদা/গ্রেড'),lfT('x_model','গাড়ির মডেল ও সিসি'),lfT('x_vendor','বিক্রেতা প্রতিষ্ঠান'),lfN('x_price','মূল্য (টাকা)')]),docs:[...LF_STAFF_DOCS,'গাড়ির কোটেশন/প্রোফর্মা ইনভয়েস','ড্রাইভিং লাইসেন্সের ফটোকপি']}
};
const LF_TYPE_BY_LEAF=Object.fromEntries(Object.entries(LF_TYPES).map(([k,v])=>[v.leaf,k]));

/* ---------- page ---------- */
function lfNewId(){return 'F'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function pageLoanForms(l){
  const type=LF_TYPE_BY_LEAF[l.id];const T0=LF_TYPES[type];
  const head=`<div class="muted small">Loan Application</div><h2>${esc(T0.en)} - application and documents</h2>`;
  if(S.view.lfid){S.view.after=()=>lfOpen(type);return head+`<div id="lfbox" class="muted" style="margin-top:12px">Loading...</div>`}
  const kids=isBranch()?[]:childBranches();
  const of=S.view.lfof||(isBranch()||isArea()?S.user.office:'all');
  const sel=isBranch()?'':`<div style="flex:2"><label>Office</label><select onchange="go({...S.view,lfof:this.value,after:null})">${isAdmin()?`<option value="all" ${of==='all'?'selected':''}>All branches</option>`:`<option value="${S.user.office}" ${of===S.user.office?'selected':''}>Area Office (own)</option>`}${kids.map(k=>`<option value="${k.code}" ${of===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select></div>`;
  S.view.after=()=>lfList(type,of);
  return head+`<div class="card"><div class="row">${sel}<div style="flex:0;align-self:flex-end">${S.user.office?`<button class="pri" onclick="A.lfNew('${type}')">New application</button>`:''}</div></div></div><div id="lfbox" class="card muted" style="margin-top:12px">Loading...</div>`;
}
async function lfList(type,of){
  const j=await api('/lf/list?type='+type+'&office='+encodeURIComponent(of));
  const box=$('#lfbox');if(!box)return;
  box.outerHTML=`<div id="lfbox" class="card">${j.forms.length?`<table><tr><th>Applicant</th><th>Account no.</th><th>Office</th><th>Last saved</th></tr>${j.forms.map(f=>`<tr class="click" onclick="go({...S.view,lfid:'${f.id}',lfoff:'${f.office}',after:null})"><td>${esc(f.name||'(no name)')}</td><td>${esc(f.acct||'')}</td><td>${esc(officeName(f.office))}</td><td>${fmtDT(f.updated)}</td></tr>`).join('')}</table>`:'No applications saved yet.'}</div>`;
}
A.lfNew=type=>{S.lf={id:lfNewId(),type,office:S.user.office,d:{l_date:new Date().toISOString().slice(0,10)},isNew:true};go({...S.view,lfid:S.lf.id,lfoff:S.user.office,after:null})};
async function lfOpen(type){
  const v=S.view;
  if(!(S.lf&&S.lf.id===v.lfid)){
    const j=await api('/lf/get?office='+encodeURIComponent(v.lfoff)+'&id='+encodeURIComponent(v.lfid));
    S.lf={id:j.form.id,type:j.form.type,office:j.form.office,d:j.form.data};
  }
  lfRender();
}
function lfField(f,val,ro){
  const v=esc(val??'');const dis=ro?' disabled':'';
  const w=f.w==='full'?'flex:1 1 100%':'flex:1 1 240px';
  let inp;
  if(f.t==='area')inp=`<textarea rows="2" data-k="${f.k}" oninput="A.lfset(this)"${dis}>${v}</textarea>`;
  else if(f.t==='sel')inp=`<select data-k="${f.k}" onchange="A.lfset(this)"${dis}><option value=""></option>${f.o.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else inp=`<input type="${f.t==='date'?'date':'text'}" ${f.t==='num'?'inputmode="decimal"':''} data-k="${f.k}" value="${v}" oninput="A.lfset(this)"${dis}>`;
  return `<div style="${w}"><label>${esc(f.l)}</label>${inp}${f.t==='num'&&/টাকা/.test(f.l)&&val?`<div class="muted small bn">${esc(lfTaka(val))}</div>`:''}</div>`;
}
function lfSections(type){const t=LF_TYPES[type];return[LF_SEC.app,t.ex,LF_SEC.loan,LF_SEC.sec,LF_SEC.g1,LF_SEC.g2]}
function lfRender(){
  const f=S.lf,t=LF_TYPES[f.type],ro=f.office!==S.user.office||!S.user.office;
  const box=$('#lfbox');if(!box)return;
  const docs=[...LF_COMMON_DOCS,...t.docs];
  box.outerHTML=`<div id="lfbox">${ro?'<div class="note n-info">View only: this application belongs to another office.</div>':''}
  ${lfSections(f.type).map(s=>`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">${s.h}</h3><div class="row" style="flex-wrap:wrap">${s.f.map(x=>lfField(x,f.d[x.k],ro)).join('')}</div></div>`).join('')}
  <div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">প্রয়োজনীয় কাগজপত্র (চেকলিস্ট)</h3>${docs.map((x,i)=>`<label style="display:block;font-weight:400;margin:4px 0"><input type="checkbox" data-k="ck${i}" ${f.d['ck'+i]?'checked':''} onchange="A.lfset(this)" ${ro?'disabled':''}> ${esc(x)}</label>`).join('')}</div>
  <div class="bar" style="margin-top:12px">${ro?'':`<button class="pri" onclick="run(A.lfSave)">Save</button>`}
  <button onclick="A.lfPrint('app')">Print application</button><button onclick="A.lfPrint('chk')">Print checklist</button><button onclick="A.lfPrint('gua')">Print guarantor's undertaking</button><button onclick="A.lfPrint('dpn')">Print demand promissory note</button><button onclick="A.lfPrint('all')">Print all</button>
  ${!ro&&!f.isNew?`<button class="dan" onclick="if(confirm('Delete this application?'))run(A.lfDel)">Delete</button>`:''}<button onclick="A.lfBack()">Back to list</button></div>
  <p class="muted small">Forms are drafts prepared in standard format. Check wording against the bank's current circulars and official forms before use.</p></div>`;
}
A.lfset=el=>{const k=el.dataset.k;S.lf.d[k]=el.type==='checkbox'?el.checked:el.value;S.lf.dirty=true;
  if(el.tagName==='INPUT'&&el.inputMode==='decimal'){const nx=el.parentElement.querySelector('.muted.small.bn');const tk=lfTaka(el.value);if(nx)nx.textContent=tk;else if(tk&&/টাকা/.test(el.parentElement.querySelector('label').textContent)){const d=document.createElement('div');d.className='muted small bn';d.textContent=tk;el.parentElement.appendChild(d)}}};
A.lfSave=async()=>{const f=S.lf;await api('/lf/save',{method:'PUT',body:{id:f.id,type:f.type,data:f.d}});f.dirty=false;f.isNew=false;toast('Saved.')};
A.lfDel=async()=>{await api('/lf/delete',{method:'POST',body:{id:S.lf.id}});S.lf=null;toast('Deleted.');A.lfBack()};
A.lfBack=()=>{if(S.lf&&S.lf.dirty&&!confirm('Leave without saving?'))return;S.lf=null;S.side=undefined;go({page:'leaf',leaf:S.view.leaf})};

/* ---------- printing ---------- */
function lfHead(){const o=office(S.lf.office);return`<div class="p-h"><img src="${LOGO}" alt=""><div class="tx"><div class="b">জনতা ব্যাংক পিএলসি.</div><div>${esc(o?(o.nameBn||o.name):'')}</div></div></div>`}
const lfRow=(l,v)=>`<tr><td style="width:36%">${l}</td><td>${esc(v||'')}</td></tr>`;
const lfTbl=(rows)=>`<table class="r3t" style="width:100%;border-collapse:collapse"><tbody>${rows}</tbody></table>`;
function lfSign(left,right){return`<div class="p-end"><div class="p-sign"><div>${left}</div><div>${right}</div></div></div>`}
function lfSecRows(s,d){return s.f.map(x=>lfRow(esc(x.l),x.t==='date'?lfDate(d[x.k]):x.t==='num'&&/টাকা/.test(x.l)&&d[x.k]?lfTaka(d[x.k]):lfv(d,x.k))).join('')}
function lfDocApp(){
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];
  return`<div class="r3pg">${lfHead()}<div class="gtitle">${t.name} - আবেদনপত্র</div>
  <p>তারিখ: ${lfDate(d.l_date)}</p><p>ব্যবস্থাপক<br>জনতা ব্যাংক পিএলসি.<br>${esc((office(f.office)||{}).nameBn||(office(f.office)||{}).name||'')}</p>
  <p>বিষয়: ${t.name} মঞ্জুরির জন্য আবেদন।</p>
  <p>জনাব, আমি নিম্নে বর্ণিত তথ্যসহ ${t.name} প্রাপ্তির জন্য আবেদন করছি।</p>
  ${[LF_SEC.app,t.ex,LF_SEC.loan,LF_SEC.sec].map(s=>`<div class="r3cap">${s.h}</div>${lfTbl(lfSecRows(s,d))}`).join('')}
  <p style="margin-top:10px">ঘোষণা: আমি এই মর্মে ঘোষণা করছি যে উপরে প্রদত্ত সকল তথ্য সত্য ও সঠিক। কোনো তথ্য অসত্য প্রমাণিত হলে ব্যাংক যে কোনো আইনানুগ ব্যবস্থা গ্রহণ করতে পারবে। ঋণের কিস্তি ও সুদ যথাসময়ে পরিশোধ করতে আমি অঙ্গীকার করছি।</p>
  ${lfSign('আবেদনকারীর স্বাক্ষর ও তারিখ','ব্যবস্থাপক')}</div>`;
}
function lfDocChk(){
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];const docs=[...LF_COMMON_DOCS,...t.docs];
  return`<div class="r3pg">${lfHead()}<div class="gtitle">${t.name} - কাগজপত্রের চেকলিস্ট</div>
  <p>আবেদনকারী: ${lfv(d,'a_name')} &nbsp; হিসাব নম্বর: ${lfv(d,'a_acct')} &nbsp; ঋণের পরিমাণ: ${lfTaka(d.l_amt)}</p>
  <table class="r3t" style="width:100%;border-collapse:collapse"><tr><th style="width:8%">ক্রমিক</th><th>কাগজপত্রের নাম</th><th style="width:14%">জমা আছে</th><th style="width:20%">মন্তব্য</th></tr>${docs.map((x,i)=>`<tr><td style="text-align:center">${toBn(i+1)}</td><td>${esc(x)}</td><td style="text-align:center">${d['ck'+i]?'✓':''}</td><td></td></tr>`).join('')}</table>
  ${lfSign('কর্মকর্তা','ব্যবস্থাপক')}</div>`;
}
function lfDocGua(){
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];
  const one=(g,n)=>`<div class="r3pg"><div style="margin-bottom:8px">${lfHead()}</div><div class="gtitle">জামিনদারের অঙ্গীকারনামা (জামিনদার-${toBn(n)})</div>
  <p>আমি ${lfv(d,g+'_name')||'................'}, পিতা: ${lfv(d,g+'_father')||'................'}, জাতীয় পরিচয়পত্র নম্বর: ${lfv(d,g+'_nid')||'................'}, ঠিকানা: ${esc(d[g+'_addr']||'................')}।</p>
  <p>আমি এই মর্মে অঙ্গীকার করছি যে ${lfv(d,'a_name')||'................'} (হিসাব নম্বর: ${lfv(d,'a_acct')||'................'}) জনতা ব্যাংক পিএলসি., ${esc((office(f.office)||{}).nameBn||(office(f.office)||{}).name||'')} থেকে ${lfTaka(d.l_amt)||'................ টাকা'} ${t.name} গ্রহণ করছেন। উক্ত ঋণ ও এর উপর আরোপযোগ্য সুদ, মাশুল ও অন্যান্য খরচ ঋণগ্রহীতা পরিশোধে ব্যর্থ হলে আমি ব্যক্তিগতভাবে ও যৌথভাবে তা পরিশোধে দায়বদ্ধ থাকব। ব্যাংকের চাহিদা পেলে আমি তাৎক্ষণিকভাবে পাওনা পরিশোধ করব।</p>
  <p>আমার এই জামিনদারি ঋণ সম্পূর্ণ পরিশোধ না হওয়া পর্যন্ত বলবৎ থাকবে এবং ব্যাংকের লিখিত সম্মতি ছাড়া তা প্রত্যাহার করা যাবে না।</p>
  <p>তারিখ: ${lfDate(d.l_date)}</p>${lfSign('জামিনদারের স্বাক্ষর','সাক্ষী/ব্যবস্থাপক')}</div>`;
  return one('g1',1)+(d.g2_name?one('g2',2):'');
}
function lfDocDpn(){
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];
  const br=(office(f.office)||{}).nameBn||(office(f.office)||{}).name||'';
  return`<div class="r3pg">${lfHead()}<div class="gtitle">ডিমান্ড প্রমিসরি নোট</div>
  <p style="text-align:right">টাকা: ${lfTaka(d.l_amt)||'................'}<br>তারিখ: ${lfDate(d.l_date)}</p>
  <p>চাহিবামাত্র আমি/আমরা ${lfv(d,'a_name')||'................'}, পিতা: ${lfv(d,'a_father')||'................'}, ঠিকানা: ${esc(d.a_pres||'................')}, জনতা ব্যাংক পিএলসি., ${esc(br)} অথবা উহার আদেশানুযায়ী যে কোনো ব্যক্তিকে ${lfTaka(d.l_amt)||'................'} মূল্য প্রাপ্তি স্বীকারপূর্বক ${t.name} বাবদ উক্ত টাকা এবং উহার উপর ${lfv(d,'l_rate')||'......'}% হারে বার্ষিক সুদসহ পরিশোধ করিব/করিব বলিয়া অঙ্গীকার করিতেছি।</p>
  <p style="margin-top:60px">ঋণগ্রহীতার স্বাক্ষর: ........................ &nbsp;&nbsp; নাম: ${lfv(d,'a_name')}</p>
  <p>সাক্ষী-১: ........................ &nbsp;&nbsp; সাক্ষী-২: ........................</p>
  <p class="muted small">দ্রষ্টব্য: এই নোট ব্যাংকের নির্ধারিত মূল্যের নন-জুডিশিয়াল স্ট্যাম্পে/রাজস্ব স্ট্যাম্প যুক্ত করে সম্পাদন করতে হবে।</p>
  ${lfSign('কর্মকর্তা','ব্যবস্থাপক')}</div>`;
}
A.lfPrint=w=>{
  const m={app:lfDocApp,chk:lfDocChk,gua:lfDocGua,dpn:lfDocDpn};
  const parts=w==='all'?['app','chk','gua','dpn']:[w];
  $('#printArea').innerHTML='<div class="bn r3p">'+parts.map(k=>m[k]()).join('')+'</div>';
  window.print();
};
