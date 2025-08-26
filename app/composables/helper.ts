import moment from 'moment';

export const formatDateTime = (dateTime: string | Date): string => {
    if (!dateTime) return '';
    return moment(dateTime).fromNow();
};

export const s3Endpoint = (path: string) => {
    const runtimeConfig = useRuntimeConfig()
    return `https://${runtimeConfig.public.s3Bucket}.${runtimeConfig.public.s3Region}.digitaloceanspaces.com/${path}`;
}

export const getInitials = (name: string) => {
    if (!name) return '';
    return name.replace(/\s+/g, '').substring(0, 2).toUpperCase();
};

export const randomString = (length: number = 32): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};
export const formatToOneDecimal = (num: number): number => {
    return Math.round(num * 10) / 10;
};
export const generateEventId = (key:string)=>{
    const randomPart = Math.random().toString(36).substr(2, 14); // Random alphanumeric string
    return `${key}:${randomPart}`;
}

