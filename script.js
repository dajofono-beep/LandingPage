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
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScrollFrame);ticking=true}},{passive:true});
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
