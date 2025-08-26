import { useGetAgentList } from './queries/agent';

const useAgentList = () => {
	const { data: agent } = useGetAgentList({ countPerPage: 999, page: 1 });

	const [agentList, totalCount] = agent ?? [[], 0];

	return {
		agentList,
		totalCount,
	};
};

export default useAgentList;
