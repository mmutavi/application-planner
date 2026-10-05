const KEY='planner.applications.v2',$=s=>document.querySelector(s);let data=load();
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('planner.applications.v1')||'null');if(!d||!Array.isArray(d.schools)||!Array.isArray(d.tasks))return{schools:[],tasks:[]};return{schools:d.schools.map((s,i)=>({...s,id:s.id||`legacy-school-${i}`,status:s.status||'Researching'})),tasks:d.tasks.map((t,i)=>({...t,id:t.id||`legacy-task-${i}`,done:!!t.done}))}}catch{return{schools:[],tasks:[]}}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function id(){return crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}
function days(v){return Math.ceil((new Date(`${v}T23:59:59`)-new Date())/86400000)}
function date(v){return v?new Date(`${v}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'No deadline'}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function render(){
 const sel=$('#school-select'),old=sel.value;sel.innerHTML='<option value="">General task</option>'+data.schools.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');if(data.schools.some(s=>s.id===old))sel.value=old;
 const done=data.tasks.filter(t=>t.done).length,total=data.tasks.length,pct=total?Math.round(done/total*100):0;
 const upcoming=data.schools.filter(s=>s.deadline&&s.status!=='Submitted'&&s.status!=='Decision received').sort((a,b)=>a.deadline.localeCompare(b.deadline))[0];
 const needs=[...data.schools.filter(s=>s.deadline&&days(s.deadline)<=7&&s.status!=='Submitted'),...data.tasks.filter(t=>!t.done&&t.due&&days(t.due)<=7)];
 $('#stat-schools').textContent=data.schools.length;$('#stat-complete').textContent=`${pct}%`;$('#stat-task-count').textContent=`${done} of ${total} tasks`;$('#stat-deadline').textContent=upcoming?date(upcoming.deadline).replace(/, \d{4}$/,''):'—';$('#stat-deadline-school').textContent=upcoming?upcoming.name:'Add a school to start';$('#stat-overdue').textContent=needs.length;$('#progress-label').textContent=`${pct}% complete`;$('#progress').style.width=`${pct}%`;$('#progress-detail').textContent=total?`${done} of ${total} tasks checked off.`:'Add tasks as you learn what each application needs.';
 if(!data.schools.length&&!data.tasks.length){$('#schools').innerHTML='<div class="empty"><strong>Your application map is blank.</strong>Add a school and break the process into small, doable tasks.</div>';return}