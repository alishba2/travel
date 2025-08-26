import React, { FC, useEffect, useState } from 'react';
import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import * as S from './styled';
import { TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { GetAgentListPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import AgentCreateForm from './components/AgentCreateForm';
import { isUndefined } from 'lodash-es';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { AgentSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import { useGetAgentList, usePutAgentDelete } from '@shared/hooks/queries/agent';
import useMe from '@shared/hooks/useMe';
import { StatusEng } from '@shared/utils/base';

interface IFormValues {
	agentName: string;
	agentTel: string;
	// username: string;
}

const Agent: FC = () => {
	/**
	 * States
	 */

	const { managerId } = useMe();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IFormValues>();

	const { confirm, failAlert } = useModal();
	const { page, countPerPage, setPage, setTotalCount, Paging } = usePaging();

	const [searchPayload, setSearchPayload] = useState<GetAgentListPayload>({
		page: 1,
		countPerPage: 10,
	});
	const [editTarget, setEditTarget] = useState<AgentSchema>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	/**
	 * Queries
	 */
	const { data: agent, isLoading, isFetching, refetch } = useGetAgentList(searchPayload);
	const [agentList, totalCount] = agent ?? [undefined, 0];

	const { mutate: putDeleteAgent, isLoading: isLoadingDelete } = usePutAgentDelete();

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

		const { agentName, agentTel } = data;

		const payload: GetAgentListPayload = {
			page: 1,
			countPerPage: 10,
			agentName: agentName || undefined,
			agentTel: agentTel || undefined,
		};

		setSearchPayload(payload);
		setPage(1);
	};

	const removeAgent = (id: number) => {
		confirm({
			message: 'Do you want to delete agent?',
			okHandler: () => {
				putDeleteAgent(
					{ id },
					{
						onSuccess: () => {
							successToast('Deleted successfully.');
							refetch();
						},
						onError: () => {
							failAlert('Failed to delete the agent.');
						},
					},
				);
			},
		});
	};

	const handleEditAgent = (data: AgentSchema) => {
		setMode('edit');
		setEditTarget(data);
	};

	const handleReset = () => {
		setValue('agentName', '');
		setValue('agentTel', '');
	};

	/**
	 * Helpers
	 */
	const refetchAgentList = () => {
		refetch();
		setMode('select');

		//

		if (mode === 'create') {
			setPage(1);
			handleReset();
			setSearchPayload({
				page: 1,
				countPerPage,
			});
		}
	};

	return (
		<S.Container>
			<Title title="Agent Management" desc="You can manage agent.">
				<Button
					type="button"
					status="third"
					text={needCreateForm ? 'Collapse' : 'Add agent'}
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
						<TextField
							label="Agent Name"
							name="agentName"
							placeholder="Please enter the agent name."
							register={register}
							// errors={errors}
							// error={!!errors.nameKor}
							// options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="전화번호"
							name="agentTel"
							placeholder="Please enter the phone number."
							register={register}
							// errors={errors}
							// error={!!errors.nameKor}
							// options={{ required: VALIDATION_MESSAGE.nameKor.required }}
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
				<AgentCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchAgentList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={20}>Agent Name</Free.Label>
					<Free.Label $width={20}>Phone Number</Free.Label>
					<Free.Label $width={10}>Status</Free.Label>
					<Free.Label $width={10}>Username</Free.Label>
					<Free.Label $width={10}>Grade</Free.Label>
					<Free.Label $width={10}>Type</Free.Label>
					<Free.Label>Options</Free.Label>
				</Free.Row>

				{!isUndefined(agentList) &&
					agentList.map((o, index) => {
						const { id, agentName, agentTel, status, username, type, grade } = o;
						const isLast = index === agentList.length - 1;

						return (
							<Free.Row key={id} $isLast={isLast}>
								<Free.Value $width={20}>{agentName}</Free.Value>
								<Free.Value $width={20}>{agentTel}</Free.Value>
								<Free.Value $width={10}>{StatusEng?.[status] ?? ''}</Free.Value>
								<Free.Value $width={10}>{username}</Free.Value>
								<Free.Value $width={10}>{grade}</Free.Value>
								<Free.Value $width={10}>{type === '에이전트' ? 'Agent' : 'Manager'}</Free.Value>

								<Free.Value>
									<OptionButtons>
										<RowButton $status="primary_outlined" onClick={() => handleEditAgent(o)}>
											Edit
										</RowButton>
										<RowButton $status="danger_outlined" onClick={() => removeAgent(id)}>
											Delete
										</RowButton>
									</OptionButtons>
								</Free.Value>
							</Free.Row>
						);
					})}

				<EmptyResult items={agentList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingDelete} />
		</S.Container>
	);
};

export default Agent;
