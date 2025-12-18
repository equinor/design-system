export const radioButtons = `const [selectedRadio, setSelectedRadio] = useState<number>(0);

<View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
  <Radio
    checked={selectedRadio === 0}
    onPress={() => setSelectedRadio(0)}
    color="primary"
  />
  <Radio
    checked={selectedRadio === 1}
    onPress={() => setSelectedRadio(1)}
    color="secondary"
  />
  <Radio
    checked={selectedRadio === 2}
    onPress={() => setSelectedRadio(2)}
    color="success"
  />
  <Radio
    checked={true}
    disabled
    color="primary"
  />
</View>`;

export const switchControl = `const [switchActive, setSwitchActive] = useState(false);

<Switch
  active={switchActive}
  onChange={setSwitchActive}
  color="primary"
/>

{/* Small variant */}
<Switch.Small
  active={switchActive}
  onChange={setSwitchActive}
/>

{/* Disabled */}
<Switch
  active={true}
  disabled
  color="primary"
/>`;
