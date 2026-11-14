/* Scroll reveal: each .reveal block fades in once as it enters view */
(function(){
  var rv=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;
  document.documentElement.classList.add('js');
  var io=new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.12});
  rv.forEach(function(el){io.observe(el)});
})();
