'use strict';
const SHOP_KEY='dv-legion-online-cart', CUSTOMER_KEY='dv-legion-checkout-customer';
const ALLOWED=new Set(['Безалкогольные напитки','Продукты и прочий ассортимент']);
const getCart=()=>{try{return JSON.parse(localStorage.getItem(SHOP_KEY)||'[]').filter(x=>ALLOWED.has(x.category))}catch{return[]}};
function renderItems(targetId){
 const box=document.querySelector(targetId);if(!box)return;box.replaceChildren();const cart=getCart();
 if(!cart.length){box.innerHTML='<p class="cart-empty">Корзина пуста. <a href="catalog.html?category='+encodeURIComponent('Безалкогольные напитки')+'">Перейти в каталог →</a></p>';return}
 for(const x of cart){const row=document.createElement('div');row.className='checkout-item';row.innerHTML='<div><strong></strong><small></small></div><b></b>';row.querySelector('strong').textContent=x.name;row.querySelector('small').textContent='Код '+x.code;row.querySelector('b').textContent='× '+x.qty;box.append(row)}
}
renderItems('#checkout-items');renderItems('#payment-summary');
const form=document.querySelector('#checkout-form');
if(form){
 const saved=(()=>{try{return JSON.parse(localStorage.getItem(CUSTOMER_KEY)||'{}')}catch{return{}}})();
 for(const [k,v] of Object.entries(saved)){if(form.elements[k])form.elements[k].value=v}
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(!getCart().length){location.href='catalog.html?category='+encodeURIComponent('Безалкогольные напитки');return}const fd=new FormData(form),data={};for(const [k,v] of fd.entries())data[k]=String(v).trim();localStorage.setItem(CUSTOMER_KEY,JSON.stringify(data));location.href='payment.html'});
}
