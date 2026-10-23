// the redux map, the zustand map, the zustand cycle, and atoms vs a store
// drawn by games/sketchkit/draw.html?deck=<this deck's folder>&f=<this file>&d=<name>

// shared look: store = dashed yellow ellipse, components = blue boxes,
// reducers = tan cylinders, middleware = teal, the main loop = red arrows
const TAN = { ink: '#8a5a2b', fill: '#efdcc4' };
const LOOP = C.you.ink;

function size(s, w, h) {
  s.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  s.svg.setAttribute('width', w); s.svg.setAttribute('height', h);
}
// a curved arrow through control point (qx, qy); dashed if o.dash
function bow(s, x1, y1, qx, qy, x2, y2, o = {}) {
  const col = o.color || C.arrow;
  add(s, s.rc.path(`M${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`, { stroke: col, strokeWidth: 2.4, strokeLineDash: o.dash ? [8, 7] : undefined }));
  const a = Math.atan2(y2 - qy, x2 - qx), L = 14;
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45), { stroke: col, strokeWidth: 2.4 }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45), { stroke: col, strokeWidth: 2.4 }));
}
// the connected component: same box on both maps
function comp(s) {
  add(s, s.rc.rectangle(40, 50, 220, 92, { stroke: C.browser.ink, fill: C.browser.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  text(s, 150, 88, 'connected', { color: C.browser.ink, size: 23 });
  text(s, 150, 116, 'component', { color: C.browser.ink, size: 23 });
}
// the store: dashed yellow ellipse
function store(s, cx, cy, w, h) {
  add(s, s.rc.ellipse(cx, cy, w, h, { stroke: C.server.ink, fill: C.server.fill, fillStyle: 'hachure', hachureGap: 9, strokeLineDash: [10, 7], strokeWidth: 2.6 }));
}
// a reducer: a tan cylinder lying on its side
function cyl(s, x, cy, w, h, label) {
  add(s, s.rc.rectangle(x, cy - h / 2, w, h, { stroke: 'none', fill: TAN.fill, fillStyle: 'hachure', hachureGap: 7 }));
  add(s, s.rc.line(x, cy - h / 2, x + w, cy - h / 2, { stroke: TAN.ink }));
  add(s, s.rc.line(x, cy + h / 2, x + w, cy + h / 2, { stroke: TAN.ink }));
  add(s, s.rc.path(`M${x} ${cy - h / 2} Q ${x - h * 0.42} ${cy} ${x} ${cy + h / 2}`, { stroke: TAN.ink }));
  add(s, s.rc.ellipse(x + w, cy, h * 0.42, h, { stroke: TAN.ink, fill: '#fff', fillStyle: 'solid' }));
  text(s, x + w / 2 - 6, cy + 7, label, { color: TAN.ink, size: 20 });
}
// a teal middleware chip
function ware(s, x, y, w, label) {
  add(s, s.rc.rectangle(x, y, w, 44, { stroke: C.cdn.ink, fill: C.cdn.fill, fillStyle: 'hachure', hachureGap: 8 }));
  mono(s, x + w / 2, y + 28, label, { size: 18, color: C.cdn.ink, anchor: 'middle' });
}

D.reduxMap = () => {
  const s = stage(52);
  size(s, 900, 620);
  comp(s);
  // the action creator
  add(s, s.rc.rectangle(590, 50, 250, 92, { stroke: C.build.ink, fill: C.build.fill, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.2 }));
  text(s, 715, 88, 'action creator', { color: C.build.ink, size: 23 });
  mono(s, 715, 118, 'play(song)', { size: 18, color: C.build.ink, anchor: 'middle' });
  arrow(s, 266, 96, 582, 96, { color: LOOP, label: 'trigger actionCreator()', ly: -14 });
  step(s, 1, 424, 124);
  // what it hands back
  add(s, s.rc.rectangle(615, 216, 200, 62, { stroke: '#374151', fill: '#fff', fillStyle: 'solid' }));
  text(s, 715, 254, 'action / function', { color: '#374151', size: 21 });
  arrow(s, 715, 148, 715, 210, { color: LOOP });
  note(s, 696, 172, 'returns an action object,', { anchor: 'end' });
  note(s, 696, 196, 'or a thunk (function)', { anchor: 'end' });
  step(s, 2, 746, 180);
  // dispatch, with the middleware in its throat
  add(s, s.rc.polygon([[605, 334], [825, 334], [740, 420], [740, 452], [690, 452], [690, 420]], { stroke: C.cdn.ink, fill: C.cdn.fill, fillStyle: 'hachure', hachureGap: 8, strokeWidth: 2.6 }));
  text(s, 715, 364, 'middleware', { color: C.cdn.ink, size: 20 });
  text(s, 715, 392, 'dispatch', { color: C.cdn.ink, size: 22 });
  arrow(s, 715, 284, 715, 328, { color: LOOP });
  step(s, 3, 746, 306);
  // the thunk side loop: back up to action / function
  bow(s, 624, 354, 532, 332, 608, 264, { dash: true });
  note(s, 552, 296, 'a thunk runs, and can', { anchor: 'end' });
  note(s, 552, 320, 'dispatch another action', { anchor: 'end' });
  // every reducer gets the action
  const R = [452, 512, 572];
  R.forEach((y) => cyl(s, 352, y, 150, 46, 'reducer'));
  R.forEach((y) => arrow(s, 708, 458, 518, y, { color: LOOP }));
  note(s, 760, 510, 'sends the action', { anchor: 'start' });
  note(s, 760, 534, 'to every reducer', { anchor: 'start' });
  step(s, 4, 776, 474);
  // ...and each returns new state into the store
  store(s, 150, 506, 210, 124);
  text(s, 150, 514, 'store', { color: C.server.ink, size: 26 });
  R.forEach((y) => arrow(s, 336, y, 262, 506 + (y - 512) * 0.6, { color: LOOP }));
  note(s, 300, 412, 'returns', { anchor: 'middle' });
  note(s, 300, 434, 'new state', { anchor: 'middle' });
  step(s, 5, 300, 604);
  // the store feeds every connected component
  arrow(s, 150, 440, 150, 150, { color: LOOP });
  note(s, 170, 232, 'into the props / selectors', { anchor: 'start' });
  note(s, 170, 256, 'of every connected component', { anchor: 'start' });
  step(s, 6, 120, 296);
  return s.svg;
};

D.zustandMap = () => {
  const s = stage(53);
  size(s, 900, 620);
  comp(s);
  // optional middleware, two chips
  note(s, 735, 46, 'optional middleware', { size: 18, color: C.cdn.ink });
  ware(s, 615, 74, 100, 'immer');
  ware(s, 730, 74, 120, 'devtools');
  arrow(s, 266, 96, 607, 96, { color: LOOP });
  note(s, 436, 58, 'calls an action function');
  note(s, 436, 82, 'from the store');
  step(s, 1, 436, 124);
  // the store: data + the functions that change it
  store(s, 590, 410, 480, 250);
  text(s, 590, 330, 'store', { color: C.server.ink, size: 26 });
  arrow(s, 732, 124, 732, 318, { color: LOOP });
  step(s, 2, 764, 220);
  text(s, 710, 398, 'action functions', { color: C.server.ink, size: 21 });
  mono(s, 710, 428, 'play()  next()', { size: 18, color: '#374151', anchor: 'middle' });
  text(s, 460, 398, 'data', { color: C.server.ink, size: 21 });
  mono(s, 460, 428, '{ songs, playing }', { size: 18, color: '#374151', anchor: 'middle' });
  arrow(s, 650, 462, 530, 462, { color: LOOP });
  note(s, 590, 494, 'set() makes new state');
  step(s, 3, 590, 438);
  // back to the component through the hook
  bow(s, 352, 420, 150, 420, 150, 150, { color: LOOP });
  note(s, 172, 262, 'useStore hook', { anchor: 'start' });
  note(s, 172, 286, 'with a selector', { anchor: 'start' });
  step(s, 4, 220, 380);
  note(s, 450, 596, 'no action creators, no dispatch, no reducers to wire up', { color: '#6b7280' });
  return s.svg;
};

// view → actions → state → view (zustand summary)
D.cycle = () => {
  const s = stage(54);
  size(s, 480, 350);
  const N = [
    ['view', 240, 92, C.db],
    ['actions', 372, 262, C.you],
    ['state', 108, 262, C.build],
  ];
  N.forEach(([label, x, y, c]) => {
    add(s, s.rc.circle(x, y, 132, { stroke: c.ink, fill: c.fill, fillStyle: 'hachure', hachureGap: 8, fillWeight: 1.2 }));
    text(s, x, y + 9, label, { color: c.ink, size: 26 });
  });
  // dashed arrows, each bowed outward so the loop reads round
  const edge = (a, b, t) => [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => {
    const a = N[i], b = N[j];
    const [x1, y1] = edge(a, b, 0.33), [x2, y2] = edge(a, b, 0.67);
    // push the control point away from the middle of the triangle
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ox = mx - 240, oy = my - 205, d = Math.hypot(ox, oy);
    bow(s, x1, y1, mx + (ox / d) * 26, my + (oy / d) * 26, x2, y2, { dash: true });
  });
  return s.svg;
};

// jotai / recoil: many small atoms, each component reads only its own
D.atoms = () => {
  const s = stage(55);
  size(s, 800, 420);
  const ATOM = { ink: '#a16207', fill: '#fde68a' }, SEL = { ink: '#7c4a1e', fill: '#e7c9a5' };
  const A = [90, 170, 250, 330, 410].map((x) => [x, 66]);
  const S = [[150, 172], [300, 172], [430, 172]];
  // atoms feed selectors; one selector feeds another
  [[0, 0], [1, 0], [2, 1], [3, 1]].forEach(([a, b]) => {
    const [x1, y1] = A[a], [x2, y2] = S[b], t = Math.atan2(y2 - y1, x2 - x1);
    arrow(s, x1 + 22 * Math.cos(t), y1 + 22 * Math.sin(t), x2 - 26 * Math.cos(t), y2 - 26 * Math.sin(t));
  });
  arrow(s, 328, 172, 400, 172);
  A.forEach(([x, y]) => add(s, s.rc.circle(x, y, 40, { stroke: ATOM.ink, fill: ATOM.fill, fillStyle: 'solid' })));
  S.forEach(([x, y]) => add(s, s.rc.circle(x, y, 48, { stroke: SEL.ink, fill: SEL.fill, fillStyle: 'hachure', hachureGap: 6 })));
  text(s, 470, 74, 'atoms (bits of state)', { color: ATOM.ink, size: 22, anchor: 'start' });
  text(s, 480, 168, 'selectors', { color: SEL.ink, size: 22, anchor: 'start' });
  note(s, 480, 192, '(derived from atoms)', { color: SEL.ink, anchor: 'start' });
  // the component tree, laid flat on a plane
  add(s, s.rc.polygon([[110, 250], [790, 250], [700, 404], [20, 404]], { stroke: '#9ca3af', fill: '#f3f4f6', fillStyle: 'solid', strokeWidth: 1.8 }));
  note(s, 580, 390, 'react component tree', { color: '#6b7280' });
  const T = [
    { root: [230, 278], kids: [[170, 352], [290, 352]] },
    { root: [520, 278], kids: [[450, 352], [590, 352]] },
  ];
  T.forEach(({ root, kids }) => {
    kids.forEach(([x, y]) => add(s, s.rc.line(root[0], root[1], x, y, { stroke: C.browser.ink, strokeWidth: 1.8 })));
    [root, ...kids].forEach(([x, y]) => add(s, s.rc.circle(x, y, 30, { stroke: C.browser.ink, fill: C.browser.fill, fillStyle: 'solid' })));
  });
  // each leaf subscribes to just what it reads
  const leaf = (i, k) => T[i].kids[k];
  [
    [A[4], leaf(1, 1), '#be123c', 20],
    [S[0], leaf(0, 0), '#0f766e', 24],
    [S[2], leaf(1, 0), '#6d28d9', 24],
    [S[1], leaf(0, 1), '#ea580c', 24],
  ].forEach(([[x1, y1], [x2, y2], col, r]) => {
    const t = Math.atan2(y2 - y1, x2 - x1);
    arrow(s, x1 + r * Math.cos(t), y1 + r * Math.sin(t), x2 - 18 * Math.cos(t), y2 - 18 * Math.sin(t), { color: col });
  });
  return s.svg;
};
