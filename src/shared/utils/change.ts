export const onChangeHandler = (
	ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
	stateFunction: React.Dispatch<React.SetStateAction<any | undefined>>,
) => {
	const {
		target: { value, name },
	} = ev;
	stateFunction((prev: any) => ({
		...prev,
		[name]: value,
	}));
};
