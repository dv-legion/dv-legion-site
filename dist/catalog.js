'use strict';
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const count = document.querySelector('#catalog-count');
const products = document.querySelector('#products');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const status = document.querySelector('#page-status');
let items = [], page = 1;
const size = 24;
const categoryOrder = ["Водка", "Вина", "Игристые вина", "Коньяк и бренди", "Виски", "Ром", "Джин", "Ликёры и аперитивы", "Настойки и бальзамы", "Коктейли и спиртные напитки", "Плодовая продукция и напитки", "Сидр", "Безалкогольные напитки", "Продукты и прочий ассортимент"];
const categoryLabel = value => value === "Игристые вина" ? "Шампанское и игристые вина" : value;
const groupButtons = document.querySelectorAll("[data-category]");
const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').replaceAll(',','.').replace(/\s+/g,' ').trim();
function render() {
 const words = normalize(search.value).split(' ').filter(Boolean);
 const filtered = items.filter(item => (!category.value || item.category === category.value) && words.every(word => normalize(item.code+' '+item.name).includes(word)));
 filtered.sort((a,b)=>categoryOrder.indexOf(a.category)-categoryOrder.indexOf(b.category)||a.name.localeCompare(b.name,'ru'));
 document.querySelector('#selected-category').textContent=category.value ? categoryLabel(category.value) : 'Все товары по видам';
 for (const button of groupButtons) button.setAttribute('aria-pressed',String(button.dataset.category===category.value));
 const pages = Math.max(1,Math.ceil(filtered.length / size));
 page = Math.min(page,pages);
 products.replaceChildren();
 count.textContent = `Найдено: ${filtered.length} из ${items.length}`;
 if (!filtered.length) {
  const message = document.createElement('p'); message.textContent = 'По вашему запросу ничего не найдено. Измените название или сбросьте фильтры.'; products.append(message);
 }
 let lastCategory=null;
 for (const item of filtered.slice((page-1)*size,page*size)) {
  if (lastCategory!==item.category) {
   const heading=document.createElement('h2');heading.className='product-group-heading';heading.textContent=categoryLabel(item.category);products.append(heading);lastCategory=item.category;
  }
  const card = document.createElement('article');card.className='product';
  const tag = document.createElement('p');tag.className='product-category';tag.textContent=categoryLabel(item.category);
  const title = document.createElement('h3');title.textContent=item.name;
  const code = document.createElement('p');code.className='product-code';code.textContent='Код: '+item.code;
  const link = document.createElement('a');link.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent('Запрос по ассортименту: '+item.code)+'&body='+encodeURIComponent('Здравствуйте!\nПрошу уточнить наличие, оптовую цену и условия поставки:\n'+item.name+'\nКод: '+item.code+'\n\nОрганизация:\nКоличество:\nТелефон:');link.textContent='Уточнить условия ↗';
  const media = document.createElement('div');media.className='product-media';
  const missing = () => { media.replaceChildren();const text=document.createElement('span');text.className='product-photo-missing';text.textContent='Фото пока нет';media.append(text); };
  if (item.image) {
   const photo=document.createElement('img');photo.src=item.image;photo.alt=item.name;photo.loading='lazy';photo.decoding='async';photo.width=240;photo.height=260;
   photo.addEventListener('error',missing,{once:true});media.append(photo);
   if (item.imageSource) { const source=document.createElement('a');source.className='photo-source';source.href=item.imageSource;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Источник фото';source.setAttribute('aria-label','Источник фотографии: '+item.name);media.append(source); }
  } else { missing(); }
  card.append(media,tag,title,code,link);products.append(card);
 }
 status.textContent = filtered.length ? `Страница ${page} из ${pages}` : 'Нет результатов';
 prev.disabled = page<=1;next.disabled=page>=pages;
}
for (const button of groupButtons) button.addEventListener('click',()=>{category.value=button.dataset.category;page=1;render()});
search.addEventListener('input' ,()=>{page=1;render()});
category.addEventListener('change',()=>{page=1;render()});
document.querySelector('#reset').addEventListener('click',()=>{search.value='';category.value='';page=1;render();search.focus()});
prev.addEventListener('click',()=>{page--;render();count.scrollIntoView({block:'start'})});
next.addEventListener('click',()=>{page++;render();count.scrollIntoView({block:'start'})});
fetch('catalog-data.json').then(response=>{if(!response.ok)throw new Error('load');return response.json()}).then(data=>{if(!Array.isArray(data))throw new Error('format');items=data;const selected=new URLSearchParams(location.search).get('category');if(categoryOrder.includes(selected))category.value=selected;render()}).catch(()=>{count.textContent='Не удалось загрузить каталог. Обновите страницу или свяжитесь с нами: info@dv-legion.ru.';search.disabled=true;category.disabled=true;document.querySelector('#reset').disabled=true});
