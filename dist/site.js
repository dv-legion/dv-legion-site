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

const revealItems=[...document.querySelectorAll('.reveal')];
if(revealItems.length){
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    revealItems.forEach((item,index)=>{
      item.style.transitionDelay=Math.min(index%4,3)*70+'ms';
      observer.observe(item);
    });
  }else{
    revealItems.forEach(item=>item.classList.add('is-visible'));
  }
}
