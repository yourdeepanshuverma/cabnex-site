import React, { createContext, useState, useEffect, useContext } from 'react';
import { api, endpoints } from '../api/api-config';

const WebsiteSettingsContext = createContext();

export const useWebsiteSettings = () => useContext(WebsiteSettingsContext);

export const WebsiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get(endpoints.WebsiteContent);
                if (response.data.success) {
                    setSettings(response.data.data.setting);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <WebsiteSettingsContext.Provider value={{ settings, loading, error }}>
            {children}
        </WebsiteSettingsContext.Provider>
    );
};
