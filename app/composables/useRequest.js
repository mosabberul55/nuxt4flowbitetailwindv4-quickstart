import { accessToken } from '~/composables/useCookies';
export function useRequest() {
    const config = useRuntimeConfig();

    const createRequest = async (url, method, body = null) => {
        const token =  accessToken?.();
        const { data, status, error, refresh, clear } = await useFetch(url, {
            baseURL: config.public.baseURL,
            method,
            body,
            onRequest({ options }) {
                if (token) options.headers.set('Authorization', `Bearer ${token}`);
                options.headers.set('Accept', 'application/json');
                options.headers.set('Content-Type', 'application/json');
            },
        });
        return { data, status, error, refresh, clear };
    };

    const getData = async (url) => createRequest(url, 'GET');
    const postData = async (url, body) => createRequest(url, 'POST', body);
    const putData = async (url, body) => createRequest(url, 'PUT', body);
    const deleteData = async (url) => createRequest(url, 'DELETE');

    return { getData, postData, putData, deleteData, createRequest };
}

// Backward-compatible named exports
export const getData = async (url) => {
    const { getData } = useRequest();
    return await getData(url);
};

export const postData = async (url, body) => {
    const { postData } = useRequest();
    return await postData(url, body);
};

export const putData = async (url, body) => {
    const { putData } = useRequest();
    return await putData(url, body);
};

export const deleteData = async (url) => {
    const { deleteData } = useRequest();
    return await deleteData(url);
};
