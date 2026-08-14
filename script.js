const modal=document.getElementById('serviceModal');const stepService=document.getElementById('stepService');const stepRegion=document.getElementById('stepRegion');let selectedService='';
function openModal(service=''){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(service){selectedService=service;stepService.hidden=true;stepRegion.hidden=false}else{stepService.hidden=false;stepRegion.hidden=true}}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-open-service]').forEach(b=>b.addEventListener('click',()=>openModal()));
document.querySelectorAll('.service-card').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.service)));
document.querySelectorAll('[data-modal-service]').forEach(b=>b.addEventListener('click',()=>{selectedService=b.dataset.modalService;stepService.hidden=true;stepRegion.hidden=false}));
document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>{const region=b.dataset.region;const text=`مرحبًا، أرغب بطلب ${selectedService || 'خدمة قانونية'} في منطقة ${region}. أرجو تزويدي بالتفاصيل.`;window.open(`https://wa.me/966506142113?text=${encodeURIComponent(text)}`,'_blank')}));
document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));
document.getElementById('backService').addEventListener('click',()=>{stepRegion.hidden=true;stepService.hidden=false});
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));
document.getElementById('langBtn').addEventListener('click',()=>alert('النسخة الإنجليزية ستُضاف في التحديث التالي.'));
