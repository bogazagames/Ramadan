'use strict';
/**
 * مغامرة الصائم الصغير
 * Refactor: فصل CSS/JS عن HTML + تنظيم نقاط الدخول + حماية النطاق العام
 * ملاحظة: الكود الأصلي كان داخل index.html — تم نقله كما هو مع أقل تغييرات سلوكية.
 */
(function(){
// ============================================================
// CONSTANTS
// ============================================================
const AVATAR_GROUPS = [
  {label:'أولاد 👦', avs:['👦','🧒','👲','🤴','🧑','🦸','🧙','🥷','🏋️','🤸','🧗','🏃','🧑‍🚀','🧑‍🔬','🧑‍🎓','🧑‍🏫','🧑‍🍳','🧑‍🎨','🦊','🐯']},
  {label:'بنات 👧', avs:['👧','🧒‍♀️','👸','🧕','🦸‍♀️','🧙‍♀️','🥷','🌸','🌺','🌻','🌼','🦋','🧑‍🎓','🧑‍🏫','🧑‍🍳','🧑‍🎨','🧑‍🚀','🧑‍🔬','🦄','🐱']},
  {label:'رمضان 🌙', avs:['🌙','⭐','🕌','🪔','📖','🤲','🌟','🏮','🕯️','🌸','🌙','☪️','📿','🎴','🌠','🌌','🏔️','🌊','🌈','🦅']},
  {label:'حيوانات 🐾', avs:['🐯','🦁','🐻','🐼','🐨','🦊','🐺','🦋','🦅','🦉','🐬','🦈','🐲','🦄','🦒','🐘','🦓','🦏','🦛','🦬']},
  {label:'رياضة ⚽', avs:['⚽','🏀','🎾','🏊','🤼','🧗','🏇','🥊','🎯','🏆','🎮','🎲','🛹','🏄','🏂','🤺','🥋','🎿','🏌️','🧘']},
  {label:'أشياء مميزة ✨', avs:['🚀','💎','🔮','🎩','🦄','🌈','⚡','❄️','🔥','💡','🏰','🗺️','🎸','🎻','🎺','🎹','🎨','📸','🔭','🌍']}
];
const HEROES = [
  {id:'princess',  name:'الأميرة الصابرة',  icon:'👸',  desc:'صبورة وكريمة'},
  {id:'lantern_g', name:'حاملة الفانوس',    icon:'🏮',  desc:'تضيء الطريق'},
  {id:'reader_g',  name:'قارئة القرآن',     icon:'📖',  desc:'تحفظ وتتعلم'},
  {id:'helper_g',  name:'المساعِدة الكريمة',icon:'🤝',  desc:'دائماً تساعد'},
  {id:'star_g',    name:'نجمة رمضان',       icon:'🌟',  desc:'مشرقة ومبهجة'},
  {id:'explorer',  name:'المستكشف',         icon:'🗺️',  desc:'يحب التعلم'},
  {id:'lantern_b', name:'حامل الفانوس',     icon:'🕯️',  desc:'ينير الطريق'},
  {id:'astronaut', name:'رائد الفضاء',      icon:'🚀',  desc:'يصل للنجوم'},
  {id:'scientist', name:'العالِم الصغير',   icon:'🔬',  desc:'ذكي ومجتهد'},
  {id:'reader_b',  name:'حافظ القرآن',      icon:'📚',  desc:'يحفظ ويتعلم'}
];
const COLORS = ['#f0b429','#38c9b0','#e85d75','#9b59b6','#3498db','#e67e22','#2ecc71','#e74c3c','#1abc9c','#f39c12','#c0006a','#1a6b00','#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#20c997','#f06595','#74c0fc','#a9e34b','#ff8787','#845ef7','#339af0','#51cf66','#ff6348','#2f9e44','#1971c2','#862e9c','#c92a2a','#5c7cfa','#0ca678','#f76707'];
const LEVELS = [{name:'مبتدئ 🌱',t:0},{name:'شجاع ⭐',t:200},{name:'بطل 🏆',t:500},{name:'أسطورة 👑',t:1000},{name:'رمضاني 🌙',t:2000}];
const GOOD_DEEDS = [
  {id:'quran', name:'قرأت القرآن',     icon:'📖', pts:20, needsApproval:true},
  {id:'pray',  name:'صليت الجماعة',   icon:'🕌', pts:25, needsApproval:true},
  {id:'suhoor',name:'أكلت السحور',    icon:'🌙', pts:15, needsApproval:true},
  {id:'helped',name:'ساعدت أحداً',    icon:'🤝', pts:15, needsApproval:true},
  {id:'study', name:'ذاكرت دروسي',    icon:'📚', pts:20, needsApproval:true},
  {id:'listen',name:'أطعت والديّ',    icon:'❤️', pts:20, needsApproval:true},
  {id:'cook',  name:'ساعدت بالطبخ',   icon:'🍳', pts:20, needsApproval:true},
  {id:'clean', name:'نظّفت البيت',    icon:'🧹', pts:15, needsApproval:true}
];
const BAD_DEEDS_PRESET = [
  {id:'b1', name:'شجار مع الإخوة',    pts:-20},
  {id:'b2', name:'عدم الاستماع للوالدين', pts:-25},
  {id:'b3', name:'الكذب',             pts:-30},
  {id:'b4', name:'ترك الصلاة',        pts:-40},
  {id:'b5', name:'الإساءة للآخرين',   pts:-25},
  {id:'b6', name:'إهدار الطعام',      pts:-15},
  {id:'b7', name:'إهمال الواجب',      pts:-20},
  {id:'b8', name:'الغضب الشديد',      pts:-15},
  {id:'b9', name:'اللعب بالجوال وقت الدراسة', pts:-20},
  {id:'b10',name:'التأخر عن وقت النوم', pts:-10},
  {id:'b11',name:'عدم ترتيب الغرفة',  pts:-10},
  {id:'b12',name:'التنمر على زميل',   pts:-35},
  {id:'b13',name:'الإسراف في الماء',  pts:-10},
  {id:'b14',name:'رفع الصوت بشكل سيء', pts:-15},
  {id:'b15',name:'كسر شيء عمداً',    pts:-25}
];
const QUESTS = [
  {id:'q1',text:'اشرب ماء كافياً في السحور 💧',pts:10},
  {id:'q2',text:'ساعد أحد أفراد العائلة 🤝',pts:15},
  {id:'q3',text:'اقرأ آية أو أكثر من القرآن 📖',pts:15},
  {id:'q4',text:'صلِّ الفجر في وقته 🌅',pts:20},
  {id:'q5',text:'ابتسم في وجه شخص واحد على الأقل 😊',pts:10},
  {id:'q6',text:'قل الحمد لله عشر مرات 🤲',pts:10},
  {id:'q7',text:'تجنب الشجار مع إخوتك 🕊️',pts:20}
];
const SHOP_ITEMS = [
  // ═══ زينة الملف الشخصي ═══
  {id:'lantern',   name:'فانوس رمضان',    icon:'🏮', cat:'زينة',  desc:'يُزيّن ملفك الشخصي',          price:80},
  {id:'crown',     name:'تاج الأبطال',    icon:'👑', cat:'زينة',  desc:'للأبطال الحقيقيين فقط',         price:350},
  {id:'star_badge',name:'شارة النجمة',    icon:'⭐', cat:'زينة',  desc:'تظهر بجانب اسمك',              price:120},
  {id:'fire_badge',name:'شارة النار',     icon:'🔥', cat:'زينة',  desc:'للصائمين الشجعان',             price:150},
  {id:'diamond',   name:'شارة الماسة',    icon:'💎', cat:'زينة',  desc:'أرقى الشارات',                 price:500},
  {id:'rainbow',   name:'قوس قزح',        icon:'🌈', cat:'زينة',  desc:'ألوان جميلة على ملفك',          price:200},
  {id:'moon_frame',name:'إطار القمر',     icon:'🌙', cat:'زينة',  desc:'إطار رمضاني فضي',              price:180},
  {id:'wings',     name:'أجنحة الملاك',   icon:'🕊️', cat:'زينة',  desc:'لمن قلبه أبيض',               price:300},
  // ═══ مكافآت النقاط ═══
  {id:'dates',     name:'طبق التمر',      icon:'🌴', cat:'نقاط',  desc:'+ 30 نقطة مكافأة',            price:100},
  {id:'honey',     name:'جرّة العسل',     icon:'🍯', cat:'نقاط',  desc:'+ 50 نقطة حلوة',              price:160},
  {id:'x2',        name:'نقاط مضاعفة',   icon:'⚡', cat:'نقاط',  desc:'ضاعف نقاطك ليوم كامل',         price:350},
  {id:'x3',        name:'نقاط ثلاثية',   icon:'🚀', cat:'نقاط',  desc:'ثلاثة أضعاف النقاط ليوم',      price:700},
  {id:'treasure',  name:'صندوق الكنز',   icon:'💰', cat:'نقاط',  desc:'+ 100 نقطة دفعة واحدة',        price:280},
  {id:'gem_bonus', name:'مكافأة الجواهر', icon:'💎', cat:'نقاط',  desc:'+ 15 جوهرة مجانية',           price:200},
  // ═══ قوى خاصة ═══
  {id:'grace',     name:'درع الحماية',    icon:'🛡️', cat:'قوى',  desc:'يحمي يوماً صعباً',             price:250},
  {id:'chest',     name:'صندوق مفاجأة',  icon:'🎁', cat:'قوى',  desc:'هدية عشوائية مذهلة!',          price:150},
  {id:'time_ext',  name:'تمديد المسابقة', icon:'⏰', cat:'قوى',  desc:'وقت إضافي للإجابة',            price:200},
  {id:'hint',      name:'قلب المساعدة',   icon:'💡', cat:'قوى',  desc:'مساعدة في سؤال صعب',           price:180},
  {id:'revive',    name:'حياة إضافية',    icon:'❤️', cat:'قوى',  desc:'ارجع لسؤال فاتك',              price:300},
  {id:'skip',      name:'تخطّي سؤال',     icon:'⏭️', cat:'قوى',  desc:'تخطّى سؤالاً صعباً',          price:220},
  // ═══ اكسسوارات الشخصية ═══
  {id:'hat',       name:'قبعة الساحر',    icon:'🎩', cat:'أكسسوار', desc:'تظهر فوق صورتك',            price:160},
  {id:'sunglasses',name:'نظارة شمسية',   icon:'😎', cat:'أكسسوار', desc:'كل شيء أحلى بنظارة',         price:140},
  {id:'cape',      name:'عباءة البطل',    icon:'🦸', cat:'أكسسوار', desc:'ارتدِ عباءة البطل',          price:280},
  {id:'sword',     name:'سيف الشجاعة',   icon:'⚔️', cat:'أكسسوار', desc:'للمحاربين الصغار',           price:320},
  {id:'wand',      name:'عصا السحر',      icon:'🪄', cat:'أكسسوار', desc:'اصنع السحر كل يوم',          price:260},
  {id:'compass',   name:'البوصلة',        icon:'🧭', cat:'أكسسوار', desc:'للمستكشفين الشجعان',         price:190},
  // ═══ ألقاب شرفية ═══
  {id:'title_hero',name:'لقب: البطل',     icon:'🏆', cat:'لقب',  desc:'يظهر اسمك: البطل [اسمك]',       price:400},
  {id:'title_star',name:'لقب: نجم',       icon:'🌟', cat:'لقب',  desc:'يظهر اسمك: نجم [اسمك]',         price:300},
  {id:'title_king',name:'لقب: الملك',     icon:'👑', cat:'لقب',  desc:'يظهر اسمك: ملك [اسمك]',         price:600},
  {id:'title_wise',name:'لقب: الحكيم',    icon:'🦉', cat:'لقب',  desc:'يظهر اسمك: الحكيم [اسمك]',      price:350},
  {id:'title_light',name:'لقب: نور',      icon:'💡', cat:'لقب',  desc:'يظهر اسمك: نور [اسمك]',         price:280},
  // ═══ مقتنيات رمضان ═══
  {id:'quran_gift',name:'مصحف ذهبي',     icon:'📖', cat:'رمضان', desc:'مقتنى رمضاني نادر',            price:450},
  {id:'prayer_mat',name:'سجادة الصلاة',  icon:'🕌', cat:'رمضان', desc:'رمز التقوى والإيمان',           price:380},
  {id:'ramadan_lamp',name:'مصباح السحر', icon:'🪔', cat:'رمضان', desc:'أضيء رمضانك',                  price:220},
  {id:'moon_medal',name:'وسام القمر',    icon:'🌙', cat:'رمضان', desc:'جائزة الصائم المثابر',          price:500},
];
const JOURNEY = [
  {id:'start',   name:'البداية',      icon:'🏡', req:0},
  {id:'village', name:'القرية',       icon:'🌳', req:100},
  {id:'desert',  name:'الصحراء',     icon:'🏜️', req:300},
  {id:'mountain',name:'الجبل',       icon:'⛰️', req:600},
  {id:'mosque',  name:'المسجد',      icon:'🕌', req:1000},
  {id:'stars',   name:'النجوم',      icon:'⭐', req:1500},
  {id:'moon',    name:'القمر',       icon:'🌙', req:2000}
];
const ACHIEVEMENTS = [
  {id:'first',    name:'أول صيام',    icon:'🌟', desc:'أتممت أول يوم'},
  {id:'s3',       name:'3 أيام',      icon:'🔥', desc:'3 أيام متتالية'},
  {id:'s7',       name:'أسبوع كامل', icon:'💪', desc:'7 أيام متتالية'},
  {id:'s14',      name:'نصف شهر',    icon:'🏆', desc:'14 يوماً متتالياً'},
  {id:'pts500',   name:'500 نقطة',   icon:'💎', desc:'مجموع 500 نقطة'},
  {id:'pts1000',  name:'ألف نقطة',   icon:'👑', desc:'مجموع 1000 نقطة'},
  {id:'allDeeds', name:'يوم كامل',   icon:'🌸', desc:'أكمل كل الأعمال في يوم'},
  {id:'allQuests',name:'مهام مكتملة',icon:'📋', desc:'أكمل كل مهام اليوم'},
  {id:'quizPerf', name:'نجم المسابقة',icon:'🎯',desc:'10/10 في المسابقة'}
];
const THEMES = [
  {id:'night', icon:'🌙', label:'الليل',  cls:'t-night'},
  {id:'day',   icon:'☀️', label:'النهار', cls:'t-day'},
  {id:'girls', icon:'🌸', label:'البنات', cls:'t-girls'},
  {id:'boys',  icon:'🌿', label:'الأولاد',cls:'t-boys'}
];
const FALLBACK_TT = [
  {dateISO:'2026-02-18',ramadanDay:1,weekdayAr:'الأربعاء',fajr:'04:49',dhuhr:'11:49',asr:'15:05',maghrib:'17:32'},
  {dateISO:'2026-02-19',ramadanDay:2,weekdayAr:'الخميس',fajr:'04:48',dhuhr:'11:49',asr:'15:05',maghrib:'17:33'},
  {dateISO:'2026-02-20',ramadanDay:3,weekdayAr:'الجمعة',fajr:'04:47',dhuhr:'11:49',asr:'15:05',maghrib:'17:34'},
  {dateISO:'2026-02-21',ramadanDay:4,weekdayAr:'السبت',fajr:'04:47',dhuhr:'11:49',asr:'15:06',maghrib:'17:34'},
  {dateISO:'2026-02-22',ramadanDay:5,weekdayAr:'الأحد',fajr:'04:46',dhuhr:'11:48',asr:'15:06',maghrib:'17:35'},
  {dateISO:'2026-02-23',ramadanDay:6,weekdayAr:'الاثنين',fajr:'04:45',dhuhr:'11:48',asr:'15:06',maghrib:'17:35'},
  {dateISO:'2026-02-24',ramadanDay:7,weekdayAr:'الثلاثاء',fajr:'04:44',dhuhr:'11:48',asr:'15:06',maghrib:'17:36'},
  {dateISO:'2026-02-25',ramadanDay:8,weekdayAr:'الأربعاء',fajr:'04:43',dhuhr:'11:48',asr:'15:07',maghrib:'17:37'},
  {dateISO:'2026-02-26',ramadanDay:9,weekdayAr:'الخميس',fajr:'04:42',dhuhr:'11:47',asr:'15:07',maghrib:'17:37'},
  {dateISO:'2026-02-27',ramadanDay:10,weekdayAr:'الجمعة',fajr:'04:41',dhuhr:'11:47',asr:'15:07',maghrib:'17:38'}
];

// ============================================================
// STATE
// ============================================================
let STATE = {
  profiles:[],currentId:null,timetable:[],
  ramadanDays:30,eidConfirmed:false,eidModalShown:false,
  quizQuestions:[],customQuestions:[],
  theme:'night',
  familyCode:'',rewards:[],
  badDeeds: BAD_DEEDS_PRESET,
  schemaVersion: 2
};
let timerInterval=null, notifGranted=false, installPrompt=null;
let setupData={name:'',age:8,avatar:'🌙',hero:'explorer',color:'#f0b429',diff:'easy'};
let setupStep=0, avatarGroupIdx=0;
let selectedFastingReason=null;
let selectedRewardPreset=null;
// QZ — quiz state, must be declared at top level
let QZ={active:false,qs:[],cur:0,score:0,answers:[],profileId:null,date:null,saved:null,_targetDate:null,_ramadanDay:null};

// ============================================================
// CONTRAST HELPER — auto dark/light text on any bg color
// ============================================================
function hexLuminance(hex){
  hex=hex.replace('#','');
  if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  const r=parseInt(hex.slice(0,2),16)/255;
  const g=parseInt(hex.slice(2,4),16)/255;
  const b=parseInt(hex.slice(4,6),16)/255;
  const toL=c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);
  return 0.2126*toL(r)+0.7152*toL(g)+0.0722*toL(b);
}
function contrastColor(hex){
  try{return hexLuminance(hex)>0.35?'#1a1000':'#f0e6d3';}
  catch(e){return'#f0e6d3';}
}
// Call this on any element that has a dynamic/custom background hex
function applyAutoContrast(el,bgHex){
  if(!el||!bgHex)return;
  el.style.color=contrastColor(bgHex);

// Basic HTML escape for safe innerHTML rendering (simple)
function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
}

// ============================================================
// SESSION — currentId is DEVICE-LOCAL ONLY, never synced to Supabase
// Each device keeps its own active profile independently
// ============================================================
const SESSION_KEY='lfa_session_id';
function getLocalSession(){return localStorage.getItem(SESSION_KEY)||null}
function setLocalSession(id){
  if(id)localStorage.setItem(SESSION_KEY,id);
  else localStorage.removeItem(SESSION_KEY);
}

// THEME — per-profile, stored in localStorage only, NEVER synced to Supabase
// Each child picks their own theme on their own device
function getProfileTheme(profileId){
  if(profileId){const t=localStorage.getItem('lfa_theme_'+profileId);if(t)return t;}
  return localStorage.getItem('lfa_theme_global')||'night';
}
function setProfileTheme(profileId,t){
  if(profileId)localStorage.setItem('lfa_theme_'+profileId,t);
  localStorage.setItem('lfa_theme_global',t);
}
// Load and apply the theme for the current profile on this device
function loadProfileTheme(){
  const t=getProfileTheme(STATE.currentId);
  document.body.setAttribute('data-theme',t);
}

// ============================================================
// SUPABASE — Real-time sync between all family devices
// ============================================================
const SB_URL  = 'https://srcveyrtcfsceqwryzxf.supabase.co';
const SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyY3ZleXJ0Y2ZzY2Vxd3J5enhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTM0OTcsImV4cCI6MjA4Njk4OTQ5N30.adG7hF4z46KIs3T8A8ahCuYs1w7jR92fIGYcttCaVY8';
let SB = null;
try { SB = supabase.createClient(SB_URL, SB_KEY); } catch(e){ console.warn('Supabase init failed', e); }

// ── LOCAL fallback ──────────────────────────────────────────
function saveLocal(){ try{ localStorage.setItem('lfa5', JSON.stringify(STATE)); }catch(e){} }
function loadLocal(){
  try{
    const d = localStorage.getItem('lfa5');
    if(d) mergeState(JSON.parse(d));
    else { const d4=localStorage.getItem('lfa4'); if(d4) mergeState(JSON.parse(d4)); }
  }catch(e){}
}

// ── Push this device's STATE to Supabase ───────────────────
// One row per family in `families` table: { family_code, state_json }
let _saveTimer = null;
async function save(){
  // Always persist currentId locally only
  setLocalSession(STATE.currentId);
  saveLocal();
  if(!SB || !STATE.familyCode) return;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async()=>{
    beginBusy();
    try{
      // NEVER upload currentId or theme — both are per-device
      const {currentId:_cid, theme:_th, ...stateToSync} = STATE;
      await SB.from('families').upsert({
        family_code: STATE.familyCode,
        state_json:  JSON.stringify(stateToSync),
        updated_at:  new Date().toISOString()
      }, { onConflict: 'family_code' });
      showSyncDot();
    }catch(e){ console.warn('Supabase save error', e); }
    finally{ endBusy(); }
  }, 800);
}

// ── Pull family state from Supabase ────────────────────────
async function load(){
  loadLocal();
  // Always restore THIS device's local-only values first
  const localId = getLocalSession();
  if(localId) STATE.currentId = localId;

  if(!SB || !STATE.familyCode) return;
  try{
    const { data, error } = await SB
      .from('families')
      .select('state_json')
      .eq('family_code', STATE.familyCode)
      .single();
    if(data && data.state_json){
      const remote = JSON.parse(data.state_json);
      mergeState(remote);
      // CRITICAL: always restore device-local values after any remote merge
      STATE.currentId = localId || STATE.currentId;
      // Theme is per-device — reload from localStorage
      loadProfileTheme();
      saveLocal();
      showSyncDot();
    }
  }catch(e){ console.warn('Supabase load error', e); }
}

// ── Join a family by code (child device) ───────────────────
async function joinFamily(code){
  if(!SB){ console.warn('Supabase not initialized'); return false; }
  const c = code.trim().toUpperCase();
  try{
    // maybeSingle() returns null instead of throwing when no row found
    const { data, error } = await SB
      .from('families')
      .select('state_json')
      .eq('family_code', c)
      .maybeSingle();
    console.log('joinFamily result:', {data, error, code: c});
    if(error){ console.warn('Supabase joinFamily error:', error); return false; }
    if(!data){ console.warn('No family found for code:', c); return false; }
    const remote = JSON.parse(data.state_json);
    STATE.familyCode = c;
    // Merge profiles: keep own IDs, add others from family for leaderboard
    const myIds = STATE.profiles.map(p=>p.id);
    (remote.profiles||[]).forEach(rp=>{
      if(!myIds.includes(rp.id)) STATE.profiles.push(rp);
    });
    // Adopt family settings
    if(remote.rewards) STATE.rewards = remote.rewards;
    if(remote.customQuestions) STATE.customQuestions = remote.customQuestions;
    // CRITICAL: never override this device's current session
    const localId = getLocalSession();
    if(localId) STATE.currentId = localId;
    saveLocal();
    await save();
    return true;
  }catch(e){
    console.error('joinFamily exception:', e);
    return false;
  }
}

// ── Real-time subscription: listen for family updates ──────
let _realtimeSub = null;
async function subscribeToFamily(){
  if(!SB || !STATE.familyCode || _realtimeSub) return;
  _realtimeSub = SB
    .channel('family_' + STATE.familyCode)
    .on('postgres_changes',{
      event: 'UPDATE',
      schema: 'public',
      table: 'families',
      filter: `family_code=eq.${STATE.familyCode}`
    }, async payload => {
      if(payload.new && payload.new.state_json){
        const remote = JSON.parse(payload.new.state_json);
        const localId = getLocalSession();
        mergeState(remote);
        // Restore device-local values — never let remote override
        STATE.currentId = localId || STATE.currentId;
        loadProfileTheme();
        saveLocal();
        showSyncDot();
        refreshCurrentScreen();
      }
    })
    .subscribe();
}

function refreshCurrentScreen(){
  const sc = document.querySelector('.screen.active');
  if(!sc) return;
  const sid = sc.id.replace('screen-','');
  const map = {home:renderHome, progress:renderProgress, shop:renderShop, profiles:renderProfiles, parent:renderParentChildren};
  if(map[sid]) map[sid]();
}

// ── Test Supabase connection & push family code ────────────
async function testConnection(){
  const el = document.getElementById('supabase-status');
  if(el) el.innerHTML = '⏳ جارٍ الاختبار...';
  if(!SB){
    if(el) el.innerHTML = '❌ Supabase غير مُهيَّأ';
    return;
  }
  try{
    // Try to upsert current family row
    const { error } = await SB.from('families').upsert({
      family_code: STATE.familyCode,
      state_json: JSON.stringify(STATE),
      updated_at: new Date().toISOString()
    },{onConflict:'family_code'});
    if(error){
      console.error('testConnection error:', error);
      if(el) el.innerHTML = `❌ خطأ: ${error.message}`;
      toast('❌ تعذّر الاتصال بـ Supabase');
    } else {
      if(el) el.innerHTML = '✅ متصل بـ Supabase — الرمز محفوظ على السحابة';
      toast('✅ الاتصال يعمل! الرمز جاهز للمشاركة');
      subscribeToFamily();
    }
  }catch(e){
    console.error('testConnection exception:', e);
    if(el) el.innerHTML = `❌ ${e.message}`;
  }
}
function showSyncDot(){
  const el=document.getElementById('sync-indicator');
  if(el){el.classList.add('syncing');setTimeout(()=>el.classList.remove('syncing'),800)}
}


// ── UI Busy Lock (prevent multi-taps while syncing) ─────────
let _busyCount=0;
function beginBusy(){
  _busyCount++;
  document.body.classList.add('is-busy');
}
function endBusy(){
  _busyCount=Math.max(0,_busyCount-1);
  if(_busyCount===0) document.body.classList.remove('is-busy');
}

// ── Multi-tab BroadcastChannel (same device) ───────────────
let _bc=null;try{_bc=new BroadcastChannel('lfa_sync')}catch(e){}
function broadcastSync(){if(_bc)try{_bc.postMessage({t:'upd',ts:Date.now()})}catch(e){}}
if(_bc)_bc.onmessage=async(e)=>{
  if(e.data&&e.data.t==='upd'){
    await load(); showSyncDot(); refreshCurrentScreen();
  }
};
window.addEventListener('storage',async e=>{if(e.key==='lfa5'){loadLocal();showSyncDot();}});

// ── State helpers ──────────────────────────────────────────
function mergeState(loaded){
  if(!loaded||typeof loaded!=='object')return;
  STATE=Object.assign({...STATE},loaded);
  if(!STATE.badDeeds||!STATE.badDeeds.length)STATE.badDeeds=BAD_DEEDS_PRESET;
  STATE.profiles.forEach(p=>{
    if(p.gems===undefined)p.gems=Math.floor((p.points||0)*0.3);
    if(p.competitionPoints===undefined)p.competitionPoints=p.points||0;
  });
}
function prf(){return STATE.profiles.find(p=>p.id===STATE.currentId)||null}
function todayISO(){return new Date().toISOString().split('T')[0]}
function todayTT(){return STATE.timetable.find(d=>d.dateISO===todayISO())||STATE.timetable[0]||null}
function dayLog(p,date){if(!p.logs)p.logs={};const d=date||todayISO();if(!p.logs[d])p.logs[d]={targetReached:false,maghribReached:false,deeds:[],pendingDeeds:[],quests:[],pts:0,quizDone:false,quizScore:0,badDeeds:[]};return p.logs[d]}
function getLevel(pts){return LEVELS.slice().reverse().find(l=>pts>=l.t)||LEVELS[0]}
function getNextLevel(pts){return LEVELS.find(l=>pts<l.t)||null}
function parseT(str,date){const[h,m]=str.split(':').map(Number);const b=new Date(date+'T00:00:00');b.setHours(h,m,0,0);return b}
function fmtTime(ms){if(ms<=0)return '00:00:00';const s=Math.floor(ms/1000);return[Math.floor(s/3600),Math.floor((s%3600)/60),s%60].map(x=>String(x).padStart(2,'0')).join(':')}

// ============================================================
// THEME
// ============================================================
function applyTheme(t){
  if(!['night','day','girls','boys'].includes(t))t='night';
  document.body.setAttribute('data-theme',t);
  // Store per-profile in localStorage — NEVER synced to Supabase
  setProfileTheme(STATE.currentId,t);
  renderAllThemeGrids();
}
function renderAllThemeGrids(){
  const t=STATE.theme;
  ['theme-grid-parent','theme-grid-modal','theme-grid-main'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    el.innerHTML=THEMES.map(th=>`<button class="theme-btn ${th.cls}${t===th.id?' active':''}" data-t="${th.id}"><span style="font-size:1.4rem">${th.icon}</span><span>${th.label}</span></button>`).join('');
    el.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>applyTheme(b.dataset.t)));
  });
}

// ============================================================
// NAVIGATION
// ============================================================
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const sc=document.getElementById('screen-'+id);if(sc)sc.classList.add('active');
  const navIds=['home','progress','shop','profiles','themes'];
  const nav=document.getElementById('nav');
  if(navIds.includes(id)){nav.classList.add('show');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.s===id))}
  else nav.classList.remove('show');
  const renders={home:renderHome,progress:renderProgress,shop:renderShop,profiles:renderProfiles,certificate:renderCertificate,parent:renderParent,themes:()=>renderAllThemeGrids(),
    quiz:()=>{
      const p=prf();if(!p)return;
      const map=document.getElementById('quiz-path-map');
      const qc=document.getElementById('quiz-container');
      if(QZ.active){
        // Mid-quiz: hide map, show questions
        if(map)map.style.display='none';
        if(qc)qc.style.display='';
        renderQuizQ();
        return;
      }
      // Show map, hide quiz-container
      if(map){map.style.display='';}
      if(qc){qc.style.display='none';qc.innerHTML='';}
      renderQuizPath(p);
    }
  };
  if(renders[id])renders[id]();
}

// ============================================================
// DATA LOAD
// ============================================================
async function loadTT(){
  try{const r=await fetch('./data.json');const d=await r.json();if(Array.isArray(d)&&d.length){STATE.timetable=d;save();return}}catch{}
  STATE.timetable=FALLBACK_TT;
}
async function loadQuiz(){
  if(STATE.quizQuestions&&STATE.quizQuestions.length>10)return;
  try{
    const r=await fetch('./questions.json');
    const d=await r.json();
    if(Array.isArray(d)&&d.length){
      // Normalize: add diff field based on points if missing
      STATE.quizQuestions=d.map(q=>({
        ...q,
        diff: q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard')
      }));
      save();
    }
  }catch(e){console.warn('loadQuiz error',e)}
}

// ============================================================
// SETUP
// ============================================================
function initSetup(){
  setupStep=0;avatarGroupIdx=0;
  setupData={name:'',age:8,avatar:'🌙',hero:'reader_b',color:'#f0b429',diff:'easy'};
  buildAvatarTabs();renderAvatarGrid();buildColorGrid();buildHeroGrid();
  document.querySelectorAll('.diff-btn').forEach(b=>{b.classList.toggle('selected',b.dataset.d==='easy');b.addEventListener('click',()=>{setupData.diff=b.dataset.d;document.querySelectorAll('.diff-btn').forEach(x=>x.classList.toggle('selected',x===b))})});
  ['d','a','m'].forEach(id=>{const sl=document.getElementById('sl-'+id);if(sl)sl.addEventListener('input',()=>onSlider(id))});
  showStep(0);
}
function showStep(n){document.querySelectorAll('.setup-step').forEach(s=>s.classList.remove('active'));const el=document.querySelector(`.setup-step[data-step="${n}"]`);if(el)el.classList.add('active');setupStep=n}
function buildAvatarTabs(){
  const el=document.getElementById('av-tabs');
  el.innerHTML=AVATAR_GROUPS.map((g,i)=>`<button class="avatar-tab${i===0?' active':''}" data-gi="${i}">${g.label}</button>`).join('');
  el.querySelectorAll('.avatar-tab').forEach(t=>t.addEventListener('click',()=>{avatarGroupIdx=parseInt(t.dataset.gi);el.querySelectorAll('.avatar-tab').forEach(x=>x.classList.toggle('active',x===t));renderAvatarGrid()}));
}
function renderAvatarGrid(){
  const g=AVATAR_GROUPS[avatarGroupIdx];const el=document.getElementById('av-grid');
  el.innerHTML=g.avs.map(a=>`<button class="av-btn${setupData.avatar===a?' selected':''}" data-a="${a}">${a}</button>`).join('');
  el.querySelectorAll('.av-btn').forEach(b=>b.addEventListener('click',()=>{setupData.avatar=b.dataset.a;el.querySelectorAll('.av-btn').forEach(x=>x.classList.toggle('selected',x===b))}));
}
function buildColorGrid(){
  const el=document.getElementById('col-grid');
  el.innerHTML=COLORS.map(c=>`<div class="color-sw${setupData.color===c?' selected':''}" data-c="${c}" style="background:${c}"></div>`).join('');
  el.querySelectorAll('.color-sw').forEach(s=>{
    applyAutoContrast(s, s.dataset.c);
    s.addEventListener('click',()=>{
      setupData.color=s.dataset.c;
      el.querySelectorAll('.color-sw').forEach(x=>x.classList.toggle('selected',x===s));
    });
  });
}
function buildHeroGrid(){
  const el=document.getElementById('hero-grid');
  el.innerHTML=HEROES.map(h=>`<div class="hero-btn${setupData.hero===h.id?' selected':''}" data-hid="${h.id}"><div class="hero-icon">${h.icon}</div><div class="bold text-sm" style="margin-top:4px">${h.name}</div><div class="text-xs text-muted">${h.desc}</div></div>`).join('');
  el.querySelectorAll('.hero-btn').forEach(b=>b.addEventListener('click',()=>{setupData.hero=b.dataset.hid;el.querySelectorAll('.hero-btn').forEach(x=>x.classList.toggle('selected',x===b))}));
}
function onSlider(changed){
  const total=STATE.ramadanDays||30;const ids=['d','a','m'];const vals={};
  ids.forEach(id=>{vals[id]=parseInt(document.getElementById('sl-'+id)?.value||0)});
  const sum=vals.d+vals.a+vals.m;
  if(sum>total){const others=ids.filter(i=>i!==changed);let ex=sum-total;for(const id of others){const r=Math.min(vals[id],ex);vals[id]-=r;ex-=r;const el=document.getElementById('sl-'+id);if(el)el.value=vals[id];if(ex<=0)break}}
  ids.forEach(id=>{const lbl=document.getElementById('lbl-'+['d','a','m'].includes(id)?id:id);if(lbl)lbl.textContent=vals[id]+' يوم'});
  const s2=vals.d+vals.a+vals.m;const info=document.getElementById('total-info');if(info)info.textContent=`✅ المجموع: ${s2} من أصل ${total} يوماً`;
}
function genPlan(age,diff){
  const total=STATE.ramadanDays||30;let b;
  if(diff==='easy')b={d:15,a:10,m:5};else if(diff==='normal')b={d:0,a:15,m:15};else b={d:0,a:0,m:30};
  if(age<=7&&diff!=='easy')b={d:15,a:10,m:5};else if(age<=9&&diff==='hero')b={d:0,a:15,m:15};
  const sum=b.d+b.a+b.m;if(sum<total)b.m+=total-sum;
  return{dhuhrDays:Math.max(0,b.d),asrDays:Math.max(0,b.a),maghribDays:Math.max(0,b.m)};
}
async function createProfile(){
  const plan={dhuhrDays:parseInt(document.getElementById('sl-d')?.value||15),asrDays:parseInt(document.getElementById('sl-a')?.value||10),maghribDays:parseInt(document.getElementById('sl-m')?.value||5)};
  const p={id:Date.now().toString(),name:setupData.name,age:setupData.age,avatar:setupData.avatar,hero:setupData.hero,color:setupData.color,diff:setupData.diff,plan,
    points:0,gems:0,competitionPoints:0,
    streak:0,maxStreak:0,graceTokens:3,achievements:[],seenQuestions:[],logs:{},inventory:[],activityLog:[]};
  STATE.profiles.push(p);
  STATE.currentId=p.id;
  setLocalSession(p.id);
  loadProfileTheme(); // apply default theme for new profile
  save();
  // إذا أدخل الطفل رمز العائلة: حاول الربط تلقائياً
  const fam=(setupData.familyCode||'').trim().toUpperCase();
  if(fam && fam!==STATE.familyCode){
    try{
      const ok=await joinFamily(fam);
      if(ok){
        toast('✅ تم ربطك بالعائلة! 🎉');
        await subscribeToFamily();
      } else {
        toast('⚠️ لم يتم العثور على العائلة — يمكنك المتابعة بدون ربط');
      }
    } catch(e){
      console.warn(e);
      toast('⚠️ تعذر الربط حالياً — يمكنك المتابعة');
    }
  }
  save();
  showScreen('home');startTimers();toast('🎉 أهلاً '+p.name+'! رمضان مبارك!');
}

// ============================================================
// HOME
// ============================================================
function renderHome(){
  const p=prf();const td=todayTT();if(!p||!td)return;
  const log=dayLog(p);
  document.getElementById('h-av').textContent=p.avatar;
  document.getElementById('h-name').textContent=p.name;
  document.getElementById('h-day').textContent='يوم '+td.ramadanDay;
  document.getElementById('h-greet').textContent=td.weekdayAr+' — '+td.ramadanDay+' رمضان';
  renderStatusCard(p,log,td);renderDeeds(p,log);renderQuests(log);renderBadDeeds(p,log);
  // المسابقة تفتح تلقائياً من بداية اليوم 00:00
  const qEl=document.getElementById('quiz-banner-sub');
  const quizBtn=document.getElementById('btn-quiz');
  if(quizBtn){quizBtn.disabled=false;quizBtn.textContent='ابدأ!';}
  if(qEl)qEl.textContent=log.quizDone?'أكملت مسابقة اليوم ✅':'10 أسئلة رمضانية - اكسب نقاطاً!';

  renderHomeInventory(p);
  renderChildRewards(p);
}
function renderHomeInventory(p){
  const wrap=document.getElementById('home-inventory-card');
  const strip=document.getElementById('inv-strip');
  if(!wrap||!strip) return;

  const inv=(p.inventory||[]).slice();
  const gifts=(p.giftHistory||[]).slice(0,6); // آخر هدايا مستلمة

  if(!inv.length && !gifts.length){
    strip.innerHTML='<div class="text-muted text-sm">لا توجد مقتنيات بعد — زور المتجر 😊</div>';
    return;
  }

  const itemsById=new Map((SHOP_ITEMS||[]).map(it=>[it.id,it]));
  const invCards=inv.map(id=>itemsById.get(id)).filter(Boolean);

  const giftCards=gifts.map(g=>({
    _isGift:true,
    icon:'🎁',
    name: (g.text||g.desc||'هدية').toString(),
    meta: `+${g.pts??GIFT_DEFAULT_POINTS} ⭐  •  +${g.gems??GIFT_DEFAULT_GEMS} 💎`
  }));

  const cards=[...giftCards,...invCards];

  strip.innerHTML=cards.map(it=>{
    if(it._isGift){
      return `
        <div class="inv-card gift-note">
          <div class="inv-ic">${it.icon}</div>
          <div class="inv-n" title="${escapeHtml(it.name)}">${escapeHtml(it.name)}</div>
          <div class="inv-sub">${escapeHtml(it.meta)}</div>
        </div>`;
    }
    return `
      <div class="inv-card">
        <div class="inv-ic">${it.icon||'🎁'}</div>
        <div class="inv-n">${it.name||''}</div>
      </div>`;
  }).join('');
}
function renderChildRewards(p){
  const card=document.getElementById('child-rewards-card');
  const badge=document.getElementById('child-rew-badge');
  const list=document.getElementById('child-rewards-list');
  if(!card||!badge||!list) return;
  const pending=getPendingGiftsForChild(p.id);
  badge.textContent=String(pending.length);
  if(!pending.length){
    card.classList.add('hidden');
    list.innerHTML='';
    return;
  }
  card.classList.remove('hidden');
  list.innerHTML=pending.slice().reverse().map(r=>`
    <div class="gift-card">
      <div class="gift-ic">${r.childAv||p.avatar||'🎁'}</div>
      <div class="gift-b">
        <div class="gift-t">${(r.text||r.desc||'').toString()}</div>
        <div class="gift-m">
          <span class="badge">⭐ +${r.pts??GIFT_DEFAULT_POINTS}</span>
          <span class="badge">💎 +${r.gems??GIFT_DEFAULT_GEMS}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" data-gid="${r.id||''}" data-gtime="${r.time}">استلم</button>
    </div>`).join('');
  list.querySelectorAll('[data-gtime]').forEach(btn=>{
    btn.addEventListener('click',async()=>{
      const t=parseInt(btn.dataset.gtime);
      // lock UI while we update + sync
      beginBusy();
      try{
        const rw=(STATE.rewards||[]).find(x=>x.childId===p.id && !x.claimed && (x.id? (x.id===btn.dataset.gid): (x.time===t)));
        if(!rw){toast('⚠️ هذه الهدية غير موجودة');return}
        rw.claimed=true; rw.claimedAt=Date.now();
        p.points=(p.points||0)+(rw.pts??GIFT_DEFAULT_POINTS);
        p.gems=(p.gems||0)+(rw.gems??GIFT_DEFAULT_GEMS);

        // حفظ الهدية لتظهر للطفل داخل "مقتنياتي"
        if(!p.giftHistory) p.giftHistory=[];
        p.giftHistory.unshift({
          time: Date.now(),
          text: (rw.text||rw.desc||'هدية'),
          pts: (rw.pts??GIFT_DEFAULT_POINTS),
          gems:(rw.gems??GIFT_DEFAULT_GEMS)
        });

        // log
        if(!p.activityLog) p.activityLog=[];
        p.activityLog.unshift({time:Date.now(),action:`🎁 استلمت هدية: ${(rw.text||rw.desc||'')}`,pts:(rw.pts??GIFT_DEFAULT_POINTS),status:'approved'});
        save();
        toast('🎉 تم استلام الهدية!');
        renderHome(); // refresh
      }finally{
        endBusy();
      }
    });
  });
}
function getTarget(p,td){
  const rd=td.ramadanDay;const plan=p.plan||{dhuhrDays:0,asrDays:0,maghribDays:30};
  let type;if(rd<=plan.dhuhrDays)type='dhuhr';else if(rd<=plan.dhuhrDays+plan.asrDays)type='asr';else type='maghrib';
  return{type,name:{dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب'}[type],time:td[type]};
}
function renderStatusCard(p,log,td){
  const el=document.getElementById('status-card');const now=new Date();const target=getTarget(p,td);
  el.className='status-card';
  if(log.maghribReached){el.className+=' status-success';el.innerHTML=`<div class="bold">🎉 أتممت صيام اليوم حتى المغرب!</div><div class="text-sm text-muted">نقاط اليوم: ${log.pts}</div>`;}
  else if(log.ateReason){
    el.className+=' status-broke';
    const labels={sick:'كنت مريضاً 🤒',tired:'تعبت 😴',forgot:'نسيت 😅',intentional:'قررت ذلك 😞'};
    el.innerHTML=`<div class="bold">💔 أكلت أو شربت — ${labels[log.ateReason]||''}</div><div class="text-sm text-muted">نقاط اليوم: ${log.pts}</div>`;
  } else if(log.targetReached){
    el.className+=' status-success';
    el.innerHTML=`<div class="bold">✅ وصلت لهدف ${target.name}!</div><button class="btn btn-success btn-sm" style="margin-top:7px;width:100%" id="btn-cont-maghrib">🌟 واصل حتى المغرب (+بونص)</button>`;
    document.getElementById('btn-cont-maghrib')?.addEventListener('click',claimMaghrib);
  } else {
    el.className+=' status-pending';
    if(target.time){const tt=parseT(target.time,td.dateISO);const diff=tt-now;
      if(diff<=0){el.innerHTML=`<div class="bold">🎯 حان وقت ${target.name}! هل وصلت؟</div><div class="flex gap-8 mt-8"><button class="btn btn-success btn-sm" style="flex:1" id="btn-yes-target">✅ نعم وصلت!</button><button class="btn btn-danger btn-sm" style="flex:1" id="btn-no-target">💔 لم أصل</button></div>`;
        document.getElementById('btn-yes-target')?.addEventListener('click',claimTarget);
        document.getElementById('btn-no-target')?.addEventListener('click',()=>showModal('m-ate'));
      } else{el.innerHTML=`<div class="bold">🎯 هدف اليوم: الصيام حتى <strong>${target.name}</strong></div><button class="btn btn-ghost btn-sm mt-8" id="btn-broke" style="width:100%">💔 أكلت أو شربت</button>`;
        document.getElementById('btn-broke')?.addEventListener('click',()=>showModal('m-ate'));
      }
    }
  }
}
function renderDeeds(p,log){
  const el=document.getElementById('deeds-grid');
  el.innerHTML=GOOD_DEEDS.map(d=>{
    const done=(log.deeds||[]).includes(d.id);
    const pending=(log.pendingDeeds||[]).includes(d.id);
    let cls='deed-btn';if(done)cls+=' done';else if(pending)cls+=' pending-approval';
    const lbl=done?'✅ تمّ':pending?'⏳ انتظر':'+'+d.pts+' نقطة';
    return`<button class="${cls}" data-did="${d.id}"><span class="deed-icon">${d.icon}</span><span class="deed-name">${d.name}</span><span class="deed-pts">${lbl}</span></button>`;
  }).join('');
  el.querySelectorAll('.deed-btn').forEach(b=>b.addEventListener('click',()=>logDeed(b.dataset.did)));
}
function renderQuests(log){
  const el=document.getElementById('quest-list');
  el.innerHTML=QUESTS.map(q=>{const done=(log.quests||[]).includes(q.id);return`<div class="quest-item" data-qid="${q.id}"><div class="q-check${done?' done':''}">${done?'✓':''}</div><span style="flex:1;font-size:0.88rem">${q.text}</span><span class="q-pts">+${q.pts}</span></div>`}).join('');
  el.querySelectorAll('.quest-item').forEach(item=>item.addEventListener('click',()=>toggleQuest(item.dataset.qid)));
  document.getElementById('q-badge').textContent=(log.quests||[]).length+'/'+QUESTS.length;
}
function renderBadDeeds(p,log){
  const bds=log.badDeeds||[];
  const sec=document.getElementById('bad-deeds-section');const lst=document.getElementById('bad-deeds-list');
  if(!bds.length){sec.classList.add('hidden');return}
  sec.classList.remove('hidden');
  lst.innerHTML=bds.map(bd=>{const preset=STATE.badDeeds.find(b=>b.id===bd.id)||{};return`<div class="bad-deed-item"><span style="font-size:1.1rem">⚠️</span><span style="flex:1;font-size:0.85rem">${preset.name||bd.id}</span><span style="color:var(--rose);font-weight:700;font-size:0.85rem">${preset.pts||''} نقطة</span></div>`}).join('');
}

// ============================================================
// TIMERS
// ============================================================
function startTimers(){if(timerInterval)clearInterval(timerInterval);timerInterval=setInterval(()=>{updateTimers();if(new Date().getSeconds()===0)checkEidNotif()},1000);updateTimers()}
function updateTimers(){
  const p=prf();const td=todayTT();if(!p||!td)return;
  const now=new Date();
  const log=dayLog(p);

  // Decide which countdown target to show:
  // - default: today's planned target (dhuhr/asr/maghrib)
  // - if target reached (but not maghrib): show countdown to maghrib (next step)
  // - if maghrib reached OR we are after today's maghrib: show countdown to tomorrow's planned target
  let showTd=td;
  let showTarget=getTarget(p,td);

  const todayMaghribT=parseT(td.maghrib,td.dateISO);
  const afterMaghrib=now>=todayMaghribT;

  if(log && log.targetReached && !log.maghribReached && showTarget.type!=='maghrib'){
    // Next inside the same day: maghrib
    showTarget={type:'maghrib',name:'المغرب',time:td.maghrib};
  } else if((log && log.maghribReached) || afterMaghrib){
    // Next day target
    const idx=(STATE.timetable||[]).findIndex(x=>x.dateISO===td.dateISO);
    const nextTd=idx>=0?(STATE.timetable||[])[idx+1]:null;
    if(nextTd){
      showTd=nextTd;
      showTarget=getTarget(p,nextTd);
    }
  }

  if(showTarget.time){
    const tt=parseT(showTarget.time,showTd.dateISO);
    const diff=tt-now;

    const titlePrefix=(showTd.dateISO===td.dateISO)?'الهدف القادم: ':'هدف الغد: ';
    document.getElementById('t-name').textContent=titlePrefix+showTarget.name;
    document.getElementById('t-main').textContent=fmtTime(diff);

    const mins=diff/60000;
    let sub='💪 استمر!';
    if(diff<=0) sub='⏰ حان وقت الهدف!';
    else if(mins<=5) sub='🔥 بقي دقائق! أنت تقدر!';
    else if(mins<=30) sub='⭐ قريب من الهدف!';
    else sub='💪 استمر!';
    document.getElementById('t-sub').textContent=sub;

    // Progress bar always based on today's fajr -> maghrib (matches labels)
    const fajrT=parseT(td.fajr,td.dateISO);
    const maghribT=todayMaghribT;
    const pct=Math.min(100,Math.max(0,(now-fajrT)/(maghribT-fajrT)*100));
    document.getElementById('p-fill').style.width=pct+'%';

    // Marker shows the countdown target within today's fajr->maghrib window if applicable
    const markerT=(showTd.dateISO===td.dateISO)?tt:todayMaghribT;
    const mPct=(markerT-fajrT)/(maghribT-fajrT)*100;
    document.getElementById('p-marker').style.right=(100-Math.min(100,Math.max(0,mPct)))+'%';

    // Bonus card: show only when target reached and maghrib not reached
    const bc=document.getElementById('bonus-card');
    if(log && log.targetReached && !log.maghribReached && getTarget(p,td).type!=='maghrib'){
      bc.classList.remove('hidden');
      document.getElementById('bonus-timer').textContent=fmtTime(maghribT-now);
    } else bc.classList.add('hidden');
  }
}

// ============================================================
// GAME ACTIONS
// ============================================================
function claimTarget(){
  const p=prf();const td=todayTT();if(!p||!td)return;const log=dayLog(p);if(log.targetReached)return;
  log.targetReached=true;const target=getTarget(p,td);
  let pts=target.type==='maghrib'?150:100;if(td.ramadanDay%7===0)pts=Math.round(pts*2);
  log.pts=(log.pts||0)+pts;addPoints(pts,'وصلت لهدف '+target.name);
  if(target.type==='maghrib'){log.maghribReached=true;confetti()}
  addActivityLog(p,'وصلت لهدف '+target.name,pts,'approved');
  checkAch(p);save();renderHome();toast('✅ رائع! +'+pts+' نقطة 🎉');
}
function claimMaghrib(){
  const p=prf();const td=todayTT();if(!p||!td)return;const log=dayLog(p);if(log.maghribReached)return;
  log.maghribReached=true;const target=getTarget(p,td);const now=new Date();
  const maghribT=parseT(td.maghrib,td.dateISO);
  // Bonus: fixed 50pts for completing to maghrib, doubled on milestone days
  const bonus=50;
  const pts=td.ramadanDay%7===0?bonus*2:bonus;
  log.pts=(log.pts||0)+pts;addPoints(pts,'بونص المغرب');
  const y=new Date();y.setDate(y.getDate()-1);const yISO=y.toISOString().split('T')[0];
  const hadY=p.logs&&p.logs[yISO]&&(p.logs[yISO].targetReached||p.logs[yISO].maghribReached);
  p.streak=hadY?(p.streak||0)+1:1;p.maxStreak=Math.max(p.maxStreak||0,p.streak);
  addActivityLog(p,'أتم صيام حتى المغرب',pts,'approved');
  checkAch(p);save();renderHome();confetti();toast('🌙 أتممت الصيام! +'+pts+' بونص!');
}
function confirmAte(reason){
  const p=prf();if(!p)return;const log=dayLog(p);
  const td=todayTT();const target=td?getTarget(p,td):null;
  const now=new Date();let pctDone=0;
  if(td&&target){const fajrT=parseT(td.fajr,td.dateISO);const targetT=parseT(target.time,td.dateISO);pctDone=Math.max(0,Math.min(1,(now-fajrT)/(targetT-fajrT)))}
  const basePts=target&&target.type==='maghrib'?150:100;
  // FIX: Correct point rules per reason
  const effects={
    sick:{pts:Math.round(basePts*pctDone),penalty:false,msg:'شفاك الله! نقاط جزئية حسب المدة 💚'},
    tired:{pts:Math.round(basePts*0.5),penalty:false,msg:'استرح جيداً! نصف النقاط محفوظة 🌙'},
    forgot:{pts:Math.round(basePts*0.4),penalty:false,msg:'لا بأس! الناسي معذور 😊'},
    intentional:{pts:0,penalty:true,msg:'حاول أن تكون أقوى غداً 💪'}
  };
  const eff=effects[reason]||effects.forgot;
  log.ateReason=reason;
  if(eff.pts>0){log.pts=(log.pts||0)+eff.pts;addPoints(eff.pts,'نقاط جزئية')}
  if(eff.penalty){
    // Intentional: 0 pts + 50 point penalty
    p.points=Math.max(0,(p.points||0)-50);
    p.competitionPoints=Math.max(0,(p.competitionPoints||0)-50);
    addActivityLog(p,'كسر الصيام عمداً',-50,'approved');
  } else addActivityLog(p,'كسر الصيام: '+reason,eff.pts,'approved');
  save();closeModal('m-ate');renderHome();toast(eff.msg);
}
function logDeed(id){
  const p=prf();if(!p)return;const log=dayLog(p);if(!log.deeds)log.deeds=[];if(!log.pendingDeeds)log.pendingDeeds=[];
  const deed=GOOD_DEEDS.find(d=>d.id===id);if(!deed)return;
  if((log.deeds||[]).includes(id)){toast('✅ سجّلت هذا العمل من قبل!');return}
  if((log.pendingDeeds||[]).includes(id)){toast('⏳ بانتظار موافقة الوالد');return}
  if(deed.needsApproval){log.pendingDeeds.push(id);addActivityLog(p,deed.name,deed.pts,'pending');save();renderDeeds(p,log);toast('⏳ طلب إرسال للوالد للموافقة');}
  else{log.deeds.push(id);log.pts=(log.pts||0)+deed.pts;addPoints(deed.pts,deed.name);addActivityLog(p,deed.name,deed.pts,'approved');if(log.deeds.length===GOOD_DEEDS.filter(d=>!d.needsApproval).length)checkAch(p);save();renderDeeds(p,log);}
}
function toggleQuest(id){
  const p=prf();if(!p)return;const log=dayLog(p);if(!log.quests)log.quests=[];
  const q=QUESTS.find(q=>q.id===id);if(!q)return;
  if(log.quests.includes(id)){log.quests=log.quests.filter(x=>x!==id);p.points=Math.max(0,(p.points||0)-q.pts)}
  else{log.quests.push(id);log.pts=(log.pts||0)+q.pts;addPoints(q.pts,q.text.substring(0,25));if(log.quests.length===QUESTS.length){toast('🏆 أكملت كل المهام!');checkAch(p)}}
  save();renderQuests(log);
}

// ============================================================
// POINTS & LOG
// ============================================================
function addPoints(amount,reason){
  const p=prf();if(!p)return;
  // Competition points — only go up
  if(amount>0){
    p.points=Math.max(0,(p.points||0)+amount);
    p.competitionPoints=(p.competitionPoints||0)+amount;
    p.gems=(p.gems||0)+Math.round(amount*0.5);
  } else {
    // Penalties reduce competition points too
    p.points=Math.max(0,(p.points||0)+amount);
    p.competitionPoints=Math.max(0,(p.competitionPoints||0)+amount);
  }
  save();ptsPopup(amount);
}
function ptsPopup(pts){
  const el=document.createElement('div');el.className='pts-popup'+(pts<0?' pts-neg':'');el.textContent=(pts>0?'+':'')+pts+' '+(pts>0?'✨':'💔');
  const x=Math.random()*(window.innerWidth*0.4)+window.innerWidth*0.3;el.style.cssText=`left:${x}px;top:${window.innerHeight*0.4}px`;
  document.body.appendChild(el);setTimeout(()=>el.remove(),1300);
}
function addActivityLog(p,action,pts,status){
  if(!p.activityLog)p.activityLog=[];
  p.activityLog.unshift({action,pts,status,time:new Date().toISOString(),date:todayISO()});
  if(p.activityLog.length>100)p.activityLog=p.activityLog.slice(0,100);
}
function checkAch(p){
  const allLogs=Object.values(p.logs||{});const success=allLogs.filter(l=>l.targetReached||l.maghribReached).length;
  const log=dayLog(p);
  const checks=[['first',success>=1],['s3',(p.streak||0)>=3],['s7',(p.streak||0)>=7],['s14',(p.streak||0)>=14],['pts500',(p.points||0)>=500],['pts1000',(p.points||0)>=1000],['allDeeds',(log.deeds||[]).length>=GOOD_DEEDS.length],['allQuests',(log.quests||[]).length>=QUESTS.length]];
  let any=false;checks.forEach(([id,cond])=>{if(cond&&!(p.achievements||[]).includes(id)){if(!p.achievements)p.achievements=[];p.achievements.push(id);const a=ACHIEVEMENTS.find(x=>x.id===id);if(a)toast('🏅 وسام جديد: '+a.name+' '+a.icon);any=true}});
  if(any)save();
}

// ============================================================
// PROGRESS
// ============================================================
function renderProgress(){
  const p=prf();if(!p)return;const pts=p.points||0;const lv=getLevel(pts);const next=getNextLevel(pts);
  const xpPct=next?Math.round((pts-lv.t)/(next.t-lv.t)*100):100;
  document.getElementById('pr-level').textContent=lv.name;
  document.getElementById('pr-xp').style.width=xpPct+'%';
  document.getElementById('pr-xp-lbl').textContent=pts+' / '+(next?next.t:pts)+' نقطة';
  const allLogs=Object.values(p.logs||{});
  const sd=allLogs.filter(l=>l.targetReached||l.maghribReached).length;
  document.getElementById('st-pts').textContent=pts;
  document.getElementById('st-streak').textContent=(p.streak||0)+'🔥';
  document.getElementById('st-days').textContent=sd;
  document.getElementById('st-grace').textContent=p.graceTokens||0;

  // Journey levels list
  const jl=document.getElementById('journey-list');
  if(jl){
    jl.innerHTML=JOURNEY.map((j,idx)=>{
      const done=pts>=j.req;
      const cur=done&&(!JOURNEY[idx+1]||pts<JOURNEY[idx+1].req);
      return`<div class="journey-item${done?' done':''}${cur?' current':''}"><span style="font-size:1.4rem">${j.icon}</span><span style="flex:1;font-weight:700">${j.name}</span><span class="text-muted text-xs">${j.req} نقطة</span>${done?'<span style="color:var(--green)">✓</span>':''}</div>`;
    }).join('');
  }

  // Quiz path
  renderQuizPath(p);

  // Achievements
  const ag=document.getElementById('ach-grid');
  ag.innerHTML=ACHIEVEMENTS.map(a=>{const u=(p.achievements||[]).includes(a.id);return`<div class="ach-card${u?' unlocked':''}"><div style="font-size:1.5rem;${u?'':'filter:grayscale(1);opacity:0.4'}">${a.icon}</div><div style="font-size:0.72rem;font-weight:700;margin-top:3px">${a.name}</div><div class="text-xs text-muted">${a.desc}</div></div>`;}).join('');

  // Activity log
  const al=document.getElementById('activity-log');
  const logs=(p.activityLog||[]).slice(0,20);
  if(!logs.length){al.innerHTML='<p class="text-muted text-sm text-center">لا توجد أنشطة بعد</p>';return}
  const statusLabel={pending:'⏳ انتظار',approved:'✅ موافق',rejected:'❌ مرفوض'};
  const statusCls={pending:'log-pending',approved:'log-approved',rejected:'log-rejected'};
  al.innerHTML=logs.map(l=>`<div class="log-item ${statusCls[l.status]||''}"><div class="bold text-sm">${l.action}</div><div class="log-meta"><span>${new Date(l.time).toLocaleDateString('ar-SA',{month:'short',day:'numeric'})}</span><span style="font-weight:700;color:${l.pts>=0?'var(--green)':'var(--rose)'}">${l.pts>=0?'+':''}${l.pts}</span><span class="badge" style="background:${l.status==='approved'?'var(--green)':l.status==='rejected'?'var(--rose)':'var(--accent)'}">${statusLabel[l.status]||l.status}</span></div></div>`).join('');
}

// ============================================================
// ADVENTURE MAP — 29-day quiz journey
// ============================================================
function renderQuizPath(p){
  const map=document.getElementById('quiz-path-map');if(!map)return;
  // Always hide quiz-container when showing map
  const qc=document.getElementById('quiz-container');
  if(qc){qc.style.display='none';qc.innerHTML='';}

  const TOTAL=STATE.ramadanDays||30;
  const todayTd=todayTT();
  const todayDay=todayTd?todayTd.ramadanDay:1;

  // Build day states (sequential unlock: day N only opens after finishing day N-1)
  const DS=[];
  const maxOpen=Math.min(todayDay,TOTAL);

  // Find first incomplete day among days that are available by date (<= today)
  let unlockedDay=-1;
  for(let d=1;d<=maxOpen;d++){
    const td2=STATE.timetable.find(t=>t.ramadanDay===d);
    const dk2=td2?td2.dateISO:null;
    const lg2=dk2&&p.logs&&p.logs[dk2]?p.logs[dk2]:null;
    if(!(lg2&&lg2.quizDone)){unlockedDay=d;break;}
  }
  if(unlockedDay<0) unlockedDay=maxOpen; // all done up to today

  for(let d=1;d<=TOTAL;d++){
    const td=STATE.timetable.find(t=>t.ramadanDay===d);
    const dk=td?td.dateISO:null;
    const lg=dk&&p.logs&&p.logs[dk]?p.logs[dk]:null;

    let state='locked';
    const done=!!(lg&&lg.quizDone);

    if(d<unlockedDay){
      state = done ? 'done' : 'locked';
    } else if(d===unlockedDay){
      state = (d===todayDay) ? 'today' : 'next';
    } else {
      // حتى لو التاريخ وصل، لا تفتح الأيام التالية قبل إكمال اليوم الحالي في السلسلة
      state = 'locked';
    }

    // Future days always locked
    if(d>todayDay) state='locked';

    DS.push({day:d,state,dateISO:dk,done});
  }

  // Zone definitions — each row has its own biome
  // ألوان أجمل وأهدأ (مع تباين جيد)
  const ZONES=[
    {name:'القرية',emoji:'🏘️',bg:'linear-gradient(180deg,#dff7ff 0%,#c7ecff 100%)',ground:'#1f7aa6',path:'rgba(255,255,255,.9)',accent:'#0d4f73',desc:'ابدأ رحلتك من القرية!',deco:['🌻','🌿','🐓','🏡','🌷']},
    {name:'الغابة',emoji:'🌲',bg:'linear-gradient(180deg,#dfffe8 0%,#bff2d2 100%)',ground:'#1f6b3c',path:'rgba(255,255,255,.9)',accent:'#0e3f20',desc:'اخترق الغابة الكثيفة',deco:['🦋','🍄','🐿️','🦜','🌿']},
    {name:'الجبال',emoji:'⛰️',bg:'linear-gradient(180deg,#efe9ff 0%,#d9d0ff 100%)',ground:'#4b3aa6',path:'rgba(255,255,255,.92)',accent:'#2a1f73',desc:'تسلّق قمم الجبال الشاهقة',deco:['🦅','❄️','🏔️','🐐','⛄']},
    {name:'الصحراء',emoji:'🏜️',bg:'linear-gradient(180deg,#fff2d6 0%,#ffe0a3 100%)',ground:'#a36a00',path:'rgba(255,255,255,.9)',accent:'#5a3a00',desc:'اعبر الصحراء الذهبية',deco:['🐪','🌵','🦎','⭐','🌅']},
    {name:'البحر',emoji:'🌊',bg:'linear-gradient(180deg,#d7f3ff 0%,#a6ddff 100%)',ground:'#005f80',path:'rgba(255,255,255,.9)',accent:'#003f6b',desc:'ابحر في أمواج البحر',deco:['🐬','🐠','⚓','🦈','🌟']},
    {name:'القلعة',emoji:'🏰',bg:'linear-gradient(180deg,#ffe9f6 0%,#ffd0ea 100%)',ground:'#7a1a55',path:'rgba(255,255,255,.92)',accent:'#4a0a32',desc:'أكمل رحلتك ونل التاج!',deco:['👑','💎','🌟','🎆','🏆']}
  ];

  // Node styles per state — high contrast for accessibility
  const nodeStyle={
    done:   {ring:'#1a7a3a',bg:'linear-gradient(135deg,#27ae60,#1e8449)',icon:'✅',numColor:'#fff',shadow:'0 4px 15px rgba(39,174,96,.6)',border:'3px solid #1a7a3a',disabled:false,label:''},
    next:   {ring:'#e65c00',bg:'linear-gradient(135deg,#ff6b35,#e65c00)',icon:'▶️',numColor:'#fff',shadow:'0 0 0 5px rgba(255,107,53,.4),0 4px 20px rgba(255,107,53,.7)',anim:'animation:pulse-today 1.5s ease-in-out infinite',border:'3px solid #e65c00',disabled:false,label:'ابدأ هنا!'},
    catchup:{ring:'#7d5a00',bg:'linear-gradient(135deg,#b8860b,#8b6508)',icon:'📖',numColor:'#fff',shadow:'0 2px 8px rgba(184,134,11,.4)',border:'2px dashed #b8860b',disabled:false,label:'لحّق'},
    today:  {ring:'#b7770d',bg:'linear-gradient(135deg,#f39c12,#d68910)',icon:'⭐',numColor:'#fff',shadow:'0 0 0 5px rgba(243,156,18,.35),0 4px 20px rgba(243,156,18,.7)',anim:'animation:pulse-today 1.8s ease-in-out infinite',border:'3px solid #b7770d',disabled:false,label:'اليوم'},
    locked: {ring:'rgba(255,255,255,0.15)',bg:'rgba(0,0,0,0.35)',icon:'🔒',numColor:'rgba(255,255,255,0.5)',shadow:'none',border:'3px solid rgba(255,255,255,0.15)',disabled:true,label:''}
  };

  // Build HTML
  // Dynamic hint based on quiz status
  const todayTdHint=todayTT();
  const todayLogHint=todayTdHint?dayLog(p,todayTdHint.dateISO):null;
  const todayQuizDone=!!(todayLogHint&&todayLogHint.quizDone);

  let hintText='⭐ اضغط على محطتك لتبدأ مسابقة اليوم!';
  if(unlockedDay<todayDay){
    hintText=`👆 ابدأ من اليوم ${unlockedDay}! (لا يمكن فتح يوم جديد قبل إنهاء السابق)`;
  } else if(todayQuizDone){
    hintText='✅ أجبت على أسئلة اليوم! 🌟';
  }let html=`
  <style>
    .adventure-map{border-radius:20px;overflow:hidden;position:relative;box-shadow:0 8px 32px rgba(0,0,0,.35)}
    .map-header{border-radius:18px;overflow:hidden;margin-bottom:10px;border:1px solid rgba(240,180,41,.25);background:linear-gradient(135deg,rgba(9,18,46,.55),rgba(9,18,46,.25));backdrop-filter:blur(10px);box-shadow:0 12px 28px rgba(0,0,0,.25)}
    .map-header-top{display:flex;align-items:center;gap:10px;padding:12px 12px 10px;border-bottom:1px solid rgba(255,255,255,.08)}
    .map-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(240,180,41,.12);border:1px solid rgba(240,180,41,.25);font-weight:900;font-size:.72rem;color:var(--text)}
    .map-hero{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.18),rgba(255,255,255,0) 60%),linear-gradient(135deg,rgba(240,180,41,.20),rgba(56,201,176,.14));border:1px solid rgba(255,255,255,.10)}
    .map-header-title{font-weight:950;font-size:1.05rem;color:var(--text)}
    .map-header-sub{font-size:.78rem;color:rgba(240,230,211,.72);margin-top:2px}
    .map-header-bottom{padding:10px 12px}

    /* padding-top أكبر حتى لا تنقص فقاعة/أفاتار اللاعب */
    .zone-row{position:relative;padding:34px 12px 14px;overflow:hidden;min-height:124px;display:flex;flex-direction:column;justify-content:center}
    .zone-label{position:absolute;top:8px;right:10px;font-size:0.62rem;font-weight:950;opacity:0.95;color:rgba(10,20,40,.92);text-shadow:0 1px 0 rgba(255,255,255,.65);background:rgba(255,255,255,.55);border:1px solid rgba(10,20,40,.12);padding:4px 10px;border-radius:999px;backdrop-filter:blur(6px)}
    .zone-deco{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
    .zone-row::after{content:'';position:absolute;inset:0;background:rgba(0,0,0,.12);pointer-events:none;z-index:1}
    .deco-item{position:absolute;font-size:1.1rem;opacity:0.35;user-select:none}
    .map-row{display:flex;align-items:center;justify-content:center;gap:0;position:relative;z-index:2}
    .map-node-wrap{display:flex;flex-direction:column;align-items:center;position:relative}
    .map-node{border:none;padding:0;cursor:pointer;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--font);transition:transform .18s,box-shadow .18s;flex-shrink:0;position:relative}
    .map-node:not(:disabled):hover{transform:scale(1.18)!important;z-index:10}
    .map-node:disabled{cursor:default;pointer-events:none}
    .map-node .nday{font-size:.75rem;font-weight:900;line-height:1.1;display:block;text-shadow:0 1px 3px rgba(0,0,0,.5)}
    .map-node .nico{font-size:.9rem;line-height:1;display:block}
    .map-node.is-milestone{width:60px!important;height:60px!important}
    .map-connector{height:5px;border-radius:3px;flex:1;min-width:4px;max-width:20px;align-self:center;position:relative}
    .map-connector.dotted{background:repeating-linear-gradient(90deg,rgba(255,255,255,.6) 0,rgba(255,255,255,.6) 4px,transparent 4px,transparent 9px);height:4px}
    .map-vline{width:5px;border-radius:3px;height:24px;margin:2px 0}
    .map-bridge{position:absolute;left:0;right:0;bottom:-12px;display:flex;pointer-events:none;z-index:3}
    .map-bridge.right{justify-content:flex-end;padding-right:20px}
    .map-bridge.left{justify-content:flex-start;padding-left:20px}
    .milestone-flag{position:absolute;top:-22px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:0.55rem;font-weight:900;background:rgba(0,0,0,.55);color:#ffd700;padding:2px 6px;border-radius:6px;border:1px solid rgba(255,215,0,.4);backdrop-filter:blur(4px)}
    .explorer-bubble{position:absolute;top:-22px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:1.35rem;animation:bounce-exp 1s ease-in-out infinite}
    .hand-pointer{position:absolute;top:-26px;right:-10px;font-size:1.7rem;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));animation:hand-pop 1.2s ease-in-out infinite}
    @keyframes hand-pop{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-5px) rotate(-6deg)}}
    @keyframes bounce-exp{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-5px)}}
    .map-legend{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:10px 8px;background:var(--surf2);border-radius:0 0 20px 20px;border:1px solid var(--bdr);border-top:none}
    .map-legend-item{display:flex;align-items:center;gap:4px;font-size:0.7rem;font-weight:700;color:var(--text)}
    .map-legend-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
    .map-hint{text-align:center;font-size:0.75rem;color:var(--text);padding:8px 12px;font-weight:700;background:rgba(240,180,41,0.08);border-radius:10px;margin-bottom:6px;border:1px solid rgba(240,180,41,0.2)}
    @keyframes pulse-next{0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,.7),0 4px 20px rgba(255,107,53,.5)}50%{box-shadow:0 0 0 8px rgba(255,107,53,0),0 4px 20px rgba(255,107,53,.5)}}
  </style>
  <div class="map-header">
    <div class="map-header-top">
      <div class="map-hero">${p.avatar||'🧒'}</div>
      <div style="flex:1;min-width:0">
        <div class="map-header-title">🧠 مسابقة رمضان داخل الخريطة</div>
        <div class="map-header-sub">جاوب الأسئلة كل يوم واكسب نقاط وجواهر</div>
      </div>
      <div class="map-badge">اليوم ${todayDay}</div>
    </div>
    <div class="map-header-bottom">
      <div class="map-hint" id="quiz-map-hint">${hintText}</div>
    </div>
  </div>
  <div class="adventure-map">`;

  // Group days into rows of 5 (snake)
  const COLS=5;
  const totalRows=Math.ceil(TOTAL/COLS);

  for(let row=0;row<totalRows;row++){
    const zone=ZONES[Math.min(row,ZONES.length-1)];
    const isReverse=(row%2===1);
    const logStart=row*COLS+1;
    const logical=[];
    for(let c=0;c<COLS&&(logStart+c)<=TOTAL;c++) logical.push(DS[logStart+c-1]);
    const display=isReverse?[...logical].reverse():logical;

    // Milestone days
    const lastDay=TOTAL;
    const milestones={7:'⭐ أسبوع',14:'🏆 نصف شهر',21:'💪 ثلاثة أرباع',[lastDay]:'👑 الختام'};

    // Decorations scattered in background
    const decoHtml=zone.deco.map((d,i)=>{
      const left=[8,20,35,55,70,80,90,15,45,65][i]||Math.random()*85+5;
      const top=[15,60,30,70,20,50,80,40,25,65][i]||Math.random()*70+10;
      return`<span class="deco-item" style="left:${left}%;top:${top}%">${d}</span>`;
    }).join('');

    html+=`<div class="zone-row" style="background:${zone.bg}">
      <div class="zone-deco">${decoHtml}</div>
      <div class="zone-label">${zone.emoji} ${zone.name}</div>
      <div class="map-row">`;

    display.forEach((ds,i)=>{
      const isLast=(i===display.length-1);
      const isMilestone=!!(milestones[ds.day]);
      const ns=nodeStyle[ds.state];
      const sz=isMilestone?60:50;
      const isToday=ds.state==='today';

      const isNext=ds.state==='next';
      html+=`<div class="map-node-wrap" style="${isMilestone?'margin-top:4px':''}">
        ${isMilestone?`<div class="milestone-flag">${milestones[ds.day]}</div>`:''}
        ${isToday?`<div class="explorer-bubble">${p.avatar||'🧒'}</div>`:isNext?`<div class="hand-pointer">👆</div>`:''}
        <button class="map-node${isMilestone?' is-milestone':''}" data-quizday="${ds.day}"
          style="width:${sz}px;height:${sz}px;background:${ns.bg};box-shadow:${ns.shadow};${ns.anim||''};${ns.border||('border:3px solid '+ns.ring)}"
          ${ns.disabled?'disabled':''}>
          <span class="nday" style="color:${ns.numColor}">${ds.day}</span>
          <span class="nico">${ns.icon}</span>
        </button>
        ${ns.label?`<div style="font-size:0.5rem;font-weight:900;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7);margin-top:2px;white-space:nowrap">${ns.label}</div>`:''}
      </div>`;

      if(!isLast){
        const nxt=display[i+1];
        const fromDone=ds.state==='done'||ds.state==='next';
        const fromToday=ds.state==='today';
        const connFilled=fromDone||fromToday;
        const connStyle=fromDone
          ?`background:linear-gradient(90deg,#27ae60,#52d68a)`
          :fromToday
            ?`background:linear-gradient(90deg,#f39c12,rgba(255,255,255,.3))`
            :`background:rgba(255,255,255,.2)`;
        html+=`<div class="map-connector ${!connFilled?'dotted':''}" style="${connFilled?connStyle:''}"></div>`;
      }
    });

    html+=`</div>`; // map-row

    // Vertical connector between rows (بين نهاية صف وبداية الصف التالي)
    if(row<totalRows-1){
      const rowEndDay=logStart + logical.length - 1;
      const progressed = rowEndDay < unlockedDay; // فتحت الصف التالي بالفعل
      const vStyle=progressed?'background:linear-gradient(180deg,#2ecc71,#52d68a)':'background:rgba(255,255,255,.28)';
      html+=`<div class="map-bridge ${isReverse?'left':'right'}">
        <div class="map-vline ${!progressed?'dotted':''}" style="${vStyle}"></div>
      </div>`;
    }

    html+=`</div>`; // zone-row
  }

  html+=`</div>`; // adventure-map

  // Legend
  html+=`<div class="map-legend">
    <div class="map-legend-item"><div class="map-legend-dot" style="background:#27ae60"></div>أكمل ✅</div>
    <div class="map-legend-item"><div class="map-legend-dot" style="background:#ff6b35"></div>ابدأ هنا ▶️</div>
        <div class="map-legend-item"><div class="map-legend-dot" style="background:#f39c12"></div>اليوم ⭐</div>
    <div class="map-legend-item"><div class="map-legend-dot" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.3)"></div>قادم 🔒</div>
  </div>`;

  map.innerHTML=html;

  // Wire clicks
  map.querySelectorAll('[data-quizday]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const day=parseInt(btn.dataset.quizday);
      map.style.display='none';
      startQuizForDay(day);
    });
  });
}



// ============================================================
// GIFTS (Parent -> Child)
// ============================================================
const GIFT_DEFAULT_POINTS = 10;
const GIFT_DEFAULT_GEMS   = 3;

function getPendingGiftsForChild(childId){
  return (STATE.rewards||[]).filter(r=>r && r.childId===childId && !r.claimed);
}
// ============================================================
// SHOP
// ============================================================
function renderShop(){
  const p=prf();if(!p)return;
  const gems=p.gems||0;
  const compPts=p.competitionPoints||p.points||0;
  const gemsEl=document.getElementById('shop-gems');if(gemsEl)gemsEl.textContent=gems;
  const compEl=document.getElementById('shop-comp-pts');if(compEl)compEl.textContent=compPts;
  const sg=document.getElementById('shop-grid');
  // Group by category
  const cats=[...new Set(SHOP_ITEMS.map(i=>i.cat||'عام'))];
  sg.innerHTML=cats.map(cat=>{
    const items=SHOP_ITEMS.filter(i=>(i.cat||'عام')===cat);
    const rows=items.map(item=>{
      const owned=(p.inventory||[]).includes(item.id);
      const can=gems>=item.price;
      return`<div class="shop-item${owned?' owned':''}">
        <div style="font-size:2rem">${item.icon}</div>
        <div class="bold text-sm" style="margin-top:4px;line-height:1.2">${item.name}</div>
        <div class="text-xs text-muted" style="margin:3px 0;line-height:1.3">${item.desc}</div>
        <div style="color:var(--teal);font-weight:900;margin:5px 0;font-size:0.9rem">💎 ${item.price}</div>
        <button class="btn${owned?' btn-ghost':!can?' btn-ghost':' btn-primary'} btn-sm" style="width:100%;margin-top:4px;font-size:0.78rem" data-iid="${item.id}" ${owned||!can?'disabled':''}>${owned?'✓ مملوك':!can?'جواهر أقل':'اشترِ'}</button>
      </div>`;
    }).join('');
    return`<div style="margin-bottom:16px">
      <div class="bold text-sm" style="margin-bottom:8px;padding:5px 10px;background:var(--surf2);border-radius:10px;border:1px solid var(--bdr)">── ${cat}</div>
      <div class="shop-grid">${rows}</div>
    </div>`;
  }).join('');
  sg.querySelectorAll('[data-iid]').forEach(b=>b.addEventListener('click',()=>buyItem(b.dataset.iid)));
}
function buyItem(id){
  const p=prf();if(!p)return;const item=SHOP_ITEMS.find(i=>i.id===id);if(!item)return;
  // FIX: Use gems only — competition points NEVER reduced
  if((p.gems||0)<item.price){toast('💎 جواهرك غير كافية!');return}
  if((p.inventory||[]).includes(id)){toast('✅ مملوك!');return}
  p.gems=Math.max(0,(p.gems||0)-item.price);// FIX: prevent negative gems
  if(!p.inventory)p.inventory=[];p.inventory.push(id);
  if(item.id==='grace')p.graceTokens=(p.graceTokens||0)+1;
  if(item.id==='chest'){const bonus=30+Math.floor(Math.random()*70);p.gems=(p.gems||0)+bonus;const cm=document.getElementById('chest-msg');if(cm)cm.textContent='+'+bonus+' جوهرة مكافأة! 🎉';showModal('m-chest')}
  if(item.id==='dates'){p.gems=(p.gems||0)+30}
  addActivityLog(p,'اشترى '+item.name,-item.price,'approved');save();renderShop();toast('🎉 اشتريت '+item.name+'!');
}

// ============================================================
// PROFILES
// ============================================================
function renderProfiles(){
  const el=document.getElementById('profiles-list');if(!el)return;
  const localId=getLocalSession();
  const sorted=[...STATE.profiles].sort((a,b)=>(b.points||0)-(a.points||0));
  const medals=['🥇','🥈','🥉'];
  el.innerHTML=sorted.map((p,i)=>{
    const isMe=p.id===localId;
    return`<div class="child-card${isMe?' card-accent':''}" style="pointer-events:none">
      <span style="font-size:1.5rem">${medals[i]||'#'+(i+1)}</span>
      <span style="font-size:2rem">${p.avatar}</span>
      <div style="flex:1;min-width:0">
        <div class="bold" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}${isMe?' 👈 أنت':''}</div>
        <div class="text-xs text-muted">${p.points||0} نقطة • ${getLevel(p.points||0).name}</div>
      </div>
      ${isMe?`<span style="font-size:0.7rem;background:var(--accent);color:var(--text-on-accent);padding:2px 8px;border-radius:10px;font-weight:900">أنت</span>`:''}
    </div>`;
  }).join('');
}
function switchProfile(id){
  STATE.currentId=id;
  setLocalSession(id);
  saveLocal(); // local only
  loadProfileTheme(); // each profile has its own theme on this device
  if(timerInterval)clearInterval(timerInterval);
  startTimers();showScreen('home');
  const p=STATE.profiles.find(x=>x.id===id);
  if(p)toast('👋 مرحباً '+p.name+'!');
}

// ============================================================
// CERTIFICATE
// ============================================================
function renderCertificate(){
  const p=prf();if(!p)return;
  document.getElementById('cert-av').textContent=p.avatar;
  document.getElementById('cert-name').textContent=p.name;
  document.getElementById('cert-level').textContent=getLevel(p.points||0).name;
  const msgEl=document.getElementById('cert-msg'); if(msgEl) msgEl.textContent='أتم بنجاح صوم شهر رمضان المبارك 1447 هـ';
  document.getElementById('cert-pts').textContent=p.points||0;
  document.getElementById('cert-date').textContent=new Date().toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});
  const sorted=[...STATE.profiles].sort((a,b)=>(b.points||0)-(a.points||0));
  const ranksEl=document.getElementById('cert-ranks');
  if(ranksEl)ranksEl.innerHTML=sorted.map((pr,i)=>`<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bdr);font-size:0.88rem"><span>${['🥇','🥈','🥉'][i]||i+1+'.'} ${pr.avatar} ${pr.name}</span><span>${pr.points||0} نقطة</span></div>`).join('');
}

// ============================================================
// PARENT PANEL
// ============================================================
// PARENT PIN — stored in localStorage only, separate from game state
// ============================================================
const PIN_KEY = 'lfa_parent_pin';
function getStoredPin(){return localStorage.getItem(PIN_KEY)||''}
function setStoredPin(p){localStorage.setItem(PIN_KEY,p)}

function renderParent(){
  document.getElementById('parent-panel').classList.add('hidden');
  const hasPin = getStoredPin().length >= 4;
  if(hasPin){
    // Show enter-PIN screen
    document.getElementById('parent-create-pin').classList.add('hidden');
    document.getElementById('parent-lock').classList.remove('hidden');
    document.getElementById('math-ans').value='';
    setTimeout(()=>document.getElementById('math-ans').focus(),100);
  } else {
    // First time — show create-PIN screen
    document.getElementById('parent-lock').classList.add('hidden');
    document.getElementById('parent-create-pin').classList.remove('hidden');
    document.getElementById('pin-create-1').value='';
    document.getElementById('pin-create-2').value='';
    setTimeout(()=>document.getElementById('pin-create-1').focus(),100);
  }
  if(!STATE.familyCode||STATE.familyCode.length<6){
    STATE.familyCode=Math.random().toString(36).substring(2,8).toUpperCase();
    // Push immediately to Supabase so children can join
    saveLocal();
    if(SB){
      SB.from('families').upsert({
        family_code: STATE.familyCode,
        state_json: JSON.stringify(STATE),
        updated_at: new Date().toISOString()
      },{onConflict:'family_code'}).then(({error})=>{
        if(error) console.warn('Supabase family create error',error);
        else { showSyncDot(); subscribeToFamily(); }
      });
    }
  }
}

function unlockParent(){
  document.getElementById('parent-lock').classList.add('hidden');
  document.getElementById('parent-create-pin').classList.add('hidden');
  document.getElementById('parent-panel').classList.remove('hidden');
  openParentTab('children');
}

function checkPin(){
  const entered=(document.getElementById('math-ans').value||'').trim();
  if(entered===getStoredPin()){
    unlockParent();
  } else {
    toast('❌ الرقم السري غير صحيح');
    document.getElementById('math-ans').value='';
    document.getElementById('math-ans').focus();
  }
}

function savePinSetup(){
  const p1=(document.getElementById('pin-create-1').value||'').trim();
  const p2=(document.getElementById('pin-create-2').value||'').trim();
  if(p1.length<4){toast('⚠️ الرقم السري يجب أن يكون 4 أرقام على الأقل');return}
  if(p1!==p2){toast('❌ الرقمان غير متطابقان');document.getElementById('pin-create-2').value='';document.getElementById('pin-create-2').focus();return}
  setStoredPin(p1);
  toast('✅ تم حفظ الرقم السري!');
  unlockParent();
}

function forgotPin(){
  if(!confirm('هل تريد حذف الرقم السري الحالي وإنشاء رقم جديد؟\n(لن تُحذف بيانات الأطفال)'))return;
  localStorage.removeItem(PIN_KEY);
  renderParent();
  toast('تم إعادة ضبط الرقم السري');
}
// ============================================================
// ALL QUESTIONS EDITOR (parent tab)
// ============================================================
let allqEditingId = null;

function renderAllQuestionsEditor(){
  // Merge built-in + custom questions
  const allQ = [...(STATE.quizQuestions||[]), ...(STATE.customQuestions||[])];
  
  // Populate category filter
  const cats = [...new Set(allQ.map(q=>q.c||'عام').filter(Boolean))].sort();
  const catSel = document.getElementById('allq-cat');
  if(catSel && catSel.options.length <= 1){
    cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o);});
  }

  const statsEl = document.getElementById('allq-stats');
  if(statsEl) statsEl.textContent = `إجمالي الأسئلة: ${allQ.length} | قائمة: ${(STATE.quizQuestions||[]).length} | مخصصة: ${(STATE.customQuestions||[]).length}`;

  // Wire search/filter
  const doFilter = ()=>renderAllQList(allQ);
  ['allq-search','allq-cat','allq-diff'].forEach(id=>{
    const el=document.getElementById(id);
    if(el && !el._wired){el._wired=true;el.addEventListener('input',doFilter);}
  });
  renderAllQList(allQ);
}

function renderAllQList(allQ){
  const search = (document.getElementById('allq-search')?.value||'').trim().toLowerCase();
  const cat = document.getElementById('allq-cat')?.value||'';
  const diff = document.getElementById('allq-diff')?.value||'';
  
  let filtered = allQ.filter(q=>{
    if(cat && q.c !== cat) return false;
    const qDiff = q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard');
    if(diff && qDiff !== diff) return false;
    if(search && !q.q.toLowerCase().includes(search) && !(q.o||[]).join(' ').toLowerCase().includes(search)) return false;
    return true;
  });

  const list = document.getElementById('allq-list');
  if(!list) return;
  
  if(!filtered.length){list.innerHTML='<p class="text-muted text-sm text-center">لا توجد أسئلة تطابق البحث</p>';return;}

  const diffColor = {easy:'#2ecc71',medium:'#f39c12',hard:'#e74c3c'};
  const diffLabel = {easy:'سهل',medium:'متوسط',hard:'صعب'};

  list.innerHTML = filtered.slice(0,100).map((q,i)=>{
    const qDiff = q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard');
    const isCustom = !!(STATE.customQuestions||[]).find(x=>x.id===q.id);
    const answerText = q.o?.[q.a]||'';
    return`<div style="background:var(--surf2);border:1px solid var(--bdr);border-radius:11px;padding:10px 12px" data-qid="${q.id}">
      <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px">
        <span style="font-size:0.68rem;font-weight:900;color:#fff;background:${diffColor[qDiff]};padding:2px 7px;border-radius:8px;flex-shrink:0;margin-top:2px">${diffLabel[qDiff]}</span>
        ${q.c?`<span style="font-size:0.68rem;background:var(--surf);border:1px solid var(--bdr);padding:2px 7px;border-radius:8px;flex-shrink:0;margin-top:2px">${q.c}</span>`:''}
        ${isCustom?`<span style="font-size:0.65rem;background:rgba(240,180,41,.2);color:var(--accent);padding:2px 7px;border-radius:8px;flex-shrink:0;margin-top:2px">مخصص</span>`:''}
        <div style="flex:1;font-weight:700;font-size:0.88rem;line-height:1.4">${q.q}</div>
      </div>
      <div style="font-size:0.78rem;color:var(--muted);margin-bottom:8px">✅ الإجابة: <span style="color:var(--green);font-weight:800">${answerText}</span> &nbsp;|&nbsp; نقاط: ${q.p||10}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" style="font-size:0.75rem;flex:1" data-edit-qid="${q.id}">✏️ تعديل</button>
        ${isCustom?`<button class="btn btn-danger btn-sm" style="font-size:0.75rem" data-del-qid="${q.id}">🗑️</button>`:''}
      </div>
    </div>`;
  }).join('');
  
  if(filtered.length>100){
    list.innerHTML += `<p class="text-xs text-muted text-center" style="padding:10px">يعرض أول 100 نتيجة من ${filtered.length} — استخدم البحث للتصفية</p>`;
  }

  // Wire edit buttons
  list.querySelectorAll('[data-edit-qid]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = parseInt(btn.dataset.editQid)||btn.dataset.editQid;
      const allQ2 = [...(STATE.quizQuestions||[]),...(STATE.customQuestions||[])];
      const q = allQ2.find(x=>x.id==id);
      if(!q) return;
      allqEditingId = id;
      document.getElementById('allq-edit-q').value = q.q;
      (q.o||[]).forEach((opt,i)=>{const el=document.getElementById('allq-edit-o'+i);if(el)el.value=opt;});
      document.getElementById('allq-edit-correct').value = q.a||0;
      document.getElementById('allq-edit-diff').value = q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard');
      const panel = document.getElementById('allq-edit-panel');
      if(panel){panel.classList.remove('hidden');panel.scrollIntoView({behavior:'smooth',block:'nearest'});}
    });
  });

  // Wire delete buttons (custom only)
  list.querySelectorAll('[data-del-qid]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.delQid;
      if(!confirm('حذف هذا السؤال؟')) return;
      STATE.customQuestions = (STATE.customQuestions||[]).filter(x=>String(x.id)!==String(id));
      save(); renderAllQuestionsEditor();
    });
  });

  // Wire save/cancel edit
  const saveBtn = document.getElementById('allq-save-edit');
  const cancelBtn = document.getElementById('allq-cancel-edit');
  if(saveBtn && !saveBtn._wired){
    saveBtn._wired = true;
    saveBtn.addEventListener('click',()=>{
      if(!allqEditingId) return;
      const qText = document.getElementById('allq-edit-q').value.trim();
      if(!qText){toast('❌ أدخل نص السؤال');return;}
      const opts = [0,1,2,3].map(i=>document.getElementById('allq-edit-o'+i)?.value.trim()||'');
      if(opts.some(o=>!o)){toast('❌ أدخل جميع الخيارات');return;}
      const correct = parseInt(document.getElementById('allq-edit-correct').value);
      const diff = document.getElementById('allq-edit-diff').value;
      const pts = diff==='hard'?25:diff==='medium'?15:10;
      // Update in quizQuestions or customQuestions
      let updated = false;
      STATE.quizQuestions = (STATE.quizQuestions||[]).map(q=>{
        if(String(q.id)===String(allqEditingId)){updated=true;return{...q,q:qText,o:opts,a:correct,diff,p:pts};}
        return q;
      });
      if(!updated){
        STATE.customQuestions = (STATE.customQuestions||[]).map(q=>{
          if(String(q.id)===String(allqEditingId)){return{...q,q:qText,o:opts,a:correct,diff,p:pts};}
          return q;
        });
      }
      allqEditingId = null;
      document.getElementById('allq-edit-panel').classList.add('hidden');
      save(); renderAllQuestionsEditor();
      toast('✅ تم حفظ التعديل!');
    });
  }
  if(cancelBtn && !cancelBtn._wired){
    cancelBtn._wired = true;
    cancelBtn.addEventListener('click',()=>{
      allqEditingId = null;
      document.getElementById('allq-edit-panel').classList.add('hidden');
    });
  }
}


function openParentTab(tab){
  ['children','deeds','fasting','questions','rewards','settings'].forEach(t=>{
    const tc=document.getElementById('ptab-'+t+'-content');if(tc)tc.classList.toggle('hidden',t!==tab);
    const tb=document.getElementById('ptab-'+t);if(tb){tb.classList.toggle('active',t===tab);}
  });
  if(tab==='children')renderParentChildren();
  if(tab==='deeds')renderParentDeeds();
  if(tab==='fasting')renderFastingTab();
  if(tab==='questions'){renderCustomQuestions();renderAllQuestionsEditor();}
  if(tab==='rewards'){renderRewardPresets();renderRewards();}
  if(tab==='settings')renderAllThemeGrids();
}

// ============================================================
// REWARD PRESETS
// ============================================================
const REWARD_PRESETS=[
  {id:'star',icon:'⭐',title:'نجمة التفوق'},
  {id:'quran',icon:'📖',title:'قراءة قرآن'},
  {id:'help',icon:'🤝',title:'مساعدة الوالدين'},
  {id:'prayer',icon:'🕌',title:'محافظة على الصلاة'},
  {id:'kind',icon:'💛',title:'خلق جميل'},
  {id:'clean',icon:'🧼',title:'نظافة وترتيب'},
  {id:'charity',icon:'🪙',title:'صدقة / مشاركة'},
  {id:'study',icon:'📚',title:'اجتهاد في الدراسة'},
  {id:'sport',icon:'🏃',title:'نشاط صحي'},
  {id:'surprise',icon:'🎁',title:'مفاجأة جميلة'}
];
function renderRewardPresets(){
  const wrap=document.getElementById('rew-presets');
  if(!wrap) return;
  if(!selectedRewardPreset) selectedRewardPreset=REWARD_PRESETS[0]?.id;
  wrap.innerHTML=REWARD_PRESETS.map(r=>{
    const active=r.id===selectedRewardPreset;
    return `<button class="btn btn-${active?'primary':'ghost'} btn-sm" data-rpid="${r.id}" style="display:flex;align-items:center;gap:6px;justify-content:center">
      <span style="font-size:1.1rem">${r.icon}</span><span style="font-weight:800">${r.title}</span>
    </button>`;
  }).join('');
  wrap.querySelectorAll('[data-rpid]').forEach(b=>b.addEventListener('click',()=>{selectedRewardPreset=b.dataset.rpid;renderRewardPresets();}));
}
function renderParentChildren(){
  const el=document.getElementById('parent-children-list');
  el.innerHTML=STATE.profiles.map(p=>`<div class="child-card"><span style="font-size:2rem">${p.avatar}</span><div style="flex:1;min-width:0"><div class="bold" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div><div class="text-xs text-muted">${p.points||0} نقطة • ${getLevel(p.points||0).name}</div><div class="text-xs text-muted">💎 ${p.gems||0} • سلسلة: ${p.streak||0}🔥 • درع: ${p.graceTokens||0}</div></div><button class="btn btn-danger btn-sm" data-remove="${p.id}">🗑️</button></div>`).join('');
  // FIX: Parent can remove child
  el.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    const pid=b.dataset.remove;const prof=STATE.profiles.find(x=>x.id===pid);
    if(!prof||!confirm('حذف '+prof.name+'؟'))return;
    STATE.profiles=STATE.profiles.filter(x=>x.id!==pid);
    if(STATE.currentId===pid)STATE.currentId=STATE.profiles[0]?.id||null;
    save();renderParentChildren();toast('تم الحذف');
  }));
  document.getElementById('family-code').textContent=STATE.familyCode||'——';
  // Check Supabase status
  const stEl=document.getElementById('supabase-status');
  if(stEl){
    if(!SB) stEl.innerHTML='❌ Supabase غير مُهيَّأ';
    else if(!STATE.familyCode) stEl.innerHTML='⚠️ لا يوجد رمز — افتح اللوحة لإنشائه';
    else stEl.innerHTML='🔄 جارٍ التحقق... اضغط "اختبار الاتصال"';
  }
  const opts=STATE.profiles.map(p=>`<option value="${p.id}">${p.avatar} ${p.name}</option>`).join('');
  ['bad-deed-child','edit-pts-child','edit-gems-child','rew-child','log-filter-child','fasting-child-select'].forEach(id=>{const el=document.getElementById(id);if(el){const def=id==='log-filter-child'?'<option value="">الكل</option>':'<option value="">اختر الطفل...</option>';el.innerHTML=def+opts}});
  const bsel=document.getElementById('bad-deed-select');if(bsel)bsel.innerHTML=`<option value="">اختر السلوك...</option>${(STATE.badDeeds||[]).map(b=>`<option value="${b.id}">${b.name} (${b.pts})</option>`).join('')}`;
}
// FIX: Fasting tab (Phase 1.8)
function renderFastingTab(){
  selectedFastingReason=null;
  const sel=document.getElementById('fasting-child-select');if(!sel)return;
  sel.innerHTML='<option value="">اختر الطفل...</option>'+STATE.profiles.map(p=>`<option value="${p.id}">${p.avatar} ${p.name}</option>`).join('');
  sel.onchange=()=>{renderFastingLog(sel.value);};
  document.querySelectorAll('[data-fasting-reason]').forEach(b=>{b.addEventListener('click',()=>{selectedFastingReason=b.dataset.fastingReason;document.querySelectorAll('[data-fasting-reason]').forEach(x=>x.className='btn btn-ghost btn-sm');b.className='btn btn-primary btn-sm';})});
  document.getElementById('btn-update-fasting').onclick=()=>{
    const pid=document.getElementById('fasting-child-select').value;if(!pid||!selectedFastingReason){toast('اختر الطفل والحالة');return;}
    const p=STATE.profiles.find(x=>x.id===pid);if(!p)return;
    const today=todayISO();if(!p.logs[today])p.logs[today]={};
    p.logs[today].ateReason=selectedFastingReason;
    toast('✅ تم تحديث حالة الصيام');save();renderFastingLog(pid);
  };
}
function renderFastingLog(pid){
  const el=document.getElementById('fasting-log-list');if(!el)return;
  if(!pid){el.innerHTML='<p class="text-muted text-sm text-center">اختر طفلاً أولاً</p>';return;}
  const p=STATE.profiles.find(x=>x.id===pid);if(!p){el.innerHTML='';return;}
  const reasons={intentional:'😞 متعمد',sick:'🤒 مريض',tired:'😴 تعب',forgot:'😅 نسيان',completed:'✅ أكمل',undefined:'—'};
  const days=Object.keys(p.logs||{}).sort().reverse().slice(0,30);
  el.innerHTML=days.length?days.map(d=>{const log=p.logs[d];const r=log.ateReason||'completed';return`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:var(--surf2);border-radius:10px;margin-bottom:5px"><span class="text-sm">${d}</span><span class="bold text-sm">${reasons[r]||r}</span><span class="text-xs text-muted">${log.pts||0} نقطة</span></div>`}).join(''):'<p class="text-muted text-sm text-center">لا توجد بيانات</p>';
}
function renderParentDeeds(){
  renderParentChildren();
  const el=document.getElementById('pending-deeds-list');
  let pending=[];
  STATE.profiles.forEach(p=>{(p.activityLog||[]).filter(l=>l.status==='pending').forEach(l=>{pending.push({...l,pId:p.id,pName:p.name,pAv:p.avatar})})});
  if(!pending.length){el.innerHTML='<p class="text-muted text-sm text-center">لا توجد طلبات معلقة</p>';return}
  el.innerHTML=pending.map((l,i)=>`<div class="log-item log-pending"><div class="flex gap-8"><span style="font-size:1.3rem">${l.pAv}</span><div style="flex:1"><div class="bold text-sm">${l.pName}: ${l.action}</div><div class="text-xs text-muted">+${l.pts} نقطة</div></div><div class="flex gap-6"><button class="btn btn-success btn-sm" data-pi="${i}" data-act="approve">✓</button><button class="btn btn-danger btn-sm" data-pi="${i}" data-act="reject">✗</button></div></div></div>`).join('');
  el.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>approveDeed(pending[parseInt(b.dataset.pi)],b.dataset.act==='approve')));
  renderParentLog();
}
function approveDeed(entry,approve){
  const p=STATE.profiles.find(x=>x.id===entry.pId);if(!p)return;
  const logEntry=p.activityLog&&p.activityLog.find(l=>l.time===entry.time&&l.status==='pending');
  if(logEntry)logEntry.status=approve?'approved':'rejected';
  if(approve){
    const deed=GOOD_DEEDS.find(d=>d.name===entry.action);
    if(deed){const log=dayLog(p,entry.date);if(!log.deeds)log.deeds=[];if(!log.pendingDeeds)log.pendingDeeds=[];log.pendingDeeds=log.pendingDeeds.filter(id=>id!==deed.id);log.deeds.push(deed.id);p.points=(p.points||0)+deed.pts}
  }
  save();renderParentDeeds();toast(approve?'✅ تمت الموافقة':'❌ تم الرفض');
}
function renderParentLog(){
  const filter=document.getElementById('log-filter-child')?.value;const el=document.getElementById('parent-log-list');
  let entries=[];
  STATE.profiles.filter(p=>!filter||p.id===filter).forEach(p=>(p.activityLog||[]).slice(0,20).forEach(l=>entries.push({...l,pName:p.name,pAv:p.avatar})));
  entries.sort((a,b)=>new Date(b.time)-new Date(a.time));entries=entries.slice(0,30);
  const stl={pending:'log-pending',approved:'log-approved',rejected:'log-rejected'};
  const stLbl={pending:'⏳',approved:'✅',rejected:'❌'};
  el.innerHTML=entries.length?entries.map(l=>`<div class="log-item ${stl[l.status]||''}"><div class="flex gap-8"><span>${l.pAv}</span><div style="flex:1"><div class="text-sm bold">${l.pName}: ${l.action}</div><div class="log-meta"><span>${new Date(l.time).toLocaleDateString('ar-SA',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><span style="color:${l.pts>=0?'var(--green)':'var(--rose)'};font-weight:700">${l.pts>=0?'+':''}${l.pts}</span><span>${stLbl[l.status]||''}</span></div></div></div></div>`).join(''):'<p class="text-muted text-sm text-center">لا توجد سجلات</p>';
}
function addBadDeed(){
  const bsel=document.getElementById('bad-deed-select');const csel=document.getElementById('bad-deed-child');
  const badId=bsel?.value;const childId=csel?.value;
  if(!badId||!childId){toast('⚠️ اختر السلوك والطفل');return}
  const bd=STATE.badDeeds.find(b=>b.id===badId);const p=STATE.profiles.find(x=>x.id===childId);
  if(!bd||!p){toast('⚠️ بيانات غير صحيحة');return}
  const log=dayLog(p);if(!log.badDeeds)log.badDeeds=[];log.badDeeds.push({id:badId,time:Date.now()});
  p.points=Math.max(0,(p.points||0)+bd.pts);addActivityLog(p,'ملاحظة: '+bd.name,bd.pts,'approved');
  ptsPopup(bd.pts);save();toast('تم إضافة الملاحظة لـ '+p.name);
}
function editPoints(add){
  const csel=document.getElementById('edit-pts-child');const vEl=document.getElementById('edit-pts-val');
  const childId=csel?.value;const val=parseInt(vEl?.value||0);
  if(!childId||isNaN(val)||val<=0){toast('⚠️ اختر الطفل وأدخل عدد النقاط');return}
  const p=STATE.profiles.find(x=>x.id===childId);if(!p)return;
  const change=add?val:-val;p.points=Math.max(0,(p.points||0)+change);
  if(add){p.competitionPoints=Math.max(0,(p.competitionPoints||0)+change);}
  addActivityLog(p,(add?'إضافة':'خصم')+' نقاط من الوالد',change,'approved');
  save();renderParentChildren();if(vEl)vEl.value='';toast((add?'✅ أضفت ':' خصمت ')+val+' نقطة لـ '+p.name);
}
function editGems(add){
  const csel=document.getElementById('edit-gems-child');const vEl=document.getElementById('edit-gems-val');
  const childId=csel?.value;const val=parseInt(vEl?.value||0);
  if(!childId||isNaN(val)||val<=0){toast('⚠️ اختر الطفل وأدخل عدد الجواهر');return}
  const p=STATE.profiles.find(x=>x.id===childId);if(!p)return;
  if(add){
    p.gems=(p.gems||0)+val;
    addActivityLog(p,'هدية جواهر من الوالد 💎',val,'approved');
    toast('💎 أضفت '+val+' جوهرة لـ '+p.name);
  } else {
    p.gems=Math.max(0,(p.gems||0)-val);
    addActivityLog(p,'خصم جواهر',-val,'approved');
    toast('💎 خصمت '+val+' جوهرة من '+p.name);
  }
  save();renderParentChildren();if(vEl)vEl.value='';
}
function addReward(){
  const csel=document.getElementById('rew-child');
  const reason=document.getElementById('rew-desc')?.value.trim();
  const childId=csel?.value;
  if(!childId){toast('⚠️ اختر الطفل أولاً');return}
  if(!selectedRewardPreset){toast('⚠️ اختر مكافأة');return}
  if(!reason){toast('⚠️ اكتب سبب المكافأة');return}
  const p=STATE.profiles.find(x=>x.id===childId);if(!p)return;
  const preset=REWARD_PRESETS.find(r=>r.id===selectedRewardPreset)||REWARD_PRESETS[0];
  if(!STATE.rewards)STATE.rewards=[];
  STATE.rewards.push({
    id: crypto?.randomUUID ? crypto.randomUUID() : ('rw_'+Date.now()+'_'+Math.floor(Math.random()*1e6)),
    childId, childName:p.name, childAv:p.avatar,
    text: `${preset.icon} ${preset.title} — ${reason}`,
    presetId: preset.id,
    pts: GIFT_DEFAULT_POINTS,
    gems: GIFT_DEFAULT_GEMS,
    time: Date.now(),
    claimed: false,
    claimedAt: null
  });
  save();renderRewards();
  const dEl=document.getElementById('rew-desc'); if(dEl) dEl.value='';
  toast('🎁 تم إرسال الهدية للطفل!');
}
function renderRewards(){
  const el=document.getElementById('rewards-list');
  const rws=STATE.rewards||[];
  if(!el) return;
  if(!rws.length){el.innerHTML='<p class="text-muted text-sm text-center">لا توجد هدايا بعد</p>';return}
  el.innerHTML=[...rws].reverse().map((r,i)=>{
    const idx=(rws.length-1-i);
    const when=new Date(r.time).toLocaleDateString('ar-SA',{month:'short',day:'numeric'});
    const claimed=r.claimed?`<span class="badge" style="background:var(--green)">تم الاستلام ✅</span>`:`<span class="badge" style="background:var(--accent)">قيد الانتظار ⏳</span>`;
    return `<div class="log-item">
      <div class="flex gap-8">
        <span style="font-size:1.6rem">${r.childAv||'🎁'}</span>
        <div style="flex:1;min-width:0">
          <div class="bold text-sm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.childName||''}: ${(r.text||r.desc||'').toString()}</div>
          <div class="text-xs text-muted flex gap-8" style="align-items:center;flex-wrap:wrap">
            <span>${when}</span>
            <span class="badge">⭐ +${r.pts??GIFT_DEFAULT_POINTS}</span>
            <span class="badge">💎 +${r.gems??GIFT_DEFAULT_GEMS}</span>
            ${claimed}
          </div>
        </div>
        <button class="btn btn-danger btn-sm" data-ri="${idx}">🗑️</button>
      </div>
    </div>`;
  }).join('');
  el.querySelectorAll('[data-ri]').forEach(b=>b.addEventListener('click',()=>{
    const i=parseInt(b.dataset.ri);
    if(Number.isNaN(i)) return;
    STATE.rewards.splice(i,1);save();renderRewards();
  }));
}
function saveTimetable(){
  try{const d=JSON.parse(document.getElementById('tt-json').value);if(Array.isArray(d)&&d.length){STATE.timetable=d;save();toast('✅ تم حفظ الجدول!')}}catch{toast('⚠️ خطأ في صيغة JSON')}
}
function resetMonth(){
  if(!confirm('هل أنت متأكد؟ سيُحذف كل التقدم!'))return;
  STATE.profiles.forEach(p=>{p.points=0;p.streak=0;p.maxStreak=0;p.logs={};p.achievements=[];p.graceTokens=3;p.seenQuestions=[];p.activityLog=[];p.inventory=[]});
  STATE.eidConfirmed=false;STATE.eidModalShown=false;STATE.ramadanDays=30;STATE.rewards=[];
  save();showScreen('home');toast('✅ تمت إعادة التعيين');
}
// Custom Questions
function renderCustomQuestions(){
  const cq=STATE.customQuestions||[];const search=document.getElementById('cq-search')?.value?.toLowerCase()||'';
  const filtered=search?cq.filter(q=>q.q.toLowerCase().includes(search)):cq;
  document.getElementById('cq-count').textContent=cq.length;
  const el=document.getElementById('cq-list');
  if(!filtered.length){el.innerHTML='<p class="text-muted text-sm text-center mt-8">لا توجد أسئلة</p>';return}
  el.innerHTML=filtered.map((q,i)=>`<div style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--bdr)"><span style="flex:1;font-size:0.82rem">${q.q.substring(0,50)}…</span><span class="badge" style="font-size:0.68rem">${q.diff==='hard'?'صعب':q.diff==='medium'?'متوسط':'سهل'}</span><button class="btn btn-danger btn-sm" data-ci="${i}">🗑️</button></div>`).join('');
  el.querySelectorAll('[data-ci]').forEach(b=>b.addEventListener('click',()=>{STATE.customQuestions.splice(parseInt(b.dataset.ci),1);save();renderCustomQuestions()}));
}
function addCustomQuestion(){
  const q=document.getElementById('cq-q').value.trim();const opts=['a','b','c','d'].map(x=>document.getElementById('cq-'+x).value.trim());
  const correct=parseInt(document.getElementById('cq-correct').value);const diff=document.getElementById('cq-diff').value;
  if(!q){toast('✏️ اكتب السؤال');return}if(opts.some(o=>!o)){toast('⚠️ أكمل كل الخيارات');return}
  const pts={easy:10,medium:15,hard:25}[diff]||10;
  if(!STATE.customQuestions)STATE.customQuestions=[];
  STATE.customQuestions.push({id:'cq_'+Date.now(),q,o:opts,a:correct,c:'مخصص',p:pts,diff});
  save();document.getElementById('cq-q').value='';['a','b','c','d'].forEach(x=>{document.getElementById('cq-'+x).value=''});renderCustomQuestions();toast('✅ تم إضافة السؤال!');
}

// ============================================================
// QUIZ
// ============================================================
// Start quiz for a specific Ramadan day (from path map)
async function startQuizForDay(ramadanDay){
  const p=prf();if(!p)return;
  const td=STATE.timetable.find(t=>t.ramadanDay===ramadanDay);
  if(!td){toast('⚠️ لا توجد بيانات لهذا اليوم');return}
  const todayTd=todayTT();
  const todayDay=todayTd?todayTd.ramadanDay:1;
  if(ramadanDay>todayDay){toast('🔒 هذا اليوم لم يأت بعد');return}
  // المسابقة تفتح تلقائياً من بداية اليوم 00:00 (بدون تحديد توقيت داخل التطبيق)
  const log=dayLog(p,td.dateISO);
  // Helper: hide map and show quiz-container
  const showQ=()=>{
    const map=document.getElementById('quiz-path-map');
    if(map)map.style.display='none';
    const qc=document.getElementById('quiz-container');
    if(qc)qc.style.display='';
  };
  if(log.quizDone){
    showQ();
    const qc=document.getElementById('quiz-container');
    const doneStars=(log.quizScore||0)>=70?'⭐⭐⭐':(log.quizScore||0)>=40?'⭐⭐':'⭐';
    if(qc)qc.innerHTML=`
      <div style="text-align:center;padding:30px 10px">
        <div style="font-size:2.5rem;margin-bottom:8px">${doneStars}</div>
        <div style="font-size:1.2rem;font-weight:900;color:var(--accent);margin-bottom:10px">أجبت يوم ${ramadanDay} ✅</div>
        <div class="card" style="margin-bottom:14px;text-align:right">
          <div>🎯 نقاطك: <span style="color:var(--accent);font-weight:900">${log.quizScore||0} نقطة</span></div>
        </div>
        <button class="btn btn-primary btn-block" id="btn-back-to-map">← عودة للخريطة</button>
      </div>`;
    document.getElementById('btn-back-to-map')?.addEventListener('click',()=>{
      const qc2=document.getElementById('quiz-container');
      if(qc2){qc2.innerHTML='';qc2.style.display='none';}
      const m=document.getElementById('quiz-path-map');
      if(m){m.style.display='';renderQuizPath(p);}
    });
    return;
  }
  if(QZ.saved&&QZ.saved.profileId===p.id&&QZ.saved.date===td.dateISO&&!log.quizDone){
    QZ={...QZ.saved,active:true,_targetDate:td.dateISO,_ramadanDay:ramadanDay};
    showQ();renderQuizQ();return;
  }
  await loadQuiz();
  const seen=new Set(p.seenQuestions||[]);const custom=STATE.customQuestions||[];
  let pool=[...(STATE.quizQuestions||[]),...custom].filter(q=>!seen.has(q.id));
  if(pool.length<5){p.seenQuestions=[];save();pool=[...(STATE.quizQuestions||[]),...custom];}
  const byDiff={easy:[],medium:[],hard:[]};
  pool.forEach(q=>{const d=q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard');(byDiff[d]||(byDiff.easy)).push(q)});
  const pick=(arr,n)=>{
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a.slice(0,Math.min(n,a.length));
  };
  // توزيع ثابت لكل يوم: 4 سهلة + 3 متوسطة + 3 صعبة
  const qs=[...pick(byDiff.easy,4),...pick(byDiff.medium,3),...pick(byDiff.hard,3)];
  if(qs.length<3){const rest=pool.sort(()=>Math.random()-.5);qs.push(...rest.slice(0,10-qs.length))}
  QZ={active:true,qs:qs.slice(0,10),cur:0,score:0,answers:[],profileId:p.id,
      date:td.dateISO,_targetDate:td.dateISO,_ramadanDay:ramadanDay,saved:null};
  showQ();renderQuizQ();
}
function renderQuizQ(){
  const q=QZ.qs[QZ.cur];if(!q){finishQuiz();return}
  const n=QZ.cur+1;const total=QZ.qs.length;const pct=Math.round(QZ.cur/total*100);
  const diffLabel={easy:'سهل 🟢',medium:'متوسط 🟡',hard:'صعب 🔴'};const dl=diffLabel[q.diff||(q.p<=10?'easy':q.p<=20?'medium':'hard')]||'';
  document.getElementById('quiz-container').innerHTML=`
    <div class="quiz-shell">
      <div class="quiz-prog"><div class="quiz-prog-fill" style="width:${pct}%"></div></div>
    <div class="quiz-meta">
      <span class="text-muted bold">${n} / ${total}</span>
      <span style="background:var(--surf);padding:3px 9px;border-radius:18px;font-size:0.72rem">${q.c||''} ${dl}</span>
      <span class="text-accent bold">⭐ ${QZ.score}</span>
    </div>
    <div class="quiz-q">${q.q}</div>
    <div class="quiz-opts" id="quiz-opts">${q.o.map((opt,i)=>`<button class="quiz-opt" data-qi="${i}">${opt}</button>`).join('')}</div>
    <div id="quiz-fb" class="quiz-fb hidden"></div>
    <div class="flex gap-8 mt-12"><button class="btn btn-ghost btn-sm" id="btn-quiz-save">💾 حفظ والمتابعة لاحقاً</button></div>
    </div>`;
  document.querySelectorAll('.quiz-opt').forEach(b=>b.addEventListener('click',()=>answerQ(parseInt(b.dataset.qi))));
  document.getElementById('btn-quiz-save').addEventListener('click',()=>{
    QZ.saved={...QZ,active:false};QZ.active=false;saveLocal();
    const qc=document.getElementById('quiz-container');
    if(qc){qc.innerHTML='';qc.style.display='none';}
    const m=document.getElementById('quiz-path-map');
    if(m){m.style.display='';renderQuizPath(prf());}
    toast('💾 تم حفظ تقدمك! يمكنك المتابعة لاحقاً');
  });
}
function answerQ(sel){
  if(!QZ.active)return;const q=QZ.qs[QZ.cur];
  document.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  const correct=sel===q.a;const pts=correct?(q.p||10):0;QZ.score+=pts;QZ.answers=QZ.answers||[];QZ.answers.push({qid:q.id,correct,sel});
  document.querySelectorAll('.quiz-opt').forEach((b,i)=>{if(i===q.a)b.classList.add('correct');else if(i===sel&&!correct)b.classList.add('wrong')});
  const fb=document.getElementById('quiz-fb');fb.className='quiz-fb '+(correct?'correct':'wrong');
  fb.textContent=correct?`✅ ممتاز! +${pts} نقطة`:`❌ الجواب الصحيح: ${q.o[q.a]}`;fb.classList.remove('hidden');
  setTimeout(()=>{QZ.cur++;QZ.cur>=QZ.qs.length?finishQuiz():renderQuizQ()},1900);
}
function finishQuiz(){
  QZ.active=false;QZ.saved=null;const p=prf();if(!p)return;
  const total=QZ.qs.length;const correct=(QZ.answers||[]).filter(a=>a.correct).length;const pts=QZ.score;
  // Write to the correct day's log (may be today or a past day from path map)
  const targetDate=QZ._targetDate||todayISO();
  const log=dayLog(p,targetDate);log.quizDone=true;log.quizScore=pts;
  const dayNum=QZ._ramadanDay||'';
  p.seenQuestions=[...(p.seenQuestions||[]),...QZ.qs.map(q=>q.id)];
  p.points=(p.points||0)+pts;p.competitionPoints=(p.competitionPoints||0)+pts;
  if(correct===total&&total>0){if(!p.achievements)p.achievements=[];if(!p.achievements.includes('quizPerf'))p.achievements.push('quizPerf')}
  addActivityLog(p,'مسابقة يوم '+(dayNum||'')+'٫ '+correct+'/'+total,pts,'approved');save();
  const stars=correct>=total?'⭐⭐⭐':correct>=Math.ceil(total*0.7)?'⭐⭐':'⭐';
  const pct=Math.round(correct/total*100);
  const msg=correct>=total?'🏆 مثالي! إجاباتك كلها صح!':correct>=Math.ceil(total*0.7)?'🌟 رائع! أنت عارف كبير!':correct>=Math.ceil(total*0.5)?'💪 كويس! استمر في التعلم':'📚 راجع الأسئلة وحاول تاني!';
  document.getElementById('quiz-container').innerHTML=`
    <div style="text-align:center;padding:16px 0 8px">
      <div style="font-size:3rem;margin-bottom:6px">${stars}</div>
      <div style="font-size:1.3rem;font-weight:900;color:var(--accent);margin-bottom:12px">اليوم ${dayNum} — انتهت! 🎉</div>
      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-weight:700">✅ إجابات صح</span>
          <span style="font-weight:900;color:var(--accent)">${correct} / ${total}</span>
        </div>
        <div style="background:rgba(255,255,255,.1);border-radius:8px;height:10px;overflow:hidden;margin-bottom:8px">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#27ae60,#f0b429);border-radius:8px;transition:width .5s"></div>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">🎯 النقاط</span>
          <span style="font-weight:900;color:#f0b429">+${pts} نقطة</span>
        </div>
      </div>
      <div style="font-size:0.9rem;font-weight:700;color:var(--text);margin-bottom:16px;padding:8px 12px;background:rgba(240,180,41,0.1);border-radius:10px">${msg}</div>
      <button class="btn btn-primary btn-block" id="btn-qhome" style="margin-bottom:8px">🗺️ عودة للخريطة</button>
      <button class="btn btn-ghost btn-block btn-sm" id="btn-qhome2">🏠 الصفحة الرئيسية</button>
    </div>`;
  document.getElementById('btn-qhome').addEventListener('click',()=>{
    QZ.active=false;
    const qc=document.getElementById('quiz-container');
    if(qc){qc.innerHTML='';qc.style.display='none';}
    const m=document.getElementById('quiz-path-map');
    if(m){m.style.display='';renderQuizPath(prf());}
  });
  document.getElementById('btn-qhome2')?.addEventListener('click',()=>{
    QZ.active=false;
    const qc=document.getElementById('quiz-container');
    if(qc){qc.innerHTML='';qc.style.display='none';}
    showScreen('home');
  });
  if(pts>0)confetti();toast(`🎉 +${pts} نقطة أضيفت لرصيدك!`);
}

// ============================================================
// EID
// ============================================================
function checkEidNotif(){
  if(STATE.eidConfirmed||STATE.eidModalShown)return;const td=todayTT();if(!td)return;const now=new Date();
  const day29=STATE.timetable.find(d=>d.ramadanDay===29);if(!day29)return;
  if((td.ramadanDay===29||td.ramadanDay===30)&&now>=new Date(day29.dateISO+'T20:00:00')){STATE.eidModalShown=true;save();showModal('m-eid-q')}
}
function answerEid(yes){
  closeModal('m-eid-q');STATE.eidConfirmed=true;STATE.ramadanDays=yes?29:30;save();
  if(yes){const sorted=[...STATE.profiles].sort((a,b)=>(b.points||0)-(a.points||0))[0];if(sorted){document.getElementById('win-av').textContent=sorted.avatar;document.getElementById('win-name').textContent=sorted.name;document.getElementById('win-pts').textContent=(sorted.points||0)+' نقطة'}showModal('m-eid-cel');confetti();setTimeout(confetti,800);setTimeout(confetti,1600)}
  else toast('🌙 نكمل صيام غداً — اليوم الثلاثين!');
}

// ============================================================
// MODALS / TOAST / CONFETTI
// ============================================================
function showModal(id){const el=document.getElementById(id);if(el)el.classList.remove('hidden')}
function closeModal(id){const el=document.getElementById(id);if(el)el.classList.add('hidden')}
let toastTmr=null;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');if(toastTmr)clearTimeout(toastTmr);toastTmr=setTimeout(()=>el.classList.remove('show'),2800)}
function confetti(){
  const cols=['#f0b429','#38c9b0','#e85d75','#9b59b6','#3498db','#2ecc71'];
  for(let i=0;i<40;i++){const el=document.createElement('div');el.className='conf-p';el.style.cssText=`left:${Math.random()*100}vw;top:-10px;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${cols[Math.floor(Math.random()*cols.length)]};animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*0.4}s`;document.body.appendChild(el);setTimeout(()=>el.remove(),3000)}
}

// ============================================================
// PWA / NOTIF / SERVICE WORKER
// ============================================================
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.getElementById('install-bar-welcome').classList.remove('hidden')});
function installPWA(){if(installPrompt){installPrompt.prompt();installPrompt.userChoice.then(r=>{if(r.outcome==='accepted')toast('✅ تم تثبيت التطبيق!')})}else toast('ℹ️ اضغط "إضافة إلى الشاشة الرئيسية" من قائمة المتصفح')}
async function requestNotif(){if(!('Notification' in window)){toast('⚠️ المتصفح لا يدعم التنبيهات');return}const perm=await Notification.requestPermission();notifGranted=perm==='granted';if(notifGranted){toast('✅ تم تفعيل التنبيهات!');document.getElementById('notif-bar').classList.add('hidden')}else toast('❌ لم يتم قبول الإذن')}
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./service-worker.js').then(reg=>{
      reg.addEventListener('updatefound',()=>{
        const nw=reg.installing;
        nw.addEventListener('statechange',()=>{
          if(nw.state==='installed'&&navigator.serviceWorker.controller){
            toast('🔄 تحديث جديد! أعد تشغيل التطبيق للحصول عليه.');
          }
        });
      });
    }).catch(()=>{});
  });
}

// ============================================================
// WELCOME EXISTING PROFILES
// ============================================================
function renderWelcomeProfiles(){
  const el=document.getElementById('existing-profiles');if(!el)return;
  const localId=getLocalSession();
  const myProfile=localId?STATE.profiles.find(p=>p.id===localId):null;
  if(myProfile){
    // This device has a profile — show only it, auto-redirect
    el.innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(240,180,41,0.15),rgba(240,180,41,0.05));border:2px solid var(--accent);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:4px">
        <span style="font-size:2.2rem">${myProfile.avatar}</span>
        <div style="flex:1;text-align:right">
          <div class="bold">${myProfile.name}</div>
          <div class="text-xs text-muted">${myProfile.points||0} نقطة • ${getLevel(myProfile.points||0).name}</div>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-my-profile-enter">← ادخل</button>
      </div>`;
    document.getElementById('btn-my-profile-enter')?.addEventListener('click',()=>switchProfile(myProfile.id));
  } else {
    // No session yet — show "create new profile" hint only
    el.innerHTML='';
  }
}

// ============================================================
// INIT
// ============================================================
async function init(){
  await load();
  // Restore this device's local session
  const localId = getLocalSession();
  if(localId && STATE.profiles.find(p=>p.id===localId)){
    STATE.currentId = localId;
    // Apply this profile's theme
    loadProfileTheme();
    await loadTT();loadQuiz();
    if(STATE.familyCode) subscribeToFamily();
    if(typeof Notification!=='undefined'&&Notification.permission==='granted')notifGranted=true;
    wireButtons();
    // Auto-go to home — no welcome screen needed
    showScreen('home');
    startTimers();
    renderHome();
    return; // skip the rest
  } else if(localId){
    setLocalSession(null);
    STATE.currentId = null;
  }
  loadProfileTheme();
  await loadTT();loadQuiz();
  if(STATE.familyCode) subscribeToFamily();
  if(typeof Notification!=='undefined'&&Notification.permission==='granted')notifGranted=true;
  wireButtons();
  // No session — show welcome screen
  renderWelcomeProfiles();
}

function wireButtons(){
  // Wire all buttons
  // (btn-start removed — replaced by role cards)
  // ===== ROLE SELECTION (Landing) =====
  document.getElementById('btn-role-kid').addEventListener('click',()=>{
    const localId=getLocalSession();
    const myProfile=localId?STATE.profiles.find(p=>p.id===localId):null;
    if(myProfile){
      // This device already has a profile — go directly, no choice
      switchProfile(myProfile.id);
    } else {
      // New device — create new profile
      initSetup();showScreen('setup');
    }
  });
  document.getElementById('btn-role-parent').addEventListener('click',()=>{
    showScreen('parent'); // parent PIN will be asked there
  });
  document.getElementById('btn-install').addEventListener('click',installPWA);
  document.getElementById('btn-back-welcome').addEventListener('click',()=>showScreen('welcome'));
  document.getElementById('btn-s0').addEventListener('click',()=>{
    const name=document.getElementById('s-name').value.trim();const age=parseInt(document.getElementById('s-age').value);
    if(!name){toast('✏️ اكتب اسمك أولاً');return}if(!age||age<3||age>16){toast('🔢 العمر يجب أن يكون بين 3 و 16');return}
    const fam=(document.getElementById('s-family-code')?.value||'').trim().toUpperCase();
    setupData.name=name.substring(0,30);setupData.age=age;setupData.familyCode=fam||'';showStep(1);
  });
  document.getElementById('btn-s1').addEventListener('click',()=>showStep(2));
  document.getElementById('btn-s2').addEventListener('click',()=>showStep(3));
  document.getElementById('btn-s3').addEventListener('click',()=>{
    const plan=genPlan(setupData.age,setupData.diff);
    document.getElementById('sl-d').value=plan.dhuhrDays;document.getElementById('sl-a').value=plan.asrDays;document.getElementById('sl-m').value=plan.maghribDays;
    document.getElementById('lbl-d').textContent=plan.dhuhrDays+' يوم';document.getElementById('lbl-a').textContent=plan.asrDays+' يوم';document.getElementById('lbl-m').textContent=plan.maghribDays+' يوم';
    document.getElementById('total-info').textContent='✅ المجموع: '+(plan.dhuhrDays+plan.asrDays+plan.maghribDays)+' يوماً';
    showStep(4);
  });
  document.getElementById('btn-s4').addEventListener('click',createProfile);
  // Nav
  document.querySelectorAll('.nav-btn[data-s]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.s)));
  // Home
  document.getElementById('btn-notif').addEventListener('click',requestNotif);
  document.getElementById('btn-quiz').addEventListener('click',()=>showScreen('quiz'));
  document.getElementById('btn-night').addEventListener('click',()=>showScreen('themes'));
  document.getElementById('btn-cert-home').addEventListener('click',()=>showScreen('certificate'));
  document.getElementById('btn-maghrib').addEventListener('click',claimMaghrib);
  // Modals
  document.querySelectorAll('#m-ate [data-r]').forEach(b=>b.addEventListener('click',()=>confirmAte(b.dataset.r)));
  document.getElementById('btn-cancel-ate').addEventListener('click',()=>closeModal('m-ate'));
  document.getElementById('btn-close-chest').addEventListener('click',()=>closeModal('m-chest'));
  document.getElementById('btn-close-theme').addEventListener('click',()=>closeModal('m-theme'));
  document.getElementById('btn-eid-yes').addEventListener('click',()=>answerEid(true));
  document.getElementById('btn-eid-no').addEventListener('click',()=>answerEid(false));
  document.getElementById('btn-eid-cert').addEventListener('click',()=>{closeModal('m-eid-cel');showScreen('certificate')});
  document.getElementById('btn-eid-close').addEventListener('click',()=>closeModal('m-eid-cel'));
  // Certificate
  document.getElementById('btn-cert-back').addEventListener('click',()=>showScreen('home'));
  // Quiz
  document.getElementById('btn-quiz-back').addEventListener('click',()=>{
    const m=document.getElementById('quiz-path-map');
    const qc=document.getElementById('quiz-container');
    const mapVisible = m && (m.style.display!== 'none');
    // إذا كنا على الخريطة (بدون سؤال مفتوح) ارجع للصفحة الرئيسية
    if(mapVisible && !QZ.active){
      showScreen('home');
      return;
    }
    // إذا كنا داخل الأسئلة: رجوع للخريطة
    if(QZ.active){QZ.saved={...QZ,active:false};saveLocal();}
    QZ.active=false;
    if(qc){qc.innerHTML='';qc.style.display='none';}
    if(m){m.style.display='';renderQuizPath(prf());}
  });
  // Parent
  document.getElementById('btn-parent-back').addEventListener('click',()=>showScreen('welcome'));
  document.getElementById('btn-pin').addEventListener('click',checkPin);
  document.getElementById('btn-save-pin').addEventListener('click',savePinSetup);
  document.getElementById('btn-forgot-pin').addEventListener('click',forgotPin);
  document.getElementById('pin-create-1').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('pin-create-2').focus()});
  document.getElementById('pin-create-2').addEventListener('keydown',e=>{if(e.key==='Enter')savePinSetup()});
  document.getElementById('math-ans').addEventListener('keydown',e=>{if(e.key==='Enter')checkPin()});
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>openParentTab(b.dataset.tab)));
  document.getElementById('btn-regen-code').addEventListener('click', async()=>{
    if(!confirm('تغيير الرمز سيقطع ربط الأجهزة الأخرى. متأكد؟'))return;
    STATE.familyCode=Math.random().toString(36).substring(2,8).toUpperCase();
    _realtimeSub=null;
    document.getElementById('family-code').textContent=STATE.familyCode;
    await testConnection();
  });
  document.getElementById('btn-test-conn').addEventListener('click', testConnection);
  document.getElementById('btn-add-bad').addEventListener('click',addBadDeed);
  document.getElementById('btn-add-pts').addEventListener('click',()=>editPoints(true));
  document.getElementById('btn-rem-pts').addEventListener('click',()=>editPoints(false));
  document.getElementById('btn-add-gems').addEventListener('click',()=>editGems(true));
  document.getElementById('btn-rem-gems').addEventListener('click',()=>editGems(false));
  document.getElementById('btn-add-rew').addEventListener('click',addReward);
  document.getElementById('btn-add-cq').addEventListener('click',addCustomQuestion);
  document.getElementById('cq-search').addEventListener('input',renderCustomQuestions);
  // تم إلغاء توقيت المسابقة اليومية
  const bSaveTT=document.getElementById('btn-save-tt');if(bSaveTT)bSaveTT.addEventListener('click',saveTimetable);
  document.getElementById('btn-reset').addEventListener('click',resetMonth);
  // FIX: Eid end-game controls (Phase 1.10)
  const endRam29=document.getElementById('btn-end-ramadan-29');
  const cont30=document.getElementById('btn-continue-30');
  if(endRam29)endRam29.addEventListener('click',()=>{if(!confirm('إنهاء رمضان بعد 29 يوماً وبدء احتفال العيد؟'))return;STATE.ramadanDays=29;STATE.eidConfirmed=true;save();showModal('m-eid-cel');toast('🎉 عيد مبارك!')});
  if(cont30)cont30.addEventListener('click',()=>{STATE.ramadanDays=30;save();toast('📅 سيستمر الشهر حتى اليوم 30');});
  document.getElementById('log-filter-child').addEventListener('change',renderParentLog);
  // Add profile
  const bGoShop=document.getElementById('btn-go-shop');if(bGoShop)bGoShop.addEventListener('click',()=>showScreen('shop'));
  // Themes back
  document.getElementById('btn-welcome-theme').addEventListener('click',()=>showScreen('themes'));
  document.getElementById('btn-themes-back').addEventListener('click',()=>showScreen(STATE.profiles.length?'home':'welcome'));
  // Notification prompt
  setTimeout(()=>{if(typeof Notification!=='undefined'&&Notification.permission==='default'&&STATE.profiles.length)document.getElementById('notif-bar').classList.remove('hidden')},3000);
}

document.addEventListener('DOMContentLoaded',init);
})();
