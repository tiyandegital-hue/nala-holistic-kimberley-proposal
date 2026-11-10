
(function(){
"use strict";
var WA="https://wa.me/27742034855";
/* mobile nav */
var t=document.querySelector('.nav-toggle'),n=document.getElementById('mainnav');
if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});}
/* reveal on scroll */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
/* FAQ accordions */
document.querySelectorAll('.faq-q').forEach(function(btn){
 btn.addEventListener('click',function(){
  var open=btn.getAttribute('aria-expanded')==='true';
  btn.setAttribute('aria-expanded',open?'false':'true');
  var a=btn.nextElementSibling; if(a){a.hidden=open;}
 });
});
/* copy address */
var cp=document.getElementById('copyAddr');
if(cp){cp.addEventListener('click',function(){
 var addr='44a Nooitgedacht Street, Royldene, Kimberley, Northern Cape 8301, South Africa';
 var done=function(){var m=document.getElementById('copyMsg');if(m)m.textContent='Address copied.';};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(addr).then(done,done);}else{done();}
});}
/* gallery filters */
var fbtns=document.querySelectorAll('.filter-btn'),cards=document.querySelectorAll('.gal-card'),count=document.getElementById('galCount');
if(fbtns.length){
 fbtns.forEach(function(b){b.addEventListener('click',function(){
  fbtns.forEach(function(x){x.setAttribute('aria-pressed','false');});
  b.setAttribute('aria-pressed','true');
  var f=b.getAttribute('data-filter'),shown=0;
  cards.forEach(function(c){var show=(f==='all'||c.getAttribute('data-cat')===f);c.style.display=show?'':'none';if(show)shown++;});
  if(count)count.textContent='Showing '+shown+' of '+cards.length+' sample sets.';
 });});
}
/* ---- quiz ---- */
var Q=[
 {q:'What is the current condition of your natural nails?',sub:'Assess the baseline condition of your nail plates.',opts:[
  {t:'Thin, bendy, or peeling',d:'Damaged by rapid filing, manual peeling, or harsh chemical soaks.',s:{restoration:4}},
  {t:'Moderate integrity, edge chipping',d:'Plates grow normally but fracture at the sidewalls once past the fingertip.',s:{overlays:4}},
  {t:'Strong and resilient',d:'Naturally durable plates needing gentle shaping, cuticle care, and a clean finish.',s:{minimal:4}},
  {t:'Existing acrylics or thick product on nails',d:'Needs gentle, careful removal before any natural-health regrowth can begin.',s:{removal:10}}]},
 {q:'How do your hands spend most of the day?',sub:'Your daily hand use shapes how much support your nails need.',opts:[
  {t:'Mostly desk work',d:'Typing and light handling — nails face gentle, everyday wear.',s:{minimal:2,restoration:1}},
  {t:'Hands-on work all day',d:'Lifting, cleaning, or manual work — nails take regular knocks.',s:{overlays:3}},
  {t:'Very active — gym, sport, outdoors',d:'Frequent impact and water exposure put nails under real stress.',s:{overlays:3,restoration:1}},
  {t:'Light, careful use',d:'Hands are mostly protected and nails are rarely knocked about.',s:{minimal:2,restoration:1}}]},
 {q:'What look do you want to leave with?',sub:'The finish you love most points to the right treatment.',opts:[
  {t:'Barely there — clean and natural',d:'A neat, glossy, natural nail with nothing to hide.',s:{restoration:3,minimal:1}},
  {t:'A classic micro-French',d:'A fine white edge on a natural base — timeless and tidy.',s:{minimal:3}},
  {t:'Warm earth and terracotta tones',d:'Kalahari-inspired colour: terracotta, clay and sand.',s:{minimal:3,overlays:1}},
  {t:'Fine-line art and small details',d:'Delicate hand-painted detail, negative space, small accents.',s:{minimal:3}}]}
];
var REC={
 restoration:{title:'Natural-Nail Care & Restoration',why:'Your answers point to nails that need recovery first — care and strengthening before decoration.',detail:'A deep rehabilitation treatment for thin, peeling or stressed nails, with gentle strengthening and protection while the natural nail regrows.',treat:'restoration'},
 overlays:{title:'Structured Overlay',why:'Your nails need real support: a structured overlay adds strength shaped to your natural nail, so it can grow without breaking at the edges.',detail:'Targeted reinforcement layered over the natural nail plate, shaped to your nail’s own arch.',treat:'overlays'},
 minimal:{title:'Minimal Nail Designs',why:'Your nails are in good shape and you want a clean, intentional finish — minimal design is the right fit.',detail:'Hand-rendered minimal art on the natural plate: micro-French, negative space and fine-line detail in Kalahari earth tones.',treat:'minimal'},
 removal:{title:'Safe Removal & Aftercare',why:'Existing product needs to come off safely first — gentle removal protects the natural nail underneath before anything new begins.',detail:'Meticulous, non-damaging removal of existing overlays or product from another salon, with aftercare for the weeks after.',treat:'removal'}
};
var panel=document.getElementById('quizOpts');
if(panel){
 var step=0,answers=[null,null,null],sel=null;
 var phase=document.getElementById('quizPhase'),qt=document.getElementById('quizQ'),qs=document.getElementById('quizSub');
 var prev=document.getElementById('quizPrev'),next=document.getElementById('quizNext');
 function render(){
  var cur=Q[step];
  phase.textContent='Assessment • Question '+(step+1)+' of 3';
  qt.textContent=cur.q; qs.textContent=cur.sub; sel=answers[step];
  panel.innerHTML='';
  cur.opts.forEach(function(o,i){
   var b=document.createElement('button');
   b.type='button';b.className='opt';b.setAttribute('aria-pressed',answers[step]===i?'true':'false');
   b.innerHTML='<strong></strong><small></small>';
   b.querySelector('strong').textContent=o.t; b.querySelector('small').textContent=o.d;
   b.addEventListener('click',function(){
    answers[step]=i;sel=i;
    panel.querySelectorAll('.opt').forEach(function(x){x.setAttribute('aria-pressed','false');});
    b.setAttribute('aria-pressed','true'); next.disabled=false; updateRec();
   });
   panel.appendChild(b);
  });
  prev.disabled=(step===0);
  next.disabled=(answers[step]===null);
  next.textContent=(step===2)?'See my recommendation →':'Next →';
  updateRec();
 }
 function scores(){
  var s={restoration:0,overlays:0,minimal:0,removal:0};
  answers.forEach(function(a,i){if(a===null)return;var sc=Q[i].opts[a].s;Object.keys(sc).forEach(function(k){s[k]+=sc[k];});});
  return s;
 }
 function best(){
  var s=scores(),k='overlays',v=-1;
  ['restoration','overlays','minimal','removal'].forEach(function(key){if(s[key]>v){v=s[key];k=key;}});
  return (v<=0)?'overlays':k;
 }
 function updateRec(){
  var r=REC[best()];
  document.getElementById('recTitle').textContent=r.title;
  document.getElementById('recWhy').textContent=r.why;
  document.getElementById('recDetail').textContent=r.detail;
  document.getElementById('recBook').href='book.html?treatment='+r.treat;
 }
 prev.addEventListener('click',function(){if(step>0){step--;render();}});
 next.addEventListener('click',function(){
  if(answers[step]===null)return;
  if(step<2){step++;render();}
  else{document.getElementById('recTitle').scrollIntoView({behavior:'smooth',block:'center'});}
 });
 render();
}
/* ---- book form ---- */
var form=document.getElementById('reserveForm');
if(form){
 var dateEl=document.getElementById('fDate');
 var today=new Date(); today.setHours(0,0,0,0);
 dateEl.min=today.toISOString().split('T')[0];
 var params=new URLSearchParams(window.location.search);
 var pre=params.get('treatment');
 var treatEl=document.getElementById('fTreat');
 if(pre&&treatEl.querySelector('option[value="'+pre+'"]')){treatEl.value=pre;}
 function depositText(){
  var v=treatEl.value;
  var names={overlays:'Structured Overlays',minimal:'Minimal Nail Designs',restoration:'Natural-Nail Care & Restoration',removal:'Safe Removal & Aftercare'};
  var line=document.getElementById('depositLine'),sub=document.getElementById('depositSub');
  if(v){line.textContent='Deposit: 50% of the confirmed price for '+names[v]+' — amount confirmed with Denise';
   sub.textContent='The 50% deposit is non-refundable and payable immediately by EFT. Denise confirms the exact amount on WhatsApp before you pay.';}
  else{line.textContent='Deposit: 50% — amount confirmed with Denise';
   sub.textContent='Choose a treatment above. The 50% deposit is non-refundable and payable immediately; the amount is confirmed with Denise before you pay.';}
 }
 treatEl.addEventListener('change',depositText); depositText();
 function showErr(id,show){var e=document.getElementById(id);if(e)e.classList.toggle('show',!!show);}
 form.addEventListener('submit',function(ev){
  ev.preventDefault();
  var name=document.getElementById('fName').value.trim();
  var phone=document.getElementById('fPhone').value.trim();
  var date=dateEl.value, time=document.getElementById('fTime').value, treat=treatEl.value;
  var ok=true;
  showErr('errName',!name); if(!name)ok=false;
  showErr('errPhone',phone.length<7); if(phone.length<7)ok=false;
  var dOk=true;
  if(!date){dOk=false;}
  else{var d=new Date(date+'T12:00:00'); if(d.getDay()===0)dOk=false; if(d<today)dOk=false;}
  showErr('errDate',!dOk); if(!dOk)ok=false;
  showErr('errTime',!time); if(!time)ok=false;
  showErr('errTreat',!treat); if(!treat)ok=false;
  if(!ok)return;
  var tname=treatEl.options[treatEl.selectedIndex].textContent;
  var msg='Hello Denise, I would like to book at NALA HOLISTIC.\nName: '+name+'\nWhatsApp: '+phone+'\nDate: '+date+'\nTime: '+time+'\nTreatment: '+tname+'\nPlease confirm the price and the 50% deposit amount.';
  var url=WA+'?text='+encodeURIComponent(msg);
  document.getElementById('successSummary').textContent='Booking request for '+name+' — '+tname+', '+date+' at '+time+'. Tap below to send it to Denise on WhatsApp.';
  document.getElementById('waSend').href=url;
  document.getElementById('bookSuccess').classList.add('show');
  document.getElementById('bookSuccess').scrollIntoView({behavior:'smooth',block:'center'});
 });
}
})();
