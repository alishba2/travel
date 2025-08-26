import { COOKIE_KEYS, getCookie } from '@shared/utils/cookie';
import { ManagerMeSchema } from '@typings/schema';
import { useGetAgentMe } from './queries/agent';

interface IReturn {
	me?: ManagerMeSchema;
	managerId?: number;
	isMaster: boolean;
	grade: string;
}

const useMe = (): IReturn => {
	const logged = !!getCookie(COOKIE_KEYS.REFRESH_TOKEN);
	const { data: me } = useGetAgentMe(logged);
	const isMaster = me?.type === '관리자';
	const grade = me?.grade ?? '';

	return {
		me,
		managerId: me?.id,
		isMaster,
		grade,
	};
};

export default useMe;
