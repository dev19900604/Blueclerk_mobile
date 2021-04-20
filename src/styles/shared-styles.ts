import { ViewStyle } from 'react-native';

export const Row: ViewStyle = { flexDirection: 'row' };
export const Center: ViewStyle = { justifyContent: 'center', alignItems: 'center' };
export const RowCenter: ViewStyle = { ...Row, ...Center };
