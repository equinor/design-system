export const basicInput = `const [value, setValue] = useState("");

<Input
  placeholder="Enter text here"
  value={value}
  onChange={setValue}
/>`;

export const inputWithAdornments = `<Input
  leftAdornments={
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Icon name="face-agent" />
    </View>
  }
  placeholder="Input with left icon"
/>

<Input
  rightAdornments={
    <View style={{ 
      justifyContent: "center", 
      alignItems: "center",
      paddingHorizontal: 8,
    }}>
      <Icon name="close" />
    </View>
  }
  placeholder="Input with right icon"
/>`;
