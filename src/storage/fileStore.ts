import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Lightweight file-backed JSON store.
 * Stdlib-first, zero third-party DB dependencies.
 */
export class FileStore {
  private baseDir: string;

  constructor(baseDir: string = path.join(process.cwd(), '.data')) {
    this.baseDir = baseDir;
  }

  private async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  private getFilePath(collection: string): string {
    return path.join(this.baseDir, `${collection}.json`);
  }

  async readCollection<T>(collection: string): Promise<T[]> {
    try {
      const filePath = this.getFilePath(collection);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeCollection<T>(collection: string, items: T[]): Promise<void> {
    await this.ensureDir(this.baseDir);
    const filePath = this.getFilePath(collection);
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
  }

  async saveRawFile(subDir: string, filename: string, content: string | Buffer): Promise<string> {
    const targetDir = path.join(this.baseDir, subDir);
    await this.ensureDir(targetDir);
    const filePath = path.join(targetDir, filename);
    await fs.writeFile(filePath, content);
    return filePath;
  }

  async readRawFile(subDir: string, filename: string): Promise<string> {
    const filePath = path.join(this.baseDir, subDir, filename);
    return await fs.readFile(filePath, 'utf-8');
  }

  async clearAll(): Promise<void> {
    try {
      await fs.rm(this.baseDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

export const defaultStore = new FileStore();
