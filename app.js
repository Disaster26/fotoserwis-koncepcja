(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function sc(){top.classList.toggle('sc',window.scrollY>8)}
  window.addEventListener('scroll',sc,{passive:true});sc();
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('open');bg.setAttribute('aria-expanded','false')})});
  // aktywna pozycja menu
  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(l){var t=document.querySelector(l.getAttribute('href'));if(t)io.observe(t)});
  }
  // karty: przeciaganie mysza + strzalki
  var tor=document.getElementById('tor');
  if(tor){
    var down=false,sx=0,sl=0,moved=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    window.addEventListener('pointerup',function(){if(!down)return;down=false;if(moved){var w=tor.querySelector('.karta').getBoundingClientRect().width+20;var t=Math.round(tor.scrollLeft/w)*w;tor.classList.remove('drag');tor.scrollTo({left:t,behavior:'smooth'})}else tor.classList.remove('drag')});
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    document.querySelectorAll('.nav button').forEach(function(b){b.addEventListener('click',function(){var w=tor.querySelector('.karta').getBoundingClientRect().width+20;tor.scrollBy({left:w*(+b.dataset.k),behavior:'smooth'})})});
  }
  // lightbox: zdjecia kart i pierwszego ekranu
  var imgs=[].slice.call(document.querySelectorAll('.hero picture img,.karta .foto img'));
  if(imgs.length){
    var ar='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    var lbx=document.createElement('div');lbx.className='lb';lbx.setAttribute('role','dialog');lbx.setAttribute('aria-modal','true');lbx.setAttribute('aria-label','Powiększone zdjęcie');
    lbx.innerHTML='<img alt=""><p></p><button type="button" class="x" aria-label="Zamknij"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button><button type="button" class="pv" aria-label="Poprzednie">'+ar+'</button><button type="button" class="nx" aria-label="Następne"><span style="display:grid;transform:scaleX(-1)">'+ar+'</span></button>';
    document.body.appendChild(lbx);
    var li=lbx.querySelector('img'),lp=lbx.querySelector('p'),cur=0,last=null;
    function big(im){if(im.dataset.big)return im.dataset.big;var c=(im.getAttribute('srcset')||'').split(',').map(function(x){return x.trim().split(' ')[0]});return c.length&&c[c.length-1]?c[c.length-1]:im.src}
    function cap(im){var k=im.closest('.karta');var h=k&&k.querySelector('h3');return (h?h.textContent+' - ':'')+im.alt}
    function show(i){cur=(i+imgs.length)%imgs.length;var im=imgs[cur];li.src=big(im);li.alt=im.alt;lp.innerHTML='';lp.appendChild(document.createTextNode(cap(im)));var s=document.createElement('span');s.textContent=(cur+1)+' / '+imgs.length;lp.appendChild(s)}
    function open(i){last=document.activeElement;show(i);lbx.classList.add('on');document.documentElement.style.overflow='hidden';lbx.querySelector('.x').focus()}
    function close(){lbx.classList.remove('on');document.documentElement.style.overflow='';li.removeAttribute('src');if(last&&last.focus)last.focus()}
    imgs.forEach(function(im,i){im.addEventListener('click',function(e){if(typeof moved!=='undefined'&&moved&&im.closest('.tor'))return;open(i)})});
    lbx.querySelector('.x').addEventListener('click',close);
    lbx.querySelector('.pv').addEventListener('click',function(){show(cur-1)});
    lbx.querySelector('.nx').addEventListener('click',function(){show(cur+1)});
    lbx.addEventListener('click',function(e){if(e.target===lbx)close()});
    document.addEventListener('keydown',function(e){if(!lbx.classList.contains('on'))return;if(e.key==='Escape')close();else if(e.key==='ArrowRight')show(cur+1);else if(e.key==='ArrowLeft')show(cur-1)});
    var tx=null;lbx.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
    lbx.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>45)show(cur+(dx<0?1:-1))},{passive:true});
  }
  // mapa przy przewinieciu
  var m=document.getElementById('mapa');
  function load(){if(m.dataset.ok)return;m.dataset.ok=1;var f=document.createElement('iframe');f.src=m.dataset.src;f.title='Mapa dojazdu - ul. Galileusza 8, Poznań';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';m.appendChild(f)}
  if(m){if('IntersectionObserver' in window){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){load();mo.disconnect()}},{rootMargin:'300px'});mo.observe(m)}else load()}
})();
