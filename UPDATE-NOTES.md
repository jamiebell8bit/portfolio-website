# Portfolio carousel update

## Install

Copy `index.html`, `styles.css`, and `navigation.js` into your existing portfolio folder, replacing the three old files. Keep `James-Bell-Resume.pdf` and your existing `assets/` folder where they are.

Preview by opening `index.html` in a browser or by running `python -m http.server 8000` and opening `http://localhost:8000`. No installation or build step is needed. If the old design remains visible, hard refresh with Ctrl+Shift+R.

## Interactions

- Desktop: the project strip travels right to left at 28 pixels per second.
- Hover: movement pauses and the card expands to reveal its summary.
- Click: opens that project's detail view. Back/forward and direct project URLs still work.
- Pause/Play: manually controls the automatic movement.
- Arrows: step between cards.
- Keyboard: Tab reaches each project once, brings it into view, and pauses movement. Enter opens it.
- Phones and touchscreens: swipe or use the arrows; summaries are visible without hover.
- Reduced-motion preference: automatic motion and transitions are disabled.

## Replace the images later

Replace the PNGs in `assets/`, preserving their filenames:

- `wetmaps-cover.png`
- `qrate-cover.png`
- `receiptme-cover.png`
- `direct-coil-cover.png`

Each image is reused on its card and detail view. Update the image alt text and remove the concept-illustration captions in `index.html` when replacing them with actual project imagery.

## Adjust the movement

In `navigation.js`, `elapsed * 0.028` sets the speed (28 pixels per second). In `styles.css`, `--card-width` sets card width and the hover `scale(1.065)` controls expansion.

This update does not publish the hosted site or push to GitHub. Publishing is separate from copying these files into your local repository.
