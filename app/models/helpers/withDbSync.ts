import { getEnv } from 'mobx-state-tree';
import { ApplicationEnv } from './ApplicationEnv';

export const withDbSync = async <T>(self: any, action: () => Promise<T>) => {
    const { ensureSync } = getEnv<ApplicationEnv>(self);
    const result = await ensureSync();

    if (!result.success) return { kind: "sync-error" };
    return action();
}