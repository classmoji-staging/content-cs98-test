// the component tree, four ways: a change rippling everywhere, components talking directly, a store, both side by side
// drawn by games/sketchkit/draw.html?deck=<this deck's folder>&f=<this file>&d=<name>

// one tree for every diagram, the same lopsided 10 components as the original pictures:
// a has one child, b has two. [x, y] around the root before scaling
const NODES = {
  root: [0, 0],
  a: [-110, 120], b: [100, 120],
  a1: [-240, 240], b1: [40, 240], b2: [230, 240],
  a1a: [-360, 360], a1b: [-130, 360], b2a: [150, 360], b2b: [330, 360],
};
const EDGES = [['root', 'a'], ['root', 'b'], ['a', 'a1'], ['b', 'b1'], ['b', 'b2'], ['a1', 'a1a'], ['a1', 'a1b'], ['b2', 'b2a'], ['b2', 'b2b']];
const START = 'a1b'; // the purple one: the component that starts a change
const R = 30, INK = '#374151', GRAY = '#e5e7eb';

// draw the tree with its root at (ox, oy), k times full size; returns each node's spot
function tree(s, ox, oy, k = 1) {
  const p = {};
  Object.entries(NODES).forEach(([id, [x, y]]) => { p[id] = { x: ox + x * k, y: oy + y * k, rx: R * k, ry: R * k }; });
  // lines first, so the circles sit on top of them. same seed per node in every diagram
  EDGES.forEach(([a, b], i) => add(s, s.rc.line(p[a].x, p[a].y, p[b].x, p[b].y, { stroke: INK, strokeWidth: 2.2 * k + 0.4, seed: 40 + i })));
  Object.keys(NODES).forEach((id, i) => {
    const c = id === START ? C.build : { ink: INK, fill: GRAY };
    add(s, s.rc.circle(p[id].x, p[id].y, 2 * R * k, { stroke: c.ink, fill: c.fill, fillStyle: 'solid', strokeWidth: (id === START ? 3 : 2.2) * k + 0.4, seed: 11 + i }));
  });
  return p;
}

// a curved arrow from a to b (nodes or the store), stopping just off their edges, not at the centers.
// o.bend: bow that many px to the left of travel (negative bows right)
// o.ctrl: or aim through this control point instead
// o.spread: leave and arrive this many radians off the straight line, so it rides beside a tree line
function bow(s, a, b, o = {}) {
  const k = o.k || 1, col = o.col || C.arrow, gap = 7 * k;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const nx = dy / len, ny = -dx / len, bend = o.bend || 0, side = Math.sign(bend) || 1;
  let x1, y1, x2, y2, cx, cy;
  if (o.spread) {
    const ta = Math.atan2(dy, dx) - side * o.spread, tb = Math.atan2(-dy, -dx) + side * o.spread;
    [x1, y1] = [a.x + (a.rx + gap) * Math.cos(ta), a.y + (a.ry + gap) * Math.sin(ta)];
    [x2, y2] = [b.x + (b.rx + gap) * Math.cos(tb), b.y + (b.ry + gap) * Math.sin(tb)];
    [cx, cy] = [(x1 + x2) / 2 + nx * bend, (y1 + y2) / 2 + ny * bend];
  } else {
    [cx, cy] = o.ctrl || [(a.x + b.x) / 2 + nx * bend, (a.y + b.y) / 2 + ny * bend];
    // the point on n's edge (circle or ellipse) facing the control point
    const edge = (n) => {
      const ux = cx - n.x, uy = cy - n.y, l = Math.hypot(ux, uy);
      const r = 1 / Math.hypot(ux / l / n.rx, uy / l / n.ry) + gap;
      return [n.x + (ux / l) * r, n.y + (uy / l) * r];
    };
    [x1, y1] = edge(a); [x2, y2] = edge(b);
  }
  const w = 2.6 * k + 0.4, L = 14 * Math.sqrt(k);
  add(s, s.rc.path(`M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, { stroke: col, strokeWidth: w }));
  const t = Math.atan2(y2 - cy, x2 - cx);
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(t - 0.45), y2 - L * Math.sin(t - 0.45), { stroke: col, strokeWidth: w }));
  add(s, s.rc.line(x2, y2, x2 - L * Math.cos(t + 0.45), y2 - L * Math.sin(t + 0.45), { stroke: col, strokeWidth: w }));
}

// prop drilling: one change ripples from component to component all over the tree
function drill(s, p, k = 1) {
  const hops = [['a1b', 'b1', 24], ['b1', 'a', 6], ['b1', 'b', 8, 0.7], ['a', 'root', 26], ['a', 'a1', -26], ['b', 'b2', 26], ['b2', 'b1', 10]];
  // [from, to, bend, spread]: spread keeps an arrow beside the tree line it follows
  hops.forEach(([a, b, bend, spread]) => bow(s, p[a], p[b], { bend: bend * k, spread, col: C.you.ink, k }));
}

// the store floats above the tree, top left
function store(s, ox, oy, k = 1) {
  const x = ox - 300 * k, y = oy + 10 * k, w = 200 * k, h = 84 * k;
  add(s, s.rc.ellipse(x, y, w, h, { stroke: C.server.ink, fill: C.server.fill, fillStyle: 'solid', strokeWidth: 2.6 * k + 0.4, strokeLineDash: [9 * k + 2, 6 * k + 2], seed: 9 }));
  text(s, x, y + 9 * k, 'store', { color: C.server.ink, size: 26 * k + 6 });
  return { x, y, rx: w / 2, ry: h / 2 };
}
// one dispatch up from the purple node, subscribes back down to the nodes in `to` that read it.
// control points are in tree coordinates, so the arrows clear the circles at any size
const SUB = { a1: [-290, 140], a: [-150, 30], b1: [-30, 30], b: [20, -140], b2: [240, -100] };
function wire(s, p, st, ox, oy, k = 1, to = ['a', 'b']) {
  const at = ([x, y]) => [ox + x * k, oy + y * k];
  bow(s, p.a1b, st, { ctrl: at([-140, 180]), col: C.db.ink, k });
  to.forEach((id) => bow(s, st, p[id], { ctrl: at(SUB[id]), col: C.browser.ink, k }));
}

// a legend entry: a short arrow (or a dot) and what it means
function key(s, x, y, col, label) {
  arrow(s, x, y, x + 48, y, { color: col });
  note(s, x + 60, y + 6, label, { anchor: 'start', color: '#374151' });
}
function dot(s, x, y, label) {
  add(s, s.rc.circle(x + 14, y, 26, { stroke: C.build.ink, fill: C.build.fill, fillStyle: 'solid', strokeWidth: 2.6 }));
  note(s, x + 40, y + 6, label, { anchor: 'start', color: '#374151' });
}

D.drilling = () => {
  const s = stage(52);
  const p = tree(s, 450, 70);
  drill(s, p);
  return s.svg;
};

D.direct = () => {
  const s = stage(52);
  const p = tree(s, 450, 70);
  // the purple node tries to talk straight to its grandparent and across to the other branch
  const red = { col: C.you.ink };
  bow(s, p.a1b, p.a, { ...red, bend: 30 });
  bow(s, p.a1b, p.b, { ...red, ctrl: [420, 240] }); // arcs over the node between them
  key(s, 150, 524, C.you.ink, 'poor practice when components try to communicate directly');
  return s.svg;
};

D.store = () => {
  const s = stage(52);
  // a little lower than the others so the arc over the root stays on the canvas
  const p = tree(s, 450, 95);
  wire(s, p, store(s, 450, 95), 450, 95);
  key(s, 270, 524, C.db.ink, 'dispatch');
  key(s, 480, 524, C.browser.ink, 'subscribe');
  return s.svg;
};

D.together = () => {
  const s = stage(52);
  const k = 0.52, oy = 170;
  text(s, 225, 84, 'without a store', { size: 26, color: INK });
  drill(s, tree(s, 225, oy, k), k);
  text(s, 675, 84, 'with a store', { size: 26, color: INK });
  const p = tree(s, 675, oy, k);
  wire(s, p, store(s, 675, oy, k), 675, oy, k, ['a1', 'a', 'b1', 'b', 'b2']);
  dot(s, 300, 470, 'component starting the change');
  return s.svg;
};
