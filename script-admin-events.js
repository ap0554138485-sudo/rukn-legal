// No names, form contents, full URLs or query parameters leave the page.
(() => {
  const send = kind => {
    const body=JSON.stringify({kind});
    fetch('/api/activity/admin-events',{method:'POST',headers:{'Content-Type':'application/json','X-Faaid':'1'},body,keepalive:true,credentials:'same-origin'}).catch(()=>{});
  };
  send('page.view');
  window.addEventListener('hashchange',()=>send('page.view'));
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');if(!link)return;
    try{
      const url=new URL(link.href,location.href);
      if(url.hostname==='wa.me'||url.hostname==='api.whatsapp.com')send('whatsapp.click');
      else if(url.protocol==='tel:')send('phone.click');
    }catch{}
  },{capture:true});
})();
