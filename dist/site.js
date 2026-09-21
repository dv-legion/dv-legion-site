'use strict';
document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-toggle');
const mainNav=document.querySelector('#main-nav');
if(menuButton&&mainNav){
  menuButton.addEventListener('click',()=>{
    const open=document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.textContent=open?'Закрыть':'Меню';
  });
  mainNav.addEventListener('click',e=>{
    if(e.target.closest('a')){document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='Меню';}
  });
}
const partnerForm=document.querySelector('#partner-form');
if(partnerForm){
 partnerForm.addEventListener('submit',e=>{
   e.preventDefault(); if(!partnerForm.reportValidity()) return;
   const data=new FormData(partnerForm); const v=n=>String(data.get(n)||'').trim();
   const subject='Заявка на сотрудничество — '+v('company');
   const body=['Здравствуйте!','','Прошу связаться со мной по вопросу сотрудничества с ООО «ДВ Легион».','','Компания: '+v('company'),'Контактное лицо: '+v('name'),'Телефон: '+v('phone'),'Email: '+(v('email')||'—'),'Город: '+(v('city')||'—'),'','Комментарий:',v('message')||'—'].join('\n');
   const status=document.querySelector('#form-status'); if(status)status.textContent='Открываем письмо на info@dv-legion.ru…';
   location.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 });
}