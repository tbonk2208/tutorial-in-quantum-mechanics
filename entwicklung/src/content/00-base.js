/* ===== Inhalte: Grundgerüst ===== */
const TOPICS = [];
const LEX = [];
const topic = t => { t.ch = t.ch || 'qm'; t.nr = TOPICS.length; TOPICS.push(t); return t; };
const lexe = (id, title, text, extra) => LEX.push(Object.assign({id, title, text}, extra || {}));
const topicById = id => TOPICS.find(t => t.id === id);
/* häufig gebrauchte Kontexte */
const CTX = {
  box:(extra) => Object.assign({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}}, extra || {}),
  line:(extra) => Object.assign({coords:['x'], params:{m:'pos'}}, extra || {}),
};
