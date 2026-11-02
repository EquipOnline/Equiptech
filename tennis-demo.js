// Tennis-specific illustrative interface. No real players or connected match data.
let tennisState={sets:[[6,4],[4,3]],points:[2,1],finished:false},tennisUndo=[];
function tennisSnapshot(){return JSON.parse(JSON.stringify(tennisState));}
function tennisPoint(side){
  if(tennisState.finished)return;
  tennisUndo.push(tennisSnapshot());
  const s=tennisState,last=s.sets[s.sets.length-1];
  s.points[side]++;
  const tie=last[0]===6&&last[1]===6,other=1-side;
  if(s.points[side]>=(tie?7:4)&&s.points[side]-s.points[other]>=2){
    last[side]++;s.points=[0,0];
    if(last[side]>=6&&(last[side]-last[other]>=2||last[side]===7)){
      const wins=s.sets.filter(x=>x[side]>x[other]).length;
      if(wins===2)s.finished=true;else s.sets.push([0,0]);
    }
  }
}
function tennisPoints(){const p=tennisState.points,last=tennisState.sets.at(-1);if(tennisState.finished)return ['—','—'];if(last[0]===6&&last[1]===6)return p;if(p[0]>=3&&p[1]>=3)return p[0]===p[1]?['40','40']:p[0]>p[1]?['AD','40']:['40','AD'];return p.map(x=>['0','15','30','40'][x]);}
function renderTennis(){
 const box=document.querySelector('#sports-content');if(!box)return;
 const note='<p class="demo-hint">Tennis demonstration / Fictional players and results. Concept for custom development; no live data.</p>';
 if(sportView==='match'){
  const point=tennisPoints();
  box.innerHTML=`<div class="score-line"><span class="tag">Tennis / U13 singles / Court 2</span><span class="live">${tennisState.finished?'COMPLETE':'LIVE DEMO'}</span></div><h3>Ridgeway vs Oakfield</h3><div class="tennis-court" aria-hidden="true"><div class="court-singles"></div><div class="court-service"></div><div class="court-net"></div><span class="court-ball"></span><span class="court-player player-near"></span><span class="court-player player-far"></span></div><div class="tennis-table-wrap"><table class="tennis-score"><caption class="sr-only">Singles match, best of three sets</caption><thead><tr><th scope="col">Player</th>${tennisState.sets.map((_,i)=>`<th scope="col">Set ${i+1}</th>`).join('')}<th scope="col">Points</th></tr></thead><tbody>${['Alex Morgan','Jamie Parker'].map((name,i)=>`<tr><th scope="row">${name}<small>${i===0?'Ridgeway':'Oakfield'}</small></th>${tennisState.sets.map((set,n)=>`<td class="${n===tennisState.sets.length-1?'current-set':''}">${set[i]}</td>`).join('')}<td class="tennis-points">${point[i]}</td></tr>`).join('')}</tbody></table></div><p class="tennis-state" role="status">${tennisState.finished?'Match complete.':tennisState.sets.at(-1).every(x=>x===6)?'Tie-break / first to 7, win by 2':tennisState.points.every(x=>x>=3)&&tennisState.points[0]===tennisState.points[1]?'Deuce / win by two points':'Best of three sets / advantage scoring'}</p><div class="demo-actions"><button data-tennis-point="0" ${tennisState.finished?'disabled':''}>Point to Alex</button><button data-tennis-point="1" ${tennisState.finished?'disabled':''}>Point to Jamie</button><button data-tennis-undo ${tennisUndo.length?'':'disabled'}>Undo</button><button data-tennis-reset>Reset match</button></div>${note}`;
 }else if(sportView==='results'){
  box.innerHTML=`<span class="tag">Tennis / Recent results</span><h3>Singles & doubles results</h3>${[['U13 singles / Alex Morgan','Won 6–4, 6–3','vs Jamie Parker / Oakfield / Court 2'],['U13 doubles / Casey Reed & Sam Taylor','Won 6–2, 7–5','vs Ellis & Blake / Riverside / Court 1'],['U12 singles / Jordan Lee','Lost 4–6, 6–3, 3–6','vs Riley Brooks / Oakfield / Court 3']].map(([match,result,detail])=>`<article class="example-result"><strong>${match}</strong><span class="result-badge">${result}</span><small>${detail}</small></article>`).join('')}${note}`;
 }else if(sportView==='player'){
  box.innerHTML=`<span class="tag">Tennis / Personal season</span><div class="profile"><div class="avatar">AM</div><div><h3>Alex Morgan</h3><span class="quiet">U13 / Singles & doubles</span></div></div><div class="mini-stats"><div><strong>8</strong><span>Singles matches</span></div><div><strong>6</strong><span>Singles wins</span></div><div><strong>75%</strong><span>Singles win rate</span></div></div><h3 class="tennis-subtitle">Season record</h3><div class="fixture"><strong>Singles</strong><span>6 wins / 2 losses</span></div><div class="fixture"><strong>Doubles</strong><span>4 wins / 1 loss</span></div><div class="fixture"><strong>Singles sets</strong><span>13 won / 6 lost</span></div><p class="quiet" style="margin-top:20px">Last five singles matches</p><div class="tennis-form" aria-label="Last five matches: win, win, loss, win, win">${['W','W','L','W','W'].map(x=>`<span class="${x==='L'?'loss':''}">${x}</span>`).join('')}</div><div class="role-note">Parent view concept: follow your child’s fixtures, match results and tennis season.</div>${note}`;
 }else if(sportView==='team'){
  box.innerHTML=`<span class="tag">Tennis / Teams & fixtures</span><h3>U13 tennis squad</h3><div class="fixture"><strong>Singles 1</strong><span>Alex Morgan</span></div><div class="fixture"><strong>Singles 2</strong><span>Jordan Lee</span></div><div class="fixture"><strong>Doubles pair</strong><span>Casey Reed & Sam Taylor</span></div><h3 class="tennis-subtitle">Coming up</h3><article class="example-result"><strong>Ridgeway vs Oakfield</strong><small>Tue 3 Nov / 14:00 / Courts 1–3</small><span class="pill">Singles & doubles</span></article><article class="example-result"><strong>Ridgeway vs Riverside</strong><small>Tue 10 Nov / 14:30 / Riverside courts</small><span class="pill">Singles & doubles</span></article>${note}`;
 }else if(sportView==='honours'){
  const season=honoursPeriod==='season';const rows=season?[['Alex Morgan','6 wins / 8 matches'],['Casey Reed','5 wins / 7 matches'],['Sam Taylor','4 wins / 6 matches']]:[['Alex Morgan','2 wins / 2 matches'],['Casey Reed','1 win / 1 match'],['Sam Taylor','1 win / 2 matches']];
  box.innerHTML=`<span class="tag">Tennis / Top performers</span><h3>Singles match wins</h3><div class="demo-actions"><button data-tennis-period="week" aria-pressed="${!season}">Weekly</button><button data-tennis-period="season" aria-pressed="${season}">Season</button></div><p class="quiet" style="margin-top:18px">${season?'2026 season':'This week'} / Ranked by wins, then win rate</p>${rows.map(([name,record],i)=>`<div class="honours-row"><span class="honours-rank">${i+1}</span><strong>${name}</strong><span>${record}</span></div>`).join('')}${note}`;
 }else{
  box.innerHTML=`<span class="tag">Tennis / Sports office</span><h3>Manage the day on court.</h3><div class="office-grid">${[['Fixtures','Singles and doubles schedules'],['Squad','Players and doubles pairings'],['Courts','Court and time allocations'],['Results','Set scores and match outcomes'],['Player records','Match wins and season records'],['Parent access','Review access requests']].map(([title,desc])=>`<div class="office-item"><strong>${title}</strong><small>${desc}</small></div>`).join('')}</div><div class="role-note">Illustrative management areas only. No bookings, messages or access approvals are made.</div>${note}`;
 }
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||sport!=='Tennis')return;
 if(b.hasAttribute('data-tennis-point')){tennisPoint(Number(b.dataset.tennisPoint));renderTennis();document.querySelector('[data-tennis-point="'+b.dataset.tennisPoint+'"]')?.focus();}
 if(b.hasAttribute('data-tennis-undo')){if(tennisUndo.length)tennisState=tennisUndo.pop();renderTennis();}
 if(b.hasAttribute('data-tennis-reset')){tennisState={sets:[[6,4],[4,3]],points:[2,1],finished:false};tennisUndo=[];renderTennis();}
 if(b.dataset.tennisPeriod){honoursPeriod=b.dataset.tennisPeriod;renderTennis();}
});
