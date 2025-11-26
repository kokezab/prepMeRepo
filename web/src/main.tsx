import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import 'react-quill/dist/quill.snow.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider, useSelector} from "react-redux";
import {store} from "@/redux/store.ts";
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { lightColors, darkColors } from './lib/colors';
import type { RootState } from '@/redux/store';

const queryClient = new QueryClient()

function ThemedApp() {
    const darkMode = useSelector((state: RootState) => state.ui.darkMode);
    const colors = darkMode ? darkColors : lightColors;

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: colors.primary.main,
                    colorSuccess: colors.success.main,
                    colorWarning: colors.warning.main,
                    colorError: colors.error.main,
                    colorInfo: colors.info.main,
                    borderRadius: 8,
                    colorBgContainer: darkMode ? '#1f2937' : '#ffffff',
                    colorBorder: darkMode ? colors.neutral[200] : lightColors.neutral[200],
                },
                components: {
                    Button: {
                        controlHeight: 36,
                        fontWeight: 500,
                    },
                    Card: {
                        borderRadiusLG: 12,
                    },
                    Input: {
                        controlHeight: 36,
                    },
                    Select: {
                        controlHeight: 36,
                    },
                },
            }}
        >
            <App/>
        </ConfigProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
            <BrowserRouter>
                <ThemedApp />
            </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
