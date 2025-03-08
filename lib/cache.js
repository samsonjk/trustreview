// utils/cache.js
const cache = new Map();
const CACHE_EXPIRATION_MS = 5 * 60 * 1000; // Cache expiration time (5 minutes)

export function getCache(key) {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRATION_MS) {
    return cached.data;
  }
  return null;
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
