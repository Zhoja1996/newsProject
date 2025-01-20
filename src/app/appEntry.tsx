import React from 'react'
import { store } from './appStore'
import BaseLayout from './layouts/BaseLayout'
import { ThemeProvider } from './providers/ThemeProvider'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import '@/shared/index.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <Provider store={store}>
                <BaseLayout />
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
)
