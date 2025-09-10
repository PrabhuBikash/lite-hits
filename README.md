# lite-hits.js

A privacy-friendly, zero-dependency wrapper around [hits.sh](https://hits.sh).  
Track **page loads**, **unique sessions**, **unique users**, and **engagement**.

---

## ✨ Demo
👉 [Live demo](https://prabhubikash.github.io/lite-hits) (GitHub Pages)

---

## ⚡ Get Started

Copy–paste this into your HTML:

```html
<script src="https://prabhubikash.github.io/lite-hits/lite-hits.js" defer
  litehits-count='{
    "pageloadCount": "true",
    "sessionKey": "mysession",
    "localKey": "myuser",
    "engagementDuration": 10000
  }'
  litehits-basePath="analyticsurl"
  litehits-globalAs="hitsh">
</script>
```
better install it locally and use `src = "/path/to/lite-hits.js"`
* `litehits-count`: JSON config of what to track
* `litehits-globalAs`: global object name (`window.hitsh` here)

The global object looks like:
```js
window.hitsh = {
  pageloadCount: { img, url, key },
  sessionCount: { img, url, key },
  localCount:   { img, url, key },
  engagementCount: { img, url, key }
}
```

## 🛠 How It Works
1. **Page loads trigger an image request**  
   Each load inserts an invisible `<img>` with
   `https://hits.sh/<hostname+pathname>/page.svg`.
   Loading this increments the counter on `hits.sh`.

2. **Session vs. user detection**

   * `sessionStorage` → counts unique visits per browser session
   * `localStorage` → counts unique visitors per browser/device

   If no record is found, it requests a new SVG and stores a flag.
   If already present, no new hit is sent (so `img = {}`, i.e., there’s nothing to display).

3. **Engagement tracking**  
   You can define an `engagementDuration` (in milliseconds, e.g. `10000` = 10s).  
   Only if a visitor stays that long will the script trigger another `hits.sh` request, counting them as “engaged.”

for more info consider checking: https://prabhubikash.github.io/lite-hits/how-it-works.html

---

## ⚠️ Disclaimer

* `lite-hits.js` is **fully transparent** — you can read the exact script you use.
* It only decides *when* to send a GET request.
* Counting is handled entirely by [hits.sh](https://hits.sh).
* Its author explicitly states [they do not log IP addresses](https://github.com/StevenBlack/hosts/issues/2252), and the project is [open-source](https://github.com/silentsoft/hits).
* However, since all counting happens on their backend, using it still requires some trust in their implementation.

In short:
- The wrapper cannot track you, and you don’t need to trust it — you can verify the code yourself.
- Whether you trust hits.sh is your own decision.

---
