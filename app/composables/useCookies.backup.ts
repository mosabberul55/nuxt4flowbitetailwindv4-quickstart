// Cookie options interface matching useCookie expectations
interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    encode?: (value: string) => string;
    decode?: (value: string) => string;
    default?: () => string | null;
    watch?: boolean;
    readonly?: boolean;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const commonCookieOptions: CookieOptions = {
    maxAge: COOKIE_MAX_AGE,
    secure: true,
    sameSite: 'lax',
    default: () => null,
    watch: true
};
//
// // Cookie instance cache
// const cookieCache = new Map<string, ReturnType<typeof useCookie<string | null>>>();
//
// // Generic cookie getter with caching
// const getCookieInstance = (name: string): ReturnType<typeof useCookie<string | null>> => {
//     if (!cookieCache.has(name)) {
//         cookieCache.set(name, useCookie<string | null>(name, commonCookieOptions));
//     }
//     return cookieCache.get(name)!;
// };
//
// // Cookie accessors
// export const getTokenCookie = () => getCookieInstance('token');
// export const getUserCookie = () => getCookieInstance('user');
//
// // Value getters
// export const accessToken = (): string | null => {
//     return getTokenCookie().value;
// };
//
// export const getUser = (): string | null => {
//     return getUserCookie().value;
// };
//
// // Value setters
// export const setAccessToken = (token: string | null): void => {
//     getTokenCookie().value = token;
// };
//
// export const setUserCookie = (user: string | null): void => {
//     getUserCookie().value = user;
// };
//
// // Reset all cookies
// export const resetAllCookies = (): void => {
//     setAccessToken(null);
//     setUserCookie(null);
// };
//
// // Client-side cookie manipulation utilities
// const isClient = (): boolean => {
//     return typeof window !== 'undefined' && typeof document !== 'undefined';
// };
//
// const buildCookieString = (name: string, value: string): string => {
//     const encodedValue = encodeURIComponent(value);
//     const parts = [
//         `${name}=${encodedValue}`,
//         'path=/',
//         `max-age=${COOKIE_MAX_AGE}`
//     ];
//
//     if (commonCookieOptions.secure) {
//         parts.push('secure');
//     }
//
//     if (commonCookieOptions.sameSite) {
//         parts.push(`samesite=${commonCookieOptions.sameSite}`);
//     }
//
//     return parts.join('; ');
// };
//
// // Force cookie updates (for immediate browser cookie updates)
// export const forceUpdateCookie = (name: string, value: string): void => {
//     if (!isClient()) return;
//
//     document.cookie = buildCookieString(name, value);
// };
//
// export const forceDeleteCookie = (name: string): void => {
//     if (!isClient()) return;
//
//     document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
// };
//
// // Combined force setters (updates both reactive cookie and browser cookie)
// export const forceSetAccessToken = (token: string): void => {
//     forceUpdateCookie('token', token);
//     setAccessToken(token);
// };
//
// export const forceSetUserCookie = (user: string): void => {
//     forceUpdateCookie('user', user);
//     setUserCookie(user);
// };
//
// // Force reset with immediate browser update
// export const forceResetAllCookies = (): void => {
//     forceDeleteCookie('token');
//     forceDeleteCookie('user');
//     resetAllCookies();
// };
//
// // Utility to check if cookies are available
// export const areCookiesAvailable = (): boolean => {
//     return isClient() && navigator.cookieEnabled;
// };
//
// // Get all cookie values as an object
// export const getAllCookieValues = () => {
//     return {
//         token: accessToken(),
//         user: getUser()
//     };
// };
//
// // Type-safe cookie validator
// export const validateCookieValue = (value: unknown): value is string => {
//     return typeof value === 'string' && value.length > 0;
// };