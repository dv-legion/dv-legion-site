'use strict';
const targets=[...document.querySelectorAll('[data-category-image]')];
fetch('catalog-data.json')
 .then(r=>{if(!r.ok)throw new Error('load');return r.json()})
 .then(items=>{
   if(!Array.isArray(items))throw new Error('format');
   const byCategory=new Map();
   for(const item of items){
     if(item && item.category && item.image && !byCategory.has(item.category)) byCategory.set(item.category,item);
   }
   for(const target of targets){
     const item=byCategory.get(target.dataset.categoryImage);
     if(item){
       const img=document.createElement('img');
       img.src=item.image;
       img.alt='';
       img.loading='lazy';
       img.decoding='async';
       img.addEventListener('error',()=>fallback(target),{once:true});
       target.replaceChildren(img);
     }else fallback(target);
   }
 })
 .catch(()=>targets.forEach(fallback));

function fallback(target){
 target.replaceChildren();
 const shape=document.createElement('span');
 shape.className='category-image-placeholder';
 shape.setAttribute('aria-hidden','true');
 target.append(shape);
}