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
    slides[current].querySelector('video')?.pause();
    slides[current].hidden=true;
    dots[current]?.classList.remove('active');
    current=next;
    slides[current].hidden=false;
    dots[current]?.classList.add('active');
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
