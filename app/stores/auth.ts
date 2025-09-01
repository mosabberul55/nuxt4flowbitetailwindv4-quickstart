import { defineStore } from 'pinia'
import {
    setUserCookie,
    setAccessToken,
    resetAllCookies,
    accessToken,
    getUser,
} from '~/composables/useCookies'

type Token = string | null
// User is stored in cookie as string in current composable; we keep it as any|string|null for compatibility
// If elsewhere you stringify the user, adjust accordingly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = any | string | null

export const useAuthStore = defineStore('auth', () => {
    // state
    const token = ref<Token>(accessToken() || null)
    // getUser now returns parsed object|string|null
    const user = ref<User>(getUser() as User)

    // getters
    const isLoggedIn = computed(() => !!token.value && !!user.value)

    // actions
    async function setToken(newToken: string | null) {
        token.value = newToken
        setAccessToken(newToken as any)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function setUser(newUser: any) {
        user.value = newUser
        setUserCookie(newUser)
    }

    async function clearAuth() {
        user.value = null
        token.value = null
        resetAllCookies()
    }

    async function login(payload: any) {
        // @ts-ignore - postData provided by Nuxt composable in project
        const { data, error, execute, refresh } = await postData('auth/login', payload)
        if (data) {
            await setToken(data.value?.token ?? null)
            if (data.value?.user?.roles) {
                if (data.value?.user) delete data.value.user.roles
            }
            await setUser(data.value?.user ?? null)
        }
        return { data, error, execute, refresh }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function register(payload: any) {
        // @ts-ignore - postData provided by Nuxt composable in project
        const { data, error, execute, refresh } = await postData('auth/signup', payload)
        if (data) {
            await setToken(data.value?.token ?? null)
            if (data.value?.user?.roles) {
                if (data.value?.user) delete data.value.user.roles
            }
            await setUser(data.value?.user ?? null)
        }
        return { data, error, execute, refresh }
    }

    async function getLoggedUser() {
        // @ts-ignore - getData provided by Nuxt composable in project
        const { data, error, execute, refresh } = await getData('auth/profile')
        if (data) {
            if ((data.value as any)?.roles) {
                delete (data.value as any).roles
            }
            // await setUser(data.value ?? null)
        }
        return { data, error, execute, refresh }
    }

    async function logout() {
        await clearAuth()
        // @ts-ignore - navigateTo provided by Nuxt
        await navigateTo('/login')
    }

    return {
        // state
        token, user,
        // getters
        isLoggedIn,
        // actions
        setToken, setUser, clearAuth, login, register, getLoggedUser, logout,
    }
})
