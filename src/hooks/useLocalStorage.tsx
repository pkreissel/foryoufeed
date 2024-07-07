import { useState } from "react";
import { User, App } from "../types";


type StorageKey = {
    keyName: string;
    defaultValue: Record<string, unknown> | null;
}

export interface AppStorage extends StorageKey {
    keyName: "app";
    defaultValue: App | null;
}

export interface UserStorage extends StorageKey {
    keyName: "user";
    defaultValue: User | null;
}

export const useAppStorage = (key: AppStorage) => {
    return useLocalStorage<AppStorage>(key);
}

export const useUserStorage = (key: UserStorage) => {
    return useLocalStorage<UserStorage>(key);
}

export const useLocalStorage = <T extends StorageKey,>(key: T): [T["defaultValue"], (value: T["defaultValue"]) => void] => {
    const { keyName, defaultValue } = key;
    const [storedValue, setStoredValue] = useState<T["defaultValue"]>(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            console.error(err);
            return defaultValue;
        }
    });
    const setValue = (newValue: T["defaultValue"]) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) { console.error(err); }
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};