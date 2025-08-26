import React, { FC, useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useGoogleMapStore } from '@shared/store/googleMap';
import * as S from './styled';
import Image from '@components/Image';
import { useLocation } from 'react-router-dom';

const GoogleMap: FC = () => {
	/**
	 * States
	 */

	const location = useLocation();

	const { dispatchMap, isOpen, lat, lng } = useGoogleMapStore();

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		handleReset();
	}, [location]);

	useEffect(() => {
		return () => {
			handleReset();
		};
	}, []);

	/**
	 * Handlers
	 */

	const handleReset = () => {
		dispatchMap({ isOpen: false, lat: 0, lng: 0 });
	};

	/**
	 * Helpers
	 */

	if (!isOpen) {
		return null;
	}

	return (
		<S.Wrapper>
			<S.Overlay onClick={handleReset} />
			<S.Close>
				<Image src="ic_close.webp" onClick={handleReset} />
			</S.Close>
			<APIProvider apiKey={process.env.GOOGLE_API_KEY!}>
				<Map
					style={{ width: '100%', height: '100%' }}
					defaultCenter={{ lat, lng }}
					defaultZoom={15}
					gestureHandling="greedy"
					disableDefaultUI
					center={{ lat, lng }}
				>
					<Marker position={{ lat, lng }} />
				</Map>
			</APIProvider>
		</S.Wrapper>
	);
};

export default GoogleMap;
