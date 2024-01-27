export function useLocalStorage() {
    const get = (key: string) => {
        const item = localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item);
    };
    
    const set = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    };
    
    const remove = (key: string) => {
        localStorage.removeItem(key);
    };
    
    return {
        get,
        set,
        remove,
    };
}