import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import 'react-quill/dist/quill.snow.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux";
import {store} from "@/redux/store.ts";
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { colors } from './lib/colors';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
            <BrowserRouter>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: colors.primary.main,
                            colorSuccess: colors.success.main,
                            colorWarning: colors.warning.main,
                            colorError: colors.error.main,
                            colorInfo: colors.info.main,
                            borderRadius: 8,
                            colorBgContainer: '#ffffff',
                            colorBorder: colors.neutral[200],
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
            </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
