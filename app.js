let trades=JSON.parse(localStorage.getItem('trades')||'[]');
let chart;

function saveTrade(){
 const t={
 symbol:symbol.value,
 direction:direction.value,
 entry:+entry.value||0,
 exit:+exit.value||0,
 risk:+risk.value||0,
 reward:+reward.value||0,
 strategy:strategy.value,
 notes:notes.value,
 date:new Date().toISOString()
 };
 t.pnl=t.exit-t.entry;
 t.rr=t.risk? (t.reward/t.risk).toFixed(2):0;
 trades.push(t);
 localStorage.setItem('trades',JSON.stringify(trades));
 render();
}

function render(){
 let total=0,wins=0,equity=[];
 trades.forEach(t=>{
   total+=t.pnl;
   if(t.pnl>0) wins++;
   equity.push(total);
 });
 stats.innerHTML=`Trades: ${trades.length}<br>Total P/L: ${total.toFixed(2)}<br>Win Rate: ${trades.length?((wins/trades.length)*100).toFixed(1):0}%`;
 trades.innerHTML=window.trades.map(t=>`<div><b>${t.symbol}</b> | ${t.direction} | P/L ${t.pnl.toFixed(2)} | RR ${t.rr}</div>`).join('');
 drawChart(equity);
}

function drawChart(data){
 const ctx=document.getElementById('equityChart');
 if(chart) chart.destroy();
 chart=new Chart(ctx,{type:'line',data:{labels:data.map((_,i)=>i+1),datasets:[{data:data}]}});
}

function exportCSV(){
 let csv='Symbol,Direction,Entry,Exit,PNL,RR,Strategy\n';
 window.trades.forEach(t=>csv+=`${t.symbol},${t.direction},${t.entry},${t.exit},${t.pnl},${t.rr},${t.strategy}\n`);
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
 a.download='TradeJournal.csv';
 a.click();
}
render();
