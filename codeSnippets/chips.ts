export const basicChips = `<View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
  <Chip
    title="Default Chip"
    onPress={() => console.log("Chip pressed")}
  />

  <Chip
    title="Active Chip"
    variant="active"
    onPress={() => console.log("Active chip pressed")}
  />

  <Chip
    title="Error Chip"
    variant="error"
    onPress={() => console.log("Error chip pressed")}
  />

  <Chip
    title="Disabled"
    disabled
    onPress={() => console.log("This won't fire")}
  />
</View>`;

export const deletableChips = `const [chipVisible, setChipVisible] = useState(true);

<View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
  {chipVisible && (
    <Chip
      title="Delete Me!"
      onDelete={() => setChipVisible(false)}
      onPress={() => console.log("Chip pressed")}
    />
  )}

  <Chip
    title="Deletable Error"
    variant="error"
    onDelete={() => console.log("Delete pressed")}
    onPress={() => console.log("Chip pressed")}
  />
</View>`;
