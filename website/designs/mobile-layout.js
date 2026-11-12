(() => {
 const header=document.querySelector('.site-header'),nav=header?.querySelector('.main-nav');
 if(!nav)return;
 nav.id='main-navigation';
 const button=document.createElement('button');
 button.className='mobile-nav-toggle';button.type='button';
 button.setAttribute('aria-label','Open navigation');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',nav.id);
 button.innerHTML='<span></span><span></span>';header.append(button);
 const close=()=>{nav.classList.remove('is-open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation');};
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
})();
