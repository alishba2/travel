/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import { Global } from '@emotion/react';
import globalStyles from '@styles/globalReset';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import App from './App';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
	//! production 버전에서 콘솔 제거
	console.log = function no_console() {};
	console.warn = function no_console() {};
}

const container = document.getElementById('root');
const root = createRoot(container!);
Modal.setAppElement(container!);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, //! 모바일이 주환경인 경우에는 true 권장드림.
			keepPreviousData: true, //! keepPreviousData false 바꾸면 잣댑니다. 바꾸면 안됩니다.
			// staleTime: 1000 * 60 * 5, //! staleTime 쓰면 잣댑니다. 절대 쓰면 안됩니다.
		},
	},
});

root.render(
	<>
		<Global styles={globalStyles} />
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={isDevelopment} />
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</>,
);
