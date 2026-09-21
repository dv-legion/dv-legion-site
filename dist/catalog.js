'use strict';

const search=document.querySelector('#search');
const category=document.querySelector('#category');
const count=document.querySelector('#catalog-count');
const products=document.querySelector('#products');
const prev=document.querySelector('#prev');
const next=document.querySelector('#next');
const status=document.querySelector('#page-status');
const selectedCategory=document.querySelector('#selected-category');
const groupButtons=document.querySelectorAll('[data-category]');
const reset=document.querySelector('#reset');
const CART_KEY='dv-legion-b2b-cart';

let items=[];
let page=1;
const size=24;
const categoryOrder=['Водка','Вина','Игристые вина','Коньяк и бренди','Виски','Ром','Джин','Ликёры и аперитивы','Настойки и бальзамы','Коктейли и спиртные напитки','Плодовая продукция и напитки','Сидр','Безалкогольные напитки','Продукты и прочий ассортимент'];
const categoryLabel=value=>value==='Игристые вина'?'Игристые вина':value;
const normalize=value=>String(value||'').toLocaleLowerCase('ru').replaceAll('ё','е').replaceAll(',','.').replace(/\s+/g,' ').trim();
const getCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch{return[]}};
const setCart=cart=>{localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCartBadge()};
const updateCartBadge=()=>{const b=document.querySelector('#cart-count');if(b)b.textContent=getCart().reduce((s,x)=>s+(x.qty||1),0)};
function addToCart(item){
 const cart=getCart(); const found=cart.find(x=>x.code===item.code);
 if(found)found.qty=(found.qty||1)+1; else cart.push({code:item.code,name:item.name,category:item.category,qty:1});
 setCart(cart); openCart();
}
function openCart(){
 const drawer=document.querySelector('#cart-drawer'); if(!drawer)return;
 const list=drawer.querySelector('.cart-items'); const cart=getCart(); list.replaceChildren();
 if(!cart.length){const p=document.createElement('p');p.className='cart-empty';p.textContent='Корзина заявки пуста.';list.append(p)}
 for(const item of cart){
   const row=document.createElement('div');row.className='cart-item';
   const txt=document.createElement('div');txt.innerHTML='<strong></strong><small></small>';txt.querySelector('strong').textContent=item.name;txt.querySelector('small').textContent='Код '+item.code;
   const controls=document.createElement('div');controls.className='cart-qty';
   const minus=document.createElement('button');minus.type='button';minus.textContent='−';
   const qty=document.createElement('span');qty.textContent=item.qty||1;
   const plus=document.createElement('button');plus.type='button';plus.textContent='+';
   minus.onclick=()=>{const c=getCart();const x=c.find(z=>z.code===item.code);if(x){x.qty--;if(x.qty<=0)c.splice(c.indexOf(x),1)}setCart(c);openCart()};
   plus.onclick=()=>{const c=getCart();const x=c.find(z=>z.code===item.code);if(x)x.qty++;setCart(c);openCart()};
   controls.append(minus,qty,plus); row.append(txt,controls);list.append(row);
 }
 drawer.hidden=false; document.body.classList.add('cart-open');
}
function closeCart(){const d=document.querySelector('#cart-drawer');if(d)d.hidden=true;document.body.classList.remove('cart-open')}
function sendCartRequest(){
 const cart=getCart(); if(!cart.length)return;
 const lines=cart.map((x,i)=>(i+1)+'. '+x.name+' | код '+x.code+' | количество '+x.qty);
 const body=['Здравствуйте!','','Прошу подготовить коммерческие условия / счёт по позициям:','',...lines,'','Организация:','Контактное лицо:','Телефон:','Город:'].join('\n');
 location.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent('B2B-заявка с сайта ДВ Легион')+'&body='+encodeURIComponent(body);
}

function syncUrl(){
  const url=new URL(location.href);
  if(category.value) url.searchParams.set('category',category.value);
  else url.searchParams.delete('category');
  history.replaceState(null,'',url);
}

function render(){
  const words=normalize(search.value).split(' ').filter(Boolean);
  const filtered=items.filter(item=>(!category.value||item.category===category.value)&&words.every(word=>normalize(item.code+' '+item.name).includes(word))).sort((a,b)=>categoryOrder.indexOf(a.category)-categoryOrder.indexOf(b.category)||a.name.localeCompare(b.name,'ru'));
  selectedCategory.textContent=category.value?categoryLabel(category.value):'Все категории';
  for(const button of groupButtons) button.setAttribute('aria-pressed',String(button.dataset.category===category.value));
  const pages=Math.max(1,Math.ceil(filtered.length/size));
  page=Math.min(page,pages);
  products.replaceChildren();
  count.textContent=filtered.length?'Найдено позиций: '+filtered.length:'Ничего не найдено';
  if(!filtered.length){const message=document.createElement('p');message.className='catalog-empty';message.textContent='По вашему запросу ничего не найдено. Измените поиск или сбросьте фильтры.';products.append(message);}
  let lastCategory=null;
  for(const item of filtered.slice((page-1)*size,page*size)){
    if(!category.value&&lastCategory!==item.category){const heading=document.createElement('h2');heading.className='product-group-heading';heading.textContent=categoryLabel(item.category);products.append(heading);lastCategory=item.category;}
    const card=document.createElement('article');card.className='product';
    const media=document.createElement('div');media.className='product-media';
    const missing=()=>{media.replaceChildren();const text=document.createElement('span');text.className='product-photo-missing';text.textContent='Фото готовится';media.append(text);};
    if(item.image){const photo=document.createElement('img');photo.src=item.image;photo.alt=item.name;photo.loading='lazy';photo.decoding='async';photo.width=260;photo.height=280;photo.addEventListener('error',missing,{once:true});media.append(photo);if(item.imageSource){const source=document.createElement('a');source.className='photo-source';source.href=item.imageSource;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Источник';source.setAttribute('aria-label','Источник фотографии: '+item.name);media.append(source);}}else{missing();}
    const tag=document.createElement('p');tag.className='product-category';tag.textContent=categoryLabel(item.category);
    const title=document.createElement('h3');title.textContent=item.name;
    const code=document.createElement('p');code.className='product-code';code.textContent='Код: '+item.code;
    const link=document.createElement('a');link.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent('Запрос по ассортименту: '+item.code)+'&body='+encodeURIComponent('Здравствуйте!\nПрошу уточнить наличие, оптовую цену и условия поставки:\n'+item.name+'\nКод: '+item.code+'\n\nОрганизация:\nКоличество:\nТелефон:');link.textContent='Запросить условия ↗';
    const add=document.createElement('button');add.type='button';add.className='add-request';add.textContent='В заявку +';add.addEventListener('click',()=>addToCart(item));
card.append(media,tag,title,code,add,link);products.append(card);
  }
  status.textContent=filtered.length?'Страница '+page+' из '+pages:'Нет результатов';
  prev.disabled=page<=1;next.disabled=page>=pages;
}

for(const button of groupButtons){button.addEventListener('click',()=>{category.value=button.dataset.category;page=1;syncUrl();render();if(window.innerWidth<700)document.querySelector('.catalog-toolbar').scrollIntoView({behavior:'smooth',block:'start'});});}
search.addEventListener('input',()=>{page=1;render()});
category.addEventListener('change',()=>{page=1;syncUrl();render()});
reset.addEventListener('click',()=>{search.value='';category.value='';page=1;syncUrl();render();search.focus();});
prev.addEventListener('click',()=>{page--;render();document.querySelector('.catalog-result-row').scrollIntoView({block:'start'});});
next.addEventListener('click',()=>{page++;render();document.querySelector('.catalog-result-row').scrollIntoView({block:'start'});});

fetch('catalog-data.json').then(response=>{if(!response.ok)throw new Error('load');return response.json();}).then(data=>{if(!Array.isArray(data))throw new Error('format');items=data;const params=new URLSearchParams(location.search);const selected=params.get('category');const q=params.get('q');if(categoryOrder.includes(selected))category.value=selected;if(q)search.value=q;render();updateCartBadge();}).catch(()=>{count.textContent='Не удалось загрузить каталог. Обновите страницу или свяжитесь с нами: info@dv-legion.ru.';search.disabled=true;category.disabled=true;reset.disabled=true;});

document.addEventListener('DOMContentLoaded',()=>{
 updateCartBadge();
 document.querySelector('#cart-open')?.addEventListener('click',openCart);
 document.querySelector('#cart-close')?.addEventListener('click',closeCart);
 document.querySelector('#cart-send')?.addEventListener('click',sendCartRequest);
});
