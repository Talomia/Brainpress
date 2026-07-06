import { bp_hooks } from './hooks';

class VersionManager {
  private history: Map<string, any[]> = new Map();

  async createVersion(entityId: string, data: any) {
    if (!this.history.has(entityId)) {
      this.history.set(entityId, []);
    }
    const version = {
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)),
      id: Math.random().toString(36).substring(7),
    };
    this.history.get(entityId)?.push(version);
    await bp_hooks.doAction('version_created', { entityId, version });
    return version;
  }

  getVersions(entityId: string) {
    return this.history.get(entityId) || [];
  }
}

export const bp_versioning = new VersionManager();
