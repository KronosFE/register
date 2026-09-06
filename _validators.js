// KVAL — generated validator card for any de-risking gate, from roster data (no image file needed).
// Self-contained. Used where a gate has no Figure-Factory card. Pair with the .kv* CSS.
var KVAL=(function(){
  function E(s){return (s==null?'':(''+s)).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function num(v){var n=parseFloat(v);return isNaN(n)?null:n;}
  // pull up to 4 "key=value" metrics from a result string
  function metrics(res){
    var out=[];
    (res||'').split(/[;\n]/).forEach(function(p){
      var m=/^\s*([A-Za-z0-9_()\/µβτ%^.\- ]{1,20}?)\s*=\s*([^;]+?)\s*$/.exec(p);
      if(m){var raw=m[2].trim(),n=num(raw);
        out.push([m[1].trim().replace(/_/g,' '), n!==null?(''+ +n.toPrecision(4)):raw.slice(0,16)]);}
    });
    return out.slice(0,4);
  }
  function stamp(g){
    var v=(g.verdict||'').toLowerCase(), s=(g.local_status||g.status||'').toUpperCase();
    if(/repro/.test(v))return'REPRODUCED';
    if(/pass|clear|confirm|closed|supported|match/.test(v))return'VALIDATED';
    if(s==='DONE')return'REPRODUCED';
    if(s==='RUNNING')return'RUNNING';
    return (g.verdict||s||'RECORDED').toUpperCase().slice(0,14);
  }
  var SEAL='<svg class="kv-mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2.5" opacity=".5"/><path d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function card(g){
    var st=stamp(g), ok=/REPRODUCED|VALIDATED/.test(st);
    var mets=metrics(g.local_result||g.result||'');
    var body = mets.length
      ? '<div class="kv-chips">'+mets.map(function(m){return '<span class="kv-chip"><b>'+E(m[1])+'</b><i>'+E(m[0])+'</i></span>';}).join('')+'</div>'
      : (g.local_result||g.result ? '<p class="kv-res">'+E(String(g.local_result||g.result).slice(0,150))+'</p>' : '');
    return '<div class="kvcard'+(ok?' ok':'')+'">'+
      '<div class="kv-top"><span class="kv-id">'+E(g.serial)+'</span><span class="kv-tag">'+E((g.machine||'').toUpperCase())+'</span></div>'+
      '<div class="kv-sealrow">'+SEAL+'<span class="kv-stamp">'+E(st)+'</span></div>'+
      '<div class="kv-title">'+E(g.title||'')+'</div>'+body+
      '<div class="kv-foot">'+E(g.code||'first-principles')+' · canon-locked</div></div>';
  }
  // ---- live-recompute widgets (real toolkit fns in window.KRONOS_LIVE_GATES) ----
  function liveKeys(serial){var G=(window.KRONOS_LIVE_GATES&&window.KRONOS_LIVE_GATES.GATES)||{};return Object.keys(G).filter(function(k){return k===serial||k.indexOf(serial+'-')===0;});}
  function hasLive(serial){return liveKeys(serial).length>0;}
  function fmtv(v){return typeof v==='number'?(''+ +v.toPrecision(5)):(''+v);}
  function widget(key,def){
    function run(p){try{return def.fn(p||{});}catch(e){return null;}}
    var base=run({}); if(!base)return null;
    var wrap=document.createElement('div');wrap.className='klive';
    var inp=base.inputs||{};
    var insH=Object.keys(inp).map(function(k){var v=inp[k];var ed=typeof v==='number';
      return '<label class="kl-in"><span>'+E(k)+'</span>'+(ed?'<input type="number" step="any" data-k="'+E(k)+'" value="'+E(v)+'">':'<em>'+E(v)+'</em>')+'</label>';}).join('');
    wrap.innerHTML='<div class="kl-h"><span class="kl-t">Live · '+E(def.title||key)+'</span><span class="kl-badge"></span></div>'+
      '<div class="kl-inputs">'+insH+'</div><div class="kl-arrow">computes in your browser ↓</div>'+
      '<div class="kl-outputs" data-out></div><div class="kl-exp" data-exp></div>'+
      '<div class="kl-note">Real KRONOS-toolkit computation — edit an input to recompute.</div>';
    var outEl=wrap.querySelector('[data-out]'),expEl=wrap.querySelector('[data-exp]'),badge=wrap.querySelector('.kl-badge');
    function upd(r){
      outEl.innerHTML=Object.keys(r.outputs||{}).map(function(k){return '<div class="kl-out"><b>'+E(fmtv(r.outputs[k]))+'</b><span>'+E(k)+'</span></div>';}).join('');
      if(r.expected!=null)expEl.textContent='expected: '+(typeof r.expected==='object'?Object.keys(r.expected).map(function(k){return k+' '+r.expected[k];}).join(' · '):fmtv(r.expected));
      badge.textContent=r.pass?'PASS ✓':'CHECK';badge.className='kl-badge '+(r.pass?'ok':'no');
    }
    function recompute(){var p={};wrap.querySelectorAll('input[data-k]').forEach(function(g){var n=parseFloat(g.value);p[g.getAttribute('data-k')]=isNaN(n)?g.value:n;});var r=run(p);if(r)upd(r);}
    wrap.querySelectorAll('input[data-k]').forEach(function(f){f.addEventListener('input',recompute);});
    upd(base); return wrap;
  }
  function mountLive(el,serial){
    if(!el)return false; var G=(window.KRONOS_LIVE_GATES&&window.KRONOS_LIVE_GATES.GATES)||{};
    var keys=liveKeys(serial); if(!keys.length){el.style.display='none';return false;}
    el.innerHTML=''; var n=0; keys.forEach(function(k){var w=widget(k,G[k]); if(w){el.appendChild(w);n++;}});
    return n>0;
  }
  return {card:card,stamp:stamp,metrics:metrics,hasLive:hasLive,mountLive:mountLive};
})();
