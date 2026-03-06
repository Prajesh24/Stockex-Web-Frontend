
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,

    },
    ADMIN: {
        USER: {
            CREATE: '/api/admin/users/',
            GET_ALL: '/api/admin/users/',
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (userId: string) => `/api/admin/users/${userId}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
        }
    },
    PORTFOLIO: {
    ADD:          '/api/portfolio',
    GET_ALL:      '/api/portfolio',
    OVERVIEW:     '/api/portfolio/overview',
    SELL:         (id: string) => `/api/portfolio/${id}/sell`,  // ← /api prefix
    SELL_HISTORY: '/api/portfolio/sell-history',
    REMOVE:       (id: string) => `/api/portfolio/${id}`,
},
WATCHLIST: {
    GET:    '/api/watchlist',
    ADD:    '/api/watchlist',
    REMOVE: (symbol: string) => `/api/watchlist/${symbol}`,
},
}