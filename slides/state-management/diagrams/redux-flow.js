// redux: dispatch → reducer → store, and connecting components to it
// drawn by games/sketchkit/draw.html?deck=<this deck's folder>&f=<this file>&d=<name>

// shared look: the store is a dashed yellow blob, a reducer is a pipe
const PIPE = { ink: '#7c6a55', fill: '#e9dfcc', face: '#f6f0e6' };
const MONO_INK = '#1f2937';

function size(s, w, h) {
  s.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  s.svg.setAttribute('width', w); s.svg.setAttribute('height', h);
}
// the store: one dashed ellipse
function store(s, cx, cy, w, h) {
  add(s, s.rc.ellipse(cx, cy, w, h, { stroke: C.server.ink, fill: C.server.fill, fillStyle: 'solid', strokeWidth: 2.6, strokeLineDash: [10, 8] }));
}
// a reducer: a sideways cylinder, open face on the right
function pipe(s, x, cy, w, h, label, o = {}) {
  const rx = h * 0.2, top = cy - h / 2;
  add(s, s.rc.ellipse(x, cy, rx * 2, h, { stroke: PIPE.ink, fill: PIPE.fill, fillStyle: 'solid' }));
  add(s, s.rc.rectangle(x, top, w, h, { stroke: 'none', fill: PIPE.fill, fillStyle: 'solid', roughness: 0.4 }));
  add(s, s.rc.rectangle(x, top, w, h, { stroke: 'none', fill: PIPE.ink, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.8 }));
  add(s, s.rc.line(x, top, x + w, top, { stroke: PIPE.ink }));
  add(s, s.rc.line(x, top + h, x + w, top + h, { stroke: PIPE.ink }));
  add(s, s.rc.ellipse(x + w, cy, rx * 2, h, { stroke: PIPE.ink, fill: PIPE.face, fillStyle: 'solid' }));
  const lx = x + w / 2 - rx / 3;
  if (o.mono) mono(s, lx, cy + 7, label, { size: o.size || 20, color: o.color || PIPE.ink, anchor: 'middle' });
  else text(s, lx, cy + 8, label, { size: o.size || 24, color: PIPE.ink });
}
// a thick arrow, for the main flow
function fat(s, x1, y1, x2, y2, col = C.arrow) {
  add(s, s.rc.line(x1, y1, x2, y2, { stroke: col, strokeWidth: 4.2 }));
  const a = Math.atan2(y2 - y1, x2 - x1), L = 20;
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5), { stroke: col, strokeWidth: 4.2 }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5), { stroke: col, strokeWidth: 4.2 }));
}
// an arrow with a head on both ends
function both(s, x1, y1, x2, y2, o = {}) {
  arrow(s, x1, y1, x2, y2, o);
  arrow(s, x2, y2, x1, y1, { color: o.color });
}
// a hand-drawn rounded box
function rbox(s, x, y, w, h, r, o = {}) {
  const d = `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h}` +
    ` L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
  add(s, s.rc.path(d, { stroke: o.ink || '#374151', fill: o.fill, fillStyle: o.fillStyle || 'solid', hachureGap: 9, strokeWidth: o.sw || 2.2 }));
}
// the "dispatch" caller on the left: what goes in
function dispatcher(s, cx, cy) {
  text(s, cx, cy - 34, 'dispatch', { size: 28, color: '#374151' });
  mono(s, cx, cy + 6, '{ current state }', { size: 18, color: MONO_INK, anchor: 'middle' });
  mono(s, cx, cy + 36, '{ action }', { size: 18, color: C.you.ink, anchor: 'middle' });
}

// state & actions: dispatch → reducer → new state in the store
D.flow = () => {
  const s = stage(41);
  size(s, 900, 300);
  dispatcher(s, 120, 150);
  fat(s, 236, 150, 318, 150);
  pipe(s, 340, 150, 200, 100, 'reducer');
  fat(s, 572, 150, 650, 150);
  store(s, 760, 140, 220, 130);
  text(s, 760, 148, 'new state', { size: 26, color: C.server.ink });
  text(s, 760, 246, 'store', { size: 24, color: C.server.ink });
  return s.svg;
};

// multiple reducers: each one owns its own slice of the state
D.reducers = () => {
  const s = stage(43);
  size(s, 900, 300);
  dispatcher(s, 110, 150);
  const SL = [['user', C.you.ink, 66], ['posts', C.browser.ink, 150], ['ui', C.cdn.ink, 234]];
  const px = 330, pw = 150, ph = 58;
  // one dispatch fans out to every reducer
  SL.forEach(([, , y]) => arrow(s, 222, 150, px - 14, y));
  SL.forEach(([name, col, y]) => pipe(s, px, y, pw, ph, name, { mono: true, color: col }));
  // ...and they all land in the one store
  const cx = 740, cy = 140;
  SL.forEach(([, , y], i) => {
    const ey = cy - 34 + i * 34;
    arrow(s, px + pw + 20, y, cx - 125 * Math.sqrt(1 - ((ey - cy) / 75) ** 2) + 2, ey);
  });
  store(s, cx, cy, 250, 150);
  text(s, cx, cy - 22, 'new state', { size: 24, color: C.server.ink });
  // the state, one key per reducer, in that reducer's color
  const k = 10.85, parts = [['{ ', MONO_INK], ['user', SL[0][1]], [', ', MONO_INK], ['posts', SL[1][1]], [', ', MONO_INK], ['ui', SL[2][1]], [' }', MONO_INK]];
  let mx = cx - (parts.reduce((n, [p]) => n + p.length, 0) * k) / 2;
  parts.forEach(([p, col]) => { mono(s, mx, cy + 18, p, { size: 18, color: col }).style.whiteSpace = 'pre'; mx += p.length * k; });
  text(s, cx, 270, 'store', { size: 24, color: C.server.ink });
  return s.svg;
};

// pure vs impure: same box, but one leaks
function fbox(s, cx, title, col) {
  text(s, cx, 40, title, { size: 26, color: col });
  arrow(s, cx, 64, cx, 128);
  mono(s, cx + 8, 100, 'in', { size: 17, color: '#6b7280' });
  add(s, s.rc.rectangle(cx - 34, 134, 68, 92, { stroke: col, fill: '#fff', fillStyle: 'solid', strokeWidth: 2.6 }));
  mono(s, cx, 190, 'f', { size: 32, color: col, anchor: 'middle' });
  arrow(s, cx, 232, cx, 298);
  mono(s, cx + 8, 272, 'out', { size: 17, color: '#6b7280' });
}
// a wobbly arrow, for the side effects
function squiggle(s, x1, y1, x2, y2, col) {
  const n = 4, dx = (x2 - x1) / n, dy = (y2 - y1) / n;
  const len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len * 9, ny = (x2 - x1) / len * 9;
  let d = `M${x1} ${y1}`;
  for (let i = 0; i < n; i++) {
    const sgn = i % 2 ? -1 : 1;
    d += ` Q${x1 + dx * (i + 0.5) + nx * sgn} ${y1 + dy * (i + 0.5) + ny * sgn} ${x1 + dx * (i + 1)} ${y1 + dy * (i + 1)}`;
  }
  add(s, s.rc.path(d, { stroke: col, strokeWidth: 2.2 }));
  const a = Math.atan2(y2 - y1, x2 - x1), L = 12;
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5), { stroke: col, strokeWidth: 2.2 }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5), { stroke: col, strokeWidth: 2.2 }));
}
D.pure = () => {
  const s = stage(47);
  size(s, 380, 400);
  fbox(s, 50, 'pure', C.db.ink);
  note(s, 50, 336, 'same in,', { size: 18, color: C.db.ink });
  note(s, 50, 360, 'same out', { size: 18, color: C.db.ink });
  fbox(s, 152, 'impure', C.you.ink);
  // the cheeky arbitrary effects, leaking out the side
  const ink = C.you.ink;
  squiggle(s, 188, 150, 230, 112, ink);
  mono(s, 236, 112, 'fetch', { size: 17, color: ink });
  squiggle(s, 188, 180, 230, 180, ink);
  mono(s, 236, 186, 'Math.random()', { size: 17, color: ink });
  squiggle(s, 188, 210, 230, 252, ink);
  note(s, 236, 262, 'change a global', { size: 17, color: ink, anchor: 'start' });
  note(s, 262, 336, 'cheeky arbitrary', { size: 18, color: ink });
  note(s, 262, 360, 'effects!', { size: 18, color: ink });
  return s.svg;
};

// the shape of data: a state object, drawn inside new hampshire
// rough outline in lon/lat, projected into the box
const NH = [
  [-71.08, 45.30], [-71.30, 45.25], [-71.42, 45.14], [-71.50, 45.01], [-71.62, 44.88], [-71.56, 44.76],
  [-71.68, 44.64], [-71.82, 44.43], [-72.00, 44.32], [-72.04, 44.12], [-72.12, 43.98], [-72.18, 43.80],
  [-72.30, 43.58], [-72.38, 43.36], [-72.40, 43.14], [-72.46, 42.96], [-72.55, 42.73],
  [-71.30, 42.70], [-71.22, 42.75], [-71.05, 42.82], [-70.92, 42.88], [-70.82, 42.87],
  [-70.76, 42.98], [-70.70, 43.07], [-70.82, 43.22], [-70.97, 43.36], [-70.99, 43.62],
  [-71.00, 44.00], [-71.02, 44.40], [-71.03, 44.80], [-71.06, 45.10],
];
D.shape = () => {
  const s = stage(53);
  size(s, 400, 520);
  const k = 178, x0 = 142, y0 = 16;
  const pts = NH.map(([lon, lat]) => [x0 + (lon + 72.6) * 0.73 * k, y0 + (45.3 - lat) * k]);
  add(s, s.rc.polygon(pts, { stroke: '#374151', fill: '#eef2f7', fillStyle: 'hachure', hachureGap: 10, strokeWidth: 2.6 }));
  // the state object, one line at a time; a and b are the two slices
  const L = ['{', ' a: {', '   x: …,', '   y: …', ' },', ' b: {', '   i: …', ' }', '}'];
  const tx = 232, ty = 212, lh = 28;
  L.forEach((line, i) => {
    const t = mono(s, tx, ty + i * lh, line, { size: 20, color: MONO_INK });
    t.style.whiteSpace = 'pre';
    t.setAttribute('font-weight', /[ab]:/.test(line) ? 700 : 400);
  });
  // each reducer owns one key
  const R = C.build.ink, G = C.db.ink;
  text(s, 74, 120, 'reducerA', { size: 24, color: R });
  curve(s, 84, 132, tx + 2, ty + lh - 6, 70, G);
  text(s, 74, 330, 'reducerB', { size: 24, color: R });
  curve(s, 112, 340, tx + 2, ty + 5 * lh - 6, -20, G);
  return s.svg;
};

// connecting a component: the container talks to the store, hands props down
D.container = () => {
  const s = stage(59);
  size(s, 640, 380);
  const bx = 24, bw = 210, bh = 96;
  add(s, s.rc.rectangle(bx, 40, bw, bh, { stroke: C.build.ink, fill: C.build.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  text(s, bx + bw / 2, 82, 'container', { size: 24, color: C.build.ink });
  text(s, bx + bw / 2, 110, 'component', { size: 24, color: C.build.ink });
  store(s, 510, 88, 210, 116);
  text(s, 510, 96, 'store', { size: 26, color: C.server.ink });
  both(s, bx + bw + 12, 88, 396, 88);
  note(s, 320, 68, 'reads state,', { size: 18 });
  note(s, 320, 118, 'dispatches', { size: 18 });
  add(s, s.rc.rectangle(bx, 256, bw, bh, { stroke: C.browser.ink, fill: C.browser.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  text(s, bx + bw / 2, 298, 'presentational', { size: 24, color: C.browser.ink });
  text(s, bx + bw / 2, 326, 'component', { size: 24, color: C.browser.ink });
  both(s, bx + bw / 2, 146, bx + bw / 2, 246);
  note(s, bx + bw / 2 + 16, 202, 'props', { size: 19, anchor: 'start' });
  // the dumb half never sees redux
  note(s, 262, 296, 'just renders props,', { size: 18, anchor: 'start', color: '#6b7280' });
  note(s, 262, 322, 'never touches the store', { size: 18, anchor: 'start', color: '#6b7280' });
  return s.svg;
};

// provider: the store sits above the whole app
D.provider = () => {
  const s = stage(61);
  size(s, 340, 410);
  store(s, 170, 58, 220, 100);
  text(s, 170, 50, 'store', { size: 24, color: C.server.ink });
  add(s, s.rc.rectangle(136, 62, 68, 28, { stroke: C.server.ink, fill: '#fff', fillStyle: 'solid', roughness: 0.8, strokeWidth: 1.6 }));
  mono(s, 170, 82, 'state', { size: 17, color: MONO_INK, anchor: 'middle' });
  arrow(s, 170, 112, 170, 150);
  rbox(s, 12, 156, 316, 172, 18, { ink: C.build.ink, fill: C.build.fill, fillStyle: 'hachure' });
  mono(s, 26, 186, '<Provider store={store}>', { size: 17, color: C.build.ink });
  add(s, s.rc.rectangle(62, 204, 216, 82, { stroke: C.browser.ink, fill: '#fff', fillStyle: 'solid' }));
  mono(s, 170, 236, '<App />', { size: 20, color: C.browser.ink, anchor: 'middle' });
  // a few components down the tree
  [86, 148, 210].forEach((x) => add(s, s.rc.rectangle(x, 250, 44, 24, { stroke: C.browser.ink, fill: C.browser.fill, fillStyle: 'solid', roughness: 0.8, strokeWidth: 1.4 })));
  mono(s, 26, 314, '</Provider>', { size: 17, color: C.build.ink });
  note(s, 170, 362, 'every component inside', { size: 18 });
  note(s, 170, 388, 'can read the store', { size: 18 });
  return s.svg;
};

// redux in motion: one click goes all the way round the loop, then the next one.
// deposit, then withdraw, so the balance goes $0 → $10 → $0 and the loop starts over.
// add &t=<seconds> to freeze it at one moment (for screenshots)
D.motion = () => {
  const s = stage(47);
  const P = {
    click: [[125, 0], [125, 236]], // starts at whichever button was pressed
    action: [[150, 158], [150, 70], [480, 70], [480, 226]],
    current: [[790, 307], [790, 400], [480, 400], [480, 274]],
    back: [[840, 307], [840, 490], [326, 490]],
  };
  const PIPES = [['balance', C.db.ink, 200], ['history', C.browser.ink, 270], ['user', C.you.ink, 340]];

  // the arrows everything travels along: straight runs, a head on the last one
  const route = (pts, col) => {
    pts.slice(0, -2).forEach((p, i) => add(s, s.rc.line(p[0], p[1], pts[i + 1][0], pts[i + 1][1], { stroke: col, strokeWidth: 2.4 })));
    const [a, b] = pts.slice(-2);
    arrow(s, a[0], a[1], b[0], b[1], { color: col });
  };

  // the store, with dispatch, three reducers and the state inside it
  store(s, 640, 290, 490, 330);
  text(s, 700, 446, 'store', { size: 24, color: C.server.ink });
  route(P.action, C.arrow);
  route(P.current, C.server.ink);
  note(s, 635, 392, 'current state goes back in', { size: 16, color: C.server.ink });
  route(P.back, C.server.ink);
  rbox(s, 440, 230, 80, 40, 10, { ink: PIPE.ink, fill: PIPE.face });
  text(s, 480, 257, 'dispatch', { size: 17, color: PIPE.ink });
  note(s, 620, 172, 'reducers', { size: 17, color: PIPE.ink });
  PIPES.forEach(([name, col, y]) => {
    arrow(s, 524, 250, 560, y);
    pipe(s, 575, y, 90, 40, name, { mono: true, color: col, size: 14 });
    arrow(s, 678, y, 720, 270 + (y - 270) / 6);
  });
  rbox(s, 725, 238, 135, 64, 10, { ink: C.server.ink, fill: '#fff' });
  text(s, 792, 262, 'state', { size: 20, color: C.server.ink });
  const stateText = mono(s, 792, 288, '', { size: 13, color: C.server.ink, anchor: 'middle' });

  // the app: two buttons and the balance it shows
  route([[125, 328], [125, 236]], C.arrow);
  rbox(s, 60, 160, 180, 70, 12, { ink: C.browser.ink, fill: C.browser.fill });
  text(s, 150, 203, 'actions', { size: 24, color: C.browser.ink });
  win(s, 40, 330, 280, 190, 'mybank.app');
  const BTN = [['deposit $10', 403], ['withdraw $10', 453]];
  BTN.forEach(([label, y]) => {
    rbox(s, 60, y - 18, 130, 36, 8, { ink: '#374151', fill: '#f3f4f6' });
    text(s, 125, y + 6, label, { size: 16, color: '#374151', weight: 400 });
  });
  note(s, 258, 410, 'balance', { size: 16 });
  const balText = text(s, 258, 458, '', { size: 44, color: C.db.ink });

  // a yellow ring that flashes when something happens
  const glow = (x, y, w, h) => {
    const g = add(s, s.rc.rectangle(x, y, w, h, { stroke: '#f59e0b', strokeWidth: 4, roughness: 0.8 }));
    g.setAttribute('opacity', 0);
    return g;
  };
  const G = {
    btn: BTN.map(([, y]) => glow(54, y - 24, 142, 48)),
    actions: glow(52, 152, 196, 86),
    dispatch: glow(432, 222, 96, 56),
    reducers: glow(558, 168, 122, 196),
    state: glow(717, 230, 151, 80),
    balance: glow(212, 394, 94, 84),
  };

  // the things that travel: a pill with a label, drawn at 0,0 and moved by transform
  const token = (w, col, isMono) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(s.rc.ellipse(0, 0, w, 32, { stroke: col.ink, fill: col.fill, fillStyle: 'solid', strokeWidth: 2.2, roughness: 0.8 }));
    const t = isMono ? mono(s, 0, 5, '', { size: 13, color: col.ink, anchor: 'middle' }) : text(s, 0, 6, '', { size: 15, color: col.ink });
    g.appendChild(t);
    add(s, g);
    return { g, t };
  };
  const tk = {
    click: token(62, C.db),
    action: token(112, C.you, true),
    current: token(60, C.server, true),
    next: token(60, C.server, true),
    fan: PIPES.map(() => token(26, C.you)),
  };
  tk.click.t.textContent = 'click';

  // walk a fraction p of the way along a run of points
  const along = (pts, p) => {
    const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
    let d = p * segs.reduce((a, b) => a + b, 0), i = 0;
    while (i < segs.length - 1 && d > segs[i]) d -= segs[i++];
    const f = segs[i] ? d / segs[i] : 0, a = pts[i], b = pts[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  };
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
  // how far between t0 and t1 we are, eased; -1 before, 2 after (so callers can hide)
  const span = (u, t0, t1) => (u < t0 ? -1 : u > t1 ? 2 : ease((u - t0) / (t1 - t0)));
  const put = (k, xy) => {
    if (!xy) return k.g.setAttribute('opacity', 0);
    k.g.setAttribute('opacity', 1);
    k.g.setAttribute('transform', `translate(${xy[0]} ${xy[1]})`);
  };
  const flash = (el, u, t0) => el.setAttribute('opacity', u >= t0 && u < t0 + 0.6 ? 1 - (u - t0) / 0.6 : 0);

  const HALF = 10; // seconds per click
  function frame(t) {
    const half = Math.floor(t / HALF) % 2, u = t % HALF;
    const before = half ? 10 : 0, after = half ? 0 : 10;
    const kind = half ? 'withdraw' : 'deposit', by = BTN[half][1];
    // 0.2 press the button, 0.5 the click goes up to actions
    flash(G.btn[half], u, 0.2); flash(G.btn[1 - half], -1, 0);
    let p = span(u, 0.5, 1.3);
    put(tk.click, p >= 0 && p <= 1 ? along([[125, by], P.click[1]], p) : null);
    // 1.3 the action creator makes an action, 1.6 dispatch carries it over to the store
    flash(G.actions, u, 1.3);
    tk.action.t.textContent = `${kind} 10`;
    p = span(u, 1.6, 3.4);
    put(tk.action, u >= 1.3 && p <= 1 ? along(P.action, Math.max(p, 0)) : null);
    // 2.0 the current state heads back in, arriving with the action
    tk.current.t.textContent = '$' + before;
    p = span(u, 2.0, 3.4);
    put(tk.current, p >= 0 && p <= 1 ? along(P.current, p) : null);
    // 3.4 dispatch hands both to every reducer
    flash(G.dispatch, u, 3.4);
    p = span(u, 3.6, 4.3);
    PIPES.forEach(([, , y], i) => put(tk.fan[i], p >= 0 && p <= 1 ? along([[524, 250], [560, y]], p) : null));
    flash(G.reducers, u, 4.3);
    // 4.8 the balance reducer returns the new state
    tk.next.t.textContent = '$' + after;
    const fresh = u >= 5.4;
    stateText.textContent = `{ balance: ${fresh ? after : before} }`;
    flash(G.state, u, 5.4);
    p = span(u, 4.8, 5.4);
    const q = span(u, 5.8, 7.2);
    if (p >= 0 && p <= 1) put(tk.next, along([[678, 200], [792, 270]], p));
    else if (q >= 0 && q <= 1) put(tk.next, along(P.back, q));
    else put(tk.next, null);
    // 7.2 the app re-renders with it
    balText.textContent = '$' + (u >= 7.2 ? after : before);
    flash(G.balance, u, 7.2);
  }

  const freeze = new URLSearchParams(location.search).get('t');
  if (freeze !== null) frame(Number(freeze) || 0);
  else {
    const t0 = performance.now();
    const tick = (now) => { frame((now - t0) / 1000); requestAnimationFrame(tick); };
    frame(0);
    requestAnimationFrame(tick);
  }
  return s.svg;
};
