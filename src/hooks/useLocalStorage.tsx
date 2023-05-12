import { useState } from "react";
import { App, User } from "../types";

type StorageKey = {
    keyName: string;
    defaultValue: any;
}

export interface AppStorage extends StorageKey {
    keyName: "app";
    defaultValue: App | {};
}

export interface UserStorage extends StorageKey {
    keyName: "user";
    defaultValue: User | null;
}

export const useAppStorage = (key: AppStorage): [App, () => void] => {
    return useLocalStorage(key);
}

export const useUserStorage = (key: UserStorage): [User, () => void] => {
    return useLocalStorage(key);
}

export const useLocalStorage = (key: StorageKey): StorageKey["defaultValue"] => {
    const { keyName, defaultValue } = key;
    const [storedValue, setStoredValue] = useState((): any => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    const setValue = (newValue: any) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) { }
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};