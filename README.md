# James Bell — Portfolio

Personal portfolio built with plain HTML, CSS and JavaScript. No package installation or build step is required.

## Files

- `index.html` — About, project and experience content, navigation and contact links.
- `styles.css` — Typography, spacing, colours and responsive layout.
- `navigation.js` — Project views, URL hashes and browser back/forward navigation.
- `James-Bell-Resume.pdf` — Downloadable résumé.

## Run locally

Clone this repository and open it in VS Code:

```bash
git clone https://github.com/jamiebell8bit/portfolio-website.git
cd portfolio-website
```

Open `index.html` directly in your browser, or serve this folder using Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. On Windows, use `py -m http.server 8000` if needed.

## Edit and push

Edit the HTML for content, CSS for appearance, and JavaScript for navigation. Preview your changes before committing:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

You can also edit individual text files through GitHub's web interface.

## Add project images

Create an `images/` folder and use descriptive filenames, for example `images/wetmaps-map.png`. Add an image inside the corresponding project section in `index.html`:

```html
<figure>
  <img src="images/wetmaps-map.png"
       alt="Describe what this map shows"
       style="display:block;max-width:100%;height:auto"
       loading="lazy">
  <figcaption>Describe the result or your contribution.</figcaption>
</figure>
```

Use relative asset paths so the site works both locally and under a hosting subdirectory.

## Hosting

The existing site is hosted at https://james-bell-portfolio.jimbo-s-bell.chatgpt.site/.

This repository contains a copy of the site's source. GitHub pushes do not automatically update that hosted site; no deployment integration is configured. Hosting and source synchronisation must be configured separately before treating GitHub as the live site's deployment source. The current site retains its existing access settings.
