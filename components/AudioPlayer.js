/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';
import { msToTicks } from '../utils/Time';

const AudioPlayer = observer(() => {
	const { rootStore } = useStores();

	const [ player, setPlayer ] = useState();

	// Set the audio mode when the audio player is created
	useEffect(() => {
		Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
			playThroughEarpieceAndroid: false,
			shouldDuckAndroid: true,
			interruptionModeIOS: InterruptionModeIOS.DoNotMix,
			playsInSilentModeIOS: true
		});

		return () => {
			player?.stopAsync();
			player?.unloadAsync();
		};
	}, []);

	// Update the player when media type or uri changes
	useEffect(() => {
		const createPlayer = async ({ uri, positionMillis }) => {
			const { isLoaded } = await player?.getStatusAsync() || { isLoaded: false };
			if (isLoaded) {
				// If the player is already loaded, seek to the correct position
				player.setPositionAsync(positionMillis);
			} else {
				// Create the player if not already loaded
				const { sound } = await Audio.Sound.createAsync({
					uri
				}, {
					positionMillis,
					shouldPlay: true
				}, ({
					isPlaying,
					positionMillis: positionMs,
					didJustFinish
				}) => {
					if (
						didJustFinish === undefined ||
						isPlaying === undefined ||
						positionMs === undefined ||
						rootStore.mediaStore.isFinished
					) {
						return;
					}
					rootStore.mediaStore.isFinished = didJustFinish;
					rootStore.mediaStore.isPlaying = isPlaying;
					rootStore.mediaStore.positionTicks = msToTicks(positionMs);
				});
				setPlayer(sound);
			}
		};

		if (rootStore.mediaStore.type === MediaTypes.Audio) {
			createPlayer({
				uri: rootStore.mediaStore.uri,
				positionMillis: rootStore.mediaStore.positionMillis
			});
		}
	}, [ rootStore.mediaStore.type, rootStore.mediaStore.uri ]);

	// Update the play/pause state when the store indicates it should
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Audio && rootStore.mediaStore.shouldPlayPause) {
			if (rootStore.mediaStore.isPlaying) {
				player?.pauseAsync();
			} else {
				player?.playAsync();
			}
			rootStore.mediaStore.shouldPlayPause = false;
		}
	}, [ rootStore.mediaStore.shouldPlayPause ]);

	// Stop the player when the store indicates it should stop playback
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Audio && rootStore.mediaStore.shouldStop) {
			player?.stopAsync();
			player?.unloadAsync();
			rootStore.mediaStore.shouldStop = false;
		}
	}, [ rootStore.mediaStore.shouldStop ]);

	return <></>;
});

export default AudioPlayer;
