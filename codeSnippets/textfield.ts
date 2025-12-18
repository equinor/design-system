export const basicTextField = `const [value, setValue] = useState("");

<TextField
  label="Full Name"
  helperText="Enter your full name"
  value={value}
  onChange={setValue}
  placeholder="John Doe"
/>

<TextField
  label="Email Address"
  helperText="We'll never share your email"
  value={value}
  onChange={setValue}
  placeholder="john@example.com"
  inputIcon="email"
  helperIcon="star-face"
/>`;

export const textFieldWithValidation = `const [email, setEmail] = useState("");

<TextField
  label="Email Address"
  helperText={
    email === ""
      ? "Enter a valid email address"
      : email.includes("@") && email.includes(".")
        ? "Email format is valid"
        : "Please include @ in your email"
  }
  value={email}
  onChange={setEmail}
  placeholder="user@example.com"
  variant={
    email === ""
      ? undefined
      : email.includes("@") && email.includes(".")
        ? "success"
        : "danger"
  }
  inputIcon={
    email === ""
      ? "email"
      : email.includes("@") && email.includes(".")
        ? "check-circle"
        : "alert-circle"
  }
/>`;
