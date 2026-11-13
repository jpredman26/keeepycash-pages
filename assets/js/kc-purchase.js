/* KeepyCash web purchase tracking for Meta and GA4.

   RevenueCat's hosted checkout (pay.rev.cat) can't run our pixel, so:
   1. Landing pages call kcRememberCheckout() when someone taps a checkout link,
      noting which product and price they went to pay for.
   2. The custom success pages RevenueCat redirects to (lifetimeOffer, welcome)
      call kcTrackPurchase() with the app_user_id RevenueCat appends.

   A Purchase is sent once per product + app_user_id. The flag lives in
   localStorage and the same id is sent as Meta's eventID, so a refresh or the
   lifetimeOffer -> welcome hop never counts a sale twice. */
(function () {
  var CHECKOUT_KEY = 'kc_checkout';
  var MAX_AGE_MS = 6 * 60 * 60 * 1000; // a checkout older than this is stale

  function store() {
    try { return window.localStorage; } catch (e) { return null; }
  }

  window.kcRememberCheckout = function (product, value, appUserId) {
    var s = store();
    if (!s) return;
    try {
      s.setItem(CHECKOUT_KEY, JSON.stringify({
        product: product,
        value: value,
        appUserId: appUserId || null,
        page: location.pathname,
        ts: Date.now()
      }));
    } catch (e) {}
  };

  window.kcForgetCheckout = function () {
    var s = store();
    if (!s) return;
    try { s.removeItem(CHECKOUT_KEY); } catch (e) {}
  };

  // The most recent checkout tap on this device, if it's still fresh.
  window.kcLastCheckout = function () {
    var s = store();
    if (!s) return null;
    try {
      var c = JSON.parse(s.getItem(CHECKOUT_KEY) || 'null');
      if (c && Date.now() - c.ts < MAX_AGE_MS) return c;
    } catch (e) {}
    return null;
  };

  var ITEM_NAMES = { yearly: 'KeepyCash yearly', lifetime_upgrade: 'KeepyCash lifetime upgrade' };

  // GA4 purchase (the key event). Kept apart from the Meta one so it still
  // fires when the pixel is blocked, with its own once-only flag. The same id is
  // the transaction_id, which GA also uses to drop duplicates.
  function trackGaPurchase(eventId, product, value) {
    if (typeof window.gtag !== 'function') return;
    var flag = 'kc_ga_purchase_' + eventId;
    var s = store();
    try { if (s && s.getItem(flag)) return; } catch (e) {}
    window.gtag('event', 'purchase', {
      transaction_id: eventId,
      currency: 'AUD',
      value: value,
      items: [{ item_id: product, item_name: ITEM_NAMES[product] || product, price: value }]
    });
    try { if (s) s.setItem(flag, String(Date.now())); } catch (e) {}
  }

  // OpenAI Ads pixel. Yearly is a paid subscription starting; the lifetime
  // upgrade is a one-off order. Amounts go in cents. The same id goes in
  // event_id, which OpenAI uses to drop duplicates, and there's a once-only flag too.
  function trackOaiPurchase(eventId, product, value) {
    if (typeof window.oaiq !== 'function') return;
    var flag = 'kc_oai_purchase_' + eventId;
    var s = store();
    try { if (s && s.getItem(flag)) return; } catch (e) {}
    var amount = Math.round(value * 100);
    try {
      if (product === 'yearly') {
        window.oaiq('measure', 'subscription_created', {
          type: 'plan_enrollment', plan_id: product, amount: amount, currency: 'AUD'
        }, { event_id: eventId });
      } else {
        window.oaiq('measure', 'order_created', {
          type: 'contents', amount: amount, currency: 'AUD',
          contents: [{ id: product, name: ITEM_NAMES[product] || product, content_type: 'product', quantity: 1, amount: amount, currency: 'AUD' }]
        }, { event_id: eventId });
      }
    } catch (e) { return; }
    try { if (s) s.setItem(flag, String(Date.now())); } catch (e) {}
  }

  window.kcTrackPurchase = function (product, appUserId, fallbackValue) {
    if (!appUserId) return false;

    var eventId = product + '_' + appUserId;
    var c = window.kcLastCheckout();
    var value = (c && c.product === product && typeof c.value === 'number') ? c.value : fallbackValue;

    trackGaPurchase(eventId, product, value);
    trackOaiPurchase(eventId, product, value);

    if (typeof window.fbq !== 'function') return false;
    var flag = 'kc_purchase_' + eventId;
    var s = store();
    try { if (s && s.getItem(flag)) return false; } catch (e) {}

    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'AUD',
      content_name: product,
      content_ids: [product],
      content_type: 'product'
    }, { eventID: eventId });

    try { if (s) s.setItem(flag, String(Date.now())); } catch (e) {}
    if (window.gtag) window.gtag('event', 'meta_purchase_sent', { product: product, value: value });
    return true;
  };
})();
