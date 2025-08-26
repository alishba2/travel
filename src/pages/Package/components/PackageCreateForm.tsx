import React, { FC, useEffect, useState } from 'react';
import Title from '@components/Title';
import Free from '@styles/FreeTable';
import { Radio, TextArea, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { VALIDATION_MESSAGE } from '@shared/constants';
import Blank from '@components/Blank';
import { useModal } from '@shared/hooks';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { ItemSchema, PackageSchema, PreviewImageSchema } from '@typings/schema';
import { forOwn, isEmpty, isUndefined } from 'lodash-es';
import InputFileForm from '@components/Input/File';
import Loader from '@components/Loader';
import useMe from '@shared/hooks/useMe';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import { getItemImg, getPackageImg } from '@shared/utils/base';
import { PostPackagePayload } from '@typings/payload';
import { usePostPackageFORM, usePutPackageFORM } from '@shared/hooks/queries/package';

interface Props {
	needCreateForm: boolean;
	editTarget?: PackageSchema;
	refetch: () => void;
}

interface IFormValues {
	nameKor: string;
	nameEng: string;
	enable: string;
	price: number;
	description: string;
	thumbnail: any;
	salesStart: string;
	salesEnd: string;
}

const PackageCreateForm: FC<Props> = ({ needCreateForm, editTarget, refetch }) => {
	/**
	 * States
	 */

	const { managerId } = useMe();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<IFormValues>({
		defaultValues: {
			enable: 'Exposed',
		},
	});

	const [savedFiles, setSavedFiles] = useState<PreviewImageSchema[]>([]);
	const [uploadTargetFiles, setUploadTargetFiles] = useState<PreviewImageSchema[]>([]);
	const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

	const watchEnable = watch('enable');
	const watchThumbnail = watch('thumbnail');

	const { failAlert } = useModal();

	/**
	 * Queries
	 */

	const { mutate: postPackage, isLoading: isLoadingCreate } = usePostPackageFORM();
	const { mutate: putPackage, isLoading: isLoadingUpdate } = usePutPackageFORM();

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (isUndefined(editTarget)) return;

		const { thumbnail, salesEnd, salesStart, title, totalPrice, valid, titleEng, description, enable } = editTarget;

		setValue('description', description);
		setValue('salesEnd', salesEnd);
		setValue('salesStart', salesStart);
		setValue('nameKor', title);
		setValue('nameEng', titleEng);
		setValue('price', totalPrice);
		setValue('enable', enable ? 'Exposed' : 'Hidden');

		setSavedFiles([{ id: 1, filename: thumbnail, imgUri: getPackageImg(thumbnail) }]);
	}, [editTarget]);

	/**
	 * Handlers
	 */

	const removeTargetFile = (targetName: string, type: 'new' | 'old', fileId?: number) => {
		if (type === 'new') {
			const prevFiles = watchThumbnail;

			setValue(
				'thumbnail',
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

		if (fileId) {
			setDeletedFileIds((prev) => [...prev, fileId]);
		}
	};

	const handleThumbnailFile = (files: File[]) => {
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

							return [newFile];
						});
					};
					reader.readAsDataURL(file);
				}
			});

			setValue('thumbnail', files);
		}
	};

	console.log('uploadTargetFilesuploadTargetFiles', uploadTargetFiles);

	const onSubmit: SubmitHandler<IFormValues> = async (data) => {
		console.log(data);
		const { description, enable, nameEng, nameKor, price, thumbnail, salesEnd, salesStart } = data;

		// if (isUndefined(managerId)) {
		// 	return failAlert('관리자 정보를 찾을 수 없습니다.');
		// }

		if (!editTarget && isEmpty(thumbnail)) {
			errorToast('Please add a main image.');
			return;
		}

		const payload: PostPackagePayload = {
			salesEnd,
			salesStart,
			title: nameKor,
			titleEng: nameEng,
			description,
			totalPrice: price,
		};

		const formData = new FormData();

		forOwn(payload, (value, key) => {
			if (value) {
				formData.append(key, value?.toString());
			}
		});

		if (!isEmpty(thumbnail)) {
			thumbnail?.forEach((item: any) => formData.append('thumbnail', item));
		}

		if (isUndefined(editTarget)) {
			postPackage(formData, {
				onSuccess: () => {
					successToast('Added Successfully.');
					refetch();
				},
				onError: () => {
					failAlert('Failed to add the package.');
				},
			});
		} else {
			formData.append('enable', `${enable === 'Exposed'}`);
			formData.append('id', editTarget.id.toString());

			putPackage(formData, {
				onSuccess: () => {
					successToast('The package has been updated.');
					refetch();
				},
				onError: () => {
					failAlert('Failed to update the package.');
				},
			});
		}
	};

	/**
	 * Helpers
	 */

	if (!needCreateForm) return null;

	return (
		<>
			<Blank size={60} />
			<Title title="Add/Edit Package" desc="You can add or edit the package.">
				{/* <Button text="Collapse" status="third" width={120} onClick={refetch} /> */}
			</Title>
			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					{editTarget && (
						<Free.Value>
							<RadioWrapper label="Exposed">
								<Radio
									name="enable"
									label="Exposed"
									register={register}
									value="Exposed"
									checked={watchEnable === 'Exposed'}
								/>
								<Radio
									name="enable"
									label="Hidden"
									register={register}
									value="Hidden"
									checked={watchEnable === 'Hidden'}
								/>
							</RadioWrapper>
						</Free.Value>
					)}
					<Free.Value>
						<TextField
							label="Package Name(Korean)"
							name="nameKor"
							placeholder="Please enter the package name in Korean."
							register={register}
							errors={errors}
							error={!!errors.nameKor}
							options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Package Name(English)"
							name="nameEng"
							placeholder="Please enter the package name in English."
							register={register}
							errors={errors}
							error={!!errors.nameEng}
							options={{ required: VALIDATION_MESSAGE.nameEng.required }}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value>
						<TextField
							label="Price"
							name="price"
							placeholder="Please enter the price."
							register={register}
							errors={errors}
							error={!!errors.price}
							options={{ required: VALIDATION_MESSAGE.price.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Sales Start Date"
							name="salesStart"
							placeholder="Please enter the sales start date."
							register={register}
							errors={errors}
							error={!!errors.salesStart}
							options={{ required: VALIDATION_MESSAGE.salesStartDate.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Sales End Date"
							name="salesEnd"
							placeholder="Please enter the sales end date."
							register={register}
							errors={errors}
							error={!!errors.price}
							options={{ required: VALIDATION_MESSAGE.salesEndDate.required }}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value>
						<TextArea
							label="Description"
							name="description"
							placeholder="Please enter the description."
							register={register}
							errors={errors}
							error={!!errors.description}
							options={{ required: VALIDATION_MESSAGE.description.required }}
							height={100}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value $width={100}>
						<InputFileForm
							required
							id="main-assets-upload"
							name="thumbnail"
							label="Main Image"
							selectedFile={isEmpty(uploadTargetFiles) ? savedFiles : uploadTargetFiles}
							handleUpload={(fileList: FileList) => {
								const files = [...Array.from(fileList)];
								handleThumbnailFile(files);
							}}
							removeTargetFile={removeTargetFile}
							register={register}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button style={{ zIndex: 10 }} type="submit" status="primary" text="Add" />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}

			<Loader isFetching={isLoadingCreate || isLoadingUpdate} />
		</>
	);
};

export default PackageCreateForm;
