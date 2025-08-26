import {
	IconLogout,
	IconBus,
	IconHttpConnect,
	IconHomeEdit,
	IconFileInvoice,
	IconUserEdit,
	IconUserCircle,
	IconPackage,
	IconPassword,
	IconMapPinCog,
	IconWriting,
	IconCircleLetterG,
} from '@tabler/icons-react';
import { PATHS } from '@shared/path';

// grade
// M - 총괄
// A - 에이전트

export const NAV_MENUS = [
	{
		id: 1,
		label: 'Travel Package',
		grade: ['M'],
		children: [
			{
				id: 1,
				label: 'Place',
				path: PATHS.PLACE,
				icon: IconMapPinCog,
				grade: ['M'],
			},
			{
				id: 2,
				label: 'Transportation',
				path: PATHS.TRANSPORTATION,
				icon: IconBus,
				grade: ['M'],
			},
			{
				id: 3,
				label: 'Contents',
				path: PATHS.CONTENTS,
				icon: IconHttpConnect,
				grade: ['M'],
			},
			{
				id: 4,
				label: 'Accommodations',
				path: PATHS.ACCOMMODATION,
				icon: IconHomeEdit,
				grade: ['M'],
			},
		],
	},
	{
		id: 2,
		label: 'Quote',
		grade: ['M', 'A'],
		children: [
			{
				id: 1,
				label: 'My Quote',
				path: PATHS.MY_ESTIMATE,
				icon: IconWriting,
				grade: ['M', 'A'],
			},
			// {
			// 	id: 2,
			// 	label: 'Quote Request List',
			// 	path: PATHS.ESTIMATE,
			// 	icon: IconFileInvoice,
			// 	grade: ['M'],
			// },
		],
	},
	// {
	// 	id: 3,
	// 	label: '유저 관리',
	// 	grade: ['M'],
	// 	children: [
	// 		{
	// 			id: 1,
	// 			label: '유저 관리',
	// 			path: PATHS.USER,
	// 			icon: IconUserEdit,
	// 			grade: ['M'],
	// 		},
	// 	],
	// },
	{
		id: 4,
		label: 'Agent',
		grade: ['M'],
		children: [
			{
				id: 1,
				label: 'Agent Management',
				path: PATHS.AGENT,
				icon: IconUserCircle,
				grade: ['M'],
			},
			{
				id: 2,
				label: 'Grade',
				path: PATHS.GRADE,
				icon: IconCircleLetterG,
				grade: ['M'],
			},
		],
	},
	// {
	// 	id: 5,
	// 	label: 'Package',
	// 	grade: ['M', 'A'],
	// 	children: [
	// 		{
	// 			id: 1,
	// 			label: 'Package Details',
	// 			path: PATHS.PACKAGE,
	// 			icon: IconPackage,
	// 			grade: ['M', 'A'],
	// 		},
	// 	],
	// },
	{
		id: 6,
		label: 'My Information',
		grade: ['M', 'A'],
		children: [
			{
				id: 1,
				label: 'Change Password',
				path: PATHS.PASSWORD,
				icon: IconPassword,
				grade: ['M', 'A'],
			},
			{
				id: 2,
				label: 'Logout',
				path: '/logout',
				icon: IconLogout,
				grade: ['M', 'A'],
			},
		],
	},
];
