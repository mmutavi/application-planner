const KEY='planner.applications.v2',$=s=>document.querySelector(s);let data=load();
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('planner.applications.v1')||'null');if(!d||!Array.isArray(d.schools)||!Array.isArray(d.tasks))return{schools:[],tasks:[]};return{schools:d.schools.map((s,i)=>({...s,id:s.id||`legacy-school-${i}`,status:s.status||'Researching'})),tasks:d.tasks.map((t,i)=>({...t,id:t.id||`legacy-task-${i}`,done:!!t.done}))}}catch{return{schools:[],tasks:[]}}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function id(){return crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}
function days(v){return Math.ceil((new Date(`${v}T23:59:59`)-new Date())/86400000)}
function date(v){return v?new Date(`${v}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'No deadline'}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function render(){