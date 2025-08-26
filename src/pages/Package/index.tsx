import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import * as S from './styled';
import { Radio, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { GetBoardListPayload, GetPackageListPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import PackageCreateForm from './components/PackageCreateForm';
import { getYmd } from '@shared/utils/dayUtils';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BoardListSchema, PackageSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import { useDeleteBoard, useGetBoardList } from '@shared/hooks/queries/board';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';
import { comma, getPackageImg } from '@shared/utils/base';
import { useDeletePackage, useGetPackageList, usePutPackageFORM } from '@shared/hooks/queries/package';
import { isUndefined } from 'lodash-es';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import Select from '@components/Select';
import useAgentList from '@shared/hooks/useAgentList';

interface IFormValues {
	title: string;
	agent: string;
	// totalPrice: string;
	startDate: string;
	endDate: string;
	enable: string;
	valid: string;
}

const Package: FC = () => {
	/**
	 * States
	 */
	const isManager = 'M';

	const navigate = useNavigate();

	const { register, handleSubmit, setValue, watch } = useForm<IFormValues>({
		defaultValues: {
			startDate: '20240101',
			endDate: '20991231',
			enable: 'Exposed',
			valid: 'Approved',
		},
	});

	const watchEnable = watch('enable');
	const watchValid = watch('valid');

	const { confirm, failAlert } = useModal();
	const { page, countPerPage, setPage, setTotalCount, Paging } = usePaging();
	const { agentList } = useAgentList();

	const [searchPayload, setSearchPayload] = useState<GetPackageListPayload>({
		page: 1,
		countPerPage: 10,
		enable: true,
		valid: true,
		startDate: '20240101',
		endDate: '20991231',
	});
	const [editTarget, setEditTarget] = useState<PackageSchema>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	/**
	 * Queries
	 */
	const { data: packageData, isLoading, isFetching, refetch } = useGetPackageList(searchPayload);
	const [packageList, totalCount] = packageData ?? [undefined, 0];

	const { mutate: deletePackage, isLoading: isLoadingDelete } = useDeletePackage();
	const { mutate: putPackage, isLoading: isLoadingUpdate } = usePutPackageFORM();

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (page) {
			setSearchPayload((prev) => ({ ...prev, page, countPerPage }));
		}
	}, [page]);

	useEffect(() => {
		setTotalCount(totalCount);
	}, [totalCount]);

	useEffect(() => {
		if (mode === 'select') {
			setEditTarget(undefined);
		}
	}, [mode]);

	/**
	 * Handlers
	 */
	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		if (isFetching) return;
		const { agent, enable, endDate, title, startDate, valid } = data;

		const payload: GetPackageListPayload = {
			countPerPage: 10,
			page: 1,
			endDate: endDate || undefined,
			startDate: startDate || undefined,
			title: title || undefined,
			enable: enable === 'Exposed',
		};

		setSearchPayload(payload);
		setPage(1);
	};

	const removePackage = (id: number) => {
		confirm({
			message: 'Do you want to delete the package?',
			okHandler: () => {
				deletePackage(id, {
					onSuccess: () => {
						successToast('Deleted successfully.');
						refetch();
					},
					onError: () => {
						failAlert('Failed to delete the package.');
					},
				});
			},
		});
	};

	const handleAccessPackage = (id: number) => {
		putPackage(
			{ id, valid: true },
			{
				onSuccess: () => {
					refetch();
				},
				onError: () => {
					failAlert('Failed to approve the package 패키지 승인에 실패했습니다.');
				},
			},
		);
	};

	const goPackageDetail = (id: number) => {
		navigate(PATHS.CREATE_PACKAGE.replace(':id', id.toString()));
	};

	const handleEditPackage = (item: PackageSchema) => {
		setMode('edit');
		setEditTarget(item);
	};

	const handleReset = () => {
		setValue('agent', '');
		setValue('enable', 'Exposed');
		setValue('title', '');
		setValue('valid', 'Approved');
		setValue('startDate', '20240101');
		setValue('endDate', '20991231');
	};

	/**
	 * Helpers
	 */
	const refetchBoardList = () => {
		refetch();
		setMode('select');

		//

		if (mode === 'create') {
			setPage(1);
			handleReset();
			setSearchPayload({
				page: 1,
				countPerPage,
				enable: true,
			});
		}
	};

	return (
		<S.Container>
			<Title title="Package Management" desc="You can manage package.">
				<Button
					type="submit"
					status="third"
					text={needCreateForm ? 'Collapse' : 'Add Package'}
					onClick={() => {
						if (needCreateForm) {
							setMode('select');
						} else {
							setMode('create');
						}
					}}
				>
					{needCreateForm ? undefined : <IconPlus color="white" size={14} />}
				</Button>
			</Title>

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={50}>
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
					<Free.Value $width={50}>
						<RadioWrapper label="Approved or Not Approved">
							<Radio
								name="valid"
								label="Approved"
								register={register}
								value="Approved"
								checked={watchValid === 'Approved'}
							/>
							<Radio
								name="valid"
								label="Not Approved"
								register={register}
								value="Not Approved"
								checked={watchValid === 'Not Approved'}
							/>
						</RadioWrapper>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={50}>
						<Select
							label="Agent"
							name="agent"
							placeholder="Please select an agent."
							values={agentList?.map((o) => {
								return { label: o.agentName, value: o.id };
							})}
							valueStructure={{ label: 'label', key: 'value' }}
							register={register}
							// errors={errors}
							// error={!!errors.agent}
							// options={{ required: VALIDATION_MESSAGE.agent.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Package Name"
							name="title"
							placeholder="Please enter the package name."
							register={register}
							// errors={errors}
							// error={!!errors.name}
							// options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value>
						<TextField
							label="Travel Start Date"
							name="startDate"
							placeholder="Please enter the travel start date."
							register={register}
							// errors={errors}
							// error={!!errors.email}
							// options={{ required: VALIDATION_MESSAGE.nameEng.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Travel End Date"
							name="endDate"
							placeholder="Please enter the travel start date."
							register={register}
							// errors={errors}
							// error={!!errors.email}
							// options={{ required: VALIDATION_MESSAGE.nameEng.required }}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button type="submit" status="primary" text="Search">
						<IconSearch color="white" size={14} />
					</Button>
					<Button status="primary_outlined" text="Reset Conditions" onClick={handleReset} />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}
			{needCreateForm && (
				<PackageCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchBoardList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={5}>Approved</Free.Label>
					<Free.Label $width={5}>Exposed</Free.Label>
					<Free.Label $width={10}>Package Thumbnail</Free.Label>
					<Free.Label $width={10}>Title</Free.Label>
					<Free.Label $width={10}>English Name</Free.Label>
					<Free.Label $width={10}>Price</Free.Label>
					<Free.Label $width={10}>Writer</Free.Label>
					<Free.Label $width={10}>Travel Start Date</Free.Label>
					<Free.Label $width={10}>Travel End Date</Free.Label>
					<Free.Label>Options</Free.Label>
				</Free.Row>
				{!isUndefined(packageList) &&
					packageList.map((o, index) => {
						const { id, salesEnd, salesStart, thumbnail, title, totalPrice, valid, enable, titleEng } = o;
						const isLast = index === packageList.length - 1;

						return (
							<Free.Row key={id} $isLast={isLast}>
								<Free.Value $width={5}>{enable ? 'O' : 'X'}</Free.Value>
								<Free.Value $width={5}>{valid ? 'O' : 'X'}</Free.Value>
								<Free.Value $width={10}>
									<img src={getPackageImg(thumbnail)} style={{ width: '100%', height: 'auto' }} alt="" />
								</Free.Value>
								<Free.Value $width={10}>{title}</Free.Value>
								<Free.Value $width={10}>{titleEng}</Free.Value>
								<Free.Value $width={10}>{comma(totalPrice)}</Free.Value>
								<Free.Value $width={10}>작성자</Free.Value>
								<Free.Value $width={10}>{getYmd(salesStart, 'dddd MM-DD-YYYY')}</Free.Value>
								<Free.Value $width={10}>{getYmd(salesEnd, 'dddd MM-DD-YYYY')}</Free.Value>
								<Free.Value>
									<OptionButtons>
										{!valid && isManager ? (
											<RowButton $status="fourth" onClick={() => handleAccessPackage(id)}>
												Approved
											</RowButton>
										) : null}
										<RowButton $status="primary" onClick={() => goPackageDetail(id)}>
											Details
										</RowButton>
										<RowButton $status="primary_outlined" onClick={() => handleEditPackage(o)}>
											Edit
										</RowButton>
										<RowButton $status="danger_outlined" onClick={() => removePackage(id)}>
											Delete
										</RowButton>
									</OptionButtons>
								</Free.Value>
							</Free.Row>
						);
					})}

				<EmptyResult items={packageList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingDelete} />
		</S.Container>
	);
};

export default Package;
