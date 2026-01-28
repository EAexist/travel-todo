import ContentTitle from '@/components/Layout/Content';
import { Screen } from '@/components/Screen/Screen';
import { TransText } from '@/components/TransText';
import { Icon as IconType } from '@/models/Icon';
import { WebDemoStackScreenProps } from '@/navigators/WebDemoStackTypes';
import { Icon } from '@rneui/themed';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const FAKE_RESERVATION_SOURCES: { [key: string]: { title: string, icon?: IconType, color: string, qr?: boolean } } = {
    'universal-studio': { title: "Universal Studio Express 예약 내역 페이지", icon: { name: "ferris-wheel", type: "material-community" }, color: "#FDB913" },
    'flight': { title: "항공권 예약 내역 페이지", icon: { name: "airlines", type: "material" }, color: "#006494" },
    'airbnb': { title: "에어비엔비 예약 내역 페이지", icon: { name: "airbnb", type: "font-awesome-5" }, color: "#f43f5e" },
    'hotel': { title: "호텔 예약 내역 페이지", icon: { name: "hotel", type: "font-awesome-5" }, color: "#37474F" },
    'visit-japan': { title: "VISIT JAPAN QR 페이지", color: "#2563eb", qr: true },
};

const FakeReservationSourceScreen: FC<WebDemoStackScreenProps<'FakeReservationSource'>> = ({ route }) => {

    const { type } = route.params || { type: 'hotel' };
    const data = FAKE_RESERVATION_SOURCES[type];

    return (
        <Screen>
            <View style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {data.icon && <Icon containerStyle={[styles.iconContainer]} size={120} name={data.icon.name} type={data.icon.type} color={data.color} />}
                {
                    data.qr && <QRCode value={"VISIT JAPAN"} size={200} />
                }
            </View>
            <ContentTitle
                title={
                    <TransText h2>{data.title}</TransText>
                }
                subtitle={`이 페이지는 가상 ${data.title} 입니다. 실제 예약 내역이 아닙니다.`}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        aspectRatio: 1,
        padding: 48,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',

        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
});
export default FakeReservationSourceScreen