export const cameraPresets={
 iso:{label:'Isometrisch',elevation:35.264},
 side:{label:'Seitenansicht',elevation:0},
 top:{label:'Draufsicht',elevation:90}
};
export const pixelStyles={
 studio:{label:'Studio',description:'Originalfarben · weiche Abstufungen',outline:[35,49,43],colors:['#eee2b9','#7f9f73','#ee8552','#233c37']},
 pocket:{label:'Pocket',description:'Vier Grüntöne · Handheld-Charme',outline:[25,45,35],colors:['#192d23','#43664a','#8eaa65','#e3edac']},
 arcade:{label:'Arcade',description:'Kräftige Farben · klare Kontraste',outline:[31,24,57],colors:['#1f1839','#553b7b','#bd6194','#f3aac4','#dc6655','#f5a45d','#f6d98d','#f9f0d9','#35516b','#4d87a3','#7bc6c3','#405e43','#76a36c','#b8d887','#766658','#b5a293']}
};
const palettes=Object.fromEntries(Object.entries(pixelStyles).map(([key,s])=>[key,s.colors.map(hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)))]));
const caches={pocket:new Map(),arcade:new Map()};
export function styleColor(r,g,b,style){
 if(style==='studio')return [r,g,b].map(c=>Math.min(255,Math.round(c/32)*32));
 const key=(r<<16)|(g<<8)|b,cache=caches[style];
 if(cache.has(key))return cache.get(key);
 let best=palettes[style][0],distance=Infinity;
 for(const color of palettes[style]){const d=.2126*(r-color[0])**2+.7152*(g-color[1])**2+.0722*(b-color[2])**2;if(d<distance){distance=d;best=color}}
 cache.set(key,best);return best;
}
