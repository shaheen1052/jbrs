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
A.lfNew=type=>{S.lf={id:lfNewId(),type,office:S.user.office,d:{l_date:new Date().toISOString().slice(0,10),...(LF_TYPES[type].defaults||{})},isNew:true};go({...S.view,lfid:S.lf.id,lfoff:S.user.office,after:null})};
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
const lfDocs=t=>t.ownDocs?t.docs:[...LF_COMMON_DOCS,...t.docs];
const lfPrintList=t=>t.print||[['app','Print application',lfDocApp],['chk','Print checklist',lfDocChk],['gua',"Print guarantor's undertaking",lfDocGua],['dpn','Print demand promissory note',lfDocDpn]];
function lfSections(type){const t=LF_TYPES[type];if(t.sections)return t.sections;return[LF_SEC.app,t.ex,LF_SEC.loan,LF_SEC.sec,LF_SEC.g1,LF_SEC.g2]}
function lfRender(){
  const f=S.lf,t=LF_TYPES[f.type],ro=f.office!==S.user.office||!S.user.office;
  const box=$('#lfbox');if(!box)return;
  const docs=lfDocs(t);
  box.outerHTML=`<div id="lfbox">${ro?'<div class="note n-info">View only: this application belongs to another office.</div>':''}
  ${lfSections(f.type).map(s=>`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">${s.h}</h3><div class="row" style="flex-wrap:wrap">${s.f.map(x=>lfField(x,f.d[x.k],ro)).join('')}</div></div>`).join('')}
  ${t.calc?`<div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">স্বয়ংক্রিয় হিসাব ও নীতিমালা যাচাই (আরসিডি সার্কুলার ১১৯/২৫, ১২২/২৬, ১২৬/২৬)</h3><div id="lfcalc">${t.calc(f.d)}</div></div>`:''}
  <div class="card bn" style="margin-top:12px"><h3 style="margin-top:0">প্রয়োজনীয় কাগজপত্র (চেকলিস্ট)</h3>${docs.map((x,i)=>`<label style="display:block;font-weight:400;margin:4px 0"><input type="checkbox" data-k="ck${i}" ${f.d['ck'+i]?'checked':''} onchange="A.lfset(this)" ${ro?'disabled':''}> ${esc(x)}</label>`).join('')}</div>
  <div class="bar" style="margin-top:12px">${ro?'':`<button class="pri" onclick="run(A.lfSave)">Save</button>`}
  ${lfPrintList(t).map(([k,l])=>`<button onclick="A.lfPrint('${k}')">${l}</button>`).join('')}${t.pdf?`<span style="flex-basis:100%"></span>${t.pdf.map(([ks,l,fn])=>`<button class="pri" onclick="run(()=>A.lfPdf(${JSON.stringify(ks).replace(/"/g,'&quot;')},'${fn}'))">${l}</button>`).join('')}`:''}<button onclick="A.lfPrint('all')">Print all</button>
  ${!ro&&!f.isNew?`<button class="dan" onclick="if(confirm('Delete this application?'))run(A.lfDel)">Delete</button>`:''}<button onclick="A.lfBack()">Back to list</button></div>
  <p class="muted small">Forms are drafts prepared in standard format. Check wording against the bank's current circulars and official forms before use.</p></div>`;
}
A.lfset=el=>{const k=el.dataset.k;S.lf.d[k]=el.type==='checkbox'?el.checked:el.value;S.lf.dirty=true;
  {const t=LF_TYPES[S.lf.type];if(t.calc){const c=$('#lfcalc');if(c)c.innerHTML=t.calc(S.lf.d)}}
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
  const f=S.lf,d=f.d,t=LF_TYPES[f.type];const docs=lfDocs(t);
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
  const PR=lfPrintList(LF_TYPES[S.lf.type]),m=Object.fromEntries(PR.map(x=>[x[0],x[2]]));
  const parts=w==='all'?PR.map(x=>x[0]):[w];
  const pa=$('#printArea');
  pa.innerHTML=parts.map(k=>{const r=m[k]();return r.indexOf('class="lfpage"')>=0?r:'<div class="bn r3p lfpad">'+r+'</div>'}).join('');
  pa.classList.add('lf0');window.addEventListener('afterprint',()=>pa.classList.remove('lf0'),{once:true});
  window.print();
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
  const host=document.createElement('div');host.className='lfpdfhost';host.innerHTML=keys.map(k=>m[k]()).join('');document.body.appendChild(host);
  try{
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
    const pgs=[...host.querySelectorAll('.lfpage')];
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
const lfLn=(l,v,w)=>`<div style="display:flex;gap:6px;margin:3px 0;${w?'width:'+w+';':''}"><span style="flex:0 0 auto">${l}</span><span style="flex:1;border-bottom:1px dotted #000;min-height:1.25em">${v?esc(v):''}</span></div>`;
const lfNm=(d,a,b)=>[lfv(d,a),lfv(d,b)].filter(Boolean).join(', ');
const lfBrn=()=>{const o=office(S.lf.office);return esc(o?(o.nameBn||o.name):'')};
const lfWd=v=>{const w=lfWords(parseFloat(v));return w?w:''};
/* ---- Annexure-Ka / Kha / Ga: exact A4 layouts (one page each) following the circular's forms ---- */
const lfFf=(v,w)=>`<span class="lff" style="min-width:${w}mm">${v?esc(v):'&nbsp;'}</span>`;
function lfBr(){const o=office(S.lf.office),n=o?(o.nameBn||o.name):'';const m=n.match(/^(.*?)\s*শাখা(?:\s*,\s*(.*))?$/);return m?{b:m[1],a:m[2]||''}:{b:n,a:''}}
const lfPage=(inner,pad)=>`<div class="lfpage" style="padding:${pad}"><div class="lfin">${inner}</div></div>`;
function lfFit(html){   // shrink a page slightly if a long entry would push it past one A4 page
  const h=document.createElement('div');h.className='lfpdfhost';h.innerHTML=html;document.body.appendChild(h);
  const pg=h.firstElementChild,inn=pg.querySelector('.lfin');const avail=pg.clientHeight-parseFloat(getComputedStyle(pg).paddingTop)-4;
  let z=1;while(inn.offsetHeight*z>avail&&z>0.55){z-=0.02;inn.style.transform='scale('+z.toFixed(2)+')';inn.style.width=(100/z).toFixed(2)+'%';inn.style.transformOrigin='top left';inn.style.height=(inn.scrollHeight)+'px'}
  const out=pg.outerHTML;h.remove();return out;
}
const lfK=(lab,val)=>`<div class="kl"><span class="kb">${lab}</span><span class="kc">:</span><span class="kf">${val?esc(val):''}</span></div>`;
const lfKR=(a,b)=>`<div class="kl kr">${a.map(([l,v,g])=>`<span class="kn" style="${g?'flex:0 0 '+g+'mm':''}">${l} :</span><span class="kf">${v?esc(v):''}</span>`).join('')}</div>`;
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
