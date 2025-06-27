import React from "react";
import { View } from "react-native";
import { Typography } from "../Typography";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";


type OfflineBannerProps = {
    isConnected?: boolean | null;
};

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isConnected = false}) => {

    const styles = useStyles(themedStyles);

    if(isConnected) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Typography style={styles.textStyle}>You are offline. You might be viewing old data.</Typography>
        </View>
    )
}

const themedStyles = EDSStyleSheet.create((theme) => ({
    container: {
        backgroundColor: theme.colors.interactive.primary,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
      },
      textStyle: {
        alignSelf: "center",
        fontWeight: 400,
        fontSize: 16,
        color: theme.colors.text.primaryInverted,
    },
}));
