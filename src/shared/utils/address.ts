import axios from 'axios';
import { isEmpty, isNil } from 'lodash-es';

export const handleGetLatLng = async (address?: string) => {
	if (!address) {
		return null;
	}

	try {
		const config = { headers: { Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}` } }; // 헤더 설정
		const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`; // REST API url에 data.address값 전송
		const res: any = await axios.get(url, config);

		// API호출
		if (!isNil(res?.data) && !isEmpty(res?.data?.documents)) {
			const data = {
				lat: res.data?.documents[0]?.x,
				lng: res.data?.documents[0]?.y,
			};

			return data;
		}
		return null;
	} catch (error) {
		return null;
	}
};
