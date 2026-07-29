export interface UserOption {
    autoPlay: boolean;
    focusMode: boolean;
}

export const defaultUserOption: UserOption = {
    autoPlay: false,
    focusMode: false,
};

const STORAGE_KEY = "user_option";

export const loadUserOption = (): UserOption => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return defaultUserOption;

        return {
            ...defaultUserOption,
            ...JSON.parse(saved),
        };
    } catch {
        return defaultUserOption;
    }
};

export const saveUserOption = (option: UserOption) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(option));
};
