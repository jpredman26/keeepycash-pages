/* KeepyCash web purchase tracking for Meta.

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

  window.kcTrackPurchase = function (product, appUserId, fallbackValue) {
    if (!appUserId || typeof window.fbq !== 'function') return false;

    var eventId = product + '_' + appUserId;
    var flag = 'kc_purchase_' + eventId;
    var s = store();
    try { if (s && s.getItem(flag)) return false; } catch (e) {}

    var c = window.kcLastCheckout();
    var value = (c && c.product === product && typeof c.value === 'number') ? c.value : fallbackValue;

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
