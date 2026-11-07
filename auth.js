(()=>{
  const LOGIN_FILE='login.html';
  const PASSWORD_SHA256='7b75ae2d2be0987f5d0d2edaf6580351300cc83db3cafc699fd69fddb2062044';
  const KEY='tang25k_site_access';
  const path=location.pathname;
  const isLogin=path.endsWith('/'+LOGIN_FILE)||path===LOGIN_FILE;
  const safeNext=()=>{
    const value=new URLSearchParams(location.search).get('next')||'index.html';
    return value.startsWith('/')&&!value.startsWith('//')?value:'index.html';
  };
  if(!isLogin && sessionStorage.getItem(KEY)!=='granted'){
    const next=location.pathname+location.search+location.hash;
    location.replace(LOGIN_FILE+'?next='+encodeURIComponent(next));
    return;
  }
  if(isLogin){
    document.addEventListener('DOMContentLoaded',()=>{
      const form=document.getElementById('login-form');
      const input=document.getElementById('site-password');
      const error=document.getElementById('login-error');
      if(sessionStorage.getItem(KEY)==='granted') location.replace(safeNext());
      form?.addEventListener('submit',async event=>{
        event.preventDefault();
        const button=form.querySelector('button');
        button.disabled=true;
        try{
          const bytes=new TextEncoder().encode(input.value);
          const digest=await crypto.subtle.digest('SHA-256',bytes);
          const actual=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
          if(actual===PASSWORD_SHA256){
            sessionStorage.setItem(KEY,'granted');
            location.replace(safeNext());
          }else{
            error.textContent='رمز عبور صحیح نیست. دوباره تلاش کنید.';
            input.value=''; input.focus(); button.disabled=false;
          }
        }catch(e){
          error.textContent='مرورگر امکان بررسی رمز را فراهم نکرد. لطفاً از مرورگر به‌روز استفاده کنید.';
          button.disabled=false;
        }
      });
    });
  }else{
    document.addEventListener('DOMContentLoaded',()=>{
      if(sessionStorage.getItem(KEY)!=='granted') return;
      if(document.getElementById('site-logout-button')) return;
      const button=document.createElement('button');
      button.id='site-logout-button';
      button.type='button';
      button.textContent='خروج از سایت';
      button.setAttribute('aria-label','خروج و قفل کردن دوباره سایت');
      button.style.cssText='position:fixed;top:14px;left:16px;z-index:99999;border:1px solid #d7e3e9;border-radius:10px;padding:10px 16px;background:#102f43;color:#fff;font:600 13px Tahoma,Arial,sans-serif;cursor:pointer;box-shadow:0 4px 14px #102f4330';
      button.addEventListener('click',()=>{
        sessionStorage.removeItem(KEY);
        const next=location.pathname+location.search+location.hash;
        location.replace(LOGIN_FILE+'?next='+encodeURIComponent(next));
      });
      document.body.appendChild(button);
    });
  }
})();