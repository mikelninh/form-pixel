import * as THREE from 'three';
export const examples=[
 {id:'sunblade',name:'SONNENKLINGE',type:'Schwert oder spielbarer Held',note:'Waffe ausrüsten — oder selbst das Schwert sein',usage:'equipment',preview:false,license:'Original FORM / PIXEL Modell'},
 {id:'relic',name:'HERZRELIKT',type:'Schwebender Kristall auf Sockel',note:'3D-Objekt → Pixel-Requisite oder Held',usage:'object',preview:false,license:'Original FORM / PIXEL Modell'},
 {id:'dragon',name:'DRAGON',type:'Geflügelter Drache',note:'Flügel · Hörner · kräftige Silhouette',url:'./assets/DragonEvolved.glb',license:'Quaternius · CC0 1.0',source:'https://poly.pizza/m/LlwD0QNUPj',docs:['Quaternius-CC0.md']},
 {id:'mushroom',name:'PILZKÖNIG',type:'Fantasy-Begleiter',note:'Großer Hut · klare Farbflächen',url:'./assets/MushroomKing.glb',license:'Quaternius · CC0 1.0',source:'https://poly.pizza/m/grnFTziU8u',docs:['Quaternius-CC0.md']},
 {id:'mimic',name:'MIMIC',type:'Lebendige Schatztruhe',note:'Zähne · Gold · eingebettete Textur',url:'./assets/Mimic.glb',license:'Quaternius · CC0 1.0',source:'https://poly.pizza/m/B8HrWzkuNp',docs:['Quaternius-CC0.md']},
 {id:'momo',name:'MOMO',type:'Runder Roboter',note:'Eigene starre Testfigur',license:'Eigene Werkstatt-Figur'},
 {id:'orbit',name:'ORBIT',type:'Kleiner Raumgleiter',note:'Breite Silhouette · Metall',license:'Eigene Werkstatt-Figur'},
 {id:'bloom',name:'BLOOM',type:'Botanischer Begleiter',note:'Dünne Blätter · feine Details',license:'Eigene Werkstatt-Figur'},
 {id:'duck',yaw:-Math.PI/2,name:'DUCK',type:'Texturierte Badeente',note:'Fremdmodell · eingebettete Textur',url:'./assets/Duck.glb',license:'Sony · SCEA Shared Source 1.0',source:'https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Duck',docs:['Duck-README.md','SCEA.txt']},
 {id:'fox',name:'FOX',type:'Low-Poly-Fuchs',note:'Rig vorhanden · hier Ruhepose',url:'./assets/Fox.glb',license:'PixelMannen · tomkranis · AsoboStudio / scurest · CC0 + CC BY 4.0',source:'https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox',docs:['Fox-README.md']},
 {id:'cesium',name:'CESIUM MAN',type:'Menschliche Figur',note:'Rig + Textur · hier Ruhepose',url:'./assets/CesiumMan.glb',license:'Cesium · CC BY 4.0 · Logo separat geschützt',source:'https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CesiumMan',docs:['CesiumMan-README.md','Cesium-logo-license.txt']}
];
export function createExample(id){const g=new THREE.Group();g.name=id.toUpperCase()+'_static';
 const material=(c,metal=0)=>new THREE.MeshStandardMaterial({color:c,roughness:.42,metalness:metal});
 const shell=material('#d7e4d6',.15),navy=material('#29344f',.25),orange=material('#f69c56'),gold=material('#f5d983',.35),purple=material('#b598d8'),green=material('#619a79'),pink=material('#e9a7b5');
 const add=(geo,mat,p,s,r)=>{const m=new THREE.Mesh(geo,mat);m.position.set(...p);if(s)m.scale.set(...s);if(r)m.rotation.set(...r);g.add(m);return m};
 const ball=(mat,p,s)=>add(new THREE.SphereGeometry(1,24,16),mat,p,s);
 if(id==='sunblade'){
  add(new THREE.BoxGeometry(.19,.94,.075),shell,[0,1.33,0]);
  add(new THREE.ConeGeometry(.135,.43,4),shell,[0,2.01,0],[1,1,.35],[0,Math.PI/4,0]);
  add(new THREE.BoxGeometry(.042,1.12,.095),gold,[0,1.43,0]);
  add(new THREE.BoxGeometry(.63,.115,.19),gold,[0,.79,0]);
  for(const sign of[-1,1])add(new THREE.BoxGeometry(.16,.23,.16),gold,[sign*.30,.86,0],null,[0,0,-sign*.4]);
  add(new THREE.CylinderGeometry(.066,.072,.44,8),navy,[0,.51,0]);
  for(let i=0;i<4;i++)add(new THREE.TorusGeometry(.073,.013,6,12),gold,[0,.37+i*.09,0],null,[Math.PI/2,0,0]);
  add(new THREE.OctahedronGeometry(.14),purple,[0,.19,0]);
  ball(green,[0,.81,.112],[.095,.095,.04]);
 }else if(id==='relic'){
  add(new THREE.CylinderGeometry(.49,.60,.16,8),navy,[0,.10,0]);
  add(new THREE.CylinderGeometry(.32,.46,.28,8),shell,[0,.30,0]);
  add(new THREE.CylinderGeometry(.43,.33,.10,8),gold,[0,.48,0]);
  add(new THREE.OctahedronGeometry(.45),purple,[0,1.08,0],[.85,1.35,.85]);
  add(new THREE.TorusGeometry(.43,.033,8,32),gold,[0,1.06,0],null,[.3,0,.3]);
  for(const sign of[-1,1])add(new THREE.OctahedronGeometry(.12),green,[sign*.48,.77,0]);
 }else if(id==='orbit'){
  ball(shell,[0,.65,0],[.44,.28,.86]);ball(navy,[0,.88,.17],[.26,.23,.39]);
  for(const sign of [-1,1]){add(new THREE.BoxGeometry(.68,.09,.75),navy,[sign*.58,.56,-.17],null,[0,sign*-.28,sign*.14]);ball(orange,[sign*.78,.59,-.35],[.16,.13,.43]);add(new THREE.CylinderGeometry(.11,.15,.36,20),shell,[sign*.78,.57,-.72],null,[Math.PI/2,0,0]);ball(gold,[sign*.78,.57,-.91],[.09,.09,.025]);ball(gold,[sign*.20,.60,.74],[.075,.055,.09]);}
  add(new THREE.BoxGeometry(.055,.4,.36),orange,[0,.95,-.61],null,[-.3,0,0]);add(new THREE.BoxGeometry(.08,.05,.28),orange,[-.14,.91,.53]);
 }else{
  ball(shell,[0,.52,0],[.39,.43,.32]);ball(green,[0,.39,.22],[.27,.27,.18]);
  for(const sign of [-1,1]){ball(navy,[sign*.115,.64,.291],[.044,.055,.032]);ball(green,[sign*.21,.13,.06],[.15,.13,.21]);ball(green,[sign*.40,.50,0],[.17,.1,.12]);}
  add(new THREE.CylinderGeometry(.075,.11,.63,12),green,[0,1.11,0]);
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const petal=ball(i%2?pink:purple,[Math.cos(a)*.37,1.64+Math.sin(a)*.29,0],[.18,.32,.10]);petal.rotation.z=a-Math.PI/2;}
  ball(gold,[0,1.63,.065],[.27,.27,.17]);ball(orange,[0,1.63,.21],[.12,.12,.04]);
  for(const sign of [-1,1]){const leaf=ball(green,[sign*.22,1.10,0],[.31,.09,.075]);leaf.rotation.z=sign*.5;}
  ball(pink,[-.2,.48,.312],[.07,.035,.025]);ball(pink,[.2,.48,.312],[.07,.035,.025]);
 }
 g.userData={note:'Original static procedural test model. No skeleton or animations.'};return g;
}

