import React from 'react';
import { PATHS } from '@shared/path';
import SignUp from '@pages/SignUp';
import SignIn from '@pages/SignIn';
import Place from '@pages/Place';
import Transportation from '@pages/Transportation';
import Contents from '@pages/Contents';
import Accommodation from '@pages/Accommodation';
import Estimate from '@pages/Estimate';
import User from '@pages/User';
import Agent from '@pages/Agent';
import Package from '@pages/Package';
import Password from '@pages/Password';
import EstimateDetail from '@pages/EstimateDetail';
import Create from '@pages/Create';
import CreatePackage from '@pages/CreatePackage';
import MyEstimate from '@pages/MyEstimate';
import MyEstimateDetail from '@pages/MyEstimateDetail';
import Home from '@pages/Home';
import Grade from '@pages/Grade';

export const rootRouter = [
	{
		path: PATHS.INTRO,
		element: <Home />,
		guard: true,
	},
	{
		path: PATHS.PLACE,
		element: <Place />,
		guard: true,
	},
	{
		path: PATHS.TRANSPORTATION,
		element: <Transportation />,
		guard: true,
	},
	{
		path: PATHS.CONTENTS,
		element: <Contents />,
		guard: true,
	},
	{
		path: PATHS.ACCOMMODATION,
		element: <Accommodation />,
		guard: true,
	},
	{
		path: PATHS.ESTIMATE,
		element: <Estimate />,
		guard: true,
	},
	{
		path: PATHS.MY_ESTIMATE,
		element: <MyEstimate />,
		guard: true,
	},
	{
		path: PATHS.MY_ESTIMATE_DETAIL,
		element: <MyEstimateDetail />,
		guard: true,
	},
	{
		path: PATHS.ESTIMATE_DETAIL,
		element: <EstimateDetail />,
		guard: true,
	},
	{
		path: PATHS.CREATE,
		element: <Create />,
		guard: true,
	},
	{
		path: PATHS.USER,
		element: <User />,
		guard: true,
	},
	{
		path: PATHS.AGENT,
		element: <Agent />,
		guard: true,
	},
	{
		path: PATHS.GRADE,
		element: <Grade />,
		guard: true,
	},
	{
		path: PATHS.PACKAGE,
		element: <Package />,
		guard: true,
	},
	{
		path: PATHS.CREATE_PACKAGE,
		element: <CreatePackage />,
		guard: true,
	},
	{
		path: PATHS.PASSWORD,
		element: <Password />,
		guard: true,
	},
	{
		path: PATHS.SIGN_UP,
		element: <SignUp />,
		guard: false,
	},
	{
		path: PATHS.SIGN_IN,
		element: <SignIn />,
		guard: false,
	},
];
