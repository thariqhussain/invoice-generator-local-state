import { useState, useEffect } from 'react';

export function useLocalStorageState(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error('Error reading localStorage key “' + key + '”:', error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage key “' + key + '”:', error);
        }
    }, [key, value]);

    return [value, setValue];
}