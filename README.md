# SkillTree — local dev setup

This runs the app with a working AI mentor, using your own Anthropic API key.

## Why you need this
The mentor calls the Anthropic API. That API doesn't allow direct browser
calls from arbitrary local pages, and there's no key attached when you just
open the HTML file — that's why the mentor failed with "couldn't reach the
mentor service" when opened directly in a browser or via a plain static
server. This tiny server holds the key on the backend and proxies the
request, so the browser never sees it.

## Setup

1. Install Node.js 18+ if you don't have it: https://nodejs.org

2. Install dependencies:
   npm install

3. Add your API key:
   cp .env.example .env
   # then open .env and paste your real key from
   # https://console.anthropic.com/settings/keys

4. Start the server:
   npm start

5. Open the app:
   http://localhost:3000/skilltree-app.html

## Notes
- Everything except the AI mentor (theme, tree, roadmap, badges, projects,
  profile, avatar) works with zero backend — it's plain HTML/CSS/JS with
  browser storage. Only the mentor chat needs this server running.
- If you edit skilltree-app.html, keep it in this same folder — server.js
  serves static files from its own directory.
- Never commit your real .env file or share your API key.
