import styled from '@emotion/styled';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { mobilePoint } from '@styles/globalStyles';
import { useInitDeviceHeight, useScrollTop } from '@shared/hooks';
import { isUndefined } from 'lodash-es';
import { ToastContainer } from 'react-toastify';
import './toastify.css';
import { PrefixOfEmotion } from '@typings/base';
import { rootRouter } from './routes';
import GuardRoute from '@shared/guards/GuardRoute';
import { unit } from '@shared/utils/base';
import { PATHS } from '@shared/path';
import { useAlertStore, useConfirmStore } from '@shared/store';
import { AlertStore, ConfirmStore, FreeModalStore, TopRefStore } from '@shared/store/types';
import { AlertModal, ConfirmModal, FreeModal, IModal } from './components';
import { useFreeModalStore } from '@shared/store/modals';
import { useTopRefStore } from '@shared/store/top';
import Navigation from '@components/Navigation';
import { COOKIE_KEYS, getCookie } from '@shared/utils/cookie';
import GoogleMap from '@components/GoogleMap';

declare global {
	interface Window {
		daum: any;
	}
}

const App: FC = () => {
	// const logged = !!getCookie(COOKIE_KEYS.REFRESH_TOKEN);
	const logged = !!sessionStorage.getItem(COOKIE_KEYS.REFRESH_TOKEN);

	const topStore = useTopRefStore((state: TopRefStore) => state);
	const alertStore = useAlertStore((state: AlertStore) => state);
	const confirmStore = useConfirmStore((state: ConfirmStore) => state);
	const freeModalStore = useFreeModalStore((state: FreeModalStore) => state);
	const { pathname } = useLocation();

	const wrapRef = useRef<HTMLDivElement>(null);
	const alertModal = useRef<IModal>(null);
	const confirmModal = useRef<IModal>(null);
	const freeModal = useRef<IModal>(null);

	const [isWide, setIsWide] = useState<boolean>(true);

	useInitDeviceHeight();
	useScrollTop({});

	useEffect(() => {
		if (wrapRef.current) {
			topStore.dispatchAddTopRef(wrapRef.current);
		}
	}, [wrapRef.current]);

	useEffect(() => {
		if (isUndefined(alertStore?.show)) return;
		if (alertStore.show) alertModal.current?.open();
		else alertModal.current?.close();
	}, [alertStore?.show]);

	useEffect(() => {
		if (isUndefined(confirmStore?.show)) return;
		if (confirmStore.show) confirmModal.current?.open();
		else confirmModal.current?.close();
	}, [confirmStore?.show]);

	useEffect(() => {
		if (isUndefined(freeModalStore?.show)) return;
		if (freeModalStore.show) freeModal.current?.open();
		else freeModal.current?.close();
	}, [freeModalStore?.show]);

	//

	return (
		<S.Container ref={wrapRef}>
			<GoogleMap />
			<S.Wrapper>
				{logged && (
					<S.Navigation $isWide={isWide}>
						<Navigation isWide={isWide} setIsWide={setIsWide} />
					</S.Navigation>
				)}
				<S.MainSection>
					<Routes>
						{rootRouter.map(({ path, element, guard }) => (
							<Route
								key={path}
								path={path}
								element={
									guard ? (
										<>
											<GuardRoute element={element} />
										</>
									) : (
										element
									)
								}
							/>
						))}
						<Route path="*" element={<Navigate replace to={logged ? PATHS.INTRO : PATHS.SIGN_IN} />} />
					</Routes>
				</S.MainSection>
			</S.Wrapper>

			<ToastContainer limit={1} />

			<FreeModal ref={freeModal} {...freeModalStore} />
			<ConfirmModal ref={confirmModal} {...confirmStore} />
			<AlertModal ref={alertModal} {...alertStore} />
		</S.Container>
	);
};

const S: PrefixOfEmotion = {};
S.Container = styled.div`
	box-sizing: border-box;
	overflow-x: hidden;
	width: 100%;
	/* height: calc(var(--vh, 1vh) * 100); */
	/* min-height: calc(var(--vh, 1vh) * 100); */
`;

S.Navigation = styled.nav<{ $isWide: boolean }>`
	height: 100%;
	min-height: 100vh;
	background-color: white;
	width: ${unit(270)};
	flex-shrink: 0;
	overflow-y: auto;
	transition: 0.3s;
	width: ${({ $isWide }) => (!$isWide ? unit(100) : unit(270))};
`;

S.Wrapper = styled.div`
	width: 100%;
	/* padding: ${unit(40)} ${unit(24)} ${unit(50)} ${unit(24)}; */
	display: flex;
`;

S.MainSection = styled.main`
	padding: ${unit(24)};
	border-left: 1px solid rb(229, 234, 240);
	min-height: 100vh;
	height: 100%;
	width: 100%;
	overflow-y: scroll;
`;

export default App;
