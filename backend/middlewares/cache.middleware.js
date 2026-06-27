const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

export function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, { data, timestamp: Date.now() });
    if (cache.size > 200) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return originalJson(data);
  };

  next();
}
