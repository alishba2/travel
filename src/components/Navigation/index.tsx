/* eslint-disable no-alert */
import React, { FC, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IMG_URI } from '@shared/utils/base';
import { PATHS } from '@shared/path';
import * as S from './styled';
import { COOKIE_KEYS, removeCookie } from '@shared/utils/cookie';
import { NAV_MENUS } from './constants';
import { isEmpty, throttle } from 'lodash-es';
import { useModal } from '@shared/hooks';
import { usePostAgentLogout } from '@shared/hooks/queries/agent';
import useMe from '@shared/hooks/useMe';
import { CustomSetState } from '@typings/base';
import { IconMenuDeep, IconSearch } from '@tabler/icons-react';
import { useGetItemSearch } from '@shared/hooks/queries/item';
import { GetItemSearchPayload, ItemType } from '@typings/payload';
import { TextField } from '@components/Input';
import { useForm } from 'react-hook-form';

interface NavigationProps {
	isWide: boolean;
	setIsWide: CustomSetState<boolean>;
}

interface ISearchFormValues {
	keyword: string;
}

const Navigation: FC<NavigationProps> = ({ isWide, setIsWide }) => {
	/**
	 * States
	 */
	const [isAnimated, setIsAnimated] = useState(false);
	const [searchPayload, setSearchPayload] = useState<GetItemSearchPayload>();
	const [searchResultActive, setSearchResultActive] = useState(0);
	const [isComposing, setIsComposing] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { confirm, failAlert } = useModal();
	const { isMaster, me, grade: managerGrade } = useMe();

	/**
	 * Forms
	 */
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<ISearchFormValues>({
		defaultValues: {
			keyword: '',
		},
	});

	const watchKeyword = watch('keyword');

	/**
	 * Refs and Throttled Functions
	 */
	const searchRef = useRef<HTMLDivElement>(null);
	const throttleSearch = useRef(
		throttle((query, grade) => {
			if (!query?.length) {
				setSearchPayload(undefined);
				return;
			}
			setSearchPayload({ keyword: query, page: 1, countPerPage: 10, grade });
		}, 300),
	).current;

	/**
	 * Queries
	 */
	const { mutate: postLogout } = usePostAgentLogout();
	const { data: items } = useGetItemSearch(searchPayload);
	const [itemList] = items ?? [[], 0];

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		throttleSearch(watchKeyword, managerGrade);
	}, [watchKeyword, managerGrade, throttleSearch]);

	// Close search results on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setSearchFocused(false);
				setSearchResultActive(0);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	/**
	 * Handlers
	 */
	const handleMenuClick = (path: string) => {
		setIsAnimated(true);
		setTimeout(() => setIsAnimated(false), 500);

		if (path === '/logout') {
			confirm({
				message: 'Do you want to log out?',
				okHandler: () => {
					postLogout(
						{},
						{
							onSuccess: () => {
								removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
								removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
								navigate(PATHS.SIGN_IN);
							},
							onError: () => {
								failAlert('Failed to log out.');
							},
						},
					);
				},
			});
			return;
		}

		navigate(path);
	};

	const goHome = () => {
		navigate(PATHS.INTRO);
	};

	const handleSearchToggle = () => {
		setSearchFocused(!searchFocused);
		if (!searchFocused) {
			setSearchResultActive(0);
		}
	};

	const onKeyDown = (ev: React.KeyboardEvent) => {
		if (isComposing) return;
		
		if (ev.code === 'ArrowDown' && searchResultActive < itemList?.length) {
			ev.preventDefault();
			setSearchResultActive((prev: number) => prev + 1);
		}
		if (ev.code === 'ArrowUp' && searchResultActive > 0) {
			ev.preventDefault();
			setSearchResultActive((prev: number) => prev - 1);
		}
		if (ev.code === 'Enter' && itemList.length && itemList[searchResultActive - 1]) {
			ev.preventDefault();
			const selectedItem = itemList[searchResultActive - 1];
			handleItemSelect(selectedItem);
		}
		if (ev.code === 'Escape') {
			setSearchFocused(false);
			setSearchResultActive(0);
		}
	};

	const handleItemSelect = (item: any) => {
		// Navigate to item detail or add to quote - adjust based on your needs
		console.log('Selected item:', item);
		
		// Option 1: Navigate to item detail page
		// navigate(`/items/${item.id}`);
		
		// Option 2: Add to current quote if on quote page
		// if (pathname.includes('/estimate/')) {
		//   // Add item to quote logic here
		// }
		
		// Option 3: Show item details in modal
		// showItemModal(item);
		
		setSearchFocused(false);
		setSearchResultActive(0);
	};

	const onClickSearchResult = (item: any) => {
		handleItemSelect(item);
	};

	/**
	 * Helpers
	 */
	const convertText = (v?: string) => {
		const res = v ? v.replaceAll('#', ' > ').replaceAll(watchKeyword, `<b>${watchKeyword}</b>`) : '';
		const splittedDesc = res?.split(/<b>|<\/b>/) || [];
		return splittedDesc;
	};

	const TYPE_ENG_KEY = {
		여행지: 'Place',
		컨텐츠: 'Contents',
		숙박: 'Accommodation',
		이동수단: 'Transportation',
	};

	const transTypeEng = (type: ItemType): string => {
		return TYPE_ENG_KEY[type];
	};

	if (!me) return null;

	const ROLE = isMaster ? 'M' : 'A';

	return (
		<S.Container $isWide={isWide}>
			<S.WideSection>
				<button type="button" onClick={() => setIsWide((prev) => !prev)}>
					<IconMenuDeep />
				</button>
			</S.WideSection>
			
			<S.Logo onClick={goHome}>
				<img src={`${IMG_URI}/${isWide ? 'korea_oneday.png' : 'korea.png'}`} alt="로고" />
			</S.Logo>

			{/* Product Search Section */}
			<S.SearchSection $isWide={isWide} ref={searchRef}>
				<S.SearchInput>
					<S.SearchIcon>
						<IconSearch size={16} />
					</S.SearchIcon>
					<TextField
						name="keyword"
						placeholder={isWide ? "Search travel products..." : "Search..."}
						autoComplete="off"
						register={register}
						onKeyDown={onKeyDown}
						onCompositionStart={() => setIsComposing(true)}
						onCompositionEnd={() => setIsComposing(false)}
						onFocus={() => setSearchFocused(true)}
					/>
				</S.SearchInput>
				
				{searchFocused && watchKeyword && !isEmpty(itemList) && (
					<S.SearchResults>
						{itemList.map((item, index) => {
							const { id: itemId, nameEng, type, personalTag, price } = item;
							return (
								<S.SearchResultItem
									key={itemId}
									onClick={() => onClickSearchResult(item)}
									$active={searchResultActive === index + 1}
									onMouseOver={() => setSearchResultActive(index + 1)}
								>
									<S.SearchResultContent>
										<S.SearchResultType>[{transTypeEng(type)}]</S.SearchResultType>
										<S.SearchResultName>
											{convertText(nameEng).map((text, idx) => {
												if (!(idx === 0) && idx % 2 === 1) {
													return <strong key={idx}>{text}</strong>;
												}
												return text;
											})}
										</S.SearchResultName>
										{personalTag && <S.SearchResultTag>({personalTag})</S.SearchResultTag>}
										{price && <S.SearchResultPrice>${price}</S.SearchResultPrice>}
									</S.SearchResultContent>
								</S.SearchResultItem>
							);
						})}
					</S.SearchResults>
				)}
			</S.SearchSection>

			{/* Navigation Menus */}
			{NAV_MENUS.map((o1: any) => {
				const isShowBigMenu = o1.grade.includes(ROLE);

				if (!isShowBigMenu) return null;

				return (
					<S.MenuUl key={o1.id}>
						<S.MenuLi>
							{isWide && <h3>{o1.label}</h3>}

							{o1.children.map((o2: any) => {
								const isSelected = pathname === o2.path;
								const isShowSmallMenu = o2.grade.includes(ROLE);

								if (!isShowSmallMenu) return null;

								return (
									<S.MenuBox
										key={o2.id}
										$isSelected={isSelected}
										$isWide={isWide}
										onClick={() => handleMenuClick(o2.path)}
									>
										<o2.icon color={isSelected ? 'white' : 'black'} size={20} />
										{isWide ? <span>{o2.label}</span> : null}
										{isAnimated && isSelected && <S.WaveAnimation />}
									</S.MenuBox>
								);
							})}
						</S.MenuLi>
					</S.MenuUl>
				);
			})}
		</S.Container>
	);
};

export default Navigation;