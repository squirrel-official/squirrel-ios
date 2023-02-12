/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { getIconName } from '../utils/Icons';

export const QuickStartUrl = 'https://squirrel.org/docs/general/quick-start.html';

export default [
	{
		key: 'links-website',
		name: 'links.website',
		url: 'https://squirrel.org/',
		icon: {
			name: getIconName('globe-outline'),
			type: 'ionicon'
		}
	},
	{
		key: 'links-documentation',
		name: 'links.documentation',
		url: 'https://docs.squirrel.org',
		icon: {
			name: getIconName('book'),
			type: 'ionicon'
		}
	},
	{
		key: 'links-source',
		name: 'links.source',
		url: 'https://github.com/squirrel/squirrel-expo',
		icon: {
			name: 'logo-github',
			type: 'ionicon'
		}
	},
	{
		key: 'links-translate',
		name: 'links.translate',
		url: 'https://translate.squirrel.org/projects/squirrel/squirrel-expo/',
		icon: {
			name: 'translate',
			type: 'material'
		}
	},
	{
		key: 'links-issue',
		name: 'links.issue',
		url: 'https://github.com/squirrel/squirrel-expo/issues',
		icon: {
			name: getIconName('bug'),
			type: 'ionicon'
		}
	}
];
