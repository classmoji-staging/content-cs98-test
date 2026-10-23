// CS52 sketchkit: shared drawing helpers for hand-drawn diagrams.
// the diagrams themselves live with their decks: slides/<deck>/diagrams/<file>.js
// see README.md. rough.js does the sketchy lines; labels use the deck's own
// title font (Comic Neue Angular).
const W = 900, H = 560;
const FONT = "'Comic Neue Angular', 'Comic Neue', cursive";
const C = {
  browser: { ink: '#1d4ed8', fill: '#dbe7fd' },
  server:  { ink: '#9a6a12', fill: '#fbecc8' },
  build:   { ink: '#6d28d9', fill: '#e9ddfc' },
  cdn:     { ink: '#0f766e', fill: '#d3f0ec' },
  db:      { ink: '#15803d', fill: '#d7f2df' },
  you:     { ink: '#be123c', fill: '#fde0e6' },
  arrow:   '#4b5563',
};
const PAY = { html: '#1d4ed8', js: '#b45309', json: '#15803d', md: '#6d28d9', css: '#be185d', ts: '#1d4ed8', tsx: '#0e7490' };

function stage(seed) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const rc = rough.svg(svg, { options: { seed, roughness: 1.3, bowing: 1.2, strokeWidth: 2.2 } });
  return { svg, rc };
}
function add(s, node) { s.svg.appendChild(node); return node; }
function text(s, x, y, str, o = {}) {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x); t.setAttribute('y', y);
  t.setAttribute('font-family', FONT);
  t.setAttribute('font-size', o.size || 22);
  t.setAttribute('font-style', o.italic === false ? 'normal' : 'italic');
  t.setAttribute('font-weight', o.weight || 700);
  t.setAttribute('fill', o.color || '#2b2f36');
  t.setAttribute('text-anchor', o.anchor || 'middle');
  if (o.halo !== false) { t.setAttribute('stroke', '#fff'); t.setAttribute('stroke-width', 5); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); }
  t.textContent = str;
  return add(s, t);
}
// a labeled actor box (browser window / server / build / cdn)
function browser(s, x, y, w, h, label = 'browser') {
  add(s, s.rc.rectangle(x, y, w, h, { stroke: C.browser.ink, fill: C.browser.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  add(s, s.rc.line(x, y + 26, x + w, y + 26, { stroke: C.browser.ink }));
  for (let i = 0; i < 3; i++) add(s, s.rc.circle(x + 16 + i * 16, y + 13, 9, { stroke: C.browser.ink, fill: '#fff', fillStyle: 'solid' }));
  text(s, x + w / 2, y + h + 30, label, { color: C.browser.ink, size: 24 });
}
function server(s, x, y, w, h, label = 'server', kind = 'server', role) {
  const c = C[kind];
  add(s, s.rc.rectangle(x, y, w, h, { stroke: c.ink, fill: c.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  if (kind === 'server') for (let i = 1; i <= 2; i++) add(s, s.rc.line(x, y + (h * i) / 3, x + w, y + (h * i) / 3, { stroke: c.ink }));
  if (role) text(s, x + w / 2, y + h / 2 + 7, role, { color: c.ink, size: 20 });
  text(s, x + w / 2, y + h + 30, label, { color: c.ink, size: 24 });
}
function cloud(s, cx, cy, label) {
  add(s, s.rc.ellipse(cx, cy, 170, 90, { stroke: C.cdn.ink, fill: C.cdn.fill, fillStyle: 'hachure', hachureGap: 9 }));
  text(s, cx, cy + 8, label, { color: C.cdn.ink, size: 24 });
}
function db(s, cx, y, label = 'database') {
  add(s, s.rc.ellipse(cx, y, 80, 22, { stroke: C.db.ink, fill: C.db.fill, fillStyle: 'solid' }));
  add(s, s.rc.line(cx - 40, y, cx - 40, y + 50, { stroke: C.db.ink }));
  add(s, s.rc.line(cx + 40, y, cx + 40, y + 50, { stroke: C.db.ink }));
  add(s, s.rc.path(`M${cx - 40} ${y + 50} Q ${cx} ${y + 66} ${cx + 40} ${y + 50}`, { stroke: C.db.ink }));
  text(s, cx, y + 88, label, { color: C.db.ink, size: 18 });
}
// a payload "file" chip: a little dog-eared page with a type tag
function chip(s, x, y, kind, label) {
  const col = PAY[kind];
  add(s, s.rc.polygon([[x, y], [x + 30, y], [x + 40, y + 10], [x + 40, y + 46], [x, y + 46]], { stroke: col, fill: '#fff', fillStyle: 'solid', roughness: 0.9 }));
  text(s, x + 20, y + 30, kind, { color: col, size: 14, italic: false });
  if (label) text(s, x + 48, y + 30, label, { color: '#374151', size: 17, anchor: 'start', weight: 400 });
}
function arrow(s, x1, y1, x2, y2, o = {}) {
  const col = o.color || C.arrow;
  add(s, s.rc.line(x1, y1, x2, y2, { stroke: col, strokeWidth: 2.4, strokeLineDash: o.dash ? [8, 7] : undefined }));
  const a = Math.atan2(y2 - y1, x2 - x1), L = 14;
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45), { stroke: col, strokeWidth: 2.4 }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45), { stroke: col, strokeWidth: 2.4 }));
  if (o.label) text(s, (x1 + x2) / 2 + (o.lx || 0), (y1 + y2) / 2 + (o.ly || -12), o.label, { size: o.size || 19, color: '#374151', weight: 400 });
}
function step(s, n, x, y) {
  add(s, s.rc.circle(x, y, 30, { stroke: '#111827', fill: '#fde68a', fillStyle: 'solid', roughness: 0.8 }));
  text(s, x, y + 7, String(n), { size: 18, color: '#111827', italic: false });
}
function note(s, x, y, str, o = {}) { return text(s, x, y, str, { size: o.size || 19, weight: 400, color: o.color || '#4b5563', anchor: o.anchor || 'middle' }); }



function mono(s, x, y, str, o = {}) {
  const t = text(s, x, y, str, { size: o.size || 16, color: o.color || '#1f2937', anchor: o.anchor || 'start', weight: 400, italic: false });
  t.setAttribute('font-family', "ui-monospace, 'SF Mono', Menlo, monospace");
  return t;
}
// a browser window with an address bar showing the url
function win(s, x, y, w, h, url, o = {}) {
  const ink = o.ink || C.browser.ink;
  add(s, s.rc.rectangle(x, y, w, h, { stroke: ink, fill: o.fill || '#fff', fillStyle: o.fill ? 'hachure' : 'solid', hachureGap: 9 }));
  add(s, s.rc.line(x, y + 30, x + w, y + 30, { stroke: ink }));
  for (let i = 0; i < 3; i++) add(s, s.rc.circle(x + 16 + i * 16, y + 15, 9, { stroke: ink, fill: '#fff', fillStyle: 'solid' }));
  if (url) {
    add(s, s.rc.rectangle(x + 66, y + 5, Math.min(w - 80, url.length * 9 + 24), 20, { stroke: ink, roughness: 0.8, strokeWidth: 1.4 }));
    mono(s, x + 78, y + 20, url, { size: 14, color: o.urlColor || ink });
  }
}
function outlet(s, x, y, w, h, col) {
  add(s, s.rc.rectangle(x, y, w, h, { stroke: col || '#9ca3af', strokeWidth: 1.6, strokeLineDash: [7, 6], roughness: 0.8 }));
}
// a curved arrow, bending by `bend` px
function curve(s, x1, y1, x2, y2, bend, col = '#374151') {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + bend;
  add(s, s.rc.path(`M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, { stroke: col, strokeWidth: 2.4 }));
  const a = Math.atan2(y2 - cy, x2 - cx), L = 14;
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45), { stroke: col, strokeWidth: 2.4 }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45), { stroke: col, strokeWidth: 2.4 }));
}

// diagram files register themselves here: D.name = () => svg
const D = {};
