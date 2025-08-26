import React, { FC, useEffect, useRef, useState } from 'react';
import Title from '@components/Title';
import Free from '@styles/FreeTable';
import { CheckBox, Radio, TextArea, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { itemTypes, VALIDATION_MESSAGE } from '@shared/constants';
import Blank from '@components/Blank';
import { useModal } from '@shared/hooks';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { ItemSchema, PreviewImageSchema } from '@typings/schema';
import { forOwn, isEmpty, isUndefined } from 'lodash-es';
import { usePostItemFORM, usePutItemFORM } from '@shared/hooks/queries/item';
import InputFileForm from '@components/Input/File';
import Loader from '@components/Loader';
import useMe from '@shared/hooks/useMe';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import { TIMELINE_JOIN_KEY, getItemImg, unit } from '@shared/utils/base';
import { handleGetLatLng } from '@shared/utils/address';
import { FreeModal, IModal } from '@components/Modal';
import ImageSelectModal from '@components/ImageSelectModal';
import Select from '@components/Select';
import { safeJsonParse } from '@shared/utils/json';
import { useGetGradeList } from '@shared/hooks/queries/grade';
import CheckWrapper from '@components/Input/Check/CheckWrapper';

interface Props {
	needCreateForm: boolean;
	editTarget?: ItemSchema;
	refetch: () => void;
}

interface IFormValues {
	nameKor: string;
	nameEng: string;
	enable: string;
	price: number;
	address: string;
	addressEnglish: string;
	description: string;
	thumbnail: any;
	details: any;
	keyword: string;
	websiteLink: string;
	personalTag: string;
}

const PlaceCreateForm: FC<Props> = ({ needCreateForm, editTarget, refetch }) => {
	/**
	 * States
	 */
	const imgSelectModal = useRef<IModal>(null);

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

	const { failAlert } = useModal();
	const [savedFiles, setSavedFiles] = useState<PreviewImageSchema[]>([]);
	const [uploadTargetFiles, setUploadTargetFiles] = useState<PreviewImageSchema[]>([]);

	const [savedDetailImgFiles, setSavedDetailImgFiles] = useState<PreviewImageSchema[]>([]);
	const [uploadDetailFiles, setUploadDetailFiles] = useState<PreviewImageSchema[]>([]);
	const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
	const [priceArray, setPriceArray] = useState<string[]>(['']);
	const [modalImg, setModalImg] = useState<any>();
	const [checkedGrade, setCheckedGrade] = useState<string[]>([]);

	const watchEnable = watch('enable');
	const watchThumbnail = watch('thumbnail');
	const watchDetails = watch('details');
	const watchAddress = watch('address');

	/**
	 * Queries
	 */
	const { data: grade } = useGetGradeList();

	const { mutate: postItem, isLoading: isLoadingCreate } = usePostItemFORM();
	const { mutate: putItem, isLoading: isLoadingUpdate } = usePutItemFORM();

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (isUndefined(editTarget)) return;
		const {
			address,
			description,
			enable,
			id,
			nameEng,
			nameKor,
			price,
			files,
			pricePolicy,
			keyword,
			addressEnglish,
			websiteLink,
			personalTag,
			type,
		} = editTarget;
		setValue('address', address);
		setValue('addressEnglish', addressEnglish);
		setValue('description', description);
		setValue('nameEng', nameEng);
		setValue('nameKor', nameKor);
		setValue('enable', enable ? 'Exposed' : 'Hidden');
		setValue('price', price);
		setValue('keyword', keyword);
		setValue('websiteLink', websiteLink ?? '');
		setValue('personalTag', personalTag ?? '');

		const thumbnail = files.find((item) => item.type === '썸네일');
		const details = files.filter((item) => item.type !== '썸네일');
		const detailFiles = details.map(({ id: fileId, itemSrc }) => ({
			id: fileId,
			filename: itemSrc,
			imgUri: getItemImg(itemSrc),
		}));
		setSavedFiles([{ id: thumbnail?.id, filename: thumbnail?.itemSrc ?? '', imgUri: getItemImg(thumbnail?.itemSrc) }]);
		setSavedDetailImgFiles(detailFiles);

		const splitPrice = pricePolicy?.split(TIMELINE_JOIN_KEY);
		if (splitPrice?.length) {
			setPriceArray(splitPrice);
		} else {
			setPriceArray(['']);
		}
	}, [editTarget]);

	useEffect(() => {
		if (isUndefined(editTarget)) return;
		const { grade: itemGrade } = editTarget;

		setCheckedGrade(itemGrade === 'ALL' ? grade?.map((item) => item.grade) ?? [] : itemGrade?.split(','));
	}, [editTarget, grade]);

	useEffect(() => {
		if (!modalImg) {
			return;
		}

		handleThumbnailFile(Array.from(modalImg));
	}, [modalImg]);

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

	const removeDetailsFile = (targetName: string, type: 'new' | 'old', fileId?: number) => {
		if (type === 'new') {
			const prevFiles = watchDetails;

			setValue(
				'details',
				prevFiles?.filter((file: File) => file.name !== targetName),
			);

			setUploadDetailFiles((prev) => {
				return prev.filter((file) => file.filename !== targetName);
			});
		} else {
			setSavedDetailImgFiles((prev) => {
				return prev.filter((file) => file.filename !== targetName);
			});
		}

		if (fileId) {
			setDeletedFileIds((prev) => [...prev, fileId]);
		}
	};

	const onSubmit: SubmitHandler<IFormValues> = async (data) => {
		const {
			address,
			description,
			enable,
			nameEng,
			nameKor,
			price,
			details,
			thumbnail,
			keyword,
			addressEnglish,
			websiteLink,
			personalTag,
		} = data;

		const hasEmptyValue = priceArray.some((value) => value === '');
		if (priceArray.length !== 1 && hasEmptyValue) {
			errorToast('빈 Price을 채워주세요.');
			return;
		}

		if (!editTarget && isEmpty(thumbnail)) {
			errorToast('Main Image를 등록해주세요.');
			return;
		}

		// if (isUndefined(managerId)) {
		// 	return failAlert('관리자 정보를 찾을 수 없습니다.');
		// }

		const latlng = await handleGetLatLng(watchAddress);

		if (!latlng) {
			errorToast('Address 찾기에 실패하였습니다.');
			return;
		}

		const payload = {
			address,
			description,
			nameEng,
			nameKor,
			price,
			type: '여행지',
			keyword,
			addressEnglish,
			pricePolicy: priceArray.join(TIMELINE_JOIN_KEY),
			websiteLink,
			personalTag,
			...latlng,
		};

		const formData = new FormData();

		forOwn(payload, (value, key) => {
			formData.append(key, value?.toString());
		});

		if (!isEmpty(thumbnail)) {
			thumbnail?.forEach((item: any) => formData.append('thumbnail', item));
		}

		if (!isEmpty(details)) {
			details?.forEach((item: any) => formData.append('details', item));
		}

		if (editTarget && uploadTargetFiles.length) {
			const prevThumbnails = editTarget.files.find((item) => item.type === '썸네일');
			formData.append('deleteFileIds', prevThumbnails?.id.toString() as any);
		}

		if (deletedFileIds.length && editTarget) {
			deletedFileIds?.forEach((id) => formData.append('deleteFileIds', id.toString()));
		}

		formData.append('grade', checkedGrade.length === grade?.length ? 'ALL' : checkedGrade?.join(',') ?? '');

		if (isUndefined(editTarget)) {
			postItem(formData, {
				onSuccess: () => {
					successToast('The product has been added.');
					refetch();
				},
				onError: () => {
					failAlert('Failed to add the product.');
				},
			});
		} else {
			formData.append('enable', `${enable === 'Exposed'}`);
			formData.append('id', editTarget.id.toString());

			putItem(formData, {
				onSuccess: () => {
					successToast('The product has been updated.');
					refetch();
				},
				onError: () => {
					failAlert('Failed to update the product.');
				},
			});
		}
	};

	const handlePostcode = () => {
		new window.daum.Postcode({
			oncomplete: (data: any) => {
				setValue('address', data?.jibunAddress || data?.roadAddress);
				setValue('addressEnglish', data?.jibunAddressEnglish || data?.roadAddressEnglish);
			},
		}).open();
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

	const handleDetailsFile = (files: File[]) => {
		if (files?.length) {
			files?.forEach((file) => {
				if (file.type.startsWith('image/')) {
					const reader = new FileReader();
					reader.onloadend = () => {
						setUploadDetailFiles((prev) => {
							const newFile = {
								filename: file.name,
								imgUri: reader.result as string,

								lastModified: file.lastModified,
							};

							if (prev.length) {
								return [...prev, newFile];
							}
							return [newFile];
						});
					};
					reader.readAsDataURL(file);
				}
			});

			const prevFiles = watchDetails;

			if (watchDetails?.length) {
				setValue('details', [...prevFiles, ...files]);
			} else {
				setValue('details', files);
			}
		}
	};

	const modalOpen = () => imgSelectModal.current?.open();
	const modalClose = () => imgSelectModal.current?.close();

	/**
	 * Helpers
	 */

	if (!needCreateForm) return null;

	return (
		<>
			<Blank size={20} />
			<Title title="Add/Edit Place" desc="You can add or edit places.">
				{/* <Button text="Collapse" status="third" width={120} onClick={refetch} /> */}
			</Title>
			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				{/*  */}

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
							label="Place Name(Korean)"
							name="nameKor"
							placeholder="Please enter the place name in Korean."
							register={register}
							errors={errors}
							error={!!errors.nameKor}
							options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Place Name(English)"
							name="nameEng"
							placeholder="Please enter the place name in English."
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
							label="Address"
							name="addressEnglish"
							placeholder="Please enter the Address."
							register={register}
							errors={errors}
							error={!!errors.address}
							options={{ required: VALIDATION_MESSAGE.address.required }}
							onClick={handlePostcode}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={50}>
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
					<Free.Value $width={50}>
						<TextArea
							label="Keyword"
							name="keyword"
							placeholder="Please enter the keyword."
							register={register}
							// errors={errors}
							// error={!!errors.keyword}
							// options={{ required: VALIDATION_MESSAGE.keyword.required }}
							height={100}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={33}>
						<CheckWrapper label="Grade">
							<CheckBox
								isChecked={checkedGrade.length === grade?.length}
								checkHandler={() => {
									if (checkedGrade.length) {
										setCheckedGrade([]);
									} else {
										setCheckedGrade(grade?.map((item) => item.grade) ?? []);
									}
								}}
								label="ALL"
							/>
							{grade?.map((item) => {
								return (
									<CheckBox
										key={item.id}
										isChecked={checkedGrade.includes(item.grade)}
										checkHandler={() => {
											setCheckedGrade((prev) => {
												if (prev.includes(item.grade)) {
													// 이미 포함되어 있다면 제거
													return prev.filter((g) => g !== item.grade);
												}
												// 포함되어 있지 않다면 추가
												return [...prev, item.grade];
											});
										}}
										label={item.grade}
									/>
								);
							})}
						</CheckWrapper>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={30} style={{ position: 'relative' }}>
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
						<Button
							style={{
								position: 'absolute',
								right: unit(-130),
								bottom: unit(10),
							}}
							type="button"
							status="primary"
							text="Fetch the image"
							onClick={modalOpen}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={30}>
						<InputFileForm
							multiple
							id="detail-assets-upload"
							name="details"
							label="Detail Image"
							selectedFile={[...savedDetailImgFiles, ...uploadDetailFiles]}
							handleUpload={(fileList: FileList) => {
								const files = [...Array.from(fileList)];
								handleDetailsFile(files);
							}}
							removeTargetFile={removeDetailsFile}
							register={register}
						/>
					</Free.Value>
				</Free.Row>

				{priceArray.map((item, idx) => {
					const isDefaultPrice = idx === 0;

					return (
						<Free.Row key={idx}>
							<Free.Value $width={30} style={{ position: 'relative' }}>
								<TextField
									label={`Price per person for ${idx + 1} ${idx === 0 ? 'person' : 'people'} `}
									name="personPrice"
									placeholder={`Price per person for ${idx + 1} ${idx === 0 ? 'person' : 'people'} (excluding units)`}
									needValue
									value={item}
									onChange={(e) => {
										const newPrice = e.target.value;
										setPriceArray((prev) => {
											const updatedPrices = [...prev];
											updatedPrices[idx] = newPrice;
											return updatedPrices;
										});
									}}
								/>

								<Button
									style={{
										position: 'absolute',
										right: unit(-130),
										bottom: unit(5),
									}}
									type="button"
									status={isDefaultPrice ? 'primary' : 'fifth_outlined'}
									text={isDefaultPrice ? 'Add' : 'Delete'}
									onClick={() => {
										setPriceArray((prev) => {
											if (!isDefaultPrice) {
												const filtered = prev.filter((_, index) => idx !== index);
												return filtered;
											}
											return [...prev, ''];
										});
									}}
								/>
							</Free.Value>
						</Free.Row>
					);
				})}

				<Free.Row>
					<Free.Value $width={50}>
						<TextField
							label="WebsiteLink"
							name="websiteLink"
							placeholder="Please enter the WebsiteLink."
							register={register}
							// errors={errors}
							// error={!!errors.websiteLink}
							// options={{ required: VALIDATION_MESSAGE.websiteLink.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Personal Tag"
							name="personalTag"
							placeholder="Please enter the personal Tag."
							register={register}
							// errors={errors}
							// error={!!errors.price}
							// options={{ required: VALIDATION_MESSAGE.price.required }}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button style={{ zIndex: 10 }} type="submit" status="primary" text={editTarget ? 'Edit' : 'Add'} />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}

			<FreeModal ref={imgSelectModal} needCloseButton>
				<ImageSelectModal setImg={setModalImg} close={modalClose} />
			</FreeModal>

			<Loader isFetching={isLoadingCreate || isLoadingUpdate} />
		</>
	);
};

export default PlaceCreateForm;
