# ⚡ Prompt Marks v2.1

> *Jump between your ChatGPT messages instantly — works across reloads, new chats, and SPA navigation.*

> [!NOTE]
> **Project Archived / Journey Ended**
> Since ChatGPT now has its own native question navigation/scrollbar, Prompt Marks has reached its destination and the journey of this extension ends here. Thank you to everyone who used Prompt Marks! ⚡

Ever lost track of a question you asked 20 messages ago? **Prompt Marks fixes that.** Click the floating ⚡ button to see all your sent messages, then jump to any one with a single click — even after switching chats or reloading the page.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Floating Button** | Always-visible button with pulse animation |
| 📋 **Message List** | Numbered list with a preview of each sent message |
| 🚀 **One-Click Jump** | Click any message → instantly scroll to it |
| 🔍 **Filter / Search** | Type to filter messages by keyword in real time |
| ↻ **Refresh Button** | Manually re-sync the message list at any time |
| ✨ **Highlight Flash** | Target message glows so you always find it |
| 🔁 **Real-Time Updates** | Auto-updates as new messages arrive |
| ⌨️ **Keyboard Shortcut** | `Alt + P` opens/closes the popup |

---

## 🆕 What's New in v2.1

**Major reliability overhaul — fixes reload & navigation issues:**

- ✅ **Works after page reload** — Button and popup re-inject automatically
- ✅ **Works after switching chats** — Detects SPA navigation (`pushState` / `popState`) and re-initializes
- ✅ **Works when ChatGPT wipes the DOM** — MutationObserver detects button removal and restores it
- ✅ **Better message detection** — Now catches deeply nested message elements from ChatGPT's streaming
- ✅ **Double-injection guard** — Safe to run across multiple navigations without conflicts
- ✅ **Empty state UI** — Friendly placeholder when no messages exist yet
- ✅ **Search / filter bar** — Find any message by keyword instantly
- ✅ **Refresh button** — Manually force a re-sync of the message list
- ✅ **`Alt + P` shortcut** — Open the popup without touching the mouse

---

## 🚀 Install (30 seconds)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode** (toggle, top-right)
3. Click **"Load unpacked"**
4. Select this folder (`prompt-marks/`)
5. Open [ChatGPT](https://chatgpt.com) — the ⚡ button appears in the bottom-right corner!

> **After updating the extension**, click the ↺ refresh icon on `chrome://extensions`, then hard-reload ChatGPT with `Ctrl + Shift + R`.

---

## 🎮 How to Use

1. **Click the ⚡ button** (bottom-right corner)
2. A panel slides up with all your sent messages
3. **Click any message** → the page scrolls to it and highlights it
4. **Type in the search bar** to filter by keyword
5. Click **↻** (bottom-right of panel) to manually refresh the list
6. Press **`Alt + P`** anytime to toggle the panel without the mouse

---

## 🔒 Privacy

No data collection. No network requests. Everything runs **100% locally** inside your browser. Your messages never leave your device.

---

## 🤝 Contribute — Add Support for Other Platforms

**Help us support:**
- 🟣 **Claude** (Anthropic)
- 🔵 **Gemini** (Google)
- 📓 **Notebook LM**
- 🔎 **Perplexity**
- *...and more!*

### How to Add a Platform

1. **Find the CSS selector** for user messages
   - Open the platform in Chrome → Press `F12`
   - Right-click a user message → **"Inspect"**
   - Note the selector (e.g., `.user-message`, `[data-role="user"]`)

2. **Test the selector** in DevTools console:
   ```javascript
   document.querySelectorAll('YOUR_SELECTOR_HERE')
   ```
   Make sure it returns all your sent messages.

3. **Update the code**
   - Edit `content.js` → find `getUserMessages()`
   - Add your selector to the query
   - Update `manifest.json` → add the platform URL to `matches`

4. **Test thoroughly** — load the unpacked extension, verify messages load, and clicking/jumping works

5. **Submit a PR** with: platform name, CSS selector, and testing notes

### Example PR Title

```
feat: Add Claude support with proper message selectors
```


https://github.com/user-attachments/assets/db6a27f5-1e1c-494c-8e7b-c6690a732941


**Your contribution helps thousands of users!** 🎉
