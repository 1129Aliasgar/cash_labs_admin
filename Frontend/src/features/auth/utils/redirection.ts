import { AuthUser } from '../types';

/**
 * Centralized redirection logic based on user role and merchant status.
 * Used after login, signup, and in the AuthProvider guard.
 */
export function getRedirectPath(user: AuthUser | null): string {
    if (!user) return '/auth/login';

    if (user.role === 'MERCHANT') {
        switch (user.merchantStatus) {
            case 'ACTIVE':
                return '/merchant/onboarding';
            case 'PENDING':
                return '/merchant/application-pending';
            case 'APPROVED':
                return '/superadmin/dashboard';
            default:
                return '/merchant/onboarding';
        }
    }

    // Default for SUPER_ADMIN, ADMIN, AGENT (and approved merchants)
    return '/superadmin/dashboard';
}
