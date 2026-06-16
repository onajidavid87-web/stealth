import type { ApiRepository } from "./repository";

function rateLimited(retryAfterSeconds: number) {
  return { allowed: false, retryAfterSeconds };
}

async function checkIncrementedLimit(
  repository: ApiRepository,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const count = await repository.incrementCounter(key, windowSeconds);
  if (count > max) return rateLimited(windowSeconds);
  return { allowed: true };
}

async function checkStoredLimit(
  repository: ApiRepository,
  key: string,
  max: number,
  retryAfterSeconds: number,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const count = await repository.getCounter(key);
  if (count >= max) return rateLimited(retryAfterSeconds);
  return { allowed: true };
}

export async function checkAccountLimit(
  repository: ApiRepository,
  sender: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkIncrementedLimit(repository, `abuse:account:${sender}`, 50, 3600);
}

export async function checkIpLimit(
  repository: ApiRepository,
  ip: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number; flagged?: boolean }> {
  if (ip === "" || ip === "unknown") {
    return { allowed: true, flagged: true };
  }

  return checkIncrementedLimit(repository, `abuse:ip:${ip}`, 100, 3600);
}

export async function checkSenderRecipientLimit(
  repository: ApiRepository,
  sender: string,
  recipient: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkIncrementedLimit(repository, `abuse:pair:${sender}:${recipient}`, 10, 3600);
}

export async function checkProofFailureLimit(
  repository: ApiRepository,
  sender: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkStoredLimit(repository, `abuse:proof:${sender}`, 5, 900);
}

export async function recordProofFailure(repository: ApiRepository, sender: string): Promise<void> {
  await repository.incrementCounter(`abuse:proof:${sender}`, 900);
}

export async function checkRelayLimit(
  repository: ApiRepository,
  relayId: string,
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkIncrementedLimit(repository, `abuse:relay:${relayId}`, 500, 3600);
}
