/**
 * Prompt Marks v2.1
 * ChatGPT message navigator — works across reloads, new chats, and SPA navigation.
 */
(() => {
  /* ── Guard: prevent double-injection ───────────────────────── */
  if (window.__promptMarksV2) return;
  window.__promptMarksV2 = true;

  /* ── State ──────────────────────────────────────────────────── */
  let messages       = [];
  let debounceTimer  = null;
  let isScrolling    = false;
  let currentUrl     = location.href;
  let reinitTimer    = null;

  /* ── Helpers ────────────────────────────────────────────────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const log = (...a) => console.log('[Prompt Marks v2.1]', ...a);

  function getUserMessages() {
    return document.querySelectorAll('[data-message-author-role="user"]');
  }

  function refreshMessages() {
    messages = Array.from(getUserMessages()).map((el, idx) => ({
      id:      idx,
      number:  idx + 1,
      text:    el.innerText.trim().slice(0, 120),
      element: el,
    }));
    return messages;
  }

  /* ── Scroll to a message ────────────────────────────────────── */
  function scrollToMessage(idx) {
    if (idx < 0 || idx >= messages.length) return;
    isScrolling = true;
    const el = messages[idx].element;

    if (!el || !document.contains(el)) {
      log('Stale element — refreshing');
      refreshMessages();
      if (idx >= messages.length) { isScrolling = false; return; }
    }

    messages[idx].element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const target = messages[idx].element;
      target.classList.add('pm-highlight');
      setTimeout(() => {
        target.classList.remove('pm-highlight');
        isScrolling = false;
      }, 2000);
    }, 600);
  }

  /* ── Rebuild popup list ─────────────────────────────────────── */
  function updatePopupList() {
    const popup = $('.prompt-marks-popup');
    if (!popup) return;

    refreshMessages();

    const list   = popup.querySelector('.prompt-marks-list');
    const count  = popup.querySelector('.prompt-marks-count');

    if (list) {
      if (messages.length === 0) {
        list.innerHTML = `
          <div class="pm-empty">
            <span>💬</span>
            <p>No messages yet.<br>Start a conversation!</p>
          </div>`;
      } else {
        list.innerHTML = messages.map(m => `
          <div class="prompt-marks-item" data-id="${m.id}">
            <span class="prompt-marks-number">Q${m.number}</span>
            <span class="prompt-marks-text">${escapeHtml(m.text)}${m.text.length >= 120 ? '…' : ''}</span>
          </div>
        `).join('');

        list.querySelectorAll('.prompt-marks-item').forEach(item => {
          item.addEventListener('click', () => {
            scrollToMessage(parseInt(item.dataset.id, 10));
          });
        });
      }
    }

    if (count) {
      count.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Create / toggle popup ──────────────────────────────────── */
  function createPopup() {
    let popup = $('.prompt-marks-popup');

    if (popup) {
      popup.classList.toggle('active');
      if (popup.classList.contains('active')) updatePopupList();
      return;
    }

    popup = document.createElement('div');
    popup.className = 'prompt-marks-popup';
    popup.innerHTML = `
      <div class="prompt-marks-header">
        <div class="pm-header-left">
          <span class="pm-logo">⚡</span>
          <h3>Prompt Marks <span class="pm-version">v2.1</span></h3>
        </div>
        <button class="prompt-marks-close" title="Close">✕</button>
      </div>
      <div class="pm-search-wrap">
        <input class="pm-search" type="text" placeholder="🔍 Filter messages…" />
      </div>
      <div class="prompt-marks-list"></div>
      <div class="prompt-marks-footer">
        <span class="prompt-marks-count">0 messages</span>
        <button class="pm-refresh-btn" title="Refresh list">↻</button>
      </div>
    `;

    /* Prevent page scroll bleed */
    const list = popup.querySelector('.prompt-marks-list');
    popup.addEventListener('wheel', e => {
      const scrollable = list.scrollHeight > list.clientHeight;
      if (!scrollable) e.preventDefault();
    }, { passive: false });

    /* Prevent click bubbling */
    popup.addEventListener('click', e => e.stopPropagation());

    /* Close button */
    popup.querySelector('.prompt-marks-close').addEventListener('click', e => {
      e.stopPropagation();
      popup.classList.remove('active');
    });

    /* Refresh button */
    popup.querySelector('.pm-refresh-btn').addEventListener('click', e => {
      e.stopPropagation();
      updatePopupList();
      animateSpin(e.currentTarget);
    });

    /* Search / filter */
    popup.querySelector('.pm-search').addEventListener('input', function () {
      const q = this.value.toLowerCase();
      popup.querySelectorAll('.prompt-marks-item').forEach(item => {
        const txt = item.querySelector('.prompt-marks-text').textContent.toLowerCase();
        item.style.display = txt.includes(q) ? '' : 'none';
      });
    });

    document.body.appendChild(popup);
    popup.classList.add('active');
    updatePopupList();
  }

  function animateSpin(btn) {
    btn.style.transition = 'transform 0.4s ease';
    btn.style.transform  = 'rotate(360deg)';
    setTimeout(() => {
      btn.style.transition = '';
      btn.style.transform  = '';
    }, 450);
  }

  /* ── Create floating button ─────────────────────────────────── */
  function createButton() {
    if ($('.prompt-marks-btn')) return; // already exists

    const btn = document.createElement('button');
    btn.className = 'prompt-marks-btn';
    btn.title     = 'Prompt Marks v2.1 — View sent messages';
    btn.innerHTML = '⚡';

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      createPopup();
    });

    document.body.appendChild(btn);
    log('Button injected');
  }

  /* ── Schedule a debounced popup refresh ─────────────────────── */
  function scheduleUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if ($('.prompt-marks-popup')?.classList.contains('active')) {
        updatePopupList();
      }
    }, 400);
  }

  /* ── Remove all injected UI ─────────────────────────────────── */
  function teardown() {
    $('.prompt-marks-btn')?.remove();
    $('.prompt-marks-popup')?.remove();
    messages = [];
    log('Torn down');
  }

  /* ── Initialize for current page ───────────────────────────── */
  function init() {
    log('Initializing for', location.pathname);
    teardown();

    let attempts = 0;
    const MAX    = 60; // 12 seconds

    const poll = setInterval(() => {
      attempts++;
      if (getUserMessages().length > 0 || attempts >= MAX) {
        clearInterval(poll);
        createButton();
        refreshMessages();
        log(`Ready — ${messages.length} messages found`);
      }
    }, 200);
  }

  /* ── Handle SPA navigation (pushState / popState) ───────────── */
  function onUrlChange() {
    if (location.href === currentUrl) return;
    currentUrl = location.href;
    log('URL changed →', currentUrl);

    // Debounce re-init so ChatGPT has time to render new content
    clearTimeout(reinitTimer);
    reinitTimer = setTimeout(init, 800);
  }

  // Monkey-patch pushState to emit a custom event
  const _push    = history.pushState.bind(history);
  const _replace = history.replaceState.bind(history);

  history.pushState = function (...args) {
    _push(...args);
    onUrlChange();
  };
  history.replaceState = function (...args) {
    _replace(...args);
    onUrlChange();
  };

  window.addEventListener('popstate', onUrlChange);

  /* ── MutationObserver — watch for new messages & DOM wipes ──── */
  const IGNORE_CLASSES = new Set([
    'prompt-marks-popup',
    'prompt-marks-btn',
    'pm-highlight',
  ]);

  new MutationObserver(mutations => {
    if (isScrolling) return;

    let btnRemoved = false;
    let newUserMsg = false;

    for (const m of mutations) {
      // Check if our button was removed (ChatGPT cleared DOM)
      for (const node of m.removedNodes) {
        if (node.nodeType === 1 && node.classList?.contains('prompt-marks-btn')) {
          btnRemoved = true;
        }
      }

      // Check for new user messages added
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (IGNORE_CLASSES.has(node.className)) continue;
        if (node.getAttribute?.('data-message-author-role') === 'user') {
          newUserMsg = true;
        }
        // Also check descendants (ChatGPT wraps deeply)
        if (node.querySelector?.('[data-message-author-role="user"]')) {
          newUserMsg = true;
        }
      }
    }

    if (btnRemoved) {
      log('Button removed by ChatGPT — re-injecting');
      clearTimeout(reinitTimer);
      reinitTimer = setTimeout(init, 600);
    } else if (newUserMsg) {
      scheduleUpdate();
    }
  }).observe(document.body, {
    childList:     true,
    subtree:       true,
    attributes:    false,
    characterData: false,
  });

  /* ── Keyboard shortcut: Alt + P ─────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'p') {
      e.preventDefault();
      createPopup();
    }
  });

  /* ── Boot ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
  } else {
    setTimeout(init, 500);
  }
})();
