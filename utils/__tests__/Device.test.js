/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

import { getAppName, getDeviceProfile, getSafeDeviceName, isCompact, isSystemThemeSupported } from '../Device';
import iOSProfile from '../profiles/ios';
import iOS10Profile from '../profiles/ios10';
import iOS12Profile from '../profiles/ios12';
import iOSFmp4Profile from '../profiles/iosFmp4';

jest.mock('react-native/Libraries/Utilities/Platform');

describe('Device', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	describe('getAppName()', () => {
		it('should return the app name including the os name', () => {
			expect(getAppName()).toBe('Jellyfin Mobile (mock)');
		});
	});

	describe('getSafeDeviceName()', () => {
		it('should return safe device names unchanged', () => {
			expect(getSafeDeviceName()).toBe('Test Phone');
		});

		it('should change the iOS default apostrophe to an ascii single quote', () => {
			Constants.deviceName = 'thornbill’s iPhone';
			expect(getSafeDeviceName()).toBe('thornbill\'s iPhone');
		});

		it('should remove non-ascii characters and trim whitespace', () => {
			Constants.deviceName = '🌮😂 iPhone ';
			expect(getSafeDeviceName()).toBe('iPhone');
		});

		it('should return the device model name if device name only contains non-ascii and whitespace characters', () => {
			Constants.deviceName = '  🌮😂 ';
			expect(getSafeDeviceName()).toBe(Device.modelName);
		});
	});

	describe('getDeviceProfile()', () => {
		it('should return the correct profile for iOS 10 devices', () => {
			Platform.Version = '10';
			expect(getDeviceProfile()).toBe(iOS10Profile);
		});

		it('should return the correct profile for iOS 11 devices', () => {
			Platform.Version = '11';
			expect(getDeviceProfile()).toBe(iOS12Profile);
		});

		it('should return the correct profile for iOS 12 devices', () => {
			Platform.Version = '12';
			expect(getDeviceProfile()).toBe(iOS12Profile);
		});

		it('should return the correct profile for iOS 13 devices', () => {
			Platform.Version = '13';
			expect(getDeviceProfile()).toBe(iOSProfile);
		});

		it ('should return the correct profile for iOS 13 devices when fMP4 support is enabled', () => {
			Platform.Version = '13';
			expect(getDeviceProfile({ enableFmp4: true })).toBe(iOSFmp4Profile);
		});

		it('should return the an empty profile for Android devices', () => {
			Platform.OS = 'android';
			expect(getDeviceProfile()).toStrictEqual({});
		});
	});

	describe('isCompact()', () => {
		it('should return false by default', () => {
			expect(isCompact()).toBe(false);
		});

		it('should return false for heights >= 480', () => {
			expect(isCompact({ height: 480 })).toBe(false);
			expect(isCompact({ height: 481 })).toBe(false);
		});

		it('should return true for heights < 480', () => {
			expect(isCompact({ height: 479 })).toBe(true);
		});
	});

	describe('isSystemThemeSupported()', () => {
		it('should return true for iOS 13+', () => {
			Platform.Version = '13';
			expect(isSystemThemeSupported()).toBe(true);
		});

		it('should return false for iOS 12 or less', () => {
			Platform.Version = '12';
			expect(isSystemThemeSupported()).toBe(false);
		});
		it('should return true for Android 10+', () => {
			Platform.OS = 'android';
			Platform.Version = '10';
			expect(isSystemThemeSupported()).toBe(true);
		});

		it('should return false for Android 9 or less', () => {
			Platform.OS = 'android';
			Platform.Version = '9';
			expect(isSystemThemeSupported()).toBe(false);
		});

		it('should return false on unsupported platforms', () => {
			Platform.OS = 'web';
			expect(isSystemThemeSupported()).toBe(false);
		});
	});
});
