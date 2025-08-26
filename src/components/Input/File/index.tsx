/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { FC, useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useModal } from '@shared/hooks';

import * as S from './styled';
import { isEmpty, isNil, isUndefined, last } from 'lodash-es';
import Image from '@components/Image';
import { PreviewImageSchema } from '@typings/schema';

interface IProps {
	multiple?: boolean;
	id: string;
	name?: string;
	label?: string;
	selectedFile: PreviewImageSchema[] | null;
	handleUpload: (file: FileList) => void;
	removeTargetFile: (name: string, type: 'new' | 'old', fileId?: number) => void;
	register?: UseFormRegister<any>;

	width?: number;
	height?: number;

	//
	required?: boolean;

	accept?: string;
}

const InputFileForm: FC<IProps> = ({
	multiple = false,
	id,
	name,
	label,
	selectedFile,
	handleUpload,
	removeTargetFile,
	register,

	width,
	height,

	//

	required = false,

	accept = '',
}) => {
	/**
	 * States
	 */
	const { failAlert } = useModal();

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const { files } = e.target;
		if (files && files.length) {
			handleUpload(files);
		} else failAlert('Please select files');
	};

	/**
	 * Helpers
	 */
	const isFileName = () => {
		return selectedFile && selectedFile.length ? `${selectedFile.length} Files` : 'No Files Selected';
	};

	const isRegister = useMemo(
		() =>
			register &&
			name && {
				...register(
					name,
					{
						onChange: (e) => {
							handleChangeFile(e);
						},
					} || {},
				),
			},
		[register, name],
	);

	return (
		<S.FileSection>
			{label && <S.Label $required={required}>{label}</S.Label>}

			<S.FileBox $width={width} $height={height}>
				<S.FileLabel htmlFor={id}>Select File</S.FileLabel>
				<S.FileText $isActive={!!selectedFile}>{isFileName()}</S.FileText>
			</S.FileBox>

			<S.FileInput
				{...isRegister}
				type="file"
				id={id}
				accept={accept}
				multiple={multiple}
				onChange={(e) => handleChangeFile(e)}
			/>

			{!isNil(selectedFile) && !isEmpty(selectedFile) && (
				<S.FileList>
					{Array.from(selectedFile).map((file) => {
						const { id: fileId, lastModified, filename, imgUri } = file;
						const isNewFile = isUndefined(fileId);

						const key = isNewFile ? `${name}_${lastModified}` : fileId;

						// console.log('FILE', file);

						return (
							<S.FileItem key={key}>
								<img src={imgUri} alt="Attached Image" />

								<S.FlexRow>
									<S.FileItemText>{filename}</S.FileItemText>
									<S.FileItemCloseBox>
										<Image
											src="ic_close.webp"
											onClick={() => removeTargetFile(filename, isNewFile ? 'new' : 'old', fileId)}
										/>
									</S.FileItemCloseBox>
								</S.FlexRow>
							</S.FileItem>
						);
					})}
				</S.FileList>
			)}
		</S.FileSection>
	);
};

export default InputFileForm;
