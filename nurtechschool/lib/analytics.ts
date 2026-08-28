import { configs } from './constants';

export type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'CLICK_REGISTER'
  | 'CLICK_DOWNLOAD'
  | 'CLICK_WHATSAPP'
  | 'CLICK_APP';

const API_BASE = configs.API_BASE || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337/api';


/**
 * Send an event to the analytics API endpoint.
 * Safe for client-side call (uses fetch without blocking UI).
 */
export const trackEvent = async (
  eventType: AnalyticsEventType,
  metadata?: Record<string, any>
) => {
  if (typeof window === 'undefined') return;

  try {
    const pagePath = window.location.pathname;

    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventType,
        pagePath,
        metadata
      }),
      keepalive: true
    }).catch((err) => {
      console.warn('Analytics tracking warning:', err);
    });
  } catch (e) {
    // ignore client tracking errors
  }
};
