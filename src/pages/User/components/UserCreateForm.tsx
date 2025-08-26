import Title from '@components/Title';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import { TextArea, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { VALIDATION_MESSAGE } from '@shared/constants';

import Blank from '@components/Blank';
import { useModal } from '@shared/hooks';
import { successToast } from '@shared/utils/toastUtils';
import { BoardListSchema, PreviewImageSchema } from '@typings/schema';
import { isUndefined } from 'lodash-es';
import { useCreateBoardFORM, useUpdateBoardFORM } from '@shared/hooks/queries/board';
import InputFileForm from '@components/Input/File';
import Loader from '@components/Loader';
import useMe from '@shared/hooks/useMe';
import { useDropzone } from 'react-dropzone';
import * as S from '../styled';

interface Props {
	needCreateForm: boolean;
	editTarget?: BoardListSchema;
	refetch: () => void;
}

interface IFormValues {
	title: string;
	content: string;
	files: any;
}

const UserCreateForm: FC<Props> = ({ needCreateForm, editTarget, refetch }) => {
	/**
	 * States
	 */

	const { managerId } = useMe();
	const {
		formState: { errors },
		register,
		setValue,
		handleSubmit,
		watch,
	} = useForm<IFormValues>();

	const { failAlert } = useModal();
	const [savedFiles, setSavedFiles] = useState<PreviewImageSchema[]>([]);
	const [uploadTargetFiles, setUploadTargetFiles] = useState<PreviewImageSchema[]>([]);
	const watchFiles = watch('files');

	const handleFile = (files: File[]) => {
		if (files?.length) {
			files.forEach((file) => {
				if (file.type.startsWith('image/')) {
					const reader = new FileReader();
					reader.onloadend = () => {
						setUploadTargetFiles((prev) => {
							const newFile = {
								filename: file.name,
								imgUri: reader.result as string,

								lastModified: file.lastModified,
							};

							return [...prev, newFile];
						});
					};
					reader.readAsDataURL(file);
				}
			});

			const prevFiles = watchFiles;
			setValue('files', [...prevFiles, ...files]);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleFile,
		noClick: true,
		accept: {
			'image/jpeg': [],
			'image/png': [],
		},
		multiple: true, // Set to true if you want to accept multiple files
	});

	/**
	 * Queries
	 */

	const { mutate: createBoard, isLoading: isLoadingCreate } = useCreateBoardFORM();
	const { mutate: updateBoard, isLoading: isLoadingUpdate } = useUpdateBoardFORM();

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (isUndefined(editTarget)) return;

		const { title, content, boardItems } = editTarget;

		setValue('title', title);
		setValue('content', content);

		const imageFiles = boardItems.map(({ id, filename }) => ({ id, filename, imgUri: '' }));
		setSavedFiles(imageFiles);
	}, [editTarget]);

	/**
	 * Handlers
	 */

	const removeTargetFile = (targetName: string, type: 'new' | 'old') => {
		if (type === 'new') {
			const prevFiles = watchFiles;

			setValue(
				'files',
				prevFiles?.filter((file: File) => file.name !== targetName),
			);

			setUploadTargetFiles((prev) => {
				return prev.filter((file) => file.filename !== targetName);
			});
		}
		//
		else {
			setSavedFiles((prev) => {
				return prev.filter((file) => file.filename !== targetName);
			});
		}
	};

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { title, content, files } = data;

		if (isUndefined(managerId)) {
			return failAlert('관리자 정보를 찾을 수 없습니다.');
		}

		const payload = {
			type: 'A',
			title,
			content,
			userId: 1,
			managerId,
			files,
		};

		if (isUndefined(editTarget)) {
			createBoard(payload, {
				onSuccess: () => {
					successToast('공지사항이 등록되었습니다.');
					refetch();
				},
				onError: () => {
					failAlert('공지사항 등록에 실패했습니다.');
				},
			});
		} else {
			updateBoard(
				{ ...payload, id: editTarget.id, savedFileNames: savedFiles.map((o) => o.filename).join(',') },
				{
					onSuccess: () => {
						successToast('공지사항이 Edit되었습니다.');
						refetch();
					},
					onError: () => {
						failAlert('공지사항 Edit에 실패했습니다.');
					},
				},
			);
		}
	};

	/**
	 * Helpers
	 */

	if (!needCreateForm) return null;

	return (
		<>
			<Blank size={60} />
			<Title title="유저 추가/Edit" desc="유저를 추가, Edit할 수 있습니다.">
				<Button text="Collapse" status="third" width={120} onClick={refetch} />
			</Title>
			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				<S.DropZone {...getRootProps()}>
					<input {...getInputProps()} />
				</S.DropZone>

				{/*  */}

				<Free.Row>
					<Free.Value>
						<TextField
							label="제목"
							name="title"
							placeholder="제목을 입력해주세요."
							register={register}
							errors={errors}
							error={!!errors.title}
							options={{ required: VALIDATION_MESSAGE.title.required }}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value>
						<TextArea
							label="Details내용"
							name="content"
							placeholder="Details내용을 입력해주세요."
							register={register}
							errors={errors}
							error={!!errors.content}
							options={{ required: VALIDATION_MESSAGE.content.required }}
							height={180}
							style={{ zIndex: 10 }}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value $width={100}>
						<InputFileForm
							multiple
							id="notice-assets-upload"
							name="files"
							label="첨부파일"
							selectedFile={[...savedFiles, ...uploadTargetFiles]}
							handleUpload={(fileList: FileList) => {
								const files = [...Array.from(fileList)];
								handleFile(files);
							}}
							removeTargetFile={removeTargetFile}
							register={register}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button style={{ zIndex: 10 }} type="submit" status="primary" text="등록" />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}

			<Loader isFetching={isLoadingCreate || isLoadingUpdate} />
		</>
	);
};

export default UserCreateForm;
