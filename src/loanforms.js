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

const lfTypeOfLeaf=id=>LF_TYPE_BY_LEAF[String(id).replace(/_(cl|rp|ao)$/,'')];
const lfShort=t=>t.en.split(' - ').pop();
const lfOf=()=>S.view.lfof||(isBranch()||isArea()?S.user.office:'all');
function lfOfSel(of,slim){
  if(isBranch())return'';const kids=childBranches();
  return`<div style="flex:0 1 auto">${slim?'':'<label>Office</label>'}<select onchange="go({...S.view,lfof:this.value,lfid:null,lfoff:null,after:null})">${isAdmin()?`<option value="all" ${of==='all'?'selected':''}>All branches</option>`:`${isArea()?`<option value="all" ${of==='all'?'selected':''}>All (Area Office + branches)</option>`:''}<option value="${S.user.office}" ${of===S.user.office?'selected':''}>Area Office (own)</option>`}${kids.map(k=>`<option value="${k.code}" ${of===k.code?'selected':''}>${k.code} - ${esc(k.name)}</option>`).join('')}</select></div>`;
}
const lfAppSel=(forms,cur,slim)=>`<div style="flex:0 1 auto">${slim?'':'<label>Applicant</label>'}<select onchange="A.lfPickF(this)"><option value="">- Applicant -</option>${forms.map(f=>`<option value="${f.office}|${f.id}" ${cur&&cur.id===f.id?'selected':''}>${esc(f.name||'(no name)')}${f.acct?' - '+esc(f.acct):''}${f.office!==S.user.office?' ['+esc(officeName(f.office))+']':''}${f.status?' ('+f.status+')':''}</option>`).join('')}</select></div>`;
A.lfPickF=el=>{const [o,i]=el.value.split('|');go({...S.view,lfid:i||null,lfoff:o||null,after:null})};
async function lfLoadSel(forms){   // load the selected applicant into S.lf
  const v=S.view,cur=forms.find(f=>f.id===v.lfid);
  if(cur&&!(S.lf&&S.lf.id===cur.id)){const g=await api('/lf/get?office='+encodeURIComponent(cur.office)+'&id='+encodeURIComponent(cur.id));S.lf={id:g.form.id,type:g.form.type,office:g.form.office,d:g.form.data}}
  return cur;
}

const LF_SA=['Branch','Area Office','Divisional Office','Head Office'];
function lfSaHtml(d,ro){
  const fs=[lfS('sa','Sanction Authority *',LF_SA)];
  if(d.sa==='Branch')fs.push(lfT('sl_ref','Sanction Letter Reference'),lfD('sl_date','Sanction Letter Date'));
  else if(d.sa)fs.push(lfT('fw_ref','Forwarding Letter Reference'),lfD('fw_date','Forwarding Letter Date'));
  return`<h3 style="margin-top:0">Sanction Authority</h3><div class="row">${fs.map(x=>lfField(x,d[x.k],ro)).join('')}</div>${d.sa==='Branch'&&d.sl_ref&&!ro&&!S.lf.isNew&&!(S.lf.flow&&S.lf.flow.status)?`<div style="margin-top:8px"><button class="pri" onclick="run(()=>A.lfBSanc('${S.lf.id}'))">Mark as sanctioned by Branch</button></div>`:''}${d.sa&&d.sa!=='Branch'?'<div class="muted small" style="margin-top:6px">This file will be sent to the Area Office. The forwarding letter reference is used by the Area Office at sanction.</div>':''}`;
}
const lfStat=(f,bn)=>{const dt=x=>x?(bn?lfDate(x):lfIsoToDmy(x)):'';
  if(!f.sa)return bn?'খসড়া':'Draft';
  if(f.status==='sanctioned')return bn?`${f.sa||''} কর্তৃক মঞ্জুর`:'Sanctioned by '+(f.sa||'Area Office');
  if(f.status==='declined')return bn?'প্রত্যাখ্যাত':'Declined by Area Office';
  if(f.status==='returned')return bn?'সংশোধনের জন্য ফেরত':'Returned for correction';
  if(f.sa==='Branch')return bn?'মঞ্জুরির অপেক্ষায় (শাখা)':'Pending sanction (Branch)';
  if(f.status==='received')return bn?`এরিয়া অফিস কর্তৃক গৃহীত ${dt(f.in_date)} (ইনওয়ার্ড ${f.in_no||''})`:`Received by Area Office ${dt(f.in_date)} (In ${f.in_no||''})`;
  if(f.status==='sent')return bn?`এরিয়া অফিসে প্রেরিত ${dt(f.out_date)}`:`Sent to Area Office ${dt(f.out_date)} (Out ${f.out_no||''})`;
  return bn?'প্রেরণের অপেক্ষায়':'Not sent yet'};
const DEC_TXT={sanctioned:'Sanctioned',declined:'Declined',returned:'Returned for correction'};
function lfDecHtml(decs){
  if(!decs||!decs.length)return'';S.lfFiles=S.lfFiles||{};
  return`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">Area Office decisions</h3>${decs.map(d=>`<div style="border-top:1px solid var(--line);padding:6px 0"><b>${DEC_TXT[d.dec]||d.dec}</b> - ${d.dec_date?lfDate(d.dec_date):''}${d.note?`<div style="white-space:pre-wrap">${esc(d.note)}</div>`:''}${d.files.map(f=>{S.lfFiles[f.fid]=f.name;return`<div><a class="lk" onclick="run(()=>A.lfDl('${f.fid}'))">&#128206; ${esc(f.name)}</a></div>`}).join('')}</div>`).join('')}</div>`;
}
A.lfDl=async fid=>{
  const r=await fetch('/api/lf/file?fid='+encodeURIComponent(fid),{headers:{authorization:'Bearer '+S.token}});
  if(!r.ok)throw new Error('Could not download the file.');
  const b=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(S.lfFiles||{})[fid]||'file';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
};
const lfOI=(no,dt,bn)=>no?no+(dt?' / '+(bn?lfDate(dt):lfIsoToDmy(dt)):''):'';
const lfWho=f=>{const sa=f.sa;if(!sa)return'(not selected)';
  if(sa==='Branch')return'Branch'+(f.sl_ref?` - Ref ${f.sl_ref}${f.sl_date?', '+lfIsoToDmy(f.sl_date):''}`:' (letter pending)');
  return sa+(f.status==='sanctioned'?' - sanctioned':f.status==='declined'?' - declined':' (to sanction)')};
function lfAsk(next){
  S.lfNext=next;
  modal(`<h2>Unsaved changes</h2><p>You have changes that are not saved. Save them before leaving?</p><div class="bar"><button class="pri" onclick="run(A.lfAskSave)">Save</button><button class="dan" onclick="A.lfAskDiscard()">Discard</button><button onclick="closeModal()">Stay</button></div>`);
}
A.lfAskSave=async()=>{if(S.lf.aoDirty)await A.lfAoSave();if(S.lf.dirty)await A.lfSave();closeModal();const n=S.lfNext;S.lfNext=null;if(n)n()};
A.lfAskDiscard=()=>{closeModal();S.lf.dirty=false;S.lf.aoDirty=false;const n=S.lfNext;S.lfNext=null;if(n)n()};
window.addEventListener('beforeunload',e=>{if(S.lf&&(S.lf.dirty||S.lf.aoDirty)){e.preventDefault();e.returnValue=''}});

/* ---------- page ---------- */
function lfNewId(){return 'F'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function pageLoanForms(l){
  const type=lfTypeOfLeaf(l.id);if(!S.view.lfid&&S.lf&&!S.lf.dirty)S.lf=null;const T0=LF_TYPES[type];
  const head=`<div class="pghead"><div class="hrow"><h2>${esc(lfShort(T0))} data entry</h2><span id="hdrsave"></span></div></div>`;
  if(S.view.lfid){S.view.after=()=>lfOpen(type);return head+`<div id="lfbox" class="muted" style="margin-top:12px">Loading...</div>`}
  const of=lfOf();
  S.view.after=()=>lfList(type,of);
  return head+`<div class="card"><div class="row" style="align-items:flex-end">${lfOfSel(of)}<div style="flex:0 0 auto">${S.user.office?`<button class="pri" onclick="A.lfNew('${type}')">New application</button>`:''}</div></div></div><div id="lfbox" class="card muted" style="margin-top:12px">Loading...</div>`;
}
async function lfList(type,of){
  const j=await api('/lf/list?type='+type+'&office='+encodeURIComponent(of));
  const box=$('#lfbox');if(!box)return;
  const rst=S.view.rst;if(rst)j.forms=j.forms.filter(f=>lfBucket(f.sa||'',f.status,f.sl_ref)===rst);
  const act=f=>f.office===S.user.office&&f.sa==='Branch'&&!f.status?`<button class="pri" ${f.sl_ref?'':'disabled title="Enter the sanction letter reference first"'} onclick="run(()=>A.lfBSanc(\'${f.id}\'))">Mark sanctioned</button>`:f.office===S.user.office&&f.sa&&f.sa!=='Branch'&&(!f.status||f.status==='returned')?`<button class="pri" onclick="A.lfSendAsk('${f.id}')">${f.status?'Send again':'Send'}</button>`:(isArea()&&f.office!==S.user.office&&f.status==='sent'?`<button class="pri" onclick="A.lfRecvAsk('${f.office}','${f.id}')">Receive</button>`:'');
  box.outerHTML=`<div id="lfbox" class="card" style="overflow:auto">${rst?`<div class="note n-info">Showing: ${rst} &nbsp; <a class="lk" onclick="go({...S.view,rst:null,after:null})">Show all</a></div>`:''}${j.forms.length?`<table><tr><th>Applicant</th><th>Account no.</th><th>Sanction authority</th><th>Status</th><th>Outward no. / date</th><th>Inward no. / date</th><th>Office</th><th>Last saved</th><th></th></tr>${j.forms.map(f=>`<tr class="click" onclick="go({...S.view,lfid:'${f.id}',lfoff:'${f.office}',after:null})"><td>${esc(f.name||'(no name)')}</td><td>${esc(f.acct||'')}</td><td>${esc(f.sa||'')}</td><td>${esc(lfStat(f))}</td><td>${esc(lfOI(f.out_no,f.out_date))}</td><td>${esc(lfOI(f.in_no,f.in_date))}</td><td>${esc(officeName(f.office))}</td><td>${fmtDT(f.updated)}</td><td onclick="event.stopPropagation()">${act(f)}</td></tr>`).join('')}</table>`:'No applications saved yet.'}</div>`;
}
const lfToday=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
A.lfBSanc=async id=>{if(S.lf&&S.lf.dirty&&S.lf.id===id)throw new Error('Save the application first.');if(!confirm('Mark this application as sanctioned by the Branch?'))return;await api('/lf/bsanction',{method:'POST',body:{id}});toast('Marked as sanctioned by Branch.');S.lf=null;go({...S.view,after:null})};
A.lfSendAsk=id=>{S.lfAct={id};modal(`<h2>Send to Area Office</h2><p>Send this file to the Area Office? Enter the outward number and date.</p><div class="fld"><label>Outward number</label><input id="fl_no"></div><div class="fld"><label>Outward date</label><input id="fl_dt" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" value="${lfIsoToDmy(lfToday())}" oninput="A.lfDt(this)"></div><div class="bar"><button class="pri" onclick="run(A.lfSendDo)">Confirm send</button><button onclick="closeModal()">Cancel</button></div>`)};
A.lfSendDo=async()=>{await api('/lf/send',{method:'POST',body:{id:S.lfAct.id,out_no:$('#fl_no').value,out_date:lfDmyToIso($('#fl_dt').value)}});closeModal();toast('Marked as sent to Area Office.');go({...S.view,after:null})};
A.lfRecvAsk=(o,id)=>{S.lfAct={o,id};modal(`<h2>Receive file</h2><p>Mark the physical file as received by the Area Office. Enter the inward number and date.</p><div class="fld"><label>Inward number</label><input id="fl_no"></div><div class="fld"><label>Inward date</label><input id="fl_dt" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" value="${lfIsoToDmy(lfToday())}" oninput="A.lfDt(this)"></div><div class="bar"><button class="pri" onclick="run(A.lfRecvDo)">Confirm received</button><button onclick="closeModal()">Cancel</button></div>`)};
A.lfRecvDo=async()=>{await api('/lf/receive',{method:'POST',body:{office:S.lfAct.o,id:S.lfAct.id,in_no:$('#fl_no').value,in_date:lfDmyToIso($('#fl_dt').value)}});closeModal();toast('Marked as received.');go({...S.view,after:null})};
A.lfNew=type=>{S.lf={id:lfNewId(),type,office:S.user.office,d:{l_date:new Date().toISOString().slice(0,10),...(LF_TYPES[type].defaults||{})},isNew:true};go({...S.view,lfid:S.lf.id,lfoff:S.user.office,after:null})};
async function lfOpen(type){
  const v=S.view;
  if(!(S.lf&&S.lf.id===v.lfid)){
    const j=await api('/lf/get?office='+encodeURIComponent(v.lfoff)+'&id='+encodeURIComponent(v.lfid));
    S.lf={id:j.form.id,type:j.form.type,office:j.form.office,d:j.form.data,flow:j.flow,decs:j.decs};
  }
  lfRender();
}
const lfIsoToDmy=v=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?m[3]+'/'+m[2]+'/'+m[1]:''};
const lfDmyToIso=v=>{const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v||'');if(!m)return'';const d=new Date(+m[3],+m[2]-1,+m[1]);return d.getFullYear()===+m[3]&&d.getMonth()===+m[2]-1&&d.getDate()===+m[1]?m[3]+'-'+m[2]+'-'+m[1]:''};
A.lfDt=(el,fn)=>{const d=el.value.replace(/\D/g,'').slice(0,8);el.value=d.length>4?d.slice(0,2)+'/'+d.slice(2,4)+'/'+d.slice(4):d.length>2?d.slice(0,2)+'/'+d.slice(2):d;el.style.borderColor=el.value.length===10&&!lfDmyToIso(el.value)?'#b42318':'';if(fn)fn(el)};
function lfField(f,val,ro,fn){fn=fn||'A.lfset';
  const v=esc(val??'');const dis=ro?' disabled':'';
  const w=f.t==='area'?'fc ad':f.w==='full'?'fc w':'fc';
  let inp;
  if(f.t==='area')inp=`<textarea rows="2" data-k="${f.k}" oninput="${fn}(this)"${dis}>${v}</textarea>`;
  else if(f.t==='sel')inp=`<select data-k="${f.k}" onchange="${fn}(this)"${dis}><option value=""></option>${f.o.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
  else if(f.t==='date')inp=`<input type="text" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" data-dt="1" data-k="${f.k}" value="${esc(lfIsoToDmy(val))}" oninput="A.lfDt(this,${fn})"${dis}>`;
  else inp=`<input type="text" ${f.t==='num'?'inputmode="decimal"':''} data-k="${f.k}" value="${v}" oninput="${fn}(this)"${dis}>`;
  return `<div class="${w}"><label>${esc(f.l)}</label>${inp}${f.t==='num'&&/টাকা/.test(f.l)&&val?`<div class="muted small bn">${esc(lfTaka(val))}</div>`:''}</div>`;
}
const lfDocs=t=>t.ownDocs?t.docs:[...LF_COMMON_DOCS,...t.docs];
const lfPrintList=t=>t.print||[['app','Print application',lfDocApp],['chk','Print checklist',lfDocChk],['gua',"Print guarantor's undertaking",lfDocGua],['dpn','Print demand promissory note',lfDocDpn]];
function lfSections(type){const t=LF_TYPES[type];if(t.sections)return t.sections;return[LF_SEC.app,t.ex,LF_SEC.loan,LF_SEC.sec,LF_SEC.g1,LF_SEC.g2]}
function lfRender(){
  const f=S.lf,t=LF_TYPES[f.type],ro=f.office!==S.user.office||!S.user.office||!!(f.flow&&f.flow.status==='declined');
  const box=$('#lfbox');if(!box)return;
  const docs=lfDocs(t);
  box.outerHTML=`<div id="lfbox" class="lfform">${ro?`<div class="note n-info">${f.flow&&f.flow.status==='declined'?'This application was declined by the Area Office and cannot be changed.':'View only: this application belongs to another office.'}</div>`:''}
  ${lfDecHtml(f.decs)}
  <div class="card bn" id="lfsa" style="margin-top:12px">${lfSaHtml(f.d,ro)}</div>
  ${lfSections(f.type).map(s=>`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">${s.h}</h3><div class="row" style="flex-wrap:wrap">${s.f.map(x=>lfField(x,f.d[x.k],ro)).join('')}</div></div>`).join('')}
  ${t.calc?`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">স্বয়ংক্রিয় হিসাব ও নীতিমালা যাচাই ${t.calcH||'(আরসিডি সার্কুলার ১১৯/২৫, ১২২/২৬, ১২৬/২৬)'}</h3><div id="lfcalc">${t.calc(f.d)}</div></div>`:''}
  <div class="card bn" style="margin-top:12px"><button onclick="A.lfCkTog()" id="ckbtn">Open Check List</button><div id="lfck"></div></div>
  <div class="bar" style="margin-top:12px">${ro?'':`<button class="pri" onclick="run(A.lfSave)">Save</button>`}${!ro&&t.sample?`<button onclick="A.lfSample()">Load test data (Word file)</button>`:''}
  ${!ro&&!f.isNew?`<button class="dan" onclick="if(confirm('Delete this application?'))run(A.lfDel)">Delete</button>`:''}<button onclick="A.lfBack()">Back to list</button></div>
  <p class="muted small">Printing and downloads are under Report in the menu.</p></div>`;
  const hs=$('#hdrsave');if(hs)hs.innerHTML=ro?'':`<button class="pri" onclick="run(A.lfSave)" style="height:28px;padding:2px 18px;font-size:13px">Save</button>`;
  f.ckOpen=false;
}
A.lfCkTog=()=>{const f=S.lf;f.ckOpen=!f.ckOpen;const b=$('#ckbtn'),c=$('#lfck');b.textContent=f.ckOpen?'Close Check List':'Open Check List';
  if(!f.ckOpen){c.innerHTML='';return}
  const docs=lfDocs(LF_TYPES[f.type]),ro=f.office!==S.user.office||!S.user.office;
  c.innerHTML=`<h3 style="margin:10px 0 4px">${esc(lfShort(LF_TYPES[f.type]))} Check List &nbsp;<span class="muted small" id="ckcnt"></span></h3>`+docs.map((x,i)=>`<label class="ckrow"><span>${toBn(i+1)}. ${esc(x)}</span><input type="checkbox" data-k="ck${i}" ${f.d['ck'+i]?'checked':''} onchange="A.lfCk(this)" ${ro?'disabled':''}></label>`).join('');A.lfCk(null)};
A.lfset=el=>{const k=el.dataset.k;S.lf.d[k]=el.type==='checkbox'?el.checked:el.dataset.dt?lfDmyToIso(el.value):el.value;S.lf.dirty=true;
  if(k==='sa'){const c=$('#lfsa');if(c)c.innerHTML=lfSaHtml(S.lf.d,false)}
  {const t=LF_TYPES[S.lf.type];if(t.calc){const c=$('#lfcalc');if(c)c.innerHTML=t.calc(S.lf.d)}}
  if(el.tagName==='INPUT'&&el.inputMode==='decimal'){const nx=el.parentElement.querySelector('.muted.small.bn');const tk=lfTaka(el.value);if(nx)nx.textContent=tk;else if(tk&&/টাকা/.test(el.parentElement.querySelector('label').textContent)){const d=document.createElement('div');d.className='muted small bn';d.textContent=tk;el.parentElement.appendChild(d)}}};
A.lfSave=async()=>{const f=S.lf;if(!f.d.sa)throw new Error('Select the Sanction Authority (mandatory) before saving.');await api('/lf/save',{method:'PUT',body:{id:f.id,type:f.type,data:f.d}});f.dirty=false;f.isNew=false;toast('Saved.')};
A.lfDel=async()=>{await api('/lf/delete',{method:'POST',body:{id:S.lf.id}});S.lf=null;toast('Deleted.');A.lfBack()};
A.lfBack=()=>go({page:'leaf',leaf:S.view.leaf,lfNull:1});

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
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];const docs=lfDocs(t);
  return`<div class="r3pg">${lfHead()}<div class="gtitle">${esc(lfShort(t))} Check List - কাগজপত্রের চেকলিস্ট</div>
  <p>আবেদনকারী: ${lfv(d,'a_name')} &nbsp; হিসাব নম্বর: ${lfv(d,'a_acct')} &nbsp; ঋণের পরিমাণ: ${lfTaka(d.l_amt)}</p>
  <table class="r3t" style="width:100%;border-collapse:collapse"><tr><th style="width:8%">ক্রমিক</th><th>কাগজপত্রের নাম</th><th style="width:8%">টিক</th></tr>${docs.map((x,i)=>`<tr><td style="text-align:center">${toBn(i+1)}</td><td>${esc(x)}</td><td style="text-align:center;font-size:15px">${d['ck'+i]?'☑':'☐'}</td></tr>`).join('')}</table>
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
function lfPagesOf(fn){
  const r=fn();if(r.indexOf('class="lfpage"')>=0)return r;
  return lfFit(r.split('<div class="r3pg">').slice(1).map(x=>lfPage('<div class="bn r3p"><div class="r3pg">'+x+'</div>','10mm 12mm 0 12mm')).join(''));
}
A.lfPrintHtml=html=>{const pa=$('#printArea');pa.innerHTML=html;pa.classList.add('lf0');window.addEventListener('afterprint',()=>pa.classList.remove('lf0'),{once:true});window.print()};
A.lfPrint=w=>{
  const PR=lfPrintList(LF_TYPES[S.lf.type]),m=Object.fromEntries(PR.map(x=>[x[0],x[2]]));
  const parts=w==='all'?PR.map(x=>x[0]):[w];
  A.lfPrintHtml(parts.map(k=>lfPagesOf(m[k])).join(''));
};
/* ---------- PDF download (A4, one page per annexure) ---------- */
function lfLoadPdf(){
  const load=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('Could not load the PDF tool. Use Print and choose Save as PDF.'));document.head.appendChild(s)});
  return(window.html2canvas&&window.jspdf)?Promise.resolve():load('/vendor/html2canvas.min.js').then(()=>load('/vendor/jspdf.umd.min.js'));
}
A.lfPdf=async(keys,fname)=>{
  toast('Preparing PDF...');
  await lfLoadPdf();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  const PR=lfPrintList(LF_TYPES[S.lf.type]),m=Object.fromEntries(PR.map(x=>[x[0],x[2]]));
  const host=document.createElement('div');host.className='lfpdfhost';host.innerHTML=keys.map(k=>lfPagesOf(m[k])).join('');document.body.appendChild(host);
  try{
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
    const pgs=[...host.querySelectorAll('.lfpage')];if(!pgs.length)throw new Error('Nothing to download.');
    for(let i=0;i<pgs.length;i++){const c=await html2canvas(pgs[i],{scale:2.2,backgroundColor:'#ffffff',logging:false});if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297,undefined,'FAST')}
    const acct=String(S.lf.d.a_acct||'').replace(/[^0-9A-Za-z-]/g,'');
    pdf.save('JBRS_'+fname+(acct?'_'+acct:'')+'.pdf');
  }finally{host.remove()}
};


/* ================= Personal Loan - RCD Circular 119/2025 (04/11/2025) ================= */
const LF_PURPOSES=['চিকিৎসা','বিবাহ','প্রসূতি','শিক্ষা','বসতবাড়ি ক্রয়','গৃহ নির্মাণ','গৃহ সংস্কার','যানবাহন ক্রয় (মোটর সাইকেল ও সিএনজি চালিত অটো রিক্সা)','পুকুর খনন','মৎস্য চাষ','বৃক্ষরোপণ','কৃষিজাত পণ্য উৎপাদন','ছেলে-মেয়ের চাকরির উদ্দেশ্যে বিদেশ প্রেরণ'];
const lfGuaSec=(g,h)=>({h,f:[lfT(g+'_name','নাম'),lfT(g+'_prof','পেশা'),lfT(g+'_father','পিতার নাম'),lfT(g+'_fpr','পিতার পেশা'),lfT(g+'_mother','মাতার নাম'),lfT(g+'_mpr','মাতার পেশা'),lfT(g+'_nid','জাতীয় পরিচয়পত্র নম্বর'),lfT(g+'_mobile','ফোন/মোবাইল নম্বর'),lfA(g+'_addr','বর্তমান ঠিকানা'),lfA(g+'_perm','স্থায়ী ঠিকানা')]});
const lfEmi=(P,n,r)=>{P=+P;n=+n;r=+r;if(!(P>0&&n>0&&r>=0))return null;const i=r/1200;const e=i?P*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1):P/n;return Math.ceil(e/10-1e-9)*10};   // matches the circular's table (rounded up to Tk 10)
const lfFmt=n=>toBn(Math.round(n).toLocaleString('en-IN'));
function lfPersonalCalc(d){
  const P=parseFloat(d.l_amt)||0,n=parseInt(d.l_months)||0,r=d.l_rate===undefined||d.l_rate===''?12:parseFloat(d.l_rate);
  if(!P||!n)return'<span class="muted">ঋণের পরিমাণ ও কিস্তির সংখ্যা দিলে এখানে মাসিক কিস্তি ও নীতিমালা যাচাই দেখা যাবে।</span>';
  const e=lfEmi(P,n,r),tot=e*n,th=parseFloat(d.x_takehome)||0;
  const ok=(c,t)=>`<div style="color:${c?'#1b6e2c':'#b42318'}">${c?'✓':'✗'} ${t}</div>`;
  const out=[`<div><b>মাসিক কিস্তি (${toBn(r)}% হারে, ${toBn(n)} কিস্তি): ${lfFmt(e)} টাকা</b> &nbsp; মোট পরিশোধ: ${lfFmt(tot)} টাকা, সুদ: ${lfFmt(tot-P)} টাকা</div>`];
  out.push('<div class="muted small">অন্যান্য কিস্তি সংখ্যায়: '+[12,24,36,48,60,72,84,96].map(k=>toBn(k)+' কিস্তি '+lfFmt(lfEmi(P,k,r))).join(' | ')+'</div>');
  out.push(ok(P<=4000000,'ঋণের পরিমাণ গ্রাহক প্রতি সর্বোচ্চ ৪০,০০,০০০ টাকার মধ্যে'+(P>4000000?' - সর্বোচ্চ সীমা অতিক্রম করেছে':'')));
  if(th){const cap=th*0.8,i=r/1200,pmax=i?cap*(1-Math.pow(1+i,-n))/i:cap*n;
    out.push(ok(e<=cap,`মাসিক কিস্তি টেক হোম পে এর ৮০% (${lfFmt(cap)} টাকা) এর মধ্যে`+(e>cap?' - বেশি। আয়ের অন্য উৎস থাকলে সহায়ক জামানত গ্রহণ সাপেক্ষে সর্বোচ্চ ৪০ লক্ষ টাকা পর্যন্ত দেওয়া যায় (আরসিডি সার্কুলার ১২৬/২৬)':'')));
    out.push(`<div class="muted small">এই কিস্তি সংখ্যায় ৮০% শর্তে ঋণযোগ্যতা প্রায় ${lfFmt(Math.min(4000000,Math.floor(pmax/1000)*1000))} টাকা</div>`);
  }else out.push('<div class="muted small">টেক হোম পে দিলে কিস্তি ≤ ৮০% শর্ত যাচাই হবে।</div>');
  if(d.x_ret&&d.l_date){const a=new Date(d.l_date),b=new Date(d.x_ret),m=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth();
    out.push(ok(m>=n,`চাকরির অবশিষ্ট মেয়াদ ${toBn(Math.max(m,0))} মাস (কিস্তির মেয়াদ চাকরির মেয়াদকাল/পিআরএল পর্যন্ত, সর্বোচ্চ ৮ বছর)`+(m<n?' - মেয়াদ কমাতে হবে বা কিস্তি পুনর্নির্ধারণ করতে হবে':'')));}
  const auth=P<=1000000?'শাখা ব্যবস্থাপক (এসও/পিও)':P<=2000000?'শাখা ব্যবস্থাপক (এসপিও)':P<=2500000?'এজিএম':P<=3000000?'ডিজিএম':P<=4000000?'জিএম':'';
  if(auth)out.push(`<div>ঋণ মঞ্জুরির ক্ষমতা: <b>${auth}</b></div>`);
  out.push(ok(!!n&&n<=96,'কিস্তির মেয়াদ সর্বোচ্চ ৮ বছর (৯৬ মাস)'));
  out.push('<div class="muted small">বেতন-ভাতাদি যে শাখায় জমা হয় শুধুমাত্র সে শাখা থেকে ঋণ প্রদান করা যাবে। ঋণ পরিশোধ না হওয়া পর্যন্ত বেতন অন্য ব্যাংক/শাখায় স্থানান্তর করা হবে না মর্মে বেতন প্রদানকারী/যথাযথ কর্তৃপক্ষের নিশ্চয়তা নিতে হবে।</div>');
  return out.join('');
}
const lfLn=(l,v,w)=>`<div style="display:flex;gap:6px;margin:3px 0;${w?'width:'+w+';':''}"><span style="flex:0 0 auto">${l}</span><span style="flex:1;${v?'':'border-bottom:1px dotted #000;'}min-height:1.25em">${v?esc(v):''}</span></div>`;
const lfNm=(d,a,b)=>[lfv(d,a),lfv(d,b)].filter(Boolean).join(', ');
const lfBrn=()=>{const o=office(S.lf.office);return esc(o?(o.nameBn||o.name):'')};
const lfWd=v=>{const w=lfWords(parseFloat(v));return w?w:''};
/* ---- Annexure-Ka / Kha / Ga: exact A4 layouts (one page each) following the circular's forms ---- */
const lfFf=(v,w)=>v?`<span class="lff has">${esc(v)}</span>`:`<span class="lff" style="min-width:${w}mm">&nbsp;</span>`;
function lfBr(){const o=office(S.lf.office),n=o?(o.nameBn||o.name):'';const m=n.match(/^(.*?)\s*শাখা(?:\s*,\s*(.*))?$/);return m?{b:m[1],a:m[2]||''}:{b:n,a:''}}
const lfPage=(inner,pad)=>`<div class="lfpage" style="padding:${pad}"><div class="lfin">${inner}</div></div>`;
function lfFit(html){   // shrink pages slightly if a long entry would push past one A4 page
  const h=document.createElement('div');h.className='lfpdfhost';h.innerHTML=html;document.body.appendChild(h);
  [...h.children].forEach(pg=>{const inn=pg.querySelector('.lfin');if(!inn)return;const avail=pg.clientHeight-parseFloat(getComputedStyle(pg).paddingTop)-4;
    let z=1;while(inn.offsetHeight*z>avail&&z>0.5){z-=0.02;inn.style.transform='scale('+z.toFixed(2)+')';inn.style.width=(100/z).toFixed(2)+'%';inn.style.transformOrigin='top left';inn.style.height=(inn.scrollHeight)+'px'}});
  const out=h.innerHTML;h.remove();return out;
}
const lfK=(lab,val)=>`<div class="kl"><span class="kb">${lab}</span><span class="kc">:</span><span class="kf${val?' has':''}">${val?esc(val):''}</span></div>`;
const lfKR=(a,b)=>`<div class="kl kr">${a.map(([l,v,g])=>`<span class="kn" style="${g?'flex:0 0 '+g+'mm':''}">${l} :</span><span class="kf${v?' has':''}">${v?esc(v):''}</span>`).join('')}</div>`;
function lfDocKa(){
  const d=S.lf.d,br=lfBr();
  const G=(g,x)=>x==='n'?lfNm(d,g+'_name',g+'_prof'):x==='f'?lfNm(d,g+'_father',g+'_fpr'):x==='m'?lfNm(d,g+'_mother',g+'_mpr'):x==='p'?[esc(d[g+'_addr']||''),lfv(d,g+'_mobile')].filter(Boolean).join(', '):x==='s'?esc(d[g+'_perm']||''):lfv(d,g+'_nid');
  const purpose=[d.l_purpose,d.l_purpose_note].filter(Boolean).join(' - ');
  const inner=`<div class="ka">
  <div class="u" style="text-align:right">এ্যানেক্সার-'ক'</div>
  <div class="kph">আবেদনকারীর<br>পাসপোর্ট সাইজের<br>সত্যায়িত ছবি<br>(২ কপি)</div>
  <div style="text-align:center;margin-top:0;line-height:1.3"><div>জনতা ব্যাংক পিএলসি.</div><div>প্রধান কার্যালয়, ঢাকা ।</div><div class="u">পার্সোনাল লোনের আবেদনপত্রের নমুনা</div></div>
  <div style="margin-top:3mm;line-height:5.6mm">ব্যবস্থাপক<br>জনতা ব্যাংক পিএলসি.<br>${lfFf(br.b,52)} শাখা<br>${lfFf(br.a,62)} ।</div>
  <div style="margin-top:3mm">প্রিয় মহোদয়,</div>
  <p class="kp">আমি নিম্ন স্বাক্ষরকারী আপনার শাখা হতে ${lfFf(purpose,66)} নিমিত্ত পার্সোনাল লোন কর্মসূচীর আওতায় ${lfFf(d.l_amt?lfFmt(d.l_amt):'',32)} (কথায় : ${lfFf(lfWd(d.l_amt),84)}) টাকা ঋণের জন্য আবেদন করছি। উক্ত ঋণ মঞ্জুরির জন্য বিশেষভাবে অনুরোধ জানাচ্ছি। আমার ব্যক্তিগত ও ঋণের গ্যারান্টরদ্বয়ের তথ্যাদি নিম্নে প্রদত্ত হলো :</p>
  <div class="kh"><span class="u">ক. ব্যক্তিগত তথ্যাদি</span> &nbsp;&nbsp;&nbsp;:</div>
  ${lfK('১. নাম',d.a_name)}${lfK('২. পিতার নাম ও পেশা',lfNm(d,'a_father','a_fpr'))}${lfK('৩. মাতার নাম ও পেশা',lfNm(d,'a_mother','a_mpr'))}${lfK('৪. স্বামী/স্ত্রীর নাম ও পেশা',lfNm(d,'a_spouse','a_spr'))}${lfK('৫. জন্ম তারিখ',lfDate(d.a_dob))}${lfK('৬. শিক্ষাগত যোগ্যতা',d.a_edu)}${lfK('৭. বর্তমান ঠিকানা',d.a_pres)}${lfK('৮. স্থায়ী ঠিকানা',d.a_perm)}${lfK('৯. যোগাযোগের ঠিকানা',d.a_cont)}${lfK('১০. ফোন/মোবাইল নম্বর',lfv(d,'a_mobile'))}${lfK('১১. জাতীয় পরিচয়পত্র নম্বর',lfv(d,'a_nid'))}
  <div class="kl"><span class="kn">১২. যে প্রতিষ্ঠানে চাকরিরত সে প্রতিষ্ঠানের নাম, ঠিকানা ও ফোন নম্বর :</span><span class="kf">${esc(d.x_employer||'')}</span></div>
    <div style="padding-left:6mm">
  ${lfKR([['পদবী',d.x_desig,35],['চাকরিতে যোগদানের তারিখ',lfDate(d.x_join),0]])}
  ${lfKR([['চাকরিতে স্থায়ী হওয়ার তারিখ',lfDate(d.x_perm),0],['চাকরি হতে অবসরের তারিখ',lfDate(d.x_ret),0]])}
  ${lfKR([['মাসিক মূল বেতন',lfv(d,'x_basic'),0],['মাসিক মোট বেতন',lfv(d,'x_gross'),0],['মাসিক টেক হোম পে',lfv(d,'x_takehome'),0]])}
  ${lfKR([['মোট দায়-দেনার পরিমাণ (যদি থাকে)',d.x_liab,0]])}</div>
  <div class="kh" style="margin-top:3mm"><span class="u">খ. ঋণের গ্যারান্টরদ্বয়ের তথ্যাদি</span> :</div>
  <div class="kgn">গ্যারান্টরদ্বয়ের পাসপোর্ট সাইজের সত্যায়িতছবি (২ কপি করে)</div>
  <table class="kt"><tr><th style="width:38mm">বিবরণ</th><th style="width:6mm"></th><th>১। পারিবারিক গ্যারান্টর</th><th>২। তৃতীয় পক্ষীয় গ্যারান্টর</th></tr>
  ${[['নাম ও পেশা','n','6.2mm'],['পিতার নাম ও পেশা','f','6.2mm'],['মাতার নাম ও পেশা','m','6.2mm'],['বর্তমান ঠিকানা ও ফোন/মোবাইল নম্বর','p','11mm'],['স্থায়ী ঠিকানা','s','6.2mm'],['জাতীয় পরিচয়পত্র নম্বর','i','11mm']].map(([l,x,h])=>`<tr style="height:${h}"><td>${l}</td><td style="text-align:center">:</td><td>${G('g1',x)}</td><td>${G('g2',x)}</td></tr>`).join('')}</table>
  <div class="kbx"><div class="kb1">আমি ঋণ আবেদনকারী ${lfFf(d.a_name,52)}<br>এর ঋণের গ্যারান্টর হিসাবে নিশ্চয়তা প্রদান করছি।<div style="margin-top:4mm">১. পারিবারিক গ্যারান্টরের স্বাক্ষর ও তারিখ:</div><div style="margin-top:5mm">২.তৃতীয় পক্ষীয় গ্যারান্টরের স্বাক্ষর ও তারিখ:</div></div>
  <div class="kb2">আমি নিশ্চয়তা প্রদান করছি যে, উপরে বর্ণিত সকল তথ্য সত্য।<div style="text-align:center;margin-top:6mm">-------------------------------<br>ঋণ আবেদনকারীর পূর্ণ নামসহ স্বাক্ষর<br>তারিখ:</div></div></div></div>`;
  return lfFit(lfPage(inner,'7mm 11mm 0 14mm'));
}
function lfDocKha(){
  const d=S.lf.d;
  const inner=`<div class="u" style="text-align:right">এ্যানেক্সার-'খ'</div>
  <div class="u" style="text-align:center;font-size:14pt;margin-top:8mm">এমপ্লয়ার্স সার্টিফিকেট</div>
  <p class="kz" style="margin-top:8mm">এ মর্মে প্রত্যয়ন করা যাচ্ছে যে, জনাব${lfFf(d.a_name,118)}</p>
  <p class="kz" style="margin-top:3mm">পিতা/স্বামী${lfFf(d.a_father||d.a_spouse,70)}গত${lfFf(lfDate(d.x_join),32)}ইং তারিখে ${lfFf(d.x_jdesig,32)}পদে এ প্রতিষ্ঠানে যোগদান করেন এবং ${lfFf(lfDate(d.x_perm),32)} ইং তারিখে চাকরি স্থায়ী হয়। তার বর্তমান পদবী${lfFf(d.x_desig,32)}। আমি তার সর্বাঙ্গীন মঙ্গল কামনা করি।</p>
  <p class="kz" style="margin-top:3mm">তার মাসিক মূল বেতন ${lfFf(d.x_basic?lfFmt(d.x_basic):'',32)}(কথায় :${lfFf(lfWd(d.x_basic),64)}) টাকা এবং সমস্ত কর্তন বাদ দেওয়ার পর বেতন (টেক হোম পে) ${lfFf(d.x_takehome?lfFmt(d.x_takehome):'',32)}(কথায় :${lfFf(lfWd(d.x_takehome),58)}) টাকা।</p>
  <div class="u" style="margin:4mm 0 4mm 4.5mm">প্রত্যয়নকারী :</div>
  <div class="kq">${[['নাম',d.x_cname],['পদবী',d.x_cdesig],['ঠিকানা',d.x_caddr],['',''],['',''],['',''],['ফোন/মোবাইল নম্বর',lfv(d,'x_cmobile')]].map(([l,v],i)=>`<div class="kl"><span class="kb2k">${l}${l&&i<3?'':''}</span><span class="kc2">${l&&i<3?':':''}${l==='ফোন/মোবাইল নম্বর'?':':''}</span><span class="kf">${v?esc(v):''}</span></div>`).join('')}</div>
  <p class="kz" style="margin-top:9mm">আরও প্রত্যয়ন করছি যে, উপরে বর্ণিত তথ্যাদি সত্য।</p>
  <div style="margin:14mm 0 0 128mm;line-height:1.5">স্বাক্ষর ও সিল<br>তারিখ :</div>`;
  return lfFit(lfPage(inner,'9mm 11mm 0 14mm'));
}
function lfDocGa(){
  const d=S.lf.d,br=lfBr();
  const P=parseFloat(d.s_amt||d.l_amt)||0,n=parseInt(d.l_months)||0,r=d.l_rate===''||d.l_rate===undefined?12:parseFloat(d.l_rate);
  const e=P&&n?lfEmi(P,n,r):0,tot=e*n;
  const inner=`<div class="u" style="text-align:right;margin-top:8mm">এ্যানেক্সার-'গ'</div>
  <div style="margin-top:10mm;line-height:6.2mm">ব্যবস্থাপক<br>জনতা ব্যাংক পিএলসি.<br>${lfFf(br.b,52)} শাখা<br>${lfFf(br.a,62)} ।</div>
  <div style="text-align:center;margin-top:11mm">বিষয় : <span class="u">ক্ষমতা অর্পণ পত্র</span> ।</div>
  <p class="kg">আমি ${lfFf(d.a_name,120)}এর আবেদনের প্রেক্ষিতে পার্সোনাল লোন কর্মসূচীর আওতায়${lfFf(lfDate(d.s_sdate),30)}তারিখে মঞ্জুরিকৃত ঋণাংক${lfFf(P?lfFmt(P):'',44)} (কথায় :${lfFf(lfWd(P),88)}) টাকা ${lfFf(toBn(r),18)}% সুদহারে আসল${lfFf(P?lfFmt(P):'',44)} সুদ ${lfFf(P&&e?lfFmt(tot-P):'',34)} মোট${lfFf(P&&e?lfFmt(tot):'',50)}(কথায় : ${lfFf(P&&e?lfWd(tot):'',100)}) টাকা ঋণ পরিশোধের নিমিত্ত (সিরিজ নং ${lfFf(lfv(d,'s_cs'),40)}হতে ${lfFf(lfv(d,'s_ce'),42)}পর্যন্ত) একাউন্ট পেয়ি${lfFf(lfv(d,'s_cn'),16)} টি চেক জমা করলাম। গৃহীত ঋণের পরপর ২টি কিস্তি পরিশোধে ব্যর্থ হলে ব্যাংক আমার অনুকূলে মঞ্জুরিকৃত ঋণের হালনাগাদ সুদসহ সমুদয় বকেয়া ব্যাংকের প্রচলিত নিয়ম অনুযায়ী আদায়ের ব্যবস্থা গ্রহণ করতে পারবে। এতে আমার কোন আপত্তি থাকবে না।</p>
  <div style="text-align:right;margin:4mm 14mm 0 0">আপনার বিশ্বস্ত,</div>
  <div style="display:flex;justify-content:space-between;margin-top:12mm"><div style="padding-top:5mm">তারিখ: ${lfFf(lfDate(d.l_date),46)}</div><div style="text-align:center;margin-right:2mm">----------------------------<br>আবেদনকারীর পূর্ণ নামসহ স্বাক্ষর<br><span style="margin-left:-8mm">জাতীয় পরিচয়পত্র নম্বর : ${lfFf(lfv(d,'a_nid'),40)}</span></div></div>
  <div class="kq" style="margin-top:4mm;width:130mm">${[['স্বাক্ষীর স্বাক্ষর',''],['পূর্ণ নাম',d.w_name],['ঠিকানা',d.w_addr],['',''],['',''],['জাতীয় পরিচয়পত্র নম্বর',lfv(d,'w_nid')]].map(([l,v])=>`<div class="kl" style="min-height:8mm;line-height:8mm"><span class="kb2k" style="flex:0 0 ${l.length>12?'42':'24'}mm">${l}</span><span class="kc2">${l?':':''}</span><span class="kf">${v?esc(v):''}</span></div>`).join('')}</div>`;
  return lfFit(lfPage(inner,'6mm 9mm 0 9mm'));
}
Object.assign(LF_TYPES.cfpersonal,{
  pdf:[[['app'],'Download Annexure-Ka (PDF)','PersonalLoan_Annexure-Ka'],[['emp'],'Download Annexure-Kha (PDF)','PersonalLoan_Annexure-Kha'],[['auth'],'Download Annexure-Ga (PDF)','PersonalLoan_Annexure-Ga'],[['app','emp','auth'],'Download all three (PDF)','PersonalLoan_Annexures']],
  ownDocs:true,calc:lfPersonalCalc,defaults:{l_rate:'12',s_cn:'5'},
  docs:['এমপ্লয়ার্স সার্টিফিকেট (এ্যানেক্সার-খ) - প্রতিষ্ঠান প্রধান/বেতন প্রদানকারী কর্মকর্তা কর্তৃক (শিক্ষা প্রতিষ্ঠানের ক্ষেত্রে ভিসি/রেজিস্ট্রার/অধ্যক্ষ/প্রিন্সিপাল/প্রধান শিক্ষক)','সর্বশেষ বেতন বিবরণী (Salary Statement)','জাতীয় পরিচয়পত্রের সত্যায়িত ফটোকপি ও সদ্য তোলা পাসপোর্ট সাইজের ২ কপি ছবি','ঋণের কিস্তি/বকেয়া আদায়ের ক্ষমতা অর্পণপত্র (এ্যানেক্সার-গ)','অন্য কোন ব্যাংক/আর্থিক প্রতিষ্ঠানে ঋণ থাকলে পূর্বের প্রতিষ্ঠানের প্রত্যয়নপত্র','স্থায়ী ঠিকানার বিষয়ে চেয়ারম্যান/কমিশনারের সার্টিফিকেট','পারিবারিক/ব্যক্তিগত গ্যারান্টি (স্বামী/স্ত্রী/পিতা/মাতা/সাবালক সন্তান/ভাই/বোন)','তৃতীয় পক্ষীয় জামিনদার (নিয়োগকর্তা/গেজেটেড অফিসার/সহকর্মী/ব্যাংকের নিকট গ্রহণযোগ্য ব্যক্তি)','ঋণের সমপরিমাণ ১টি চেকসহ তারিখ বিহীন মোট ৫টি স্বাক্ষরযুক্ত A/C Payee চেক','Letter of Authority (প্রভিডেন্ট ফান্ড/গ্র্যাচুইটি বা অন্য আর্থিক সুবিধা থেকে বকেয়া সমন্বয়)','বেতন প্রদানকারী/যথাযথ কর্তৃপক্ষের নিশ্চয়তা: ঋণ পরিশোধ না হওয়া পর্যন্ত বেতন অন্য ব্যাংক/শাখায় স্থানান্তর করা হবে না (আরসিডি সার্কুলার ১২৬/২৬)','সহায়ক জামানতের কাগজপত্র (আয়ের অন্য উৎস থাকলে এবং মাসিক বেতন দ্বারা কিস্তি পরিশোধ না হলে - আরসিডি সার্কুলার ১২৬/২৬)','সন্তোষজনক সিআইবি রিপোর্ট (বিতরণের পূর্বে ও পরে)','চার্জ ডকুমেন্টস: ডিপি নোট, লেটার অব অ্যারেঞ্জমেন্ট, লেটার অব ডিসবার্সমেন্ট, লেটার অব গ্যারান্টি, লেটার অব লিয়েন (প্রযোজ্য ক্ষেত্রে)'],
  sections:[
   {h:'আবেদনকারীর ব্যক্তিগত তথ্য (এ্যানেক্সার-ক)',f:[lfT('a_name','নাম'),lfT('a_acct','হিসাব নম্বর'),lfT('a_father','পিতার নাম'),lfT('a_fpr','পিতার পেশা'),lfT('a_mother','মাতার নাম'),lfT('a_mpr','মাতার পেশা'),lfT('a_spouse','স্বামী/স্ত্রীর নাম'),lfT('a_spr','স্বামী/স্ত্রীর পেশা'),lfD('a_dob','জন্ম তারিখ'),lfT('a_edu','শিক্ষাগত যোগ্যতা'),lfT('a_nid','জাতীয় পরিচয়পত্র নম্বর'),lfT('a_mobile','ফোন/মোবাইল নম্বর'),lfA('a_pres','বর্তমান ঠিকানা'),lfA('a_perm','স্থায়ী ঠিকানা'),lfA('a_cont','যোগাযোগের ঠিকানা')]},
   {h:'চাকরির তথ্য',f:[lfA('x_employer','প্রতিষ্ঠানের নাম, ঠিকানা ও ফোন নম্বর'),lfT('x_jdesig','যোগদানের পদ'),lfT('x_desig','বর্তমান পদবী'),lfD('x_join','চাকরিতে যোগদানের তারিখ'),lfD('x_perm','চাকরিতে স্থায়ী হওয়ার তারিখ'),lfD('x_ret','চাকরি হতে অবসরের তারিখ'),lfN('x_basic','মাসিক মূল বেতন (টাকা)'),lfN('x_gross','মাসিক মোট বেতন (টাকা)'),lfN('x_takehome','মাসিক টেক হোম পে (টাকা)'),lfA('x_liab','মোট দায়-দেনার পরিমাণ (যদি থাকে)')]},
   {h:'ঋণের তথ্য',f:[lfS('l_purpose','ঋণের উদ্দেশ্য',LF_PURPOSES),lfN('l_amt','আবেদনকৃত ঋণের পরিমাণ (টাকা)'),lfS('l_months','কিস্তির সংখ্যা (মাস)',['12','24','36','48','60','72','84','96']),lfT('l_rate','সুদের হার (% বার্ষিক)'),lfD('l_date','আবেদনের তারিখ'),lfA('l_purpose_note','উদ্দেশ্যের বিস্তারিত (প্রয়োজনে)')]},
   lfGuaSec('g1','জামিনদার-১ (পারিবারিক গ্যারান্টর)'),lfGuaSec('g2','জামিনদার-২ (তৃতীয় পক্ষীয় গ্যারান্টর)'),
   {h:'নিয়োগকর্তার প্রত্যয়নকারী (এ্যানেক্সার-খ)',f:[lfT('x_cname','নাম'),lfT('x_cdesig','পদবী'),lfT('x_cmobile','ফোন/মোবাইল নম্বর'),lfA('x_caddr','ঠিকানা')]},
   {h:'মঞ্জুরি ও ক্ষমতা অর্পণপত্র (এ্যানেক্সার-গ)',f:[lfD('s_sdate','মঞ্জুরির তারিখ'),lfN('s_amt','মঞ্জুরিকৃত ঋণের পরিমাণ (টাকা) - ফাঁকা থাকলে আবেদনকৃত পরিমাণ'),lfT('s_cs','চেকের সিরিজ নং (শুরু)'),lfT('s_ce','চেকের সিরিজ নং (শেষ)'),lfT('s_cn','একাউন্ট পেয়ি চেকের সংখ্যা'),lfT('w_name','সাক্ষীর পূর্ণ নাম'),lfT('w_nid','সাক্ষীর জাতীয় পরিচয়পত্র নম্বর'),lfA('w_addr','সাক্ষীর ঠিকানা')]}
  ],
  print:[['app',"Print application (Annexure-Ka)",lfDocKa],['emp',"Print employer's certificate (Annexure-Kha)",lfDocKha],['auth','Print authority letter (Annexure-Ga)',lfDocGa],['chk','Print checklist',lfDocChk],['gua',"Print guarantor's undertaking",lfDocGua],['dpn','Print demand promissory note',lfDocDpn]]
});

/* ================= Staff Motor Cycle Loan - Instruction Circular 1318/25 (13/02/2025), form of Circular 724/17 photo ================= */
const lfMon=v=>{const n=parseFloat(String(v==null?'':v).replace(/,/g,''));return isFinite(n)?toBn(n.toLocaleString('en-IN',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})):lfv({x:v},'x')};
const lfTk=v=>{const m=lfMon(v);return m?m+' টাকা':''};
const lfNoi=v=>{const m=lfMon(v);return m?m+' টাকা':'নাই'};
const lfNum=v=>parseFloat(String(v==null?'':v).replace(/,/g,''))||0;
const lfQuotes=d=>[1,2,3].map(i=>({n:d['q'+i+'_n']||'',a:d['q'+i+'_a']||'',r:lfNum(d['q'+i+'_r'])}));
function lfMotoCalc(d){
  const ok=(c,t)=>`<div style="color:${c?'#1b6e2c':'#b42318'}">${c?'✓':'✗'} ${t}</div>`,wn=t=>`<div style="color:#b26a00">! ${t}</div>`,out=[];
  const P=lfNum(d.l_amt),Q=lfQuotes(d).filter(q=>q.r>0),low=Q.length?Math.min(...Q.map(q=>q.r)):0;
  if(!P)out.push('<span class="muted">ঋণের পরিমাণ ও দরপত্রের তথ্য দিলে এখানে নীতিমালা (নির্দেশ বিজ্ঞপ্তি ১৩১৮/২৫) যাচাই দেখা যাবে।</span>');
  else out.push(ok(P<=500000,'ঋণের পরিমাণ সর্বোচ্চ ৫,০০,০০০ টাকার মধ্যে (নির্দেশ বিজ্ঞপ্তি ১৩১৮/২৫)'+(P>500000?' - সীমা অতিক্রম করেছে':'')));
  out.push(ok(Q.length===3,'তিনটি প্রতিষ্ঠানের দরপত্র ('+toBn(Q.length)+'/৩)'));
  if(Q.length&&P)out.push(ok(P<=low,'ঋণের পরিমাণ দরপত্র অনুযায়ী সর্বনিম্ন মূল্য ('+lfMon(low)+' টাকা) এর বেশি নয়'+(P>low?' - বেশি':'')));
  if(low&&d.m_low)out.push(ok(lfNum(d.m_low)===low,'সর্বনিম্ন মূল্য ('+lfMon(d.m_low)+' টাকা) তিনটি দরপত্রের সর্বনিম্ন দরের সাথে মিলেছে'+(lfNum(d.m_low)===low?'':' - মিলেনি, সর্বনিম্ন দর '+lfMon(low)+' টাকা')));
  if(d.m_vendor&&Q.length){const lq=Q.find(q=>q.r===low);out.push(ok(!!lq&&lq.n.trim()===String(d.m_vendor).trim(),'সরবরাহকারী প্রতিষ্ঠান সর্বনিম্ন দরদাতা'+(lq?' ('+esc(lq.n)+')':'')+' এর সাথে মিলেছে'))}
  out.push(d.x_perm?ok(true,'চাকরিতে স্থায়ীকরণের তারিখ: '+lfDate(d.x_perm)):ok(false,'চাকরিতে স্থায়ীকরণের তারিখ দেওয়া হয়নি'));
  out.push(d.x_brta==='আছে'?ok(true,'BRTA কর্তৃক প্রদত্ত বৈধ ড্রাইভিং লাইসেন্স আছে'+(d.x_dl?' ('+esc(toBn(d.x_dl))+')':'')):ok(false,'BRTA কর্তৃক প্রদত্ত বৈধ ড্রাইভিং লাইসেন্স থাকা বাধ্যতামূলক (ঋণ মঞ্জুরির পূর্বে নিশ্চিত করতে হবে)'));
  if(d.v_wd){const a=new Date(d.v_wd),b=new Date(d.l_date||Date.now()),y=(b-a)/31557600000;out.push(ok(y>=5,'পূর্বের মোটর সাইকেল ঋণ উত্তোলনের তারিখ ('+lfDate(d.v_wd)+') থেকে '+toBn(Math.floor(Math.max(y,0)*10)/10)+' বছর অতিক্রান্ত'+(y>=5?' - ৫ বছর পূর্ণ, প্রত্যয়নপত্র সংযুক্ত করুন':' - ৫ বছর পূর্ণ হয়নি')))}
  else out.push(ok(true,'পূর্বে ভোগকৃত মোটর সাইকেল ঋণ নেই (৫ বছর শর্ত প্রযোজ্য নয়)'));
  if(d.x_ret){const a=new Date(d.l_date||Date.now()),b=new Date(d.x_ret),m=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth();out.push(ok(m>0,'অবসর/পিআরএল গ্রহণের তারিখ: '+lfDate(d.x_ret)+' - চাকরির অবশিষ্ট মেয়াদ '+toBn(Math.max(m,0))+' মাস (অবসরের পূর্বেই ঋণ আদায়যোগ্য হতে হবে)'))}
  const inst=['cpf_i','hb_i','cmp_i'].reduce((s,k)=>s+lfNum(d[k]),0),th=lfNum(d.x_takehome);
  if(th)out.push(`<div class="muted small">টেক হোম পে ${lfMon(th)} টাকা; চলমান মাসিক কিস্তি ${lfMon(inst)||'০'} টাকা${inst?' ('+toBn(Math.round(inst/th*100))+'%)':''}</div>`);
  out.push('<div class="muted small">আবেদন যথাযথ কর্তৃপক্ষের মাধ্যমে উপ-মহাব্যবস্থাপক, ওয়েলফেয়ার ডিপার্টমেন্ট (স্টাফ গৃহায়ণ ঋণ), প্রধান কার্যালয়, ঢাকায় প্রেরণ করতে হবে। ঋণ মঞ্জুর হলে ব্যাংক কর্তৃক আরোপিত শর্তাবলি প্রযোজ্য।</div>');
  return out.join('');
}
const lfMotoSample={a_name:'খালিদ বিন আজাদ',a_father:'এম.এ. আজাদ',x_desig:'সিনিয়র অফিসার',x_bankid:'026122',x_fileno:'এসও-13999',x_posting:'সিরাজগঞ্জ কর্পোরেট শাখা, সিরাজগঞ্জ',x_join:'2020-09-14',x_perm:'2020-09-14',a_dob:'1992-12-31',x_ret:'2051-12-30',a_mobile:'01866595059',x_scale:'22000-53060',x_basic:'29510',x_gross:'63471.00',x_takehome:'40858.90',
 m_name:'YAMAHA R15 V4',m_model:'R15 V4, SILVER',m_country:'ভারত',m_vendor:'আরএস মটরস',
 q1_n:'আরএস মটরস',q1_a:'এসবি ফজলুল হক রোড, সিরাজগঞ্জ',q1_r:'500000',q2_n:'আল-আরাফা মটরস',q2_a:'বেড়া হাসপাতাল রোড, বেড়া, পাবনা',q2_r:'530000',q3_n:'তামিম মটরস অ্যান্ড বাইক সেন্টার',q3_a:'শেরপুর, বগুড়া',q3_r:'535000',m_cond:'নতুন',m_low:'500000',l_amt:'500000',
 cmp_a:'57350.62',cmp_i:'1370',
 r_name:'মোঃ হুমায়ন কবির',r_desig:'সহকারী মহাব্যবস্থাপক',r_place:'সিরাজগঞ্জ কর্পোরেট শাখা, সিরাজগঞ্জ'};
A.lfSample=()=>{const f=S.lf;if(f.d.a_name&&!confirm('Replace the entered data with the test data from the Word file?'))return;Object.assign(f.d,lfMotoSample);f.dirty=true;lfRender()};
const lfPg=(inner,n)=>lfPage(`<div class="ka">${inner}</div><div class="u" style="position:absolute;left:0;right:0;bottom:-2mm;text-align:center">${n}</div>`,'7mm 11mm 0 14mm');
const lfSig=d=>`<div style="margin-left:96mm;line-height:6.4mm"><div style="margin-bottom:4mm">আবেদনকারীর স্বাক্ষর :</div>${lfLn('নাম :',d.a_name)}${lfLn('পদবী :',d.x_desig)}${lfLn('বর্তমান কর্মস্থল :',d.x_posting)}</div>`;
const lfWit=(d,k)=>`<div style="margin-top:2mm;line-height:6mm"><div>${toBn(k)}. স্বাক্ষর &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</div>${[['নাম','_name'],['পদবী','_desig'],['বর্তমান কর্মস্থল','_place']].map(([l,s])=>`<div style="display:flex;gap:2mm;padding-left:4mm;width:110mm"><span style="flex:0 0 32mm">${l}</span><span>:</span><span style="flex:1;border-bottom:1px dotted #000;min-height:5.6mm">${esc(d['w'+k+s]||'')}</span></div>`).join('')}</div>`;
function lfDocMoto1(){
  const d=S.lf.d,amt=lfMon(d.l_amt)?lfMon(d.l_amt)+'/= ('+lfWd(d.l_amt)+') টাকা':'৫,০০,০০০/= (পাঁচ লক্ষ) টাকা';
  const p1=`<div class="kph">আবেদনকারীর<br>পাসপোর্ট সাইজের<br>সত্যায়িত ছবি</div>
  <div style="line-height:5.9mm;margin-top:4mm">উপ-মহাব্যবস্থাপক<br>জনতা ব্যাংক পিএলসি.<br>ওয়েলফেয়ার ডিপার্টমেন্ট<br>(স্টাফ গৃহায়ণ ঋণ)<br>প্রধান কার্যালয়<br>ঢাকা।</div>
  <div style="text-align:center;margin-top:6mm">যথাযথ কর্তৃপক্ষের মাধ্যমে</div>
  <div style="margin-top:5mm;border-bottom:1px solid #000;border-top:1px solid #000;padding:0 1mm"><span class="u">বিষয়ঃ-</span> জনতা ব্যাংক কর্মচারী যানবাহন অগ্রিম নীতিমালা-২০০০ এর আওতায় মোটর সাইকেল ঋণের আবেদনপত্র।</div>
  <div style="margin-top:5mm">প্রিয় মহোদয়,</div>
  <p class="kp">আমি নিম্নস্বাক্ষরকারী মোটর সাইকেল ক্রয়ের নিমিত্তে ''জনতা ব্যাংক কর্মচারী যানবাহন অগ্রিম নীতিমালা-২০০০'' এর আওতায় জারিকৃত নির্দেশ বিজ্ঞপ্তি নং ১৩১৮/২৫ তারিখ: ১৩-০২-২০২৫ এর প্রেক্ষিতে মোটর সাইকেল ঋণ নীতিমালায় জারিকৃত সকল নির্দেশ বিজ্ঞপ্তির শর্তাধীনে ${amt} মোটর সাইকেল ঋণের জন্য নিম্নে প্রয়োজনীয় তথ্যাদি উল্লেখপূর্বক আবেদন করছি ঃ</p>
  <div class="kh" style="margin-top:7mm"><span class="u">১। সাধারণ তথ্য ঃ</span></div><div class="mgap">
  ${lfKR([['ক. নাম',d.a_name,0]])}${lfKR([['খ. পিতা/স্বামীর নাম',d.a_father,0]])}
  ${lfKR([['গ. পদবী, ব্যাংক আইডি ও ব্যক্তিগত নথি নং',[d.x_desig,d.x_bankid?'আইডি-'+toBn(d.x_bankid):'',d.x_fileno?'নথি নং-'+toBn(d.x_fileno):''].filter(Boolean).join(', '),0]])}
  ${lfKR([['ঘ. বর্তমান কর্মস্থল',d.x_posting,0]])}
  ${lfKR([['ঙ. চাকুরীতে যোগদানের তারিখ',lfDate(d.x_join),0],['বেতন স্কেল',lfv(d,'x_scale'),0]])}
  ${lfKR([['চ. চাকুরী স্থায়ীকরণের তারিখ',lfDate(d.x_perm),0],['মূল বেতন',lfMon(d.x_basic),0]])}
  ${lfKR([['ছ. জন্ম তারিখ',lfDate(d.a_dob),0],['মোট বেতন (বেতন বিবরণীসহ)',lfMon(d.x_gross),0]])}
  ${lfKR([['জ. স্বাভাবিকভাবে পি.আর.এল/অবসর গ্রহণের তারিখ',lfDate(d.x_ret),0],['টেকহোম পে',lfMon(d.x_takehome),0]])}
  ${lfKR([['ঝ. মোবাইল নং',lfv(d,'a_mobile'),0]])}</div>`;
  const q=lfQuotes(d),mk=lfMon;
  const p2=`<div class="u" style="text-align:center">পাতা-২</div>
  <div class="kh" style="margin-top:6mm"><span class="u">২। ক্রয়ের জন্য প্রস্তাবিত মোটর সাইকেল এর বিবরণ ঃ</span></div>
  ${lfKR([['যন্ত্রের নাম',d.m_name,0],['মডেল নম্বর',d.m_model,0]])}${lfKR([['প্রস্তুতকারক দেশের নাম',d.m_country,0],['সরবরাহকারী প্রতিষ্ঠানের নাম',d.m_vendor,0]])}
  <div class="kh" style="margin-top:6mm"><span class="u">দরপত্র প্রদানকারী তিনটি প্রতিষ্ঠানের বিবরণ ঃ</span></div>
  <table class="kt" style="width:174mm;margin-left:0"><tr><th style="width:18mm">ক্রমিক নং</th><th>নাম ও ঠিকানা</th><th style="width:44mm">দরপত্রের উদ্ধৃত দর</th></tr>
  ${q.map((x,i)=>`<tr><td style="text-align:center">${toBn(i+1)}।</td><td>${esc([x.n,x.a].filter(Boolean).join(', '))}&nbsp;</td><td style="text-align:right">${x.r?mk(x.r)+'/= টাকা':''}&nbsp;</td></tr>`).join('')}</table>
  <div class="kh" style="margin-top:6mm"><span class="u">দরপত্র অনুযায়ী মোটর সাইকেল এর সর্বনিম্ন মূল্য ঃ</span></div>
  <div style="margin-top:2mm;display:flex;gap:30mm;padding-left:8mm"><span>নতুন ঃ ${d.m_cond==='রিকন্ডিশন'?'---':lfFf(lfMon(d.m_low)?lfMon(d.m_low)+'/= টাকা':'',34)}</span><span>রিকন্ডিশন ঃ ${d.m_cond==='রিকন্ডিশন'?lfFf(lfMon(d.m_low)?lfMon(d.m_low)+'/= টাকা':'',34):'---'}</span></div>
  <div class="kh" style="margin-top:7mm"><span class="u">৩। দায়দেনার বিবরণ ঃ</span></div>
  <table style="width:100%;border-collapse:collapse;margin-top:2mm;line-height:1.5">
  ${[['ক) সিপিএফ/জিপিএফ ঋণ',d.cpf_a,'ক) মাসিক নির্ধারিত কিস্তি',lfNoi(d.cpf_i)],['খ) গৃহ নির্মাণ ঋণ',d.hb_a,'খ) মাসিক নির্ধারিত কিস্তি',lfNoi(d.hb_i)],['গ) কম্পিউটার অগ্রিম',d.cmp_a,'গ) মাসিক নির্ধারিত কিস্তি',lfNoi(d.cmp_i)]].map(r=>`<tr><td style="width:44mm;padding:2mm 0">${r[0]}</td><td style="width:44mm">: ${lfNoi(r[1])}</td><td style="width:50mm">${r[2]}</td><td>: ${r[3]}</td></tr>`).join('')}
  <tr><td style="padding:2mm 0;vertical-align:top">ঘ) পূর্বে ভোগকৃত যানবাহন অগ্রিম</td><td style="vertical-align:top">: ${lfNoi(d.v_a)}</td><td style="vertical-align:top">ঘ) মঞ্জুরীর তারিখ<br>উত্তোলনের তারিখ</td><td style="vertical-align:top">: ${d.v_sd?lfDate(d.v_sd):'নাই'}<br>: ${d.v_wd?lfDate(d.v_wd):'নাই'}</td></tr></table>
  <p class="kp" style="margin-top:8mm">(ভোগকৃত মোটর সাইকেল ঋণ উত্তোলনের তারিখ হতে ৫ বছর অতিক্রান্ত হয়েছে কিনা এ মর্মে ঋণ বিতরণকারী শাখা/ঋণের বর্তমান পরিচালিত শাখার প্রত্যয়নপত্র সংযুক্ত করতে হবে।)</p>`;
  const att=['চাকুরী স্থায়ীকরণ পত্রের সত্যায়িত ফটোকপি।','প্রধান কার্যালয় কর্তৃক নির্ধারিত সর্বশেষ বেতন নির্ধারণী পত্র।','জন্ম তারিখ নির্ধারণের ক্ষেত্রে এসএসসি/শিক্ষাগত যোগ্যতার সনদপত্র।','বর্তমান স্থিতিসহ জিপিএফ/সিপিএফ এর বিবরণী।','মোটর কার লোন/মোটর সাইকেল ঋণ/বাই-সাইকেল ঋণ/জিপিএফ/সিপিএফ/কম্পিউটার ঋণ/অন্যান্য ঋণ (যদি থাকে) এর বিবরণী।','সর্বশেষ বেতন বিবরণী।','BRTA কর্তৃক প্রদত্ত বৈধ ড্রাইভিং লাইসেন্স প্রদান করতে হবে।'];
  const p3=`<div class="u" style="text-align:center">পাতা-৩</div>
  <p class="kp" style="margin-top:5mm;line-height:6.4mm">আমি এই মর্মে অঙ্গীকার করছি যে, উপরোক্ত তথ্যাবলী সত্য। প্রস্তাবিত ঋণ মঞ্জুর করা হলে ব্যাংক কর্তৃক আরোপিত শর্ত ও নিয়মাবলী আমি যথাযথভাবে পালন করতে বাধ্য থাকব। এতদ্‌সঙ্গে বর্ণিত তথ্যাদি ভুল প্রমাণে উল্লেখিত ঋণ প্রস্তাব বা মঞ্জুরীকৃত ঋণসীমা বাতিল বলে গণ্য হলে এ বিষয়ে আমার অনুকূলে ঋণের দায় স্থিতি চাহিবামাত্র সমন্বয়ে অঙ্গীকারবদ্ধ হয়ে অত্র ঋণ আবেদন পত্র দাখিল করলাম।</p>
  <div style="margin-top:3mm">${lfSig(d)}</div>
  <div style="margin-top:3mm">স্বাক্ষী ঃ</div>${lfWit(d,1)}${lfWit(d,2)}
  <div class="kh" style="margin-top:3mm"><span class="u">সংশ্লিষ্ট ঊর্ধ্বতন কর্মকর্তা/নির্বাহীর সুপারিশ ঃ</span></div>
  <p class="kp" style="line-height:6.2mm">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, আবেদনকারী আমার সম্মুখে আবেদন পত্রে স্বাক্ষর করেছেন। ঋণ প্রস্তাবে দাখিলকৃত কাগজপত্র ও সন্নিবেশিত তথ্যাবলী সত্য ও নির্ভুল। আরও প্রত্যয়ন করা যাচ্ছে যে, আমার জানামতে ঋণ প্রার্থীর বিরুদ্ধে সাময়িকভাবে বরখাস্তের আদেশ, আদালতে বা বিভাগীয় শৃংখলাজনিত কারনে দন্ড প্রাপ্ত নন অথবা দন্ড প্রাপ্ত হলেও দন্ডের মেয়াদ বলবৎ নাই, শৃংখলাজনিত কোন অভিযোগ বা মামলা অনিষ্পন্ন অবস্থায় নাই অথবা ব্যাংকের কোন পাওনা আদায়ের জন্য দায়ী রাখা হয়নি।</p>
  <p class="kp" style="margin-top:1mm">প্রার্থীত ঋণ নিয়মানুযায়ী মঞ্জুরীর জন্য সুপারিশ করা হ'ল।</p>
  <div style="display:flex;justify-content:space-between;margin-top:5mm"><div style="padding-top:2mm">তারিখ ঃ ${lfFf(d.r_date?lfDate(d.r_date):'',30)}</div><div style="width:92mm;line-height:6.2mm"><div>স্বাক্ষর ঃ</div>${lfLn('নাম ঃ',d.r_name)}${lfLn('পদবী ঃ',[d.r_desig,d.r_place].filter(Boolean).join(', '))}<div style="padding-left:16mm">(সীলমোহরসহ)</div></div></div>
  <div style="margin-top:3mm"><span class="u">নিম্নোক্ত কাগজপত্রাদি সংযুক্ত করতে হবে:</span></div>
  <div style="line-height:5.7mm">${att.map((x,i)=>`<div>${toBn(i+1)}) ${x}</div>`).join('')}</div>`;
  return lfFit(lfPg(p1,'চলমান পাতা-২')+lfPg(p2,'চলমান পাতা-৩')+lfPg(p3,''));
}
function lfDocMoto2(){
  const d=S.lf.d;
  const inner=`<div class="u" style="text-align:center;font-size:20pt;margin-top:14mm">ঘোষণা পত্র</div>
  <p class="kp" style="margin-top:12mm;line-height:8mm">আমি নিম্নস্বাক্ষরকারী এই মর্মে ঘোষণা করছি যে, অবসর, ইস্তফা, পদচ্যুতি, অপসারন অথবা অন্য কোন কারণে ব্যাংকের চাকুরী হতে অপসারিত হলে মোটর সাইকেল ঋণের সমুদয় পাওনা সুদ বা আসলে আমার প্রাপ্তব্য যাবতীয় পেনশন বেনিফিট, গ্রাচুইটিসহ ভবিষ্যৎ তহবিলে জমাকৃত টাকা হতে আদায় করে ঋণ হিসাবটি সমন্বয় করবার জন্য ব্যাংক কর্তৃপক্ষকে ক্ষমতা প্রদান করলাম।</p>
  <div style="margin:16mm 0 0 64mm;line-height:8.4mm">${[['স্বাক্ষর ঃ',''],['নাম ঃ',d.a_name],['পদবী ঃ',d.x_desig],['বর্তমান কর্মস্থল ঃ',d.x_posting],['জিপিএফ/সিপিএফ নং ঃ',d.x_gpf]].map(([l,v])=>`<div style="display:flex;gap:2mm"><span style="flex:0 0 54mm;text-align:right">${l}</span><span style="flex:1;border-bottom:1px dotted #000;min-height:6mm">${esc(v||'')}</span></div>`).join('')}</div>
  <div style="margin-top:14mm">স্বাক্ষী ঃ</div>${lfWit(d,1)}<div style="height:6mm"></div>${lfWit(d,2)}`;
  return lfFit(lfPage(inner,'8mm 11mm 0 14mm'));
}
function lfDocMoto3(){
  const d=S.lf.d,wd=d.v_wd?lfDate(d.v_wd):'';
  const inner=`<div style="text-align:center;margin-top:6mm">জনতা ব্যাংক পিএলসি.<br>${lfBrn()}</div>
  <div style="display:flex;justify-content:space-between;margin-top:10mm"><span>স্মারক নং ${lfFf('',50)}</span><span>তারিখ : ${lfFf(d.pc_date?lfDate(d.pc_date):'',34)}</span></div>
  <div class="u" style="text-align:center;font-size:15pt;margin-top:12mm">প্রত্যয়নপত্র</div>
  <p class="kz" style="margin-top:9mm;text-align:justify;line-height:9mm">এ মর্মে প্রত্যয়ন করা যাচ্ছে যে, জনাব ${lfFf(d.a_name,70)}, পিতা/স্বামী ${lfFf(d.a_father,50)}, পদবী ${lfFf(d.x_desig,40)}, ব্যাংক আইডি ${lfFf(d.x_bankid?toBn(d.x_bankid):'',30)}, বর্তমান কর্মস্থল ${lfFf(d.x_posting,60)} ${d.v_wd?`এর অনুকূলে ${lfFf(d.pc_branch||'',50)} শাখা হতে ইতোপূর্বে ভোগকৃত মোটর সাইকেল ঋণ ${lfFf(wd,28)} তারিখে উত্তোলন করা হয়েছিল। উক্ত ঋণ উত্তোলনের তারিখ হতে ৫ (পাঁচ) বছর অতিক্রান্ত হয়েছে।`:`এই শাখা হতে ইতোপূর্বে মোটর সাইকেল ঋণ গ্রহণ করেননি।`}</p>
  <p class="kz" style="margin-top:6mm">আরও প্রত্যয়ন করা যাচ্ছে যে, উপরে বর্ণিত তথ্যাদি সত্য।</p>
  <div style="margin:26mm 0 0 100mm;line-height:7mm"><div>স্বাক্ষর ঃ</div>${lfLn('নাম ঃ',d.pc_name)}${lfLn('পদবী ঃ',d.pc_desig)}<div style="padding-left:6mm">(সীলমোহরসহ)</div></div>`;
  return lfFit(lfPage(inner,'10mm 14mm 0 16mm'));
}
Object.assign(LF_TYPES.stfmoto,{
  pdf:[[['app'],'Download Application (PDF)','MotorCycleLoan_Application'],[['dec'],'Download Declaration (PDF)','MotorCycleLoan_Declaration'],[['cert'],'Download Certificate (PDF)','MotorCycleLoan_Certificate']],
  ownDocs:true,calc:lfMotoCalc,calcH:'(নির্দেশ বিজ্ঞপ্তি নং ১৩১৮/২৫)',sample:lfMotoSample,defaults:{x_brta:''},
  docs:['ঋণের আবেদনপত্র (৩ পাতা, আবেদনকারীর পাসপোর্ট সাইজের সত্যায়িত ছবিসহ)','ঘোষণা পত্র','চাকুরী স্থায়ীকরণ পত্রের সত্যায়িত ফটোকপি','প্রধান কার্যালয় কর্তৃক নির্ধারিত সর্বশেষ বেতন নির্ধারণী পত্র','জন্ম তারিখ নির্ধারণের ক্ষেত্রে এসএসসি/শিক্ষাগত যোগ্যতার সনদপত্র','বর্তমান স্থিতিসহ জিপিএফ/সিপিএফ এর বিবরণী','মোটর কার লোন/মোটর সাইকেল ঋণ/বাই-সাইকেল ঋণ/জিপিএফ/সিপিএফ/কম্পিউটার ঋণ/অন্যান্য ঋণ (যদি থাকে) এর বিবরণী','সর্বশেষ বেতন বিবরণী','BRTA কর্তৃক প্রদত্ত বৈধ ড্রাইভিং লাইসেন্সের সত্যায়িত ফটোকপি','তিনটি প্রতিষ্ঠানের দরপত্র/কোটেশন','পূর্বের মোটর সাইকেল ঋণ উত্তোলনের ৫ বছর অতিক্রান্ত হওয়ার প্রত্যয়নপত্র (ঋণ বিতরণকারী/বর্তমান পরিচালিত শাখা কর্তৃক, প্রযোজ্য হলে)','সংশ্লিষ্ট ঊর্ধ্বতন কর্মকর্তা/নির্বাহীর সুপারিশ'],
  sections:[
   {h:'১। সাধারণ তথ্য',f:[lfT('a_name','ক. নাম'),lfT('a_acct','বেতন হিসাব নম্বর'),lfT('a_father','খ. পিতা/স্বামীর নাম'),lfT('x_desig','গ. পদবী'),lfT('x_bankid','ব্যাংক আইডি'),lfT('x_fileno','ব্যক্তিগত নথি নং'),lfT('x_posting','ঘ. বর্তমান কর্মস্থল'),lfD('x_join','ঙ. চাকুরীতে যোগদানের তারিখ'),lfD('x_perm','চ. চাকুরী স্থায়ীকরণের তারিখ'),lfD('a_dob','ছ. জন্ম তারিখ'),lfD('x_ret','জ. পি.আর.এল/অবসর গ্রহণের তারিখ'),lfT('a_mobile','ঝ. মোবাইল নং'),lfT('x_scale','বেতন স্কেল'),lfN('x_basic','মূল বেতন'),lfN('x_gross','মোট বেতন (বেতন বিবরণীসহ)'),lfN('x_takehome','টেকহোম পে'),lfT('x_gpf','জিপিএফ/সিপিএফ নং (ঘোষণা পত্র)'),lfS('x_brta','BRTA বৈধ ড্রাইভিং লাইসেন্স',['','আছে','নেই']),lfT('x_dl','ড্রাইভিং লাইসেন্স নম্বর')]},
   {h:'২। ক্রয়ের জন্য প্রস্তাবিত মোটর সাইকেল',f:[lfT('m_name','যন্ত্রের নাম'),lfT('m_model','মডেল নম্বর'),lfT('m_country','প্রস্তুতকারক দেশের নাম'),lfT('m_vendor','সরবরাহকারী প্রতিষ্ঠানের নাম'),
    ...[1,2,3].flatMap(i=>[lfT('q'+i+'_n','দরপত্র '+toBn(i)+': প্রতিষ্ঠানের নাম'),lfT('q'+i+'_a','ঠিকানা'),lfN('q'+i+'_r','উদ্ধৃত দর (টাকা)')]),
    lfS('m_cond','মোটর সাইকেলের ধরন',['নতুন','রিকন্ডিশন']),lfN('m_low','দরপত্র অনুযায়ী সর্বনিম্ন মূল্য (টাকা)'),lfN('l_amt','আবেদনকৃত ঋণের পরিমাণ (টাকা)')]},
   {h:'৩। দায়দেনার বিবরণ',f:[lfN('cpf_a','ক) সিপিএফ/জিপিএফ ঋণ (টাকা)'),lfN('cpf_i','মাসিক নির্ধারিত কিস্তি'),lfN('hb_a','খ) গৃহ নির্মাণ ঋণ (টাকা)'),lfN('hb_i','মাসিক নির্ধারিত কিস্তি'),lfN('cmp_a','গ) কম্পিউটার অগ্রিম (টাকা)'),lfN('cmp_i','মাসিক নির্ধারিত কিস্তি'),lfN('v_a','ঘ) পূর্বে ভোগকৃত যানবাহন অগ্রিম (টাকা)'),lfD('v_sd','মঞ্জুরীর তারিখ'),lfD('v_wd','উত্তোলনের তারিখ')]},
   {h:'স্বাক্ষী (২ জন)',f:[lfT('w1_name','১. নাম'),lfT('w1_desig','পদবী'),lfT('w1_place','বর্তমান কর্মস্থল'),lfT('w2_name','২. নাম'),lfT('w2_desig','পদবী'),lfT('w2_place','বর্তমান কর্মস্থল')]},
   {h:'সংশ্লিষ্ট ঊর্ধ্বতন কর্মকর্তা/নির্বাহীর সুপারিশ',f:[lfT('r_name','নাম'),lfT('r_desig','পদবী'),lfT('r_place','কর্মস্থল'),lfD('r_date','তারিখ')]},
   {h:'প্রত্যয়নপত্র (৫ বছর অতিক্রান্ত - ঋণ বিতরণকারী/বর্তমান পরিচালিত শাখা)',f:[lfT('pc_branch','ঋণ বিতরণকারী শাখার নাম'),lfT('pc_name','প্রত্যয়নকারীর নাম'),lfT('pc_desig','পদবী'),lfD('pc_date','তারিখ')]}
  ],
  print:[['app','Print application (3 pages, with photo box)',lfDocMoto1],['dec','Print declaration (ঘোষণা পত্র)',lfDocMoto2],['cert','Print certificate (প্রত্যয়নপত্র)',lfDocMoto3],['chk','Print checklist',lfDocChk]]
});

/* ================= Check List page and Report page ================= */
function pageLfCl(l){
  const type=lfTypeOfLeaf(l.id),T0=LF_TYPES[type];
  S.view.after=()=>lfClLoad(type);
  return`<div class="pghead"><h2>${esc(lfShort(T0))} Check List</h2></div><div id="lfbox" class="muted">Loading...</div>`;
}
async function lfClLoad(type){
  const of=lfOf(),j=await api('/lf/list?type='+type+'&office='+encodeURIComponent(of));
  const box=$('#lfbox');if(!box)return;
  const cur=await lfLoadSel(j.forms);
  const sel=`<div class="card"><div class="row" style="align-items:flex-end">${lfOfSel(of)}${lfAppSel(j.forms,cur)}</div></div>`;
  if(!cur){box.outerHTML=`<div id="lfbox">${sel}<p class="muted">${j.forms.length?'Select an applicant to tick the documents received.':'No applications saved yet. Use Data Entry first.'}</p></div>`;return}
  const f=S.lf,docs=lfDocs(LF_TYPES[type]),ro=f.office!==S.user.office||!S.user.office;
  box.outerHTML=`<div id="lfbox">${sel}<div class="card bn" style="margin-top:12px">${ro?'<div class="note n-info">View only: this application belongs to another office.</div>':''}
  <div class="muted small" style="margin-bottom:4px">${esc(f.d.a_name||'')} ${f.d.a_acct?'- '+esc(f.d.a_acct):''} &nbsp; <b id="ckcnt"></b></div>
  ${docs.map((x,i)=>`<label class="ckrow"><input type="checkbox" data-k="ck${i}" ${f.d['ck'+i]?'checked':''} onchange="A.lfCk(this)" ${ro?'disabled':''}><span>${toBn(i+1)}. ${esc(x)}</span></label>`).join('')}
  <div class="bar" style="margin-top:12px">${ro?'':`<button class="pri" onclick="run(A.lfSave)">Save</button>`}</div></div></div>`;
  A.lfCk(null);
}
A.lfCk=el=>{if(el){S.lf.d[el.dataset.k]=el.checked;S.lf.dirty=true}
  const n=lfDocs(LF_TYPES[S.lf.type]).filter((x,i)=>S.lf.d['ck'+i]).length,c=$('#ckcnt');if(c)c.textContent='Received: '+n+' / '+lfDocs(LF_TYPES[S.lf.type]).length};

const lfCsv=rows=>'\ufeff'+rows.map(r=>r.map(c=>'"'+String(c??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
A.lfRpPrint=()=>{const r=S.lfrp,nm=r.type==='all'?'ঋণ আবেদন':LF_TYPES[r.type].name,o=office(S.user.office);
  const tbl=`<table class="r3t" style="width:100%;border-collapse:collapse"><tr>${r.hd.map(h=>`<th>${h}</th>`).join('')}</tr>${r.rows.map(x=>`<tr>${x.map((c,k)=>`<td${k===3?' style="text-align:right"':''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
  A.lfPrintHtml(`<div class="bn r3p lfpad"><div class="p-h"><img src="${LOGO}" alt=""><div class="tx"><div class="b">জনতা ব্যাংক পিএলসি.</div><div>${esc(o?(o.nameBn||o.name):'')}</div></div></div><div class="gtitle">${nm} - আবেদনের তালিকা</div>${tbl}${lfSign('কর্মকর্তা',isArea()?'অফিস প্রধান':'ব্যবস্থাপক')}</div>`)};
A.lfRpCsv=()=>{const r=S.lfrp;const b=new Blob([lfCsv([r.hd,...r.rows])],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='JBRS_'+r.type+'_report.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};

const lfRpKeys=()=>{const v=$('#lfdoc').value,PR=lfPrintList(LF_TYPES[S.lf.type]);return v==='all'?PR.map(x=>x[0]):[v]};
A.lfRpView=()=>{if(!S.lf||!$('#lfview'))return;const m=Object.fromEntries(lfPrintList(LF_TYPES[S.lf.type]).map(x=>[x[0],x[2]]));$('#lfview').innerHTML=lfRpKeys().map(k=>lfPagesOf(m[k])).join('')};
A.lfRpDo=async w=>{if(!S.lf)return toast('Select an applicant first.');const ks=lfRpKeys();if(w==='print')return A.lfPrint(ks.length>1?'all':ks[0]);await A.lfPdf(ks,LF_TYPES[S.lf.type].en.replace(/[^A-Za-z]+/g,'')+'_'+(ks.length>1?'All':ks[0]))};

/* ---- Personal Loan checklist: exactly as supplied ---- */
Object.assign(LF_TYPES.cfpersonal,{ownDocs:true,docs:[
'ঋণের আবেদনপত্র',
'ঋণগ্রহীতার জাতীয় পরিচয়পত্রের ফটোকপি',
'ঋণগ্রহীতার অফিস আইডি কার্ডের ফটোকপি (প্রতিষ্ঠান প্রধান কর্তৃক সত্যায়িত)',
'ঋণগ্রহীতার নিয়োগপত্র ও স্থায়ীকরণপত্রের ফটোকপি (প্রতিষ্ঠান প্রধান কর্তৃক সত্যায়িত)',
'স্থায়ী ঠিকানার বিষয়ে চেয়ারম্যান/কমিশনারের সার্টিফিকেট',
'ঋণগ্রহীতার সদ্য তোলা পাসপোর্ট সাইজের ২ কপি ছবি',
'ঋণগ্রহীতার অঙ্গীকারনামা ও দায়-দেনা সংক্রান্ত ঘোষণাপত্র',
'লেটার অব অথোরিটি (প্রভিডেন্ট ফান্ড/গ্র্যাচুইটি বা অন্য আর্থিক সুবিধা থেকে বকেয়া সমন্বয়)',
'সর্বশেষ বেতন বিবরণী (বেতন প্রদানকারী কর্মকর্তা কর্তৃক স্বাক্ষরিত)',
'এমপ্লয়ার্স সার্টিফিকেট (এ্যানেক্সার-খ) - প্রতিষ্ঠান প্রধান/বেতন প্রদানকারী কর্মকর্তা কর্তৃক (শিক্ষা প্রতিষ্ঠানের ক্ষেত্রে ভিসি/রেজিস্ট্রার/অধ্যক্ষ/প্রিন্সিপাল/প্রধান শিক্ষক)',
'বেতন প্রদানকারী/যথাযথ কর্তৃপক্ষের নিশ্চয়তা: ঋণ পরিশোধ না হওয়া পর্যন্ত বেতন অন্য ব্যাংক/শাখায় স্থানান্তর করা হবে না (আরসিডি সার্কুলার ১২৬/২৬)',
'পারিবারিক/ব্যক্তিগত গ্যারান্টর (স্বামী/স্ত্রী/পিতা/মাতা/সাবালক সন্তান/ভাই/বোন) এর জাতীয় পরিচয়পত্রের ফটোকপি ও ২ কপি ছবি',
'তৃতীয় পক্ষীয় জামিনদার (নিয়োগকর্তা/গেজেটেড অফিসার/সহকর্মী/ব্যাংকের নিকট গ্রহণযোগ্য ব্যক্তি) এর জাতীয় পরিচয়পত্রের ফটোকপি ও ২ কপি ছবি',
'অন্য কোন ব্যাংক/আর্থিক প্রতিষ্ঠানে ঋণ থাকলে পূর্বের প্রতিষ্ঠানের প্রত্যয়নপত্র',
'সহায়ক জামানতের কাগজপত্র (আয়ের অন্য উৎস থাকলে এবং মাসিক বেতন দ্বারা কিস্তি পরিশোধ না হলে - আরসিডি সার্কুলার ১২৬/২৬)',
'ঋণগ্রহীতা ও গ্যারান্টর কর্তৃক স্বাক্ষরিত সিআইবি ইনকোয়ারী ফরম (সকল ঋণের তথ্য উল্লেখ করে)',
'সন্তোষজনক সিআইবি রিপোর্ট (ঋণগ্রহীতা, পারিবারিক গ্যারান্টর ও তৃতীয় পক্ষীয় জামিনদার) এবং সিআইবি রিপোর্টে উল্লেখিত সকল ঋণের মঞ্জুরীপত্র ও হিসাব বিবরণী',
'ঋণের সমপরিমাণ ১টি চেকসহ তারিখ বিহীন মোট ৫টি স্বাক্ষরযুক্ত A/C Payee চেক',
'লেটার অব অ্যাকসেপটেন্স',
'ঋণের মঞ্জুরীপত্র',
'চার্জ ডকুমেন্টস: ডিপি নোট, লেটার অব অ্যারেঞ্জমেন্ট, লেটার অব ডিসবার্সমেন্ট, লেটার অব গ্যারান্টি, লেটার অব লিয়েন (প্রযোজ্য ক্ষেত্রে)',
'ঋণের কিস্তি/বকেয়া আদায়ের ক্ষমতা অর্পণপত্র (এ্যানেক্সার-গ)',
'বেতন হিসাব হতে স্বয়ংক্রিয় মাসিক কিস্তি কর্তনের ক্ষমতা অর্পণপত্র',
'এলডিসিএল',
'ঋণের ডকুমেন্টেশন সংক্রান্ত ছাড়পত্র',
'ঋণ হিসাবের তথ্যের প্রিন্টেড কপি (AOF)',
'ঋণগ্রহীতার বেতন হিসাব (সঞ্চয়ী হিসাব) এর প্রিন্ট কপি'
]});

/* ================= Data Entry (Area Office) ================= */
const LF_AO=[lfT('ao_mno','সভার নম্বর (Meeting No.)'),lfD('ao_mdate','সভার তারিখ'),lfT('ao_slref','মঞ্জুরিপত্র স্মারক নম্বর'),lfD('ao_sldate','মঞ্জুরিপত্রের তারিখ'),lfN('ao_amt','মঞ্জুরিকৃত ঋণের পরিমাণ (টাকা)'),lfS('ao_months','কিস্তির সংখ্যা (মাস)',['12','24','36','48','60','72','84','96']),lfT('ao_rate','সুদের হার (% বার্ষিক)'),lfT('ao_nsref','নোটশীট স্মারক নম্বর'),lfD('ao_nsdate','নোটশীটের তারিখ'),lfA('ao_cond','মঞ্জুরির শর্তাবলি'),lfA('ao_rem','মন্তব্য/সুপারিশ')];
function pageLfAo(l){
  const type=lfTypeOfLeaf(l.id);
  S.view.after=()=>lfAoLoad(type);
  return`<div class="pghead"><div class="hrow"><h2>${esc(lfShort(LF_TYPES[type]))} Data Entry (Area Office)</h2><span id="hdrsave"></span></div></div><div id="lfbox" class="muted" style="margin-top:12px">Loading...</div>`;
}
async function lfAoLoad(type){
  const of=S.view.lfof||(isArea()||isAdmin()?'all':S.user.office);
  const j=await api('/lf/list?type='+type+'&office='+encodeURIComponent(of));if(S.view.rst)j.forms=j.forms.filter(f=>lfBucket(f.sa||'',f.status,f.sl_ref)===S.view.rst);
  const box=$('#lfbox');if(!box)return;
  const cur=await lfLoadSel(j.forms);
  const sel=cur?`<div class="bar"><button onclick="go({...S.view,lfid:null,lfoff:null,after:null})">&larr; Back to list</button></div>`:`<div class="card"><div class="row" style="align-items:flex-end">${lfOfSel(of)}</div></div>`;
  if(!cur){const rst=S.view.rst;
    box.outerHTML=`<div id="lfbox">${sel}<div class="card" style="margin-top:12px;overflow:auto">${rst?`<div class="note n-info">Showing: ${rst} &nbsp; <a class="lk" onclick="go({...S.view,rst:null,after:null})">Show all</a></div>`:''}${j.forms.length?`<table><tr><th>Applicant</th><th>Account no.</th><th>Branch</th><th>Sanctioned by / authority</th><th>Status</th><th>Outward no. / date</th><th>Inward no. / date</th><th>Last saved</th></tr>${j.forms.map(f=>`<tr class="click" style="${f.status==='sent'||f.status==='received'?'font-weight:600':''}" onclick="go({...S.view,lfid:'${f.id}',lfoff:'${f.office}',after:null})"><td>${esc(f.name||'(no name)')}</td><td>${esc(f.acct||'')}</td><td>${esc(officeName(f.office))}</td><td>${esc(lfWho(f))}</td><td>${esc(lfStat(f))}</td><td>${esc(lfOI(f.out_no,f.out_date))}</td><td>${esc(lfOI(f.in_no,f.in_date))}</td><td>${fmtDT(f.updated)}</td></tr>`).join('')}</table>`:'No applications yet.'}</div></div>`;return}
  const r=await api('/lf/ao?office='+encodeURIComponent(cur.office)+'&id='+encodeURIComponent(cur.id));
  const f=S.lf;f.ao=r.ao||{};f.aoDirty=false;f.flow=r.flow;f.decs=r.decs;const stt=r.flow?r.flow.status:'';
  const ro=!isArea(),d=f.d,fc={...cur,sa:cur.sa||d.sa};
  const info=`<div class="card bn" style="margin-top:12px"><div><b>${esc(d.a_name||'')}</b> ${d.a_acct?'- '+esc(d.a_acct):''} &nbsp; ঋণের পরিমাণ: ${d.l_amt?esc(lfTaka(d.l_amt)):''}</div><div class="small">Sanction authority: <b>${esc(fc.sa||'')}</b>${d.fw_ref?' &nbsp; Forwarding letter: '+esc(d.fw_ref)+' '+(d.fw_date?lfDate(d.fw_date):''):''}</div><div class="small">Status: ${esc(lfStat(fc))}</div></div>`;
  if(fc.sa==='Branch'){box.outerHTML=`<div id="lfbox">${sel}${info}<div class="note n-info" style="margin-top:12px">This application is sanctioned by the Branch. No Area Office entry is needed.</div></div>`;return}
  box.outerHTML=`<div id="lfbox" class="lfform">${sel}${info}${ro?'<div class="note n-info" style="margin-top:12px">View only: only the Area Office can enter this page.</div>':''}${stt==='sent'?'<div class="note n-info" style="margin-top:12px">The branch has sent this file. Press Receive (top right) when the physical file arrives.</div>':stt==='returned'?'<div class="note n-info" style="margin-top:12px">Returned to the branch for correction. Waiting for the branch to send it again.</div>':''}<div class="card bn" style="margin-top:12px"><h3>Area Office entry (for Note Sheet and Sanction Letter)</h3><div class="row">${LF_AO.map(x=>lfField(x,f.ao[x.k],ro,'A.lfAoset')).join('')}</div></div>${lfDecHtml(f.decs)}${stt==='received'&&!ro?`<div class="card bn" style="margin-top:12px"><h3>Record decision</h3><div class="row"><div class="fc"><label>Decision *</label><select id="dc_dec"><option value=""></option><option value="sanctioned">Sanctioned</option><option value="returned">Returned for correction</option><option value="declined">Declined (final)</option></select></div><div class="fc"><label>Decision date *</label><input id="dc_dt" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" value="${lfIsoToDmy(lfToday())}" oninput="A.lfDt(this)"></div><div class="fc ad" style="flex:1 1 100%;max-width:none"><label>Query / reason / remarks (required for Returned and Declined)</label><textarea id="dc_note" rows="3" style="height:80px"></textarea></div><div class="fc w"><label>Attachments (query letter or sanction letter; PDF, image, Word or Excel; up to 5 files, 1 MB each)</label><input type="file" id="dc_files" multiple style="height:auto"></div></div><div class="bar" style="margin-top:10px"><button class="pri" onclick="run(A.lfDecide)">Record decision</button></div></div>`:''}</div>`;
  const hs=$('#hdrsave');if(hs)hs.innerHTML=ro?'':`${stt==='sent'?`<button class="pri" onclick="A.lfRecvAsk('${cur.office}','${cur.id}')" style="height:28px;padding:2px 14px;font-size:13px;margin-right:6px">Receive file</button>`:''}<button class="pri" onclick="run(A.lfAoSave)" style="height:28px;padding:2px 18px;font-size:13px">Save</button>`;
}
A.lfAoset=el=>{S.lf.ao[el.dataset.k]=el.dataset.dt?lfDmyToIso(el.value):el.value;S.lf.aoDirty=true};
A.lfAoSave=async()=>{const f=S.lf;await api('/lf/ao',{method:'PUT',body:{office:f.office,id:f.id,data:f.ao}});f.aoDirty=false;toast('Saved.')};

A.lfDecide=async()=>{
  const f=S.lf,dec=$('#dc_dec').value,date=lfDmyToIso($('#dc_dt').value),note=$('#dc_note').value.trim(),files=[...$('#dc_files').files];
  if(!dec)throw new Error('Choose the decision.');if(!date)throw new Error('Enter the decision date as dd/mm/yyyy.');
  if(dec!=='sanctioned'&&!note)throw new Error(dec==='declined'?'Write the reason for declining.':'Write the query for the branch.');
  if(files.length>5)throw new Error('Attach at most 5 files.');
  for(const x of files)if(x.size>1048576)throw new Error(x.name+' is larger than 1 MB.');
  if(!confirm(dec==='declined'?'Declining is final. The branch cannot reopen or change this application. Continue?':dec==='returned'?'Return this file to the branch for correction?':'Record this application as sanctioned?'))return;
  if(f.aoDirty)await A.lfAoSave();
  const r=await api('/lf/decide',{method:'POST',body:{office:f.office,id:f.id,dec,note,date}});
  const b64=x=>new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>ok(String(fr.result).split(',')[1]);fr.onerror=()=>no(new Error('Could not read '+x.name));fr.readAsDataURL(x)});
  try{for(const x of files)await api('/lf/attach',{method:'POST',body:{office:f.office,id:f.id,seq:r.seq,name:x.name,mime:x.type,data:await b64(x)}})}
  catch(e){toast('Decision recorded, but an attachment failed: '+e.message,true);go({...S.view,after:null});return}
  toast('Decision recorded.');go({...S.view,after:null});
};

/* ================= Loan Dashboard and Home ================= */
const LF_BK=['Draft','Not sent','Pending sanction','Sent','Received','Returned','Declined','Sanctioned: Branch','Sanctioned: Area Office','Sanctioned: Divisional Office','Sanctioned: Head Office'];
const lfBucket=(sa,st,ref)=>!sa?'Draft':st==='sent'?'Sent':st==='received'?'Received':st==='returned'?'Returned':st==='declined'?'Declined':st==='sanctioned'?'Sanctioned: '+sa:sa==='Branch'?'Pending sanction':'Not sent';
async function lfSummary(){
  const j=await api('/lf/summary?office='+encodeURIComponent(isBranch()?S.user.office:'all'));const m={};
  for(const r of j.rows){const t=m[r.type]=m[r.type]||{};const b=lfBucket(r.sa,r.status,r.sl_ref);t[b]=(t[b]||0)+r.n}
  return m;
}
const lfTotals=m=>{const t={};Object.values(m).forEach(o=>Object.entries(o).forEach(([b,n])=>t[b]=(t[b]||0)+n));return t};
const lfChips=t=>LF_BK.filter(b=>t[b]).map(b=>`<span class="badge" style="margin:2px 6px 2px 0">${b}: <b>${String(t[b])}</b></span>`).join('')||'<span class="muted">No applications yet.</span>';
async function lfHomeLoad(){
  const m=await lfSummary(),t=lfTotals(m),el=$('#hmLoan');if(!el)return;
  const n=Object.values(t).reduce((a,b)=>a+b,0);
  el.outerHTML=`<div class="card" id="hmLoan"><div>Total applications: <b>${String(n)}</b></div><div style="margin-top:6px">${lfChips(t)}</div>${isArea()&&t.Sent?`<div class="note n-warn" style="margin-top:8px">${String(t.Sent)} file(s) sent by branches are waiting to be received.</div>`:''}${isArea()&&t.Received?`<div class="note n-info" style="margin-top:8px">${String(t.Received)} received file(s) are waiting for a decision.</div>`:''}<div style="margin-top:8px"><button onclick="go({page:'leaf',leaf:'lf_dash'})">Open Loan Dashboard</button></div></div>`;
}

/* ================= Loan Reports (common page) ================= */
function pageLfRpt(l){
  const v=S.view,tab=v.rtab||'all',of=v.lfof||(isBranch()?S.user.office:'all');
  S.view.after=()=>lfRptLoad(tab,of);
  const tb=(k,t)=>`<button class="${tab===k?'pri':''}" onclick="go({...S.view,rtab:'${k}',lfid:null,lfoff:null,after:null})">${t}</button>`;
  const dt=(k,ph)=>`<input style="width:122px;height:28px;padding:2px 7px;font-size:13px" placeholder="${ph}" maxlength="10" inputmode="numeric" value="${esc(lfIsoToDmy(v[k]))}" oninput="A.lfDt(this)" onchange="A.rpSet('${k}',lfDmyToIso(this.value))">`;
  const flt=`<select onchange="A.rpSet('rtype',this.value)"><option value="all">All loan types</option>${Object.entries(LF_TYPES).map(([k,t])=>`<option value="${k}" ${v.rtype===k?'selected':''}>${esc(lfShort(t))}</option>`).join('')}</select>${lfOfSel(of,1)}<select onchange="A.rpSet('rst',this.value)"><option value="">All statuses</option>${LF_BK.map(b=>`<option ${v.rst===b?'selected':''}>${b}</option>`).join('')}</select>${dt('rfrom','From dd/mm/yyyy')}${dt('rto','To dd/mm/yyyy')}`;
  return`<div class="pghead"><div class="hrow"><div class="bar">${tb('all','All report')}${tb('one','Individual report')}</div><div class="hrow" id="rpctl" style="flex:1 1 auto"></div></div><div class="hrow" style="margin-top:6px">${flt}</div></div><div id="lfbox" class="muted" style="margin-top:12px">Loading...</div>`;
}
A.rpSet=(k,val)=>go({...S.view,[k]:val||null,lfid:null,lfoff:null,after:null});
async function lfRptLoad(tab,of){
  const v=S.view,ty=v.rtype||'all';
  const j=await api('/lf/items?type='+ty+'&office='+encodeURIComponent(of));
  const box=$('#lfbox');if(!box)return;
  const rows=j.forms.filter(f=>{const d=f.data||{},sa=f.sa||d.sa||'',ld=d.l_date||'';return(!v.rst||lfBucket(sa,f.status,f.sl_ref||d.sl_ref)===v.rst)&&(!v.rfrom||ld>=v.rfrom)&&(!v.rto||ld<=v.rto)});
  const rc=$('#rpctl');
  if(tab==='all'){
    const out=rows.map((f,i)=>{const d=f.data||{},t=LF_TYPES[f.type];return[toBn(i+1),t?lfShort(t):f.type,f.name||d.a_name||'',f.acct||d.a_acct||'',d.l_amt?lfFmt(d.l_amt):'',d.l_months?toBn(d.l_months):'',d.l_date?lfDate(d.l_date):'',officeName(f.office),f.sa||d.sa||'',lfStat({...f,sa:f.sa||d.sa},true),lfOI(f.out_no,f.out_date,true),lfOI(f.in_no,f.in_date,true),t?toBn(lfDocs(t).filter((x,k)=>d['ck'+k]).length)+'/'+toBn(lfDocs(t).length):'']});
    const hd=['ক্রমিক','ঋণের ধরন','আবেদনকারী','হিসাব নম্বর','ঋণের পরিমাণ (টাকা)','কিস্তি (মাস)','আবেদনের তারিখ','অফিস/শাখা','মঞ্জুরি কর্তৃপক্ষ','অবস্থা','আউটওয়ার্ড নং ও তারিখ','ইনওয়ার্ড নং ও তারিখ','কাগজপত্র জমা'];
    S.lfrp={rows:out,hd,type:ty};
    if(rc)rc.innerHTML=`<div class="bar"><button class="pri" onclick="A.lfRpPrint()">Print</button><button onclick="A.lfRpCsv()">Download (Excel)</button></div>`;
    box.outerHTML=`<div id="lfbox"><div class="card bn" style="overflow:auto">${out.length?`<table class="r3t" style="width:100%;border-collapse:collapse"><tr>${hd.map(h=>`<th>${h}</th>`).join('')}</tr>${out.map(r=>`<tr>${r.map((c,k)=>`<td${k===4?' style="text-align:right"':''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`:'No applications match.'}</div></div>`;
    return;
  }
  const cur=await lfLoadSel(rows);
  let ctl=lfAppSel(rows.map(f=>({...f,name:(f.name||'(no name)')+' · '+(LF_TYPES[f.type]?lfShort(LF_TYPES[f.type]):f.type)})),cur,1);
  if(cur){const PR=lfPrintList(LF_TYPES[S.lf.type]),dk=PR.some(x=>x[0]===v.lfdoc)||v.lfdoc==='all'?v.lfdoc:PR[0][0];
    ctl+=`<select id="lfdoc" onchange="S.view.lfdoc=this.value;A.lfRpView()">${PR.map(x=>`<option value="${x[0]}" ${x[0]===dk?'selected':''}>${x[1].replace(/^Print /,'')}</option>`).join('')}<option value="all" ${dk==='all'?'selected':''}>All documents</option></select><div class="bar"><button class="pri" onclick="A.lfRpView()">View</button><button onclick="A.lfRpDo('print')">Print</button><button onclick="run(()=>A.lfRpDo('pdf'))">Download PDF</button></div>`}
  if(rc)rc.innerHTML=ctl;
  box.outerHTML=`<div id="lfbox"><div id="lfview" class="lfsc" style="overflow:auto">${cur?'':'<p class="muted">Select an applicant, then choose a document.</p>'}</div></div>`;
  if(cur)A.lfRpView();
}

/* ================= Loan Dashboard (by category) ================= */
const LF_CATS=[['CMSME',['cmsme']],['Agricultural & Rural Credit',['crop','dairy','bullfat','mpsc','gnkr','youth']],['Consumer financing',['cfpersonal','cfcredit','cfhealth','cfpension']],['Secured overdraft',['sod']],['Staff loan',['stfhouse','stfmoto','stfcomp','execcar']]];
function pageLfDash(){S.view.after=async()=>{
    const [m,j]=await Promise.all([lfSummary(),api('/lf/items?type=all&office='+encodeURIComponent(isBranch()?S.user.office:'all'))]);
    const box=$('#lfdash');if(!box)return;
    const sum=o=>Object.values(o||{}).reduce((a,b)=>a+b,0);
    const cell=(k,b,n)=>n?`<td class="click" onclick="go({page:'leaf',leaf:'${LF_TYPES[k].leaf}',rst:'${b}',after:null})">${String(n)}</td>`:'<td></td>';
    const tot=lfTotals(m),BK=LF_BK.filter(b=>tot[b]);
    let body='';
    for(const [cn,ks] of LF_CATS){const have=ks.filter(k=>m[k]);if(!have.length)continue;
      const ct={};have.forEach(k=>Object.entries(m[k]).forEach(([b,n])=>ct[b]=(ct[b]||0)+n));
      body+=`<tr style="background:var(--bg)"><td><b>${esc(cn)}</b></td>${BK.map(b=>`<td><b>${ct[b]?String(ct[b]):''}</b></td>`).join('')}<td><b>${String(sum(ct))}</b></td></tr>`;
      body+=have.map(k=>`<tr><td style="padding-left:22px"><a class="lk" onclick="go({page:'leaf',leaf:'${LF_TYPES[k].leaf}',after:null})">${esc(lfShort(LF_TYPES[k]))}</a></td>${BK.map(b=>cell(k,b,m[k][b])).join('')}<td>${String(sum(m[k]))}</td></tr>`).join('')}
    const rec=j.forms.slice(0,15),sa=f=>({...f,sa:f.sa||(f.data||{}).sa});
    box.outerHTML=`<div id="lfdash"><div class="card" style="overflow:auto">${body?`<table><tr><th>Loan category / type</th>${BK.map(b=>`<th>${b.replace('Sanctioned: ','Sanctioned by ')}</th>`).join('')}<th>Total</th></tr>${body}</table><div class="muted small" style="margin-top:6px">Click a number to open that list.</div>`:'No loan applications yet.'}</div>
    <h3 style="margin-top:16px">Recent movement</h3><div class="card" style="overflow:auto">${rec.length?`<table><tr><th>Last saved</th><th>Applicant</th><th>Loan type</th><th>Branch</th><th>Sanctioned by / authority</th><th>Status</th><th>Outward no. / date</th><th>Inward no. / date</th></tr>${rec.map(f=>`<tr class="click" onclick="go({page:'leaf',leaf:'${(LF_TYPES[f.type]||{}).leaf}',lfid:'${f.id}',lfoff:'${f.office}',after:null})"><td>${fmtDT(f.updated)}</td><td>${esc(f.name||'(no name)')}</td><td>${esc(LF_TYPES[f.type]?lfShort(LF_TYPES[f.type]):f.type)}</td><td>${esc(officeName(f.office))}</td><td>${esc(lfWho(sa(f)))}</td><td>${esc(lfStat(sa(f)))}</td><td>${esc(lfOI(f.out_no,f.out_date))}</td><td>${esc(lfOI(f.in_no,f.in_date))}</td></tr>`).join('')}</table>`:'Nothing yet.'}</div></div>`};
  return`<h2>Loan Dashboard</h2><div id="lfdash" class="card muted">Loading...</div>`}
