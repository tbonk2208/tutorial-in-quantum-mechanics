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
/* ===== KI-Rückfall für die Handschrift: eine Zeile von Claude lesen lassen (nur auf Knopfdruck) ===== */
const KI_INK_SYS = `Du liest eine einzelne handgeschriebene Zeile aus einer Rechnung zur Quantenmechanik I und ihrer Mathematik (Physik-Bachelor). Die Zeile stammt aus einer Lern-App, die sie anschließend selbst prüft.
Schreib die Zeile GENAU so ab, wie sie dasteht, auch wenn sie mathematisch falsch ist. Korrigiere, ergänze und vereinfache nichts.
Antworte nur mit der Zeile in der Eingabesprache der App: kein Kommentar, keine Anführungszeichen, kein $, kein LaTeX.

Eingabesprache:
- Multiplikation: Leerzeichen zwischen Faktoren (2 m, k x, i ħ) oder *. Funktionsaufrufe ohne Leerzeichen: ψ(x), sin(k x), e^(i k x).
- Brüche: (Zähler)/(Nenner); Klammern nur weglassen, wenn Zähler oder Nenner ein einzelnes Zeichen ist: ħ^2/(2 m), 1/2 m ω^2 x^2.
- Potenzen mit ^, Indizes mit _: x^2, e^(-x^2/2), ψ_n, E_n, V_0, c_{n+1}. Mehrere Zeichen in Klammern.
- Wurzel: sqrt(2/L). Komplex konjugiert: ψ^*. Adjungiert: a^†. Betrag: |ψ|^2. Fakultät: n!. Striche: ψ', ψ''.
- Ableitungen: d/dx ψ, d^2/dx^2 ψ, dψ/dx, ∂ψ/∂t, ∂/∂x (…).
- Integral mit Grenzen: ∫_{0}^{L} |ψ|^2 dx, ∫_{-∞}^{∞} ψ^* x ψ dx (das Differential am Ende, mit Leerzeichen davor). Summe: Σ_{n=1}^{∞} |c_n|^2. Auswerten in Grenzen: [x^2/2]_0^L.
- Operatoren mit Dach: p̂, x̂, Ĥ (Buchstabe mit Zirkumflex darüber). Kommutator: [x̂, p̂].
- Dirac: |n⟩, ⟨m|n⟩, ⟨n|x̂|m⟩, Erwartungswert ⟨x^2⟩, Unschärfe Δx; Spin: |↑⟩, |↓⟩, S_z, σ_x.
- Matrizen zeilenweise mit ; zwischen den Zeilen: (1, 0; 0, -1); Spaltenvektor: (a; b).
- Weitere Zeichen: ħ ψ φ χ π θ ω κ α β λ μ ε ν ρ σ τ ξ Δ Φ Ψ Ω ∇ ∞ ± ⇒ ↑ ↓ ⊗ =.

Beispiele für ganze Zeilen:
∫_{0}^{L} |ψ|^2 dx = 1
-ħ^2/(2 m) d^2/dx^2 ψ + V ψ = E ψ
i ħ ∂ψ/∂t = Ĥ ψ
E_n = (n + 1/2) ħ ω
⟨n|x̂|m⟩ = sqrt(ħ/(2 m ω)) (sqrt(m) δ_{n,m-1} + sqrt(m+1) δ_{n,m+1})
[x̂, p̂] = i ħ
(1, 0; 0, -1)
Σ_{n=1}^{∞} |c_n|^2 = 1

Ist ein Zeichen unklar, nimm die Lesart, die in der Zeile Sinn ergibt, und bevorzuge Namen aus der Aufgabe (lateinisch w gegen ω, v gegen ν, p gegen ρ nach den Namen der Aufgabe). Ist gar nichts lesbar, antworte nur mit ?`;
/* png: data:image/png;base64,…  info: {title, names:[…], rep}  →  Zeile in der Eingabesprache ('' = nichts gelesen) */
async function kiReadInk(png, info){
  if (!KI.ready()) throw new Error('Die KI ist nicht eingerichtet (Einstellungen)');
  if (KI.today() >= KI.cfg.limit) throw new Error('für heute sind die ' + KI.cfg.limit + ' KI-Anfragen aufgebraucht');
  const m = /^data:(image\/(?:png|jpeg));base64,(.+)$/.exec(String(png || ''));
  if (!m) throw new Error('kein Bild der Zeile');
  info = info || {};
  const txt = (info.title ? 'Aufgabe: ' + info.title + '\n' : '') + (info.names && info.names.length ? 'Namen in dieser Aufgabe: ' + info.names.join(', ') + '\n' : '') + 'Schreib die handgeschriebene Zeile im Bild ab.';
  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {method:'POST', headers:{'x-api-key':KI.cfg.key, 'anthropic-version':'2023-06-01', 'content-type':'application/json', 'anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:KI.cfg.model, max_tokens:300, system:KI_INK_SYS, messages:[{role:'user', content:[{type:'image', source:{type:'base64', media_type:m[1], data:m[2]}}, {type:'text', text:txt}]}]})});
  } catch(e){ throw new Error('keine Verbindung zur KI. Ohne Internet liest nur die Erkennung im Gerät'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j && j.error && j.error.message ? j.error.message : 'HTTP ' + r.status);
  let line = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
  line = line.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
  line = (line.split('\n').map(x => x.trim()).filter(Boolean)[0] || '').replace(/^(zeile|antwort|line)\s*:\s*/i, '').replace(/^[`"„“]+|[`"“”]+$/g, '').replace(/^\$+|\$+$/g, '').trim();
  if (line === '?') line = '';
  line = line.slice(0, 300);
  KI.log().push({d:new Date().toISOString(), t:info.id || '', q:'[Handschrift lesen]', a:line, k:'ink'}); store.save();
  return line;
}
function kiSetup(root){
  const c = KI.cfg;
  const w = h('div', {class:'stack'});
  w.innerHTML = `<p class="small muted">Mit einem eigenen API-Schlüssel von Anthropic beantwortet eine KI (Claude) frei formulierte Fragen unter „? Frage“. Auf Wunsch liest sie auch eine handgeschriebene Zeile („Von der KI lesen lassen“). Das Tutorial gibt feste Regeln vor (keine fertigen Lösungen, knapp, fachlich genau). Ohne Schlüssel sendet das Tutorial nichts ins Internet.</p>
  <p class="small"><b>Bitte beachten:</b> Frage, Aufgabentext und Rechenweg werden an Anthropic (USA) gesendet, beim Lesen der Handschrift ein Bild der Zeile. Es fallen Kosten nach dem Preismodell der API an. Der Schlüssel bleibt nur auf diesem Gerät.</p>
  <label class="fld">API-Schlüssel <input type="password" class="ki-key" autocomplete="off" placeholder="sk-ant-…"></label>
  <label class="fld">Modell <select class="ki-model"><option value="claude-sonnet-5-5">Claude Sonnet 5.5 (gründlich)</option><option value="claude-haiku-5-5">Claude Haiku 5.5 (schnell, günstig)</option><option value="claude-opus-5-5">Claude Opus 5.5 (am stärksten)</option></select></label>
  <label class="fld">Höchstens <input type="number" class="ki-limit" min="1" max="200"> KI-Anfragen pro Tag (Fragen und gelesene Zeilen)</label>
  <label class="ckm"><input type="checkbox" class="ki-consent"> <span>Ich bin volljährig und einverstanden, dass Fragen an die KI gesendet werden.</span></label>`;
  root.append(w);
  $('.ki-key', w).value = c.key || ''; $('.ki-model', w).value = c.model; $('.ki-limit', w).value = c.limit; $('.ki-consent', w).checked = !!c.consent;
  const b = h('button', {class:'btn btn-sm btn-primary', type:'button'}, 'Speichern');
  const del = h('button', {class:'btn btn-sm', type:'button'}, 'Schlüssel löschen');
  b.onclick = () => { c.key = $('.ki-key', w).value.trim(); c.model = $('.ki-model', w).value; c.limit = Math.max(1, Math.min(200, +$('.ki-limit', w).value || 30)); c.consent = $('.ki-consent', w).checked; KI.save(); toast(KI.ready() ? 'KI-Antworten eingeschaltet.' : 'Gespeichert (KI aus).'); };
  del.onclick = () => { c.key = ''; c.consent = false; c.inkOk = false; KI.save(); $('.ki-key', w).value = ''; $('.ki-consent', w).checked = false; toast('Schlüssel gelöscht.'); };
  w.append(h('div', {class:'row'}, b, del));
}
