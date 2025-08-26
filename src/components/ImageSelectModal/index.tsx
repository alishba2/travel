import React, { FC, useState, useEffect, useRef } from 'react';
import Free from '@styles/FreeTable';
import * as S from './styled';
import { Radio, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isEmpty } from 'lodash-es';
import { GetItemFileSearchPayload } from '@typings/payload';
import Button from '@components/Button';
import { useGetItemFileSearch } from '@shared/hooks/queries/item';
import EmptyResult from '@components/EmptyResult';
import { CustomSetState } from '@typings/base';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import { errorToast } from '@shared/utils/toastUtils';
import { getItemImg } from '@shared/utils/base';

interface IProps {
	setImg: CustomSetState<any>;
	close: () => void;
}

interface IFormValues {
	keyword: string;
	type: string;
}

const COUNT_PER_PAGE = 30;

const ImageSelectModal: FC<IProps> = ({ setImg, close }) => {
	/**
	 * States
	 */

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IFormValues>({
		defaultValues: {
			type: 'local',
		},
	});

	const [searchPayload, setSearchPayload] = useState<GetItemFileSearchPayload>({
		page: 1,
		countPerPage: COUNT_PER_PAGE,
		type: 'local',
	});

	const watchType = watch('type');
	/**
	 * Queries
	 */

	const { data: files } = useGetItemFileSearch(searchPayload);

	const [fileList, totalCount] = files ?? [[], 0];

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { keyword, type } = data;

		if (!keyword) {
			errorToast('Please enter a search keyword.');
			return;
		}

		setSearchPayload({ page: 1, countPerPage: COUNT_PER_PAGE, keyword, type });
	};

	const onClickImg = async (file: any) => {
		const isHaveHttps = file?.itemSrc?.includes('https');
		const convertSrc = isHaveHttps ? file?.itemSrc : getItemImg(file?.itemSrc);

		const image = document.createElement('img');
		image.crossOrigin = 'Anonymous';
		image.src = convertSrc;

		image.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx: any = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0);
			canvas.toBlob((blob: any) => {
				const data = new File([blob], 'image.jpg', { type: 'image/jpeg' });
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(data);
				setImg(dataTransfer.files);
			}, 'image/jpeg');
		};

		close();
	};

	/**
	 * Helpers
	 */

	return (
		<>
			<S.Container>
				<Free.SearchTable $isOverflowVisible onSubmit={handleSubmit(onSubmit)}>
					<Free.Row>
						<Free.Value $width={50}>
							<RadioWrapper label="Type">
								{['local', 'unsplash'].map((item) => {
									return (
										<Radio
											name="type"
											key={item}
											label={item}
											register={register}
											value={item}
											checked={watchType === item}
										/>
									);
								})}
							</RadioWrapper>
						</Free.Value>
					</Free.Row>
					<Free.Row style={{ position: 'relative' }}>
						<Free.Value $width={50}>
							<TextField
								label="Search Travel Products"
								name="keyword"
								placeholder="Please enter the travel product name."
								register={register}
								autoComplete="off"
							/>
						</Free.Value>

						<Button type="submit" status="primary" text="search" />
					</Free.Row>
				</Free.SearchTable>

				{!isEmpty(fileList) ? (
					<S.SearchResult>
						{fileList.map((file) => {
							return (
								<S.FileBox
									key={file.id}
									onClick={() => {
										onClickImg(file);
									}}
								>
									<S.FileImgFigure $src={file?.itemSrc} $isHaveHttps={file?.itemSrc?.includes('https')} />
									<S.ItemName>{file.item.nameEng}</S.ItemName>
								</S.FileBox>
							);
						})}
					</S.SearchResult>
				) : (
					<EmptyResult items={fileList} />
				)}
			</S.Container>
		</>
	);
};

export default ImageSelectModal;
