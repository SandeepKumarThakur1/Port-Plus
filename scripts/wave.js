/* Feature pages 1-4: scroll reveal + follow-the-cursor wave */
(function(){
  var rv=document.querySelectorAll('.reveal');
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window&&!calm){
    document.documentElement.classList.add('js');
    var io=new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(el){io.observe(el)});
  }
  var sw=document.querySelector('.swell');if(!sw)return;
  var p=sw.querySelectorAll('path'),W=1200,H=200,base=128;
  var tx=600,fx=600,bx=600,pr=0,tp=0,on=true;
  function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
  function idle(x,t,a){return calm?0:a*Math.sin(x*.012+t*.0014)+a*.45*Math.sin(x*.031-t*.001+1)}
  function path(ys){var d='M0 '+ys[0].toFixed(1),i;for(i=1;i<ys.length;i++)d+=' L'+(i*20)+' '+ys[i].toFixed(1);return d+' L'+W+' '+H+' L0 '+H+' Z'}
  window.addEventListener('pointermove',function(e){
    var r=sw.getBoundingClientRect();
    tx=clamp((e.clientX-r.left)/r.width*W,-100,W+100);
    tp=.3+.7*(1-clamp(Math.abs(e.clientY-(r.top+r.height*.6))/(window.innerHeight*.75),0,1));
  },{passive:true});
  document.addEventListener('pointerleave',function(){tp=0});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){on=es[0].isIntersecting},{rootMargin:'160px'}).observe(sw);
  function frame(t){
    if(on){
      var i,x,f=[],b=[];
      fx+=(tx-fx)*.14;bx+=(tx-bx)*.07;pr+=(tp-pr)*.08;
      for(i=0;i<=60;i++){x=i*20;
        f.push(base-50*pr*Math.exp(-Math.pow(x-fx,2)/(2*110*110))+idle(x,t,4));
        b.push(base-9-34*pr*Math.exp(-Math.pow(x-bx,2)/(2*180*180))+idle(x+250,t*.8,3.5))}
      p[0].setAttribute('d',path(b));p[1].setAttribute('d',path(f));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
