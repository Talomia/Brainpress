import { bp_hooks } from './hooks';

export async function fetchWithRetry(url: string, options: any = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
      await bp_hooks.doAction('fetch_retry', { url, attempt: i + 1 });
    }
  }
}

export const bp_utils = {
  fetchWithRetry,
  sanitizeContent: (content: string) => content.replace(/<script.*?>.*?<\/script>/gi, ''),
};
