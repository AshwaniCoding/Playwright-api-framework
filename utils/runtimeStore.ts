const store: Record<string, any> = {};

export const RuntimeStore = {

    set(key: string, value: any) {
        store[key] = value;
    },

    get<T = any>(key: string): T | undefined {
        return store[key];
    },

    clear(key?: string) {
        if (key) delete store[key];
        else Object.keys(store).forEach(k => delete store[k]);
    }
};
