/**
 * js/sync.js
 * Automatic Background Synchronization Engine.
 * Features:
 *   - Periodic 90-second silent background auto-sync
 *   - Instant auto-sync when tab regains focus or network reconnects
 *   - Live Auto-Sync Indicator in topbar (🟢 Live timestamp / 🔄 Syncing...)
 *   - Zero UI blocking (soft silent refresh of current view)
 */

const AutoSync = (function () {

  let _syncTimer = null;
  let _isSyncing = false;
  const SYNC_INTERVAL_MS = 90 * 1000; // 90 seconds periodic sync

  function updateBadge(status) {
    const badge = document.getElementById('autosync-badge');
    const dot   = document.getElementById('autosync-dot');
    const txt   = document.getElementById('autosync-text');
    if (!badge || !dot || !txt) return;

    const isAr = I18n.getLang() === 'ar';

    if (status === 'syncing') {
      dot.style.background = 'var(--brass)';
      dot.style.transform = 'scale(1.2)';
      txt.textContent = isAr ? 'مزامنة...' : 'Syncing...';
      badge.setAttribute('title', isAr ? 'جاري المزامنة في الخلفية...' : 'Syncing in background...');
    } else if (status === 'online') {
      dot.style.background = 'var(--teal)';
      dot.style.transform = 'scale(1)';
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      txt.textContent = timeStr;
      badge.setAttribute('title', isAr ? `مزامنة تلقائية نشطة (آخر مزامنة ${timeStr})` : `Auto-synced silently at ${timeStr}`);
    } else if (status === 'offline') {
      dot.style.background = 'var(--rust)';
      dot.style.transform = 'scale(1)';
      txt.textContent = isAr ? 'منقطع' : 'Offline';
      badge.setAttribute('title', isAr ? 'غير متصل بالإنترنت' : 'Offline');
    }
  }

  async function performSync() {
    if (_isSyncing || !API.getToken() || !navigator.onLine) return;
    _isSyncing = true;
    updateBadge('syncing');

    try {
      // 1. Silent reference data refresh
      await loadReferenceData();

      // 2. Refresh active view content silently if appropriate
      const h = Router.decodeHash();
      if (h.route === 'dashboard') {
        API.cacheBust('dashboard');
        await Dashboard.render(document.getElementById('content'));
      } else if (h.route === 'notes') {
        const wrap = document.getElementById('all-notes-list-wrap');
        const badge = document.getElementById('all-notes-count-badge');
        const searchInput = document.getElementById('all-notes-search-input');
        const modFilter = document.getElementById('all-notes-module-filter');
        if (wrap && badge) {
          await Notes.reloadAllNotesPage(wrap, badge, searchInput ? searchInput.value : '', modFilter ? modFilter.value : '', { forceNetwork: false });
        }
      }

      updateBadge('online');
    } catch (err) {
      updateBadge('online');
    } finally {
      _isSyncing = false;
    }
  }

  function start() {
    if (_syncTimer) return;
    updateBadge('online');
    _syncTimer = setInterval(performSync, SYNC_INTERVAL_MS);

    // Auto-sync when user switches back to this tab — delayed 5s to avoid competing with page load
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && API.getToken()) {
        setTimeout(performSync, 5000);
      }
    });

    // Auto-sync when internet reconnects
    window.addEventListener('online', () => {
      updateBadge('online');
      setTimeout(performSync, 3000); // Delay 3s to let page settle
    });

    window.addEventListener('offline', () => {
      updateBadge('offline');
    });
  }

  function stop() {
    if (_syncTimer) {
      clearInterval(_syncTimer);
      _syncTimer = null;
    }
  }

  return { start, stop, syncNow: performSync };
})();
