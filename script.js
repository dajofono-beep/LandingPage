const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav-principal');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const sections=[...document.querySelectorAll('main section[id],header[id]')];
const links=[...document.querySelectorAll('.site-header nav a')];
window.addEventListener('scroll',()=>{let current='inicio';for(const section of sections){if(scrollY>=section.offsetTop-160)current=section.id}links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+current))},{passive:true});

const carousel=document.querySelector('.video-carousel');
if(carousel){
  const slides=[...carousel.querySelectorAll('[data-video-slide]')];
  const dots=[...carousel.querySelectorAll('.video-dot')];
  const prevBtn=carousel.querySelector('.video-arrow-prev');
  const nextBtn=carousel.querySelector('.video-arrow-next');
  const dotsWrap=carousel.querySelector('.video-dots');
  let current=slides.findIndex(s=>!s.hidden);
  if(current<0)current=0;
  function goTo(i){
    const next=(i+slides.length)%slides.length;
    if(next===current)return;
    const outgoing=slides[current];
    const incoming=slides[next];
    outgoing.querySelector('video')?.pause();
    outgoing.classList.add('az-fade-out');
    dots[current]?.classList.remove('active');
    setTimeout(()=>{
      outgoing.hidden=true;
      outgoing.classList.remove('az-fade-out');
      incoming.hidden=false;
      incoming.classList.add('az-fade-in');
      requestAnimationFrame(()=>requestAnimationFrame(()=>incoming.classList.remove('az-fade-in')));
      current=next;
      dots[current]?.classList.add('active');
    },260);
  }
  prevBtn?.addEventListener('click',()=>goTo(current-1));
  nextBtn?.addEventListener('click',()=>goTo(current+1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>goTo(i)));
  if(slides.length<2){
    prevBtn?.setAttribute('hidden','');
    nextBtn?.setAttribute('hidden','');
    dotsWrap?.setAttribute('hidden','');
  }
}

/* ===== Build de evaluacion: mejoras dinamicas (no publicado) ===== */
const header=document.querySelector('.site-header');
const progressBar=document.querySelector('.scroll-progress');
const heroArt=document.querySelector('.hero-art');
const familyArt=document.querySelector('.family-art');
const familySection=document.querySelector('.family-section');
const sunMask=document.querySelector('.family-sun-mask');
const sunImg=document.querySelector('.family-sun');
const SUN_SRC_SIZE={w:2048,h:682};
const SUN_BBOX={x:1219,y:162,w:339,h:206};
const SUN_MAX_OFFSET=130;
const RIDGE_POINTS=[[0.0,0.2899],[0.5835,0.2899],[0.5854,0.5054],[0.5874,0.5019],[0.5894,0.4966],[0.5913,0.492],[0.5933,0.4891],[0.5952,0.4879],[0.5972,0.4864],[0.5991,0.4663],[0.6011,0.4519],[0.603,0.4277],[0.605,0.43],[0.6069,0.4321],[0.6089,0.4428],[0.6108,0.4621],[0.6128,0.4686],[0.6147,0.4715],[0.6167,0.4788],[0.6187,0.4851],[0.6206,0.486],[0.6226,0.4841],[0.6245,0.483],[0.6265,0.4862],[0.6284,0.4996],[0.6304,0.5109],[0.6323,0.5132],[0.6343,0.5165],[0.6362,0.5186],[0.6382,0.5176],[0.6401,0.5149],[0.6421,0.5119],[0.644,0.5096],[0.646,0.509],[0.6479,0.5105],[0.6499,0.5126],[0.6519,0.5145],[0.6538,0.5165],[0.6558,0.5165],[0.6577,0.5136],[0.6597,0.5103],[0.6616,0.5065],[0.6636,0.5034],[0.6655,0.5002],[0.6675,0.4969],[0.6694,0.4937],[0.6714,0.4914],[0.6733,0.4904],[0.6753,0.4908],[0.6772,0.4925],[0.6792,0.495],[0.6812,0.4971],[0.6831,0.4994],[0.6851,0.501],[0.687,0.5023],[0.689,0.5038],[0.6909,0.5031],[0.6929,0.4985],[0.6948,0.4933],[0.6968,0.4885],[0.6987,0.4837],[0.7007,0.4795],[0.7026,0.4751],[0.7046,0.4703],[0.7065,0.4654],[0.7085,0.4617],[0.7104,0.4594],[0.7124,0.4589],[0.7144,0.4592],[0.7163,0.4943],[0.7183,0.5633],[0.7202,0.5683],[0.7222,0.5572],[0.7241,0.553],[0.7261,0.5515],[0.728,0.5392],[0.73,0.5193],[0.7319,0.5128],[0.7339,0.5088],[0.7358,0.5069],[0.7378,0.5059],[0.7397,0.5021],[0.7417,0.4992],[0.7437,0.4985],[0.7456,0.4996],[0.7476,0.5017],[0.7495,0.5042],[0.7515,0.5078],[0.7534,0.513],[0.7554,0.5157],[0.7573,0.5151],[0.7593,0.5155],[0.7612,0.5191],[0.7632,0.5054],[0.7651,0.4585],[0.7671,0.4103],[0.769,0.393],[0.771,0.393],[0.7729,0.2796],[1.0,0.2796]];

function buildSkyClipPath(cw,scale,offsetX,offsetY){
  const screenPts=RIDGE_POINTS.map(([xf,yf])=>[offsetX+xf*SUN_SRC_SIZE.w*scale,offsetY+yf*SUN_SRC_SIZE.h*scale]);
  const rev=screenPts.slice().reverse();
  const parts=['0px 0px',cw+'px 0px'].concat(rev.map(([x,y])=>x.toFixed(1)+'px '+y.toFixed(1)+'px'));
  return 'polygon('+parts.join(',')+')';
}

function layoutSun(){
  if(!sunImg||!familySection||!sunMask)return;
  if(window.innerWidth<=640){sunMask.style.display='none';return}
  sunMask.style.display='';
  const cw=familySection.offsetWidth,ch=familySection.offsetHeight;
  const scale=Math.max(cw/SUN_SRC_SIZE.w,ch/SUN_SRC_SIZE.h);
  const renderedW=SUN_SRC_SIZE.w*scale,renderedH=SUN_SRC_SIZE.h*scale;
  const offsetX=(cw-renderedW)/2;
  const offsetY=ch-renderedH;
  const w=SUN_BBOX.w*scale,h=SUN_BBOX.h*scale;
  const cx=offsetX+(SUN_BBOX.x+SUN_BBOX.w/2)*scale;
  const cy=offsetY+(SUN_BBOX.y+SUN_BBOX.h/2)*scale;
  sunImg.style.width=w+'px';
  sunImg.style.height=h+'px';
  sunImg.style.left=(cx-w/2)+'px';
  sunImg.style.top=(cy-h/2)+'px';
  sunMask.style.clipPath=buildSkyClipPath(cw,scale,offsetX,offsetY);
}

let ticking=false;
function onScrollFrame(){
  const y=window.scrollY;
  header?.classList.toggle('is-scrolled',y>40);
  if(progressBar){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progressBar.style.width=(max>0?y/max*100:0)+'%';
  }
  if(heroArt){
    const r=heroArt.parentElement.getBoundingClientRect();
    heroArt.style.transform='translateY('+(r.top*-0.08)+'px)';
  }
  if(familyArt){
    const r=familyArt.parentElement.getBoundingClientRect();
    familyArt.style.transform='translateY('+(r.top*-0.06)+'px)';
  }
  if(sunImg&&familySection&&window.innerWidth>640){
    const r=familySection.getBoundingClientRect();
    const progress=Math.max(-1,Math.min(1,r.top/window.innerHeight));
    sunImg.style.transform='translateY('+(progress*SUN_MAX_OFFSET)+'px)';
  }
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScrollFrame);ticking=true}},{passive:true});
window.addEventListener('resize',layoutSun);
window.addEventListener('load',layoutSun);
if(familySection&&window.ResizeObserver){
  new ResizeObserver(layoutSun).observe(familySection);
}
layoutSun();
onScrollFrame();

const navList=document.querySelector('.site-header nav');
const navIndicator=document.querySelector('.nav-indicator');
function positionNavIndicator(){
  if(!navIndicator||window.innerWidth<=980)return;
  const activeLink=navList?.querySelector('a.active');
  if(!activeLink)return;
  navIndicator.style.left=activeLink.offsetLeft+'px';
  navIndicator.style.width=activeLink.offsetWidth+'px';
  navIndicator.style.opacity='1';
}
links.forEach(a=>{
  const obs=new MutationObserver(positionNavIndicator);
  obs.observe(a,{attributes:true,attributeFilter:['class']});
});
window.addEventListener('resize',positionNavIndicator);
window.addEventListener('load',positionNavIndicator);
setTimeout(positionNavIndicator,300);

const scene=document.querySelector('.product-scene');
const mockup=document.querySelector('.device-mockup');
const logoIcon=document.querySelector('.floating-icon');
if(scene&&mockup){
  scene.addEventListener('mousemove',e=>{
    const r=scene.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5;
    const py=(e.clientY-r.top)/r.height-0.5;
    const tilt='perspective(1000px) rotateX('+(-py*6).toFixed(2)+'deg) rotateY('+(px*8).toFixed(2)+'deg)';
    mockup.style.transition='none';
    mockup.style.transform=tilt;
    if(logoIcon){
      logoIcon.style.transition='none';
      logoIcon.style.transform=tilt;
    }
  });
  scene.addEventListener('mouseleave',()=>{
    mockup.style.transition='transform .5s ease';
    mockup.style.transform='none';
    if(logoIcon){
      logoIcon.style.transition='transform .5s ease';
      logoIcon.style.transform='none';
    }
  });
}

document.querySelectorAll('.button').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const r=btn.getBoundingClientRect();
    const ripple=document.createElement('span');
    ripple.className='az-ripple';
    const size=Math.max(r.width,r.height);
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-r.left-size/2)+'px';
    ripple.style.top=(e.clientY-r.top-size/2)+'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend',()=>ripple.remove());
  });
});
