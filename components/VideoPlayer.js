/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, Video, VideoFullscreenUpdate } from 'expo-av';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';
import { msToTicks } from '../utils/Time';

const VideoPlayer = observer(() => {
	const { rootStore } = useStores();

	const player = useRef(null);
	// Local player fullscreen state
	const [ isPresenting, setIsPresenting ] = useState(false);
	const [ isDismissing, setIsDismissing ] = useState(false);

	// Set the audio mode when the video player is created
	useEffect(() => {
		Audio.setAudioModeAsync({
			interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
			interruptionModeIOS: InterruptionModeIOS.DoNotMix,
			playsInSilentModeIOS: true
		});
	}, []);

	// Update the player when media type or uri changes
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Video) {
			rootStore.didPlayerCloseManually = true;
			player.current?.loadAsync({
				uri: rootStore.mediaStore.uri
			}, {
				positionMillis: rootStore.mediaStore.positionMillis,
				shouldPlay: true
			});
		}
	}, [ rootStore.mediaStore.type, rootStore.mediaStore.uri ]);

	// Update the play/pause state when the store indicates it should
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Video && rootStore.mediaStore.shouldPlayPause) {
			if (rootStore.mediaStore.isPlaying) {
				player.current?.pauseAsync();
			} else {
				player.current?.playAsync();
			}
			rootStore.mediaStore.shouldPlayPause = false;
		}
	}, [ rootStore.mediaStore.shouldPlayPause ]);

	// Close the player when the store indicates it should stop playback
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Video && rootStore.mediaStore.shouldStop) {
			rootStore.didPlayerCloseManually = false;
			closeFullscreen();
			rootStore.mediaStore.shouldStop = false;
		}
	}, [ rootStore.mediaStore.shouldStop ]);

	const openFullscreen = () => {
		if (!isPresenting) {
			player.current?.presentFullscreenPlayer()
				.catch(e => {
					console.error(e);
					Alert.alert(e);
				});
		}
	};

	const closeFullscreen = () => {
		if (!isDismissing) {
			player.current?.dismissFullscreenPlayer()
				.catch(e => {
					console.debug(e);
				});
		}
	};

	return (
		<Video
			ref={player}
			usePoster
			posterSource={{ uri: rootStore.mediaStore.backdropUri }}
			resizeMode='contain'
			useNativeControls
			onReadyForDisplay={openFullscreen}
			onPlaybackStatusUpdate={({ isPlaying, positionMillis, didJustFinish }) => {
				if (didJustFinish) {
					rootStore.didPlayerCloseManually = false;
					closeFullscreen();
					return;
				}
				rootStore.mediaStore.isPlaying = isPlaying;
				rootStore.mediaStore.positionTicks = msToTicks(positionMillis);
			}}
			onFullscreenUpdate={({ fullscreenUpdate }) => {
				switch (fullscreenUpdate) {
					case VideoFullscreenUpdate.PLAYER_WILL_PRESENT:
						setIsPresenting(true);
						rootStore.isFullscreen = true;
						break;
					case VideoFullscreenUpdate.PLAYER_DID_PRESENT:
						setIsPresenting(false);
						break;
					case VideoFullscreenUpdate.PLAYER_WILL_DISMISS:
						setIsDismissing(true);
						break;
					case VideoFullscreenUpdate.PLAYER_DID_DISMISS:
						setIsDismissing(false);
						rootStore.isFullscreen = false;
						rootStore.mediaStore.reset();
						player.current?.unloadAsync()
							.catch(console.debug);
						break;
				}
			}}
			onError={e => {
				console.error(e);
				Alert.alert(e);
			}}
		/>
	);
});

export default VideoPlayer;
