import Redis from "ioredis";
const redis = new Redis();

export function getLevelKey(namespace: string, id: string): string {
  return `level:${namespace}:${id}`;
}

export function getWorldKey(sessionId: string): string {
  return `world:${sessionId}`;
}

export async function getBlob<T>(key: string): Promise<T | undefined> {
  const value = await redis.get(key);
  if (!value) {
    return;
  }
  return JSON.parse(value) as T;
}

export async function setBlob<T>(key: string, value: T) {
  return redis.set(key, JSON.stringify(value));
}
