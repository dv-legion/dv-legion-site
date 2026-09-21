'use strict';

const menuButton=document.querySelector('.menu-toggle');
const mainNav=document.querySelector('#main-nav');

if(menuButton&&mainNav){
  menuButton.addEventListener('click',()=>{
    const open=document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.textContent=open?'Закрыть':'Меню';
  });
  mainNav.addEventListener('click',event=>{
    if(event.target.closest('a')){
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.textContent='Меню';
    }
  });
  window.addEventListener('resize',()=>{
    if(window.innerWidth>900){
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.textContent='Меню';
    }
  });
}

const partnerForm=document.querySelector('#partner-form');
if(partnerForm){
  partnerForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!partnerForm.reportValidity()) return;

    const data=new FormData(partnerForm);
    const value=name=>String(data.get(name)||'').trim();
    const subject='Заявка на сотрудничество — '+value('company');
    const body=[
      'Здравствуйте!',
      '',
      'Прошу связаться со мной по вопросу сотрудничества с ООО «ДВ Легион».',
      '',
      'Компания: '+value('company'),
      'Контактное лицо: '+value('name'),
      'Телефон: '+value('phone'),
      'Email: '+(value('email')||'—'),
      'Город: '+(value('city')||'—'),
      '',
      'Комментарий:',
      value('message')||'—'
    ].join('\n');

    const status=document.querySelector('#form-status');
    if(status) status.textContent='Открываем готовое письмо на info@dv-legion.ru…';
    window.location.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
}