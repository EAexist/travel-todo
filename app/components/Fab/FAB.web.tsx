import { IconNode } from '@rneui/base';
import { FABProps, Icon, IconProps, useTheme } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FAB = ({
    onPress,
    icon,
    title,
    visible = true,
    disabled = false
}: FABProps) => {
    if (!visible) return null;

    const {
        theme: { colors },
    } = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            disabled={disabled}
            onPress={onPress}
            style={[
                styles.fab,
                { backgroundColor: colors.primary },
                title ? styles.extended : styles.round
            ]}
        >
            <View style={styles.content}>
                {icon && renderIcon(icon)}
                {title && <Text>{title}</Text>}
            </View>
        </TouchableOpacity>
    );
};

const renderIcon = (icon: IconNode, defaultColor: string = 'white') => {

    if (!icon || icon === true) return null;

    if (React.isValidElement(icon)) return icon;

    if (typeof icon === 'object') {
        return <Icon
            size={24}
            {...(icon as IconProps)}
            color={(icon as IconProps).color || defaultColor}
        />;
    }

    return null;
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    round: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    extended: {
        paddingHorizontal: 20,
        height: 48,
        borderRadius: 24,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});