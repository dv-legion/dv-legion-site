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
const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё','е').replaceAll(',','.').replace(/\s+/g,' ').trim();
function render() {
 const words = normalize(search.value).split(' ').filter(Boolean);
 const filtered = items.filter(item => (!category.value || item.category === category.value) && words.every(word => normalize(item.code+' '+item.name).includes(word)));
 const pages = Math.max(1,Math.ceil(filtered.length / size));
 page = Math.min(page,pages);
 products.replaceChildren();
 count.textContent = `Найдено: ${filtered.length} из ${items.length}`;
 if (!filtered.length) {
  const message = document.createElement('p'); message.textContent = 'По вашему запросу ничего не найдено. Измените название или сбросьте фильтры.'; products.append(message);
 }
 for (const item of filtered.slice((page-1)*size,page*size)) {
  const card = document.createElement('article');card.className='product';
  const tag = document.createElement('p');tag.className='product-category';tag.textContent=item.category;
  const title = document.createElement('h2');title.textContent=item.name;
  const code = document.createElement('p');code.className='product-code';code.textContent='Код: '+item.code;
  const link = document.createElement('a');link.href='mailto:info@dv-legion.ru?subject='+encodeURIComponent('Запрос по ассортименту: '+item.code)+'&body='+encodeURIComponent('Здравствуйте!\nПрошу уточнить наличие, оптовую цену и условия поставки:\n'+item.name+'\nКод: '+item.code+'\n\nОрганизация:\nКоличество:\nТелефон:');link.textContent='Уточнить условия ↗';
  card.append(tag,title,code,link);products.append(card);
 }
 status.textContent = filtered.length ? `Страница ${page} из ${pages}` : 'Нет результатов';
 prev.disabled = page<=1;next.disabled=page>=pages;
}
search.addEventListener('input',()=>{page=1;render()});
category.addEventListener('change',()=>{page=1;render()});
document.querySelector('#reset').addEventListener('click',()=>{search.value='';category.value='';page=1;render();search.focus()});
prev.addEventListener('click',()=>{page--;render();count.scrollIntoView({block:'start'})});
next.addEventListener('click',()=>{page++;render();count.scrollIntoView({block:'start'})});
fetch('catalog-data.json').then(response=>{if(!response.ok)throw new Error('load');return response.json()}).then(data=>{if(!Array.isArray(data))throw new Error('format');items=data;render()}).catch(()=>{count.textContent='Не удалось загрузить каталог. Обновите страницу или свяжитесь с нами: info@dv-legion.ru.';search.disabled=true;category.disabled=true;document.querySelector('#reset').disabled=true});
