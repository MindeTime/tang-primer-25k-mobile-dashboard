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
  }
})();
