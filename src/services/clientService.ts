import crypto from 'node:crypto';
import { Client, ClientInput } from '../types.js';
import { FileStore, defaultStore } from '../storage/fileStore.js';

export class ClientService {
  private store: FileStore;
  private readonly collectionName = 'clients';

  constructor(store: FileStore = defaultStore) {
    this.store = store;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async createClient(input: ClientInput): Promise<Client> {
    const trimmedName = input.name?.trim();
    if (!trimmedName) {
      throw new Error('Client name is required');
    }

    const trimmedEmail = input.contactEmail?.trim();
    if (!trimmedEmail || !this.isValidEmail(trimmedEmail)) {
      throw new Error('Valid contact email is required');
    }

    const clients = await this.store.readCollection<Client>(this.collectionName);

    const now = new Date().toISOString();
    const newClient: Client = {
      id: input.id?.trim() || `client_${crypto.randomBytes(6).toString('hex')}`,
      name: trimmedName,
      description: input.description?.trim(),
      industry: input.industry?.trim() || 'SaaS',
      contactEmail: trimmedEmail,
      contactName: input.contactName?.trim(),
      timezone: input.timezone?.trim() || 'UTC',
      currency: input.currency?.trim() || 'USD',
      createdAt: now,
      updatedAt: now,
    };

    clients.push(newClient);
    await this.store.writeCollection(this.collectionName, clients);
    return newClient;
  }

  async getClient(clientId: string): Promise<Client | null> {
    const clients = await this.store.readCollection<Client>(this.collectionName);
    return clients.find((c) => c.id === clientId) || null;
  }

  async listClients(): Promise<Client[]> {
    return await this.store.readCollection<Client>(this.collectionName);
  }
}
