/* ===== Optionale KI-Antworten mit eigenem Anthropic-API-Schlüssel ===== */
const KI = {
  cfg:null,
  init(){ this.cfg = Object.assign({key:'', model:'claude-sonnet-5-5', limit:30, consent:false}, store.data.ki || {}); },
  save(){ store.data.ki = this.cfg; store.save(); },
  ready(){ return !!(this.cfg && this.cfg.key && this.cfg.consent); },
  log(){ return store.data.kilog || (store.data.kilog = []); },
  today(){ const d = today(); return this.log().filter(e => e.d && e.d.startsWith(d)).length; }
};
const KI_SYS = `Du bist ein geduldiger Tutor für Quantenmechanik I und ihre mathematischen Grundlagen (Physik-Bachelor, deutschsprachige Universität) in der Lern-App „Tutorial in Quantum Mechanics“. Du duzt.
Regeln:
1. Bleib bei Physik und der dafür nötigen Mathematik.
2. Nenne nicht das Endergebnis oder den vollständigen Lösungsweg der aktuellen Aufgabe. Gib einen Hinweis, stell eine Rückfrage oder zeig die Idee an einem anderen Beispiel. Wird ausdrücklich nach der Lösung gefragt, erkläre kurz, warum du sie nicht verrätst, und gib den nächsten kleinen Schritt.
3. Antworte knapp (höchstens etwa 150 Wörter). Formeln in $...$ (LaTeX).
4. Sei fachlich genau, nenne Konventionen (z. B. Phasenwahl, Normierung) und sag, wenn du unsicher bist.
5. Frag nicht nach persönlichen Daten.`;
async function kiAsk(task, goal, q, lines, out, btn){
  if (!KI.ready()) return;
  if (!q || q.trim().length < 4){ out.textContent = 'Schreib deine Frage in das Feld darüber.'; return; }
  if (KI.today() >= KI.cfg.limit){ out.textContent = 'Für heute sind die ' + KI.cfg.limit + ' KI-Fragen aufgebraucht.'; return; }
  btn.disabled = true; out.textContent = '… denkt nach';
  const ctxText = 'Aufgabe: ' + task.title + '\n' + (task.text || '') + '\nZiel: ' + (goal.prompt || '') + '\nBisheriger Rechenweg:\n' + (lines.length ? lines.map((l, i) => (i + 1) + ') ' + l).join('\n') : '(noch nichts)') + '\nFrage: ' + q;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {method:'POST', headers:{'x-api-key':KI.cfg.key, 'anthropic-version':'2023-06-01', 'content-type':'application/json', 'anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:KI.cfg.model, max_tokens:700, system:KI_SYS, messages:[{role:'user', content:ctxText}]})});
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j && j.error && j.error.message ? j.error.message : 'HTTP ' + r.status);
    const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim() || '(keine Antwort)';
    out.innerHTML = '<span class="muted tiny">KI-Antwort (Claude) · kann Fehler enthalten</span>' + md(text);
    KI.log().push({d:new Date().toISOString(), t:task.id, q, a:text.slice(0, 2000)}); store.save();
  } catch(e){ out.textContent = 'Die KI ist gerade nicht erreichbar (' + String(e.message || e).slice(0, 120) + '). Ohne Internet funktionieren nur die eingebauten Hilfen.'; }
  finally { btn.disabled = false; }
}
function kiSetup(root){
  const c = KI.cfg;
  const w = h('div', {class:'stack'});
  w.innerHTML = `<p class="small muted">Mit einem eigenen API-Schlüssel von Anthropic beantwortet eine KI (Claude) frei formulierte Fragen unter „? Frage“. Das Tutorial gibt feste Regeln vor (keine fertigen Lösungen, knapp, fachlich genau). Ohne Schlüssel sendet das Tutorial nichts ins Internet.</p>
  <p class="small"><b>Bitte beachten:</b> Frage, Aufgabentext und Rechenweg werden an Anthropic (USA) gesendet. Es fallen Kosten nach dem Preismodell der API an. Der Schlüssel bleibt nur auf diesem Gerät.</p>
  <label class="fld">API-Schlüssel <input type="password" class="ki-key" autocomplete="off" placeholder="sk-ant-…"></label>
  <label class="fld">Modell <select class="ki-model"><option value="claude-sonnet-5-5">Claude Sonnet 5.5 (gründlich)</option><option value="claude-haiku-5-5">Claude Haiku 5.5 (schnell, günstig)</option><option value="claude-opus-5-5">Claude Opus 5.5 (am stärksten)</option></select></label>
  <label class="fld">Höchstens <input type="number" class="ki-limit" min="1" max="200"> KI-Fragen pro Tag</label>
  <label class="ckm"><input type="checkbox" class="ki-consent"> <span>Ich bin volljährig und einverstanden, dass Fragen an die KI gesendet werden.</span></label>`;
  root.append(w);
  $('.ki-key', w).value = c.key || ''; $('.ki-model', w).value = c.model; $('.ki-limit', w).value = c.limit; $('.ki-consent', w).checked = !!c.consent;
  const b = h('button', {class:'btn btn-sm btn-primary', type:'button'}, 'Speichern');
  const del = h('button', {class:'btn btn-sm', type:'button'}, 'Schlüssel löschen');
  b.onclick = () => { c.key = $('.ki-key', w).value.trim(); c.model = $('.ki-model', w).value; c.limit = Math.max(1, Math.min(200, +$('.ki-limit', w).value || 30)); c.consent = $('.ki-consent', w).checked; KI.save(); toast(KI.ready() ? 'KI-Antworten eingeschaltet.' : 'Gespeichert (KI aus).'); };
  del.onclick = () => { c.key = ''; c.consent = false; KI.save(); $('.ki-key', w).value = ''; $('.ki-consent', w).checked = false; toast('Schlüssel gelöscht.'); };
  w.append(h('div', {class:'row'}, b, del));
}
