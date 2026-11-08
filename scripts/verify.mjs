import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,writeFile,stat,readdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('output');
const types={'.html':'text/html; charset=utf-8','.mp4':'video/mp4','.png':'image/png'};
const server=createServer(async(req,res)=>{
  const file=resolve(root,`.${decodeURIComponent(new URL(req.url,'http://localhost').pathname)}`);
  if(file!==root&&!file.startsWith(root+'/')){res.writeHead(403).end();return;}
  try{const data=await readFile(file===root?resolve(root,'index.html'):file);res.writeHead(200,{'content-type':types[extname(file)]||'text/html; charset=utf-8','content-length':data.length});res.end(data);}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const report={media:[],browsers:[],bytes:0};
for(const [name,width,height] of [['paysage',1920,1080],['portrait',1080,1920]]){
  const file=`output/le-trou-${name}.mp4`;
  const p=JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file],{encoding:'utf8'}));
  const v=p.streams.find(s=>s.codec_type==='video');
  assert.equal(v.width,width);assert.equal(v.height,height);assert.equal(v.codec_name,'h264');
  assert(Math.abs(Number(p.format.duration)-24)<.1);assert.equal(v.nb_frames,'720');
  execFileSync('ffmpeg',['-v','error','-i',file,'-f','null','-']);
  report.media.push({file,width,height,seconds:Number(p.format.duration),frames:Number(v.nb_frames),codec:v.codec_name});
}
for(const f of await readdir(root))report.bytes+=(await stat(resolve(root,f))).size;
assert(report.bytes<40*1024*1024,'Delivery folder exceeds 40 MiB');
const browser=await chromium.launch({headless:true});
try{
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`)});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
 assert.equal(await page.locator('.film').count(),6);
 assert.equal(await page.locator('video').getAttribute('playsinline'),'');
 const media=await page.locator('video').evaluate(async v=>{v.muted=true;await v.play();await new Promise(r=>setTimeout(r,300));v.pause();return{duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message||null,played:v.currentTime>0}});
 assert.equal(media.error,null);assert(media.played);assert.equal(media.duration,24);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflows horizontally');
 await page.locator('video').evaluate(v=>{v.currentTime=0;v.load()});
 await page.waitForTimeout(300);
 await page.screenshot({path:`proof/page-${width}.png`,fullPage:true});
 await page.locator('#film-6 summary').click();
 await page.locator('#film-6').scrollIntoViewIfNeeded();
 await page.screenshot({path:`proof/storyboard-${width}.png`});
 await page.locator('.stills summary').click();
 for(const img of await page.locator('.frames img').all())assert(await img.evaluate(i=>i.complete&&i.naturalWidth===1920));
 // Confirm the vertical cut actually decodes in the same browser, too.
 await page.locator('video').evaluate(v=>{v.src='le-trou-portrait.mp4';v.load()});
 await page.waitForFunction(()=>document.querySelector('video').readyState>=1&&document.querySelector('video').videoHeight===1920);
 assert.equal(errors.length,0,errors.join('\n'));
 report.browsers.push({viewport:width,video:media,portraitLoads:true,errors,storyboards:6});
 await page.close();
}
}finally{await browser.close();server.close();}
await writeFile('proof/verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
