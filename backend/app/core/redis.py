import os
import redis
import logging

# Initialize a lazy Redis client for blocklisting and caching
redis_url = os.environ.get("REDIS_URL", "").strip()
if not redis_url or redis_url.startswith("memory://"):
    redis_url = "redis://localhost:6379/0"

class InMemoryRedisMock:
    """A simple in-memory mock for Redis to support local dev without a running Redis server."""
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def setex(self, key, ttl, value):
        self.store[key] = value

try:
    redis_client = redis.from_url(redis_url, decode_responses=True)
    redis_client.ping() # Force connection attempt
except Exception as e:
    logging.warning(f"Failed to connect to Redis at '{redis_url}': {e}. Falling back to in-memory dict for local dev.")
    redis_client = InMemoryRedisMock()
