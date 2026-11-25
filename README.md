# ArenaSkateCount

Displays the skate count when no max is set.

Many rinks take registrations through a DaySmart "Dash" calendar (`apps.daysmartrecreation.com`). When a session has a capacity, the calendar shows a label such as **5/30 Registered**. When a session has no capacity set, which is common for Public Skate, the calendar shows nothing, even though the count is already in the data the page downloads.

This add-on fills in the missing label, for example **44 Registered**. Labels it adds have a dotted underline so you can tell them apart from the site's own.

> **Unofficial.** This project is not affiliated with or endorsed by DaySmart or any rink. Read [Legal and disclaimers](#legal-and-disclaimers) before you install it.

## Pick your browser

| Browser | Method | Runs automatically? | Tested? |
| --- | --- | --- | --- |
| [Chrome on a computer](#chrome-on-a-computer) | Extension | Yes | Yes |
| [Chrome on a phone](#chrome-on-a-phone-android-or-iphone) (Android or iPhone) | Bookmarklet, set up from a computer first | No, one tap per page load | Code tested on desktop Chrome only |
| [Edge, Brave, Opera, Vivaldi on a computer](#edge-brave-opera-or-vivaldi-on-a-computer) | Extension | Yes | No |
| [Firefox on a computer](#firefox-on-a-computer) | Userscript | Yes | No |
| [Safari on a Mac](#safari-on-a-mac) | Userscript | Yes | No |
| [Firefox on Android](#firefox-on-android) | Userscript | Yes | No |
| [Safari on iPhone or iPad](#safari-on-iphone-or-ipad) | Userscript | Yes | No |

"Tested: No" means the steps follow each browser's standard install route but nobody has confirmed them for this add-on yet. If you try one, please open an issue and say how it went.

Once it is installed, open your rink's Dash calendar. Sessions without a capacity should show a count next to the **Add to cart** button within a second or two.

## Chrome on a computer

Chrome on Windows, Mac, Linux or ChromeOS can load the extension directly.

1. On this page, click the green **Code** button, then **Download ZIP**.
2. Unzip it somewhere you will keep it. Chrome loads the extension from that folder every time it starts, so don't delete or move it afterwards.
3. In Chrome, go to `chrome://extensions`.
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked**.
6. Select the `extension` folder inside the unzipped folder (the one containing `manifest.json`).
7. Open or reload your rink's Dash calendar.

To update later, download the ZIP again, replace the folder's contents, and click the reload arrow on the extension's card in `chrome://extensions`.

Chrome may show a "Disable developer mode extensions" reminder at startup. That is normal for any extension loaded this way.

## Chrome on a phone (Android or iPhone)

**Chrome on a phone cannot install extensions.** The workaround is a bookmarklet: a bookmark that runs the script when you tap it. Setting it up takes two parts, and the first part needs a computer.

### Part 1: on a computer (once)

You need Chrome on a desktop or laptop, signed in to the same Google account as your phone, with bookmark sync turned on.

1. Open [`bookmarklet/bookmarklet.txt`](https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/bookmarklet/bookmarklet.txt). It is one very long line.
2. Select all of it and copy it.
3. Open Chrome's bookmark manager: `Ctrl+Shift+O` on Windows, Linux and ChromeOS, or `Cmd+Option+B` on a Mac.
4. Click the **⋮** menu at the top right of the bookmark manager, then **Add new bookmark**.
5. Set **Name** to `skatecount`. You will type this on your phone, so keep it short.
6. Paste into **URL**, and check that it starts with `javascript:`.
7. Click **Save**.

Use the bookmark manager for this, not the address bar. Chrome removes the `javascript:` prefix from text pasted into the address bar.

### Part 2: on your phone (every time you want counts)

1. Make sure Chrome on the phone is signed in to the same Google account, with bookmark sync on. Give it a minute to sync the first time.
2. Open your rink's Dash calendar in Chrome and wait for the sessions to load.
3. Tap the address bar and type `skatecount`.
4. In the suggestions, tap the bookmark. It has a star icon and its address starts with `javascript:`.
5. The counts appear on the page.

Things to know:

- **Open it from the address bar, as in step 3.** Opening it from the bookmarks list loads it as a new page and nothing happens on the calendar.
- It lasts until the page reloads. Changing dates or filters keeps the counts; a refresh or a new visit needs another tap.
- Tapping it twice is harmless.

No computer? You can try creating the bookmark on the phone: bookmark any page, edit that bookmark, rename it `skatecount`, and replace its URL with the contents of `bookmarklet.txt`. This route is untested.

If you want counts on your phone without tapping each time, use [Firefox on Android](#firefox-on-android) or [Safari on iPhone or iPad](#safari-on-iphone-or-ipad) instead.

## Edge, Brave, Opera or Vivaldi on a computer

These browsers are built on the same engine as Chrome and load the same extension. Follow the [Chrome on a computer](#chrome-on-a-computer) steps, using the browser's own extensions page:

| Browser | Extensions page |
| --- | --- |
| Edge | `edge://extensions` |
| Brave | `brave://extensions` |
| Opera | `opera://extensions` |
| Vivaldi | `vivaldi://extensions` |

Turn on the browser's developer mode switch, then use **Load unpacked** and select the `extension` folder.

## Firefox on a computer

Firefox only keeps unsigned extensions until it restarts, so use the userscript version.

1. Install a userscript manager from Firefox Add-ons, such as [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or Violentmonkey.
2. Open [`arena-skate-count.user.js`](https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js).
3. The userscript manager offers to install it. Click **Install**.
4. Open or reload your rink's Dash calendar.

The userscript manager can also pick up new versions from this repository.

## Safari on a Mac

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) from the Mac App Store. It is a free, open-source Safari extension.
2. Open the Userscripts app once and choose a folder for your scripts.
3. In Safari, go to **Settings > Extensions**, turn on Userscripts, and allow it on `apps.daysmartrecreation.com`.
4. Download [`arena-skate-count.user.js`](https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js) and save it into the scripts folder from step 2.
5. Open or reload your rink's Dash calendar.

## Firefox on Android

Firefox for Android supports add-ons, including Tampermonkey, so the script runs automatically with no tapping.

1. In Firefox on your phone, open the [Tampermonkey add-on page](https://addons.mozilla.org/firefox/addon/tampermonkey/) and tap **Add to Firefox**.
2. Open [`arena-skate-count.user.js`](https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js) in Firefox.
3. Tampermonkey offers to install it. Tap **Install**.
4. Open your rink's Dash calendar in Firefox.

## Safari on iPhone or iPad

1. Install [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) from the App Store (free, open source).
2. Open the Userscripts app and choose a folder for your scripts.
3. In the **Settings** app, go to Safari's **Extensions**, turn on Userscripts, and allow it on `apps.daysmartrecreation.com`.
4. Download [`arena-skate-count.user.js`](https://raw.githubusercontent.com/slopyright-ai/ArenaSkateCount/main/extension/arena-skate-count.user.js) and save it into the scripts folder from step 2 using the Files app.
5. Open your rink's Dash calendar in Safari.

## Troubleshooting

- **No count appears.** The add-on only fills in sessions that have a register button and no label of their own. Past sessions and league games are left as they are.
- **It worked, then stopped.** The site probably changed its page layout or its data. Open an issue.
- **Phone bookmarklet does nothing.** Check that the bookmark's URL starts with `javascript:` and that you are tapping it from the address bar suggestions while the calendar is open.

## How it works

The Dash calendar page asks DaySmart's API for the sessions in view, and each session comes back with a summary that includes `registered_count`. The page only draws the label when the session has a capacity.

The script watches for the page's own sessions request, repeats that same request once (at most once every five seconds per request), reads the counts, and adds the label to matching entries. It matches entries by date, time and title, and shows nothing when it can't match one with confidence.

The same file, [`extension/arena-skate-count.user.js`](extension/arena-skate-count.user.js), is the extension's content script, the userscript, and the source for the bookmarklet. To rebuild the bookmarklet after editing it, run `tools/build-bookmarklet.sh` (needs Node.js).

## Legal and disclaimers

This section is plain-language information, not legal advice.

**Not affiliated.** ArenaSkateCount is an independent, unofficial project. It is not affiliated with, endorsed by, sponsored by or supported by DaySmart Software, the Dash product, or any rink or facility. "DaySmart" and "Dash" are names of their respective owners and are used here only to say what the add-on works with.

**No permission has been sought.** Nobody has asked DaySmart or any facility to approve this add-on. A website's terms of use, or a facility's own rules, can restrict automated requests or changes to how a page is displayed. You are responsible for checking the terms that apply to you and for deciding whether to use this. If a facility or DaySmart asks you to stop, stop.

**What it does and doesn't do.**

- It reads only session data that the site already sends to visitors' browsers, including visitors who are not signed in.
- It does not log in, bypass any access control, register, buy, or change anything on the server.
- It adds roughly one extra read request for each sessions request the page makes.
- It shows a total only. It does not show who is registered.

**Counts are unofficial.** The number is whatever the site's data reports at that moment. It may be out of date, may leave out walk-ins or people who registered another way, and may be wrong. Don't rely on it for capacity, safety or business decisions. Ask the facility for anything that matters.

**Privacy.** The add-on collects nothing. It has no analytics and no server of its own, and stores nothing on your device. Its only network requests go to `api.daysmartrecreation.com`, the same service the calendar page already uses. Userscript managers and other tools you install to run it have their own privacy policies.

**Security.** Extensions, userscripts and bookmarklets run code inside the page you are viewing. Read the source before you install it, and only install it from this repository.

**AI assistance.** Parts of this project were written with AI assistance. How copyright applies to AI-assisted code varies by country. The project is offered under the license below to the extent the author holds rights in it.

**No warranty.** The software is provided "as is", without warranty of any kind, and may stop working whenever the site changes. See the license for the full terms.

**Concerns.** If you represent DaySmart or a facility and have a concern about this project, please open an issue on this repository.

## License

[MIT](LICENSE) © 2026 slopyright.ai
