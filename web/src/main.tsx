import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux";
import {store} from "@/redux/store.ts";
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    </StrictMode>,
)
