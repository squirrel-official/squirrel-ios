/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Icon, Text, ThemeContext } from 'react-native-elements';

import { isCompact } from '../utils/Device';
import { getIconName } from '../utils/Icons';

const ErrorView = ({
	icon = { name: getIconName('alert'), type: 'ionicon' },
	heading,
	message,
	details = [],
	buttonIcon,
	buttonTitle,
	onPress
}) => {
	const window = useWindowDimensions();
	const marginVertical = isCompact(window) ? 20 : 40;
	const { theme } = useContext(ThemeContext);

	return (
		<View style={{
			...styles.container,
			backgroundColor: theme.colors.background
		}}>
			<View style={styles.body}>
				<Icon
					testID='error-view-icon'
					name={icon.name}
					type={icon.type}
					size={isCompact(window) ? 60 : 100}
				/>
				<Text
					testID='error-view-heading'
					h2
					style={{ ...styles.heading, marginVertical }}
				>
					{heading}
				</Text>
				<Text
					testID='error-view-message'
					style={{ ...styles.message, marginBottom: marginVertical }}
				>
					{message}
				</Text>
			</View>
			<View testID='error-view-details'>
				{details.map((detailText, index) => (
					<Text
						testID='error-view-detail'
						key={`errorview-details-${index}`}
						style={styles.details}
					>
						{detailText}
					</Text>
				))}
			</View>
			{buttonTitle && (
				<Button
					testID='error-view-button'
					containerStyle={styles.footer}
					icon={buttonIcon}
					title={buttonTitle}
					onPress={onPress}
				/>
			)}
		</View>
	);
};

ErrorView.propTypes = {
	icon: PropTypes.shape({
		name: PropTypes.string,
		type: PropTypes.string
	}),
	heading: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	details: PropTypes.arrayOf(PropTypes.string),
	buttonIcon: PropTypes.shape({
		name: PropTypes.string,
		type: PropTypes.string
	}),
	buttonTitle: PropTypes.string,
	onPress: PropTypes.func
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFill,
		flex: 1,
		paddingHorizontal: 15
	},
	body: {
		flexGrow: 1,
		justifyContent: 'center'
	},
	footer: {
		marginVertical: 17
	},
	heading: {
		textAlign: 'center'
	},
	message: {
		textAlign: 'center',
		marginHorizontal: 20
	},
	details: {
		fontSize: 15
	}
});

export default ErrorView;
