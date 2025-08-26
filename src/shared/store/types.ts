// 얼럿 타입
export interface IAlertParam {
	needCloseButton?: boolean;
	needOKButton?: boolean;
	onAfterClose?: any;
	disabled?: boolean;
	containerStyle?: any;
	children?: JSX.Element;

	//

	message?: string;
	type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'none';

	//
	show?: boolean;
}

//
//

// 컨펌 타입
export interface IConfirmParam {
	message?: string;
	type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'none';
	okHandler?: any;
	//
	show?: boolean;
}

export interface IFreeModalParam {
	needCloseButton?: boolean;
	needOKButton?: boolean;
	onAfterClose?: any;
	children?: JSX.Element;
	//
	disabled?: boolean;
	containerStyle?: any;

	//
	show?: boolean;
}
export interface AlertStore extends IAlertParam {
	dispatchOpenAlert: (alertInfo: IAlertParam) => void;
	dispatchCloseAlert: () => void;
}

export interface ConfirmStore extends IConfirmParam {
	dispatchOpenConfirm: (confirmInfo: IConfirmParam) => void;
	dispatchCloseConfirm: () => void;
}

export interface FreeModalStore extends IFreeModalParam {
	dispatchOpenFreeModal: (alertInfo: IAlertParam) => void;
	dispatchCloseFreeModal: () => void;
}

export interface TopRefStore {
	root: HTMLDivElement | null;
	dispatchAddTopRef: (ref: HTMLDivElement) => void;
	dispatchRemoveTopRef: () => void;
}

export interface ItemSearchStore {
	itemId: number;
	dispatchItemId: (itemId: number) => void;
}
