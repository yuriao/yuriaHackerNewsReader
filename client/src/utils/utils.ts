/**
 * Shared utility functions for both web and mobile apps
 */

// Time ago formatter (e.g., "2 hours ago")
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return '1 minute ago';
  
  return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
}

// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    if (!url) return '';
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch (e) {
    return '';
  }
}

// Truncate text to a certain length with ellipsis
export function truncateText(text: string, length: number): string {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

// Strip HTML tags from a string
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}