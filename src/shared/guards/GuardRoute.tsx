import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { COOKIE_KEYS, getCookie } from '@shared/utils/cookie';
import { PATHS } from '@shared/path';

interface GuardRouteProps {
	element: any;
	path?: string;
}

const GuardRoute: FC<GuardRouteProps> = ({ element, path }) => {
	// const logged = !!getCookie(COOKIE_KEYS.REFRESH_TOKEN);
	const logged = !!sessionStorage.getItem(COOKIE_KEYS.REFRESH_TOKEN);

	return logged ? element : <Navigate replace to={PATHS.SIGN_IN} />;
};

export default GuardRoute;
