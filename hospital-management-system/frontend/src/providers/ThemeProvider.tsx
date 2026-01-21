// ** Dependencies
import React, { useState } from 'react';
import type { ReactElement as JSX, ReactNode } from 'react';

// ** Contexts
import ThemeContext from '@/contexts/ThemeContext';

interface ThemeProviderProps {
    children: ReactNode;
}

function ThemeProvider(props: ThemeProviderProps): JSX {
    const { children } = props;

    const [ theme, setTheme ] = useState<'light' | 'dark'>('light');
    
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            { children }
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;