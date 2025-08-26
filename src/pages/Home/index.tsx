import React, { FC, useState, useEffect } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomHeader from './components/CustomHeader';
import * as S from './styled';
import { useGetBatchCalendarMonth } from '@shared/hooks/queries/batch';
import { GetBatchCalendarMonthPayload } from '@typings/payload';
import useMe from '@shared/hooks/useMe';
import { getYmd } from '@shared/utils/dayUtils';
import Loader from '@components/Loader';
import { StringKeyAndVal } from '@typings/base';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';

const localizer = dayjsLocalizer(dayjs);

const CALENDAR_COLORS: StringKeyAndVal = {
	대기: '#4a55a2',
	요청: '#7895cb',
	답변완료: '#a0bfe0',
	최종완료: '#c5dff8',
	취소: '#9ea1d4',
};

interface EventType {
	title: string;
	start: Date;
	end: Date;
	bgColor: string;
	headcount: string;
	recipient: string;
	id: number;
}

const Home: FC = () => {
	/**
	 * States
	 */

	const navigate = useNavigate();

	const { managerId } = useMe();

	const [searchPayload, setSearchPayload] = useState<GetBatchCalendarMonthPayload>();

	const [batchList, setBatchList] = useState<EventType[]>([]);

	/**
	 * Queries
	 */

	const { data: batch, isLoading, isFetching } = useGetBatchCalendarMonth(searchPayload);

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (managerId) {
			setSearchPayload({ monthYear: getYmd(new Date(), 'YYYY-MM') });
		}
	}, [managerId]);

	useEffect(() => {
		if (batch?.length) {
			const convertList = batch.map(({ title, recipient, headcount, startDate, endDate, status, id }) => {
				return {
					title: `${title} - ${recipient} (${headcount})`,
					headcount,
					recipient,
					start: new Date(getYmd(startDate, 'YYYY-MM-DD')),
					end: new Date(getYmd(endDate, 'YYYY-MM-DD')),
					bgColor: CALENDAR_COLORS?.[status] ?? '#ccc',
					id,
				};
			});
			setBatchList(convertList);
		} else {
			setBatchList([]);
		}
	}, [batch]);

	/**
	 * Handlers
	 */

	// 일정 띠 CSS
	const eventPropGetter = (event: EventType) => {
		const backgroundColor = event.bgColor;

		const style = {
			backgroundColor,
		};

		return {
			style,
		};
	};

	/**
	 * Helpers
	 */

	return (
		<>
			<S.Container>
				<Calendar
					localizer={localizer}
					events={batchList}
					startAccessor="start"
					endAccessor="end"
					titleAccessor="title"
					views={['month']}
					defaultView={Views.MONTH}
					style={{ height: '100%' }}
					onSelectEvent={(event: EventType) => {
						if (event?.id) {
							navigate(PATHS.MY_ESTIMATE_DETAIL.replace(':id', event.id.toString()));
						}
					}}
					components={{
						toolbar: CustomHeader,
					}}
					onNavigate={(date) => {
						const calendarMonthYear = getYmd(date, 'YYYY-MM');
						setSearchPayload({ monthYear: calendarMonthYear });
					}}
					className="calendar"
					popup
					eventPropGetter={eventPropGetter}
					formats={{
						dateFormat: 'D',
						weekdayFormat: (date) => {
							const dayName = dayjs(date).format('dddd'); // Full day name
							const shortDayName = dayName.slice(0, 3).toUpperCase(); // First three letters in uppercase
							return shortDayName;
						},
					}}
				/>
			</S.Container>
			<Loader isFetching={isLoading || isFetching} />
		</>
	);
};

export default Home;
