/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useStores } from '@/models';
import { ReactNode } from 'react';

export const AuthGate = ({ children }: { children: ReactNode }) => {

    const rootStore = useStores()
    if (!rootStore.isAuthenticated) {
        return null;
    }

    return children;
}