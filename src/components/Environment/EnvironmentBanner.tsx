import React, { useContext } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Typography } from "../Typography";
import {
    EnvironmentContext,
    EnvironmentContextProps,
} from "./EnvironmentProvider";

type EnvironmentStyleProps = Pick<
    EnvironmentContextProps,
    "currentEnvironment"
>;

export const EnvironmentBanner = () => {
    const currentEnvironment = useContext(EnvironmentContext);
    const styles = useStyles(themeStyles, { currentEnvironment });

    if (currentEnvironment === "prod") return null;

    return (
        <View style={styles.container}>
            <Typography color={styles.text.color}>
                {currentEnvironment} environment
            </Typography>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create(
    (theme, props: EnvironmentStyleProps) => {
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
    }
);
