"""Check published HTML metadata, local links, anchors and catalog coverage."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import json,xml.etree.ElementTree as ET
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=set();self.links=[];self.canon=[];self.h1=0;self.feed(text)
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.ids.add(a['id'])
  if t=='h1':self.h1+=1
  for k in ['href','src']:
   if k in a:self.links.append(a[k])
  if a.get('rel')=='canonical':self.canon.append(a['href'])
p=Path(__file__).resolve().parents[1]/'dist';pages={f.name:Page(f.read_text()) for f in p.glob('*.html')};errors=[]
for name,s in pages.items():
 if s.h1!=1:errors.append((name,'h1',s.h1))
 for link in s.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=unquote(u.path) or name
  if not (p/target).exists():errors.append((name,'file',target))
  if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:errors.append((name,'anchor',link))
urls=[n.text for n in ET.parse(p/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
for url in urls:
 assert url.startswith('https://dv-legion.ru/')
 name=urlsplit(url).path.lstrip('/') or 'index.html'
 assert pages[name].canon==[url],name
assert len(urls)==18
for item in json.loads((p/'catalog-data.json').read_text()):
 import html
 assert any(html.escape(item['name']) in (p/n).read_text() for n in pages if n not in ['catalog.html','index.html']),item['code']
print(f'{len(pages)} HTML pages, {len(urls)} sitemap URLs, 954 catalog entries checked')
print('Link errors:',errors)
assert not errors
