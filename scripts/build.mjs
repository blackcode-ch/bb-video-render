import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const css = await readFile('src/film.css','utf8');
const motion = await readFile('src/motion.js','utf8');
const scene = await readFile('src/film.html','utf8');
for(const [name,w,h] of [['landscape',1920,1080],['portrait',1080,1920]]) {
  await mkdir(`${name}/assets`,{recursive:true});
  await copyFile('node_modules/gsap/dist/gsap.min.js',`${name}/assets/gsap.min.js`);
  const font = ['/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'].find(existsSync);
  if(!font) throw new Error('Install fonts-liberation before the CI build');
  await copyFile(font,`${name}/assets/LiberationSans-Regular.ttf`);
  await writeFile(`${name}/index.html`,`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Le trou, c’est vous. — Brigitte</title><script src="assets/gsap.min.js"></script><style>${css}</style></head><body class="${name}"><div id="root" data-composition-id="main" data-width="${w}" data-height="${h}" data-duration="24" data-fps="30">${scene}</div><script>${motion}</script></body></html>`);
}
await mkdir('output',{recursive:true});
await mkdir('proof',{recursive:true});
await copyFile('page/index.html','output/index.html');
