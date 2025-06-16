const ICORNAnalytics = {
    init() {
        this.setupEventListeners();
        this.trackPageView();
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="x.com"]')) {
                this.trackEvent('social_click', {
                    platform: 'X',
                    url: e.target.href
                });
            }
        });
    },

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer
        });
    },

    trackEvent(eventName, eventData) {
        if (navigator.sendBeacon) {
            const data = {
                event: eventName,
                data: eventData,
                timestamp: Date.now(),
                session: this.getSessionId()
            };
            navigator.sendBeacon('/analytics', JSON.stringify(data));
        }
    },

    getSessionId() {
        let sessionId = sessionStorage.getItem('icorn_session');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            sessionStorage.setItem('icorn_session', sessionId);
        }
        return sessionId;
    }
};

export default ICORNAnalytics;
