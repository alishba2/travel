/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-multi-assign */
import React, { FC, useRef, useEffect, KeyboardEvent, useState } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

// Styles
import 'video.js/dist/video-js.css';
import './player.css';

interface IVideoPlayerProps {
	sources: videojs.Tech.SourceObject[];
	lastTime?: number;
	realTime?: number;
}

const CUSTOM_OPTION = {
	VOLUME_STEP: 0.1,
	SEEK_STEP: 5,
};

const options: VideoJsPlayerOptions = {
	autoplay: true,
	controls: true,
	controlBar: {
		pictureInPictureToggle: false,
		progressControl: false,
	},
	responsive: true,
	fluid: true,
	muted: true,
};

// TODO : 이전 시청 이력 반영 > ready
const VideoPlayer: FC<IVideoPlayerProps> = ({ sources, lastTime, realTime }) => {
	const supposedCurrentTime = useRef<number>(0);
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<VideoJsPlayer>();

	const [isPause, setIsPause] = useState<boolean>(false);

	useEffect(() => {
		// make sure Video.js player is only initialized once
		if (!playerRef.current) {
			const videoElement = videoRef.current;
			if (!videoElement) return;

			const player = (playerRef.current = videojs(videoElement, { ...options, sources }, () => {
				player.on('timeupdate', () => handleTimeUpdate(player));
				player.on('ratechange', () => handleRateChange(player));
				player.on('seeking', () => handleSeeking(player));
				player.on('focusout', () => handleFocusOut(player));
				player.on('keydown', (e: KeyboardEvent) => handleKeyDown(e, player));
				player.on('pause', () => setIsPause(true));
				player.on('play', () => {
					setIsPause(false);
				});
				player.on('ended', () => handleEnded(player));
				player.on('loadeddata', () => handleLoadedData(player));
				player.on('contextmenu', (e: Event) => e.preventDefault());
			}));
		}
	}, [videoRef, sources]);

	// create Record
	useEffect(() => {
		const handleRepeat = setInterval(() => {
			return () => clearInterval(handleRepeat);
		}, 10000);
		return () => clearInterval(handleRepeat);
	}, [isPause]);

	// Dispose the Video.js player when the functional component unmounts
	useEffect(() => {
		const player = playerRef.current;

		if (player) {
			player.focus();
			player.muted(false);
		}

		return () => {
			if (player) {
				player.dispose();
				playerRef.current = undefined;
			}
		};
	}, [playerRef]);

	// Player Event Handlers
	const handleLoadedData = (player: VideoJsPlayer) => {
		if (lastTime) {
			supposedCurrentTime.current = lastTime;
			player.currentTime(lastTime);
			// player.pause();
			// player.play();
		}
	};

	const handleTimeUpdate = (player: VideoJsPlayer) => {
		const currentTime = player.currentTime();
		const isSupposed = currentTime > supposedCurrentTime.current;
		if (!player.seeking() && isSupposed) {
			supposedCurrentTime.current = currentTime;
		}
	};

	const handleSeeking = (player: VideoJsPlayer) => {
		const currentTime = player.currentTime();
		const prevTime = supposedCurrentTime.current;
		// prev, next 불가
		if (currentTime > prevTime || currentTime < prevTime) {
			player.currentTime(prevTime);
		}
	};

	const handleRateChange = (player: VideoJsPlayer) => player.playbackRate(1);
	const handleFocusOut = (player: VideoJsPlayer) => {
		// player.focus();
	};
	const handleKeyDown = (e: KeyboardEvent, player: VideoJsPlayer) => {
		switch (e.code) {
			case 'Space':
				if (player.paused()) {
					player.play();
				} else {
					player.pause();
				}
				break;
			case 'Enter':
				if (player.isFullscreen()) {
					player.exitFullscreen();
				} else {
					player.requestFullscreen();
				}
				break;
			case 'ArrowLeft':
				// player.currentTime(player.currentTime() - CUSTOM_OPTION.SEEK_STEP);
				break;
			case 'ArrowDown':
				player.volume(player.volume() - CUSTOM_OPTION.VOLUME_STEP);
				break;
			case 'ArrowUp':
				player.volume(player.volume() + CUSTOM_OPTION.VOLUME_STEP);
				break;
			default:
		}
	};

	// APIs
	const handleEnded = (player: VideoJsPlayer) => {
		// Ended Lecture, realTime 사용
	};

	return (
		// <>
		// 	<div style={{ position: 'absolute', zIndex: 9999, width: `${playerWidth}px`, height: `${playerHeight}px` }} />
		// 	<div data-vjs-player>
		// 		<video ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
		// 	</div>
		// </>
		<div data-vjs-player>
			<video ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
		</div>
	);
};

export default VideoPlayer;
