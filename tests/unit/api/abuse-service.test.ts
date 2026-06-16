import { describe, expect, it } from "vitest";

import { MemoryApiRepository } from "../../../src/server/api/memory-repository";
import {
  checkAccountLimit,
  checkIpLimit,
  checkProofFailureLimit,
  checkRelayLimit,
  checkSenderRecipientLimit,
  recordProofFailure,
} from "../../../src/server/api/abuse-service";

const sender = `G${"B".repeat(55)}`;
const recipient = `G${"A".repeat(55)}`;
const relayId = "relay-001";

describe("abuse service", () => {
  it("allows sender under account limit", async () => {
    const repository = new MemoryApiRepository();
    const result = await checkAccountLimit(repository, sender);
    expect(result).toMatchObject({ allowed: true });
  });

  it("blocks sender over account limit", async () => {
    const repository = new MemoryApiRepository();
    for (let i = 0; i < 50; i++) {
      await repository.incrementCounter(`abuse:account:${sender}`, 3600);
    }
    const result = await checkAccountLimit(repository, sender);
    expect(result).toMatchObject({ allowed: false });
    expect(result.retryAfterSeconds).toBeTypeOf("number");
  });

  it("flags unknown ip but allows through", async () => {
    const repository = new MemoryApiRepository();
    const result = await checkIpLimit(repository, "unknown");
    expect(result).toMatchObject({ allowed: true, flagged: true });
  });

  it("blocks ip over limit", async () => {
    const repository = new MemoryApiRepository();
    for (let i = 0; i < 100; i++) {
      await repository.incrementCounter(`abuse:ip:1.2.3.4`, 3600);
    }
    const result = await checkIpLimit(repository, "1.2.3.4");
    expect(result).toMatchObject({ allowed: false });
    expect(result.retryAfterSeconds).toBeTypeOf("number");
  });

  it("blocks targeted harassment over sender-recipient limit", async () => {
    const repository = new MemoryApiRepository();
    for (let i = 0; i < 10; i++) {
      await repository.incrementCounter(`abuse:pair:${sender}:${recipient}`, 3600);
    }
    const result = await checkSenderRecipientLimit(repository, sender, recipient);
    expect(result).toMatchObject({ allowed: false });
    expect(result.retryAfterSeconds).toBeTypeOf("number");
  });

  it("blocks sender after proof failures", async () => {
    const repository = new MemoryApiRepository();
    for (let i = 0; i < 5; i++) {
      await recordProofFailure(repository, sender);
    }
    const result = await checkProofFailureLimit(repository, sender);
    expect(result).toMatchObject({ allowed: false });
    expect(result.retryAfterSeconds).toBeTypeOf("number");
  });

  it("allows sender under proof failure limit", async () => {
    const repository = new MemoryApiRepository();
    await recordProofFailure(repository, sender);
    const result = await checkProofFailureLimit(repository, sender);
    expect(result).toMatchObject({ allowed: true });
  });

  it("blocks relay over limit", async () => {
    const repository = new MemoryApiRepository();
    for (let i = 0; i < 500; i++) {
      await repository.incrementCounter(`abuse:relay:${relayId}`, 3600);
    }
    const result = await checkRelayLimit(repository, relayId);
    expect(result).toMatchObject({ allowed: false });
    expect(result.retryAfterSeconds).toBeTypeOf("number");
  });
});