export const statesButtons = `// Different colors/states
<Button
  title="Primary Button"
  color="primary"
  onPress={() => alert("Primary pressed")}
/>

<Button
  title="Secondary Button"
  color="secondary"
  onPress={() => alert("Secondary pressed")}
/>

<Button
  title="Danger Button"
  color="danger"
  onPress={() => alert("Danger pressed")}
/>

<Button
  title="Disabled Button"
  variant="contained"
  disabled
/>`;
export const variantButtons = `
// Different variants
<Button
  title="Contained Button"
  variant="contained"
  onPress={() => alert("Contained pressed")}
/>

<Button
  title="Outlined Button"
  color="secondary"
  variant="outlined"
  onPress={() => alert("Outlined pressed")}
/>

<Button
  title="Ghost Button"
  variant="ghost"
  onPress={() => alert("Ghost pressed")}
/>`;

export const iconButtons = `// Icon positions
<Button
  title="Leading"
  iconPosition="leading"
  variant="outlined"
  iconName="home-outline"
/>

<Button
  title="Trailing"
  iconPosition="trailing"
  iconName="send-outline"
  variant="outlined"
/>

<Button.Icon
  name="heart"
  onPress={() => alert("Heart pressed")}
/>

<Button.Icon
  name="star"
  variant="outlined"
  onPress={() => alert("Star pressed")}
/>

<Button.Icon
  name="close"
  variant="ghost"
  onPress={() => alert("Close pressed")}
/>

<Button.Icon
  name="check"
  disabled
/>`;

export const toggleButtons = `<Button.Toggle activeIndex={togglePressed ? 1 : 0}>
  <Button title="Option 1" onPress={() => setTogglePressed(false)} />
  <Button title="Option 2" onPress={() => setTogglePressed(true)} />
</Button.Toggle>`;
