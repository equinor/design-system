import {
    basicTextField,
    textFieldWithValidation,
} from "@/codeSnippets/textfield";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Spacer, TextField, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function TextFieldScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [validationEmail, setValidationEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="heading.lg">TextField</Typography>
                <Spacer amount="small" />
                <Typography variant="body.md">
                    TextFields combine an input with a label, helper text, and
                    validation states — great when you need more context around
                    user input.
                </Typography>
            </View>
            <View style={styles.section}>
                <Typography variant="heading.md">Basic TextField</Typography>

                <TextField
                    label="Full Name"
                    helperText="Enter your full name"
                    value={name}
                    onChange={setName}
                    placeholder="John Doe"
                />
            </View>

            <View style={styles.section}>
                <Typography variant="heading.md">TextField with Icon</Typography>

                <TextField
                    label="Email Address"
                    helperText="We'll never share your email"
                    value={email}
                    onChange={setEmail}
                    placeholder="john@example.com"
                    inputIcon={"email"}
                    helperIcon="star-face"
                />

                <ViewCode title="Basic TextField" code={basicTextField} />
            </View>

            <View style={styles.section}>
                <Typography variant="heading.md">TextField with Unit</Typography>

                <TextField
                    label="Amount"
                    unit="USD"
                    helperText="Enter the amount in US dollars"
                    value={amount}
                    onChange={setAmount}
                    placeholder="0.00"
                    meta="optional"
                />
            </View>

            <View style={styles.section}>
                <Typography variant="heading.md">Multiline TextField</Typography>

                <TextField
                    label="Message"
                    meta="Optional"
                    helperText="Share your thoughts"
                    value={message}
                    onChange={setMessage}
                    placeholder="Type your message here..."
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={styles.section}>
                <Typography variant="heading.md">TextField with Validation</Typography>
                <Typography style={styles.description}>
                    TextField with invalid state
                </Typography>

                <View style={{ marginBottom: 16 }}>
                    <TextField
                        label="Email Address"
                        helperText={
                            validationEmail === ""
                                ? "Enter a valid email address"
                                : validationEmail.includes("@") &&
                                    validationEmail.includes(".")
                                  ? "Email format is valid"
                                  : "Please include @ in your email"
                        }
                        value={validationEmail}
                        onChange={setValidationEmail}
                        placeholder="user@example.com"
                        invalid={
                            validationEmail !== "" &&
                            !(
                                validationEmail.includes("@") &&
                                validationEmail.includes(".")
                            )
                        }
                    />
                </View>

                <View style={{ marginBottom: 16 }}>
                    <TextField
                        label="Password"
                        helperText={
                            password === ""
                                ? "Password must be at least 8 characters"
                                : password.length >= 8
                                  ? "Password strength is good"
                                  : "Password is too short"
                        }
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter password"
                        invalid={password !== "" && password.length < 8}
                        secureTextEntry
                    />
                </View>

                <View>
                    <TextField
                        label="Username"
                        helperText={
                            username === ""
                                ? "Username must be 3-20 characters, letters and numbers only"
                                : /^[a-zA-Z0-9]{3,20}$/.test(username)
                                  ? "Username is available"
                                  : "Invalid username format"
                        }
                        value={username}
                        onChange={setUsername}
                        placeholder="johndoe123"
                        invalid={
                            username !== "" &&
                            !/^[a-zA-Z0-9]{3,20}$/.test(username)
                        }
                    />
                </View>

                <ViewCode
                    title="TextField with Validation"
                    code={textFieldWithValidation}
                />
                <Spacer amount="small" />
                <View style={styles.section}>
                    <Typography variant="heading.md">Read-only TextField</Typography>

                    <TextField
                        label="Read-only Field"
                        helperText="This field is not editable"
                        value="Cannot edit this"
                        onChange={() => {}}
                        readOnly
                    />
                </View>
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    description: {
        marginBottom: 16,
        opacity: 0.7,
    },
});
