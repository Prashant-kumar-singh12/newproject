<h1 align="center">InternLink</h1>

<p align="center">
  Internship matching platform for engineering students — matched to the projects you have actually built.
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-1e6bff?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-0b1b33?style=flat-square">
</p>

<p align="center">
  <a href="#live-demo">Live demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#connecting-a-backend">Backend plan</a>
</p>

---

## Overview

InternLink is a responsive, multi-page website built with plain HTML5, CSS3 and
JavaScript — no frameworks, no build step, no dependencies. It solves a problem
most engineering students have: internship listings are everywhere, but there is
no easy way to tell which ones are realistic. InternLink scores every listing
against a student's real skills and projects and shows the working.

This repository is the complete frontend, built as a college project. Demo
authentication and form submissions run on `localStorage`, and every place a
real API would plug in is marked with a `BACKEND HOOK` comment.

## Live demo

> Deploy this repo with GitHub Pages and paste your link here:
> `https://<your-username>.github.io/internlink/`
>
> Steps are in [Deploying on GitHub Pages](#deploying-on-github-pages).

## Screenshots

> Add your own screenshots after deploying. Create a `screenshots/` folder, drop
> the images in, and uncomment the block below.

<!--
| Home | Features | Dashboard |
|---|---|---|
| ![Home](screenshots/home.png) | ![Features](screenshots/features.png) | ![Dashboard](screenshots/dashboard.png) |
-->

## Features

**Pages**

| Page | What it contains |
|---|---|
| `index.html` | Hero, skill marquee, feature cards, how it works, about, animated stats, reviews, CTA |
| `about.html` | Problem statement, mission, vision, feature list, team |
| `services.html` | Six feature cards with expandable detail, partner section |
| `contact.html` | Validated contact form and contact details |
| `login.html` | Login form plus a demo dashboard shown after sign-in |
| `signup.html` | Registration form with password rules |

**Interactions**
- Sticky navbar with scroll state, active-page highlighting and a hamburger menu below 900px
- Menu closes on link click and on `Escape`
- Smooth scrolling with a sticky-header offset
- Scroll reveal via `IntersectionObserver`, with left / right / zoom variants
- Statistics counters animated with `requestAnimationFrame` and an ease-out curve
- Page loader, scroll progress bar, typing headline, auto-scrolling skill marquee
- Back-to-top button, expandable feature cards with `aria-expanded` kept in sync

**Hover effects**
- Cards: lift, gradient hairline, pointer-following spotlight, 3D tilt, icon rotate and fill
- Buttons: shine sweep and a click ripple drawn at the pointer
- Navbar underline, sliding footer links, scaling social icons and avatars

**Forms and validation**
- Name — required, 3+ characters, letters only
- Email — regex format check
- Phone — 10-digit Indian mobile, optional `+91`, spaces or dashes allowed
- Password — 8+ characters with at least one letter and one number
- Confirm password — must match
- Subject and message — minimum lengths
- Errors render under the field, set `aria-invalid`, move focus to the first bad input, and clear as the user types

**Demo authentication**
- Sign up stores an account in `localStorage` and rejects duplicate emails
- Login starts a session; the navbar switches to a "Hi, name" chip with Log out
- A sample dashboard replaces the login form while signed in

**Accessibility**
- Skip-to-content link, visible focus rings, labelled controls
- `aria-expanded`, `aria-controls`, `aria-live` on menus, panels and alerts
- Alt text on illustrations, decorative SVGs marked `aria-hidden`
- Full keyboard operation and `prefers-reduced-motion` support

## Getting started

Clone and open — nothing to install.

```bash
git clone https://github.com/<your-username>/internlink.git
cd internlink
```

Then either open `index.html` directly, or run a local server (recommended, so
paths behave exactly as they will in production):

```bash
python -m http.server 5500
# open http://localhost:5500
```

In VS Code you can also right-click `index.html` and choose **Open with Live Server**.

## Project structure

```
internlink/
├── index.html              Home
├── about.html              About the project
├── services.html           Features
├── contact.html            Contact form
├── login.html              Login + demo dashboard
├── signup.html             Registration
│
├── css/
│   ├── base.css            Design tokens, reset, typography, focus styles
│   ├── layout.css          Page grid, buttons, navbar, hero
│   ├── components.css      Cards, stats, forms, footer, loader, marquee
│   ├── animations.css      Keyframes, scroll reveal, hover effects
│   └── responsive.css      Breakpoints (loaded last so it can override)
│
├── js/
│   ├── validation.js       Reusable validators and error display
│   ├── auth.js             localStorage demo authentication
│   ├── script.js           Navigation, scroll reveal, counters, forms
│   └── animations.js       Loader, progress bar, typing, tilt, ripple
│
├── images/
│   ├── hero-dashboard.svg
│   └── about-illustration.svg
│
├── .gitignore
├── LICENSE
└── README.md
```

Load order matters. CSS: `base → layout → components → animations → responsive`.
JS: `validation.js → auth.js → script.js → animations.js`. Every page links all
five stylesheets and all four scripts, so the design system stays identical
across the site.

## Tech stack

| Area | Used |
|---|---|
| Markup | Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `figure`, `footer`) |
| Styling | CSS custom properties, Flexbox, Grid, `clamp()`, `color-mix()`, `mask-image` |
| Scripting | Vanilla JavaScript (ES6), `IntersectionObserver`, `requestAnimationFrame`, Pointer Events |
| Storage | `localStorage` for demo accounts, session and contact messages |
| Fonts | Space Grotesk (headings), Inter (body) |
| Graphics | Hand-written SVG illustrations and inline SVG icons — no external image hosts |

## Responsive behaviour

Layouts verified at 1920, 1440, 1024, 768, 620, 480 and 375px. Grids collapse
4 → 2 → 1, the hero stacks with the illustration on top, and there is no
horizontal scrolling at any width.

## Deploying on GitHub Pages

1. Push this repository to GitHub.
2. Open the repo, then **Settings → Pages**.
3. Under *Build and deployment*, set **Source** to `Deploy from a branch`.
4. Choose branch `main` and folder `/ (root)`, then **Save**.
5. Wait about a minute and open `https://<your-username>.github.io/internlink/`.
6. Paste that link into the [Live demo](#live-demo) section above, and into the
   **About** panel on the repo home page.

## Connecting a backend

Everything demo-only lives in `js/auth.js` and the contact handler in
`js/script.js`, each marked `BACKEND HOOK`. The markup does not change.

| Current demo | Real implementation |
|---|---|
| `Auth.signup()` writes to `localStorage` | `POST /api/auth/register`, password hashed with bcrypt on the server |
| `Auth.login()` compares plain text | `POST /api/auth/login` returning a JWT |
| `startSession()` saves a user object | Store the JWT in an httpOnly cookie |
| Contact form saves locally | `POST /api/contact` → database + email via Nodemailer |
| Dashboard cards are sample content | `GET /api/matches`, `/api/applications`, `/api/mentor-sessions` |

Suggested stack: Node.js + Express with MongoDB (Mongoose) or MySQL, JWT for
sessions, bcrypt for hashing.

## Roadmap

- [ ] Profile builder with project uploads
- [ ] Server-side match scoring instead of sample percentages
- [ ] Hiring-partner view for posting listings
- [ ] Email verification and password reset
- [ ] Dark mode toggle stored per user

## License

Released under the [MIT License](LICENSE).

---

Built as a B.Tech CSE college project. Students, companies and statistics shown
on the site are sample content for demonstration.
