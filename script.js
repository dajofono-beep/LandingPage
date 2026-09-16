const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav-principal');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const sections=[...document.querySelectorAll('main section[id],header[id]')];
const links=[...document.querySelectorAll('.site-header nav a')];
window.addEventListener('scroll',()=>{let current='inicio';for(const section of sections){if(scrollY>=section.offsetTop-160)current=section.id}links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+current))},{passive:true});
