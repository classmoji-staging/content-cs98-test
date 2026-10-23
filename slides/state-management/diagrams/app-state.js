// application level state: the data layer under the UI (4.2)
// drawn by games/sketchkit/draw.html?deck=<this deck's folder>&f=<this file>&d=<name>

// one color per piece of state, used in both the json and the screen
const ST = { user: C.you.ink, apps: C.browser.ink, icons: C.build.ink, clock: C.cdn.ink };

// a sketched desktop, w wide; each region drawn in its state's color
function desktop(s, x, y, w) {
  const k = w / 600, h = 350 * k;
  add(s, s.rc.rectangle(x, y, w, h, { stroke: '#374151', fill: '#f3f4f6', fillStyle: 'solid', strokeWidth: 2.6 }));
  add(s, s.rc.line(x, y + 26 * k, x + w, y + 26 * k, { stroke: '#374151' }));
  // menu bar: clock, then the signed-in user
  mono(s, x + w - 150 * k, y + 19 * k, '2:38 PM', { size: 15 * k + 3, color: ST.clock });
  add(s, s.rc.circle(x + w - 24 * k, y + 13 * k, 18 * k, { stroke: ST.user, fill: C.you.fill, fillStyle: 'solid' }));
  // an app window, with a couple of notes in it
  const wx = x + 50 * k, wy = y + 56 * k, ww = 330 * k, wh = 190 * k;
  add(s, s.rc.rectangle(wx, wy, ww, wh, { stroke: ST.apps, fill: '#fff', fillStyle: 'solid' }));
  add(s, s.rc.line(wx, wy + 24 * k, wx + ww, wy + 24 * k, { stroke: ST.apps }));
  for (let i = 0; i < 3; i++) add(s, s.rc.circle(wx + 14 * k + i * 14 * k, wy + 12 * k, 8 * k, { stroke: ST.apps }));
  add(s, s.rc.rectangle(wx + 30 * k, wy + 50 * k, 110 * k, 90 * k, { stroke: '#b45309', fill: '#fde68a', fillStyle: 'hachure', hachureGap: 6 }));
  add(s, s.rc.rectangle(wx + 170 * k, wy + 70 * k, 110 * k, 90 * k, { stroke: '#b45309', fill: '#fde68a', fillStyle: 'hachure', hachureGap: 6 }));
  // desktop icons down the right side
  ['lab3', 'notes'].forEach((name, i) => {
    const ix = x + w - 80 * k, iy = y + 64 * k + i * 90 * k;
    add(s, s.rc.polygon([[ix, iy + 8 * k], [ix + 18 * k, iy + 8 * k], [ix + 24 * k, iy], [ix + 48 * k, iy], [ix + 48 * k, iy + 40 * k], [ix, iy + 40 * k]], { stroke: ST.icons, fill: C.build.fill, fillStyle: 'solid' }));
    note(s, ix + 24 * k, iy + 62 * k, name, { size: 15 * k + 3, color: ST.icons });
  });
  // the dock: open apps, a dot under the active one
  const dw = 250 * k, dx = x + (w - dw) / 2, dy = y + h - 54 * k;
  add(s, s.rc.rectangle(dx, dy, dw, 42 * k, { stroke: ST.apps, fill: C.browser.fill, fillStyle: 'solid', roughness: 0.9 }));
  ['#1d4ed8', '#ea580c', '#15803d', '#6d28d9'].forEach((col, i) => {
    const ax = dx + 22 * k + i * 58 * k;
    add(s, s.rc.rectangle(ax, dy + 7 * k, 28 * k, 26 * k, { stroke: col, fill: col, fillStyle: 'solid', roughness: 0.7 }));
  });
  add(s, s.rc.circle(dx + 36 * k, dy + 38 * k, 5 * k, { stroke: ST.apps, fill: ST.apps, fillStyle: 'solid' }));
  return { h };
}

D.dataLayer = () => {
  const s = stage(72);
  // the state, as data
  add(s, s.rc.rectangle(24, 40, 420, 370, { stroke: '#374151', fill: '#fff', fillStyle: 'solid' }));
  text(s, 70, 32, 'state', { size: 24, color: '#374151' });
  const L = [
    ['{', '#374151'],
    ['  user: { name: "panda", loggedIn: true },', ST.user],
    ['  apps: [', ST.apps],
    ['    { name: "VS Code", active: true },', ST.apps],
    ['    { name: "Chrome", active: false },', ST.apps],
    ['  ],', ST.apps],
    ['  icons: [', ST.icons],
    ['    { name: "lab3", x: 900, y: 60 },', ST.icons],
    ['    { name: "notes", x: 900, y: 150 },', ST.icons],
    ['  ],', ST.icons],
    ['  clock: { time: "2:38 PM" },', ST.clock],
    ['}', '#374151'],
  ];
  // svg drops leading spaces unless told to keep them
  L.forEach(([line, col], i) => { mono(s, 42, 76 + i * 28, line, { size: 15, color: col }).style.whiteSpace = 'pre'; });
  // ...becomes the screen
  desktop(s, 510, 106, 370);
  text(s, 695, 90, 'the UI', { size: 24, color: '#374151' });
  arrow(s, 452, 230, 500, 230);
  note(s, 476, 260, 'render', { size: 18 });
  text(s, 450, 482, 'UI = f(state)', { size: 36, color: '#111827' });
  note(s, 450, 526, 'change the data and the screen follows: never edit the screen directly', { color: '#6b7280' });
  return s.svg;
};

// application state drives the component tree, react-dom keeps the DOM in step (4.3)
// a short strip (900×330) so the slide's bullets fit underneath
function node(s, x, y, label, c) {
  add(s, s.rc.rectangle(x, y, 150, 52, { stroke: c.ink, fill: c.fill, fillStyle: 'hachure', hachureGap: 8, fillWeight: 1.2 }));
  mono(s, x + 75, y + 32, label, { size: 17, color: c.ink, anchor: 'middle' });
}
function tree(s, x, labels, c, title) {
  text(s, x + 100, 44, title, { size: 22, color: c.ink });
  add(s, s.rc.line(x + 24, 132, x + 24, 290, { stroke: c.ink, strokeWidth: 1.8 }));
  add(s, s.rc.line(x + 24, 200, x + 50, 200, { stroke: c.ink, strokeWidth: 1.8 }));
  add(s, s.rc.line(x + 24, 290, x + 50, 290, { stroke: c.ink, strokeWidth: 1.8 }));
  node(s, x, 80, labels[0], c);
  node(s, x + 50, 174, labels[1], c);
  node(s, x + 50, 264, labels[2], c);
}
D.stateDrives = () => {
  const s = stage(31);
  s.svg.setAttribute('viewBox', '0 0 900 330');
  // the app state: one place the data lives
  const cx = 92, top = 112, w = 144, h = 136, c = C.db;
  add(s, s.rc.rectangle(cx - w / 2, top, w, h, { stroke: 'none', fill: c.fill, fillStyle: 'hachure', hachureGap: 8 }));
  add(s, s.rc.line(cx - w / 2, top, cx - w / 2, top + h, { stroke: c.ink }));
  add(s, s.rc.line(cx + w / 2, top, cx + w / 2, top + h, { stroke: c.ink }));
  add(s, s.rc.path(`M${cx - w / 2} ${top + h} Q ${cx} ${top + h + 34} ${cx + w / 2} ${top + h}`, { stroke: c.ink }));
  add(s, s.rc.ellipse(cx, top, w, 34, { stroke: c.ink, fill: '#fff', fillStyle: 'solid' }));
  text(s, cx, 186, 'application', { size: 21, color: c.ink });
  text(s, cx, 212, 'state', { size: 21, color: c.ink });
  arrow(s, 178, 186, 262, 186, { label: 'drives', ly: -16 });
  tree(s, 284, ['<App>', '<Toolbar>', '<NoteList>'], C.server, 'component tree');
  arrow(s, 498, 186, 594, 186, { label: 'react-dom', ly: -16 });
  tree(s, 614, ['<div>', '<header>', '<ul>'], C.you, 'DOM');
  return s.svg;
};
