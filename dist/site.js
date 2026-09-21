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
    if(e.target.closest('a')){
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.textContent='Меню';
    }
  });
}

const partnerForm=document.querySelector('#partner-form');
if(partnerForm){
 partnerForm.addEventListener('submit',e=>{
   e.preventDefault(); if(!partnerForm.reportValidity()) return;
   const data=new FormData(partnerForm), v=n=>String(data.get(n)||'').trim();
   const subject='Заявка на сотрудничество — '+v('company');
   const body=['Здравствуйте!','','Прошу связаться со мной по вопросу сотрудничества с ООО «ДВ Легион».','','Компания: '+v('company'),'Контактное лицо: '+v('name'),'Телефон: '+v('phone'),'Email: '+(v('email')||'—'),'Город: '+(v('city')||'—'),'','Комментарий:',v('message')||'—'].join('\n');
   const status=document.querySelector('#form-status');
   if(status)status.textContent='Открываем письмо на info@dv-legion.ru…';
   location.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 });
}

// Product consultant
const bot=document.createElement('section');
bot.className='consultant';
bot.innerHTML='<button class="consultant-launch" type="button" aria-expanded="false">Онлайн-консультант <span>●</span></button><div class="consultant-panel" hidden><div class="consultant-head"><div><strong>DV Консультант</strong><small>По ассортименту и B2B-условиям</small></div><button class="consultant-close" type="button" aria-label="Закрыть">×</button></div><div class="consultant-log" aria-live="polite"></div><div class="consultant-quick"><button type="button" data-q="вино">Вина</button><button type="button" data-q="водка">Водка</button><button type="button" data-q="виски">Виски</button><button type="button" data-q="игристое">Игристое</button></div><form class="consultant-form"><input type="text" placeholder="Например: сухое вино или виски" aria-label="Вопрос консультанту"><button type="submit">→</button></form></div>';
document.body.append(bot);

const launch=bot.querySelector('.consultant-launch');
const panel=bot.querySelector('.consultant-panel');
const closeBtn=bot.querySelector('.consultant-close');
const log=bot.querySelector('.consultant-log');
const form=bot.querySelector('.consultant-form');
const input=form.querySelector('input');
let consultantItems=[];

function addMsg(text,who='bot',links=[]){
 const row=document.createElement('div'); row.className='consultant-msg '+who;
 const p=document.createElement('p'); p.textContent=text; row.append(p);
 if(links.length){
   const box=document.createElement('div'); box.className='consultant-links';
   for(const x of links){ const a=document.createElement('a'); a.href=x.href; a.textContent=x.label; box.append(a); }
   row.append(box);
 }
 log.append(row); log.scrollTop=log.scrollHeight;
}
function norm(s){return String(s||'').toLocaleLowerCase('ru').replaceAll('ё','е').replace(/\s+/g,' ').trim();}
const cats=[
 ['вино','Вина'],['вина','Вина'],['игрист','Игристые вина'],['шампан','Игристые вина'],['водк','Водка'],['виски','Виски'],['коньяк','Коньяк и бренди'],['бренди','Коньяк и бренди'],['ром','Ром'],['джин','Джин'],['ликер','Ликёры и аперитивы'],['настой','Настойки и бальзамы'],['сидр','Сидр'],['безалког','Безалкогольные напитки']
];
function answerConsultant(q){
 const nq=norm(q);
 if(!nq)return;
 addMsg(q,'user');
 if(/цен|стоим|налич|остат|прайс/.test(nq)){
   addMsg('Оптовая цена и наличие подтверждаются менеджером. Я могу найти нужную позицию и подготовить переход в каталог.', 'bot', [{label:'Открыть каталог',href:'catalog.html'}]); return;
 }
 if(/достав|постав|услов|партнер|опт/.test(nq)){
   addMsg('ДВ Легион работает в B2B-формате. Условия поставки зависят от категории, объёма и точки поставки. Оставьте заявку — менеджер уточнит детали.', 'bot', [{label:'Стать партнёром',href:'partners.html#request'}]); return;
 }
 const cat=cats.find(([key])=>nq.includes(key));
 const words=nq.split(' ').filter(x=>x.length>2);
 const found=consultantItems.filter(i=>{
   const hay=norm((i.name||'')+' '+(i.code||'')+' '+(i.category||''));
   return words.every(w=>hay.includes(w));
 }).slice(0,4);
 if(found.length){
   addMsg('Нашёл подходящие позиции:', 'bot', found.map(i=>({label:i.name,href:'catalog.html?q='+encodeURIComponent(i.name)}))); return;
 }
 if(cat){
   addMsg('Открою категорию «'+cat[1]+'».', 'bot', [{label:'Смотреть '+cat[1],href:'catalog.html?category='+encodeURIComponent(cat[1])}]); return;
 }
 addMsg('Могу помочь найти товар по названию, коду или категории: вино, водка, виски, игристые вина, коньяк, ром, джин и другие направления.', 'bot', [{label:'Весь каталог',href:'catalog.html'}]);
}
launch.addEventListener('click',()=>{
 const isOpen=!panel.hidden; panel.hidden=isOpen; launch.setAttribute('aria-expanded',String(!isOpen));
 if(!isOpen&&log.children.length===0)addMsg('Здравствуйте! Я помогу найти продукцию в каталоге ДВ Легион и подскажу, как запросить оптовые условия.');
});
closeBtn.addEventListener('click',()=>{panel.hidden=true;launch.setAttribute('aria-expanded','false')});
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();input.value='';answerConsultant(q)});
bot.querySelector('.consultant-quick').addEventListener('click',e=>{const b=e.target.closest('button[data-q]');if(b)answerConsultant(b.dataset.q)});
fetch('catalog-data.json').then(r=>r.ok?r.json():[]).then(d=>{if(Array.isArray(d))consultantItems=d}).catch(()=>{});
