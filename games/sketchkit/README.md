# sketchkit

The hand-drawn look for CS52 diagrams: sketchy lines from [rough.js](https://roughjs.com) 4.6.6, labels in the deck's title font (Comic Neue Angular), and one color per role.

The kit is shared. The diagrams live with their decks.

```
games/sketchkit/
  rough.js      rough.js 4.6.6 (same file as cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.js)
  kit.js        palette + helpers: stage, text, note, mono, browser, server, cloud, db,
                chip, arrow, step, win, outlet, curve
  draw.html     the page a slide embeds; loads the kit, then one diagram file
slides/<deck>/diagrams/
  <file>.js     one diagram, or a few that belong together, as D.<name> = () => svg
```

## Put a diagram on a slide

An iframe block, 900×560:

```
/content/classmoji-staging/content-cs98-test/games/sketchkit/draw.html?deck=<deck folder>&f=<file>
```

- `deck` is the deck's folder name under `slides/`, e.g. `routing-1768253383889`.
- `f` is the file in that deck's `diagrams/` folder, without `.js`.
- Add `&d=<name>` when the file holds more than one diagram.
- Add `&v=2` (any value) after editing a diagram file, so browsers fetch the new version.

## Add a diagram

1. Make `slides/<deck>/diagrams/<file>.js` with `D.myDiagram = () => { const s = stage(seed); …; return s.svg; };`. Upload it to the deck with folder `diagrams`, or commit it.
2. Use the kit's helpers and colors. Helpers only one deck needs stay in that deck's file, like the architecture meter in Web Frameworks or `pieces()` in Routing.
3. If a helper turns out to be useful in two decks, move it into `kit.js`.

## Colors

browser blue `#1d4ed8` · server amber `#9a6a12` · build purple `#6d28d9` · cdn teal `#0f766e` · database green `#15803d` · you red `#be123c` · arrows gray `#4b5563`

## Static diagrams vs interactives

- **Static diagrams** (boxes, arrows, layouts): a recipe in the deck's `diagrams/` folder, drawn by sketchkit.
- **Interactives** (buttons, animation, state): self-contained, either an inline html block or a `games/<name>/` folder in the deck. Same rough.js version, fonts and colors.
- Inline html blocks run sandboxed (no `allow-same-origin`), so they can't load sketchkit from `/content`. They load rough.js from jsdelivr instead.

## Who uses it

Every deck with a `diagrams/` folder. To find every slide that draws one, search the decks for `games/sketchkit/draw.html`.
