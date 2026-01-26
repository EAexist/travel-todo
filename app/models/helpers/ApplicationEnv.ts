export interface ApplicationEnv {
    ensureSync: () => Promise<{
        success: boolean;
    }>
}