import { Paper, Typography } from "@equinor/eds-mobile-components";
import { Image, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.hero}>
                <Image
                    source={require("../../assets/images/puzzle_illu.png")}
                    style={styles.image}
                />
            </View>
            <View style={styles.welcome}>
                <Typography variant="h2" style={styles.title}>
                    EDS Mobile
                </Typography>
                <Typography variant="h6">
                    Equinor Design System for React Native
                </Typography>
            </View>
            <View style={styles.section}>
                <Typography variant="p">
                    This is a component library showcase for the Equinor Design
                    System Mobile.
                </Typography>
            </View>
            <View
                style={[
                    styles.section,
                    {
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    },
                ]}
            >
                <Paper elevation="raised" style={{ padding: 16 }}>
                    <Typography variant="h6">What&apos;s New</Typography>
                    <Typography
                        variant="p"
                        style={{ flexWrap: "wrap", fontSize: 14 }}
                    >
                        We are happy to...
                    </Typography>
                </Paper>
                <Paper elevation="raised" style={{ padding: 16 }}>
                    <Typography variant="h6">Getting Started</Typography>
                    <Typography
                        variant="p"
                        style={{ flexWrap: "wrap", fontSize: 14 }}
                    >
                        Welcome to the ...
                    </Typography>
                </Paper>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: "#fff",
    },
    hero: {
        padding: 10,
        alignItems: "center",
    },
    welcome: {
        marginTop: 40,
        alignItems: "center",
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#000",
        paddingVertical: 8,
    },
    section: {
        padding: 24,
    },
});
