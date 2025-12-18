export const verticalSpacer = `import { Spacer } from "@equinor/eds-mobile-components";

<View>
  <Text>First element</Text>
  <Spacer amount="small" />  {/* 8px */}
  <Text>Second element</Text>
  <Spacer amount="medium" /> {/* 16px (default) */}
  <Text>Third element</Text>
  <Spacer amount="large" />  {/* 24px */}
  <Text>Fourth element</Text>
</View>`;

export const horizontalSpacer = `import { Spacer } from "@equinor/eds-mobile-components";

<View style={{ flexDirection: 'row' }}>
  <Text>First</Text>
  <Spacer amount="small" direction="horizontal" />
  <Text>Second</Text>
  <Spacer amount="large" direction="horizontal" />
  <Text>Third</Text>
</View>`;
