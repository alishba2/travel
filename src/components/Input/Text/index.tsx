import React, { FC, HTMLInputTypeAttribute, useMemo } from 'react';
import { FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form';

import * as S from './styled';
import { ErrorMessage } from '@hookform/error-message';
import { isUndefined } from 'lodash-es';

interface TextFieldProps {
	label?: string;
	name: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	width?: number;
	height?: number;
	autoComplete?: string;

	register?: UseFormRegister<any>;
	options?: RegisterOptions<any>;
	error?: boolean;
	errors?: FieldErrors<any>;

	//

	disabled?: boolean;
	maxLength?: number;
	inputMode?: 'email' | 'search' | 'text' | 'tel' | 'url' | 'numeric' | 'none' | 'decimal' | undefined;

	onClick?: () => void;
	onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;

	onCompositionStart?: React.CompositionEventHandler<HTMLInputElement> | undefined;
	onCompositionEnd?: React.CompositionEventHandler<HTMLInputElement> | undefined;
	value?: string;
	onChange?: (e: any) => void;
	needValue?: boolean;
}

const Textfield: FC<TextFieldProps> = ({
	label,
	name,
	placeholder,
	type = 'text',
	register,
	options,
	error,
	errors,
	width,
	height = 45,
	onClick,
	//

	disabled,
	maxLength,
	inputMode,
	autoComplete,

	onFocus,
	onKeyDown,
	onCompositionStart,
	onCompositionEnd,
	value,
	onChange,
	needValue = false,
}) => {
	/**
	 * States
	 */

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	/**
	 * Helpers
	 */

	const isRegister = useMemo(() => name && register && { ...register(name, options) }, [name, options, register]);

	return (
		<S.Article>
			<S.Container>
				{label && <S.Label $required={!isUndefined(options?.required)}>{label}</S.Label>}

				{needValue ? (
					<S.Input
						type={type}
						{...isRegister}
						$isError={error}
						$width={width}
						$height={height}
						disabled={disabled}
						placeholder={placeholder}
						inputMode={inputMode}
						maxLength={maxLength}
						onKeyDown={onKeyDown}
						onFocus={onFocus}
						autoComplete={autoComplete}
						onCompositionStart={onCompositionStart}
						onCompositionEnd={onCompositionEnd}
						onClick={onClick}
						readOnly={name === 'address'}
						value={value}
						onChange={onChange}
					/>
				) : (
					<S.Input
						type={type}
						{...isRegister}
						$isError={error}
						$width={width}
						$height={height}
						disabled={disabled}
						placeholder={placeholder}
						inputMode={inputMode}
						maxLength={maxLength}
						autoComplete={autoComplete}
						onKeyDown={onKeyDown}
						onFocus={onFocus}
						onCompositionStart={onCompositionStart}
						onCompositionEnd={onCompositionEnd}
						onClick={onClick}
						readOnly={name === 'address'}
						// value={value}
						// onChange={onChange}
					/>
				)}
			</S.Container>

			{error && (
				<S.ValidErrorP>
					<ErrorMessage errors={errors} name={name} />
				</S.ValidErrorP>
			)}
		</S.Article>
	);
};

export default Textfield;
