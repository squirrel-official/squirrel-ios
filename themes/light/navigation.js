/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { DefaultTheme } from '@react-navigation/native';

import Colors from '../../constants/Colors';

export default {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: Colors.blue,
		background: '#F2F2F2',
		card: '#303030',
		text: Colors.white,
		border: '#272729'
	}
};
