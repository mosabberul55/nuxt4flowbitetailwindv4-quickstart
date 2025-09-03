import { defineStore } from 'pinia'
import {
    setUserCookie,
    setAccessToken,
    resetAllCookies,
    accessToken,
    getUser,
} from '~/composables/useCookies'

type Token = string | null
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
        if (process.client) {
            setUserCookie(newUser)
        }
    }

    async function clearAuth() {
        user.value = null
        token.value = null
        resetAllCookies()
    }

    // small internal helper to DRY token+user handling from auth endpoints
    async function applyAuthPayload(data: any) {
        if (!data) return
        const tokenVal = data.value?.token ?? null
        const userVal = data.value?.user ?? null
        // Strip roles if present before storing user
        if (userVal && userVal.roles) {
            // avoid mutating original object if it's shared; shallow clone
            const { roles, ...rest } = userVal
            await setToken(tokenVal)
            await setUser(rest)
            return
        }
        await setToken(tokenVal)
        await setUser(userVal)
    }

    async function login(payload: any) {
        // @ts-ignore - postData provided by Nuxt composable in project
        const { data, error, execute, refresh } = await postData('auth/login', payload)
        if (data) {
            await applyAuthPayload(data)
        }
        return { data, error, execute, refresh }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function register(payload: any) {
        // @ts-ignore - postData provided by Nuxt composable in project
        const { data, error, execute, refresh } = await postData('auth/signup', payload)
        if (data) {
            await applyAuthPayload(data)
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
            await setUser(data.value ?? null)
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
