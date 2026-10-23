// where does this state live? eight places, least machinery at the top
// drawn by games/sketchkit/draw.html?deck=<this deck's folder>&f=<this file>
// add &here=<1-8> to light up one row ("you are here") and fade the rest

D.stateLadder = () => {
  const s = stage(60);
  const here = Number(new URLSearchParams(location.search).get('here')) || 0;
  const ROWS = [
    // [where it lives, the tool, when to use it, an example]
    ['derive it', "don't store it", 'can you compute it from other state?', 'a filtered list', '#15803d'],
    ['in the component', 'useState / useReducer', 'only one component reads it', 'a toggle', '#15803d'],
    ['in the parent', 'lift it up, pass props', 'two siblings need it', 'the selected item', '#0f766e'],
    ['in the url', 'useSearchParams', 'should survive refresh, back and sharing', 'page 3', '#0f766e'],
    ['in context', 'createContext / useContext', 'app-wide, changes rarely', 'the language', '#1d4ed8'],
    ['in a store', 'Zustand', 'shared and changes often: read a slice', "what's playing", '#6d28d9'],
    ['in a server cache', 'TanStack Query / SWR / fetch / loaders', "it's the server's data, you hold a copy", 'the comments', '#9a6a12'],
    ['synced everywhere', 'Firebase / a sync engine', 'lives on many devices at once', 'a shared doc', '#be123c'],
  ];
  const top = 56, gap = 60, railL = 150, railR = 374, x = 402;
  const rowY = (i) => top + gap * i + (i >= 6 ? 6 : 0);
  const bottom = rowY(7);
  add(s, s.rc.line(railL, top - 18, railL, bottom + 22, { stroke: '#6b7280', strokeWidth: 3 }));
  add(s, s.rc.line(railR, top - 18, railR, bottom + 22, { stroke: '#6b7280', strokeWidth: 3 }));
  ROWS.forEach(([name, api, rule, eg, col], i) => {
    const y = rowY(i), n0 = s.svg.childNodes.length;
    add(s, s.rc.line(railL, y, railR, y, { stroke: col, strokeWidth: 3 }));
    step(s, i + 1, railL - 40, y);
    text(s, (railL + railR) / 2, y - 8, name, { color: col, size: 20 });
    mono(s, x, y - 4, api, { size: 15, color: col });
    note(s, x, y + 18, rule, { size: 17, anchor: 'start', color: '#374151' });
    note(s, 890, y - 4, 'e.g. ' + eg, { size: 16, anchor: 'end', color: '#9ca3af' });
    if (here && here !== i + 1) [...s.svg.childNodes].slice(n0).forEach((el) => el.setAttribute('opacity', 0.22));
  });
  if (here) {
    const y = rowY(here - 1);
    add(s, s.rc.rectangle(railL - 58, y - 34, 894 - (railL - 58), 62, { stroke: '#f59e0b', strokeWidth: 2.4, roughness: 1 }));
    note(s, railL - 64, y + 6, 'you are here', { size: 15, anchor: 'end', color: '#b45309' });
  }
  // the line between state you own and state you borrow from the server
  const dy = (rowY(5) + rowY(6)) / 2 + 2;
  // the arrow goes down first so the labels can sit on a white patch over it
  arrow(s, 46, top - 6, 46, bottom + 6, { color: '#9ca3af' });
  add(s, s.rc.rectangle(34, dy - 26, 26, 52, { stroke: 'none', fill: '#fff', fillStyle: 'solid' }));
  add(s, s.rc.line(10, dy, 890, dy, { stroke: '#9ca3af', strokeWidth: 1.6, strokeLineDash: [8, 7], roughness: 0.6 }));
  note(s, 14, dy - 8, '↑ you own it', { size: 15, anchor: 'start', color: '#6b7280' });
  note(s, 14, dy + 20, "↓ the server's", { size: 15, anchor: 'start', color: '#6b7280' });
  // less machinery at the top, more at the bottom
  text(s, 14, top - 30, 'less machinery', { size: 16, color: '#6b7280', weight: 400, anchor: 'start' });
  text(s, 14, bottom + 36, 'more machinery', { size: 16, color: '#6b7280', weight: 400, anchor: 'start' });
  if (!here) note(s, 450, 548, 'start at the top. move down only when the state needs it.', { color: '#6b7280' });
  return s.svg;
};
