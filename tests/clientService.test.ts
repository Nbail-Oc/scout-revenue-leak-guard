import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { FileStore } from '../src/storage/fileStore.js';
import { ClientService } from '../src/services/clientService.js';

describe('ClientService (Seam: Client Management)', () => {
  let testStore: FileStore;
  let service: ClientService;

  beforeEach(async () => {
    const testDir = path.join(os.tmpdir(), `scout-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    testStore = new FileStore(testDir);
    service = new ClientService(testStore);
  });

  it('creates and retrieves a new client with generated id and timestamps', async () => {
    const created = await service.createClient({
      name: 'Yojit FZE',
      description: 'Dubai-based logistics SaaS',
      industry: 'SaaS',
      contactEmail: 'billing@yojit.com',
      contactName: 'Ahmed Al-Mansoori',
      timezone: 'Asia/Dubai',
      currency: 'USD',
    });

    assert.ok(created.id, 'Client should have an ID');
    assert.equal(created.name, 'Yojit FZE');
    assert.equal(created.contactEmail, 'billing@yojit.com');
    assert.ok(created.createdAt, 'Should have createdAt timestamp');

    const fetched = await service.getClient(created.id);
    assert.deepEqual(fetched, created);
  });

  it('rejects client creation if name or email is missing/invalid', async () => {
    await assert.rejects(
      async () => {
        await service.createClient({
          name: '   ',
          industry: 'SaaS',
          contactEmail: 'billing@yojit.com',
          timezone: 'UTC',
          currency: 'USD',
        });
      },
      { message: /Client name is required/ }
    );

    await assert.rejects(
      async () => {
        await service.createClient({
          name: 'Valid Name',
          industry: 'SaaS',
          contactEmail: 'invalid-email',
          timezone: 'UTC',
          currency: 'USD',
        });
      },
      { message: /Valid contact email is required/ }
    );
  });

  it('lists all clients in creation order', async () => {
    await service.createClient({
      id: 'client-1',
      name: 'Double',
      industry: 'SaaS',
      contactEmail: 'finance@double.com',
      timezone: 'Asia/Kolkata',
      currency: 'USD',
    });

    await service.createClient({
      id: 'client-2',
      name: 'Yojit',
      industry: 'SaaS',
      contactEmail: 'billing@yojit.com',
      timezone: 'Asia/Dubai',
      currency: 'USD',
    });

    const list = await service.listClients();
    assert.equal(list.length, 2);
    assert.equal(list[0].id, 'client-1');
    assert.equal(list[1].id, 'client-2');
  });

  it('returns null when getting a non-existent client', async () => {
    const result = await service.getClient('non-existent-id');
    assert.equal(result, null);
  });
});
