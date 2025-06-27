import React, { useContext } from "react";
import { EnvironmentContext, EnvironmentContextProps } from "./EnvironmentProvider";
import { View } from "react-native";
import { Typography } from "../Typography";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";

type EnvironmentStyleProps = Pick<EnvironmentContextProps, "currentEnvironment">;

export const EnvironmentBanner = () => {
    const currentEnvironment = useContext(EnvironmentContext);
    const styles = useStyles(themeStyles, { currentEnvironment });

    if (currentEnvironment === "prod") return null;

    return (
        <View style={styles.container}>
            <Typography color={styles.text.color}>{currentEnvironment} environment</Typography>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create((theme, props: EnvironmentStyleProps) => {
    const { currentEnvironment } = props;
    let backgroundColor = "#00000000";
    if (currentEnvironment !== "prod") {
        backgroundColor = theme.colors.environment[currentEnvironment];
    }

    return {
        container: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor,
        },
        text: {
            color: theme.colors.environment.text,
        },
    };
});
