export const basicTabs = `<Tabs initialActiveIndex={0}>
  <Tabs.Tab title="First Tab">
    <View style={{ padding: 16 }}>
      <Typography>Content for the first tab</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Second Tab">
    <View style={{ padding: 16 }}>
      <Typography>Content for the second tab</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Third Tab">
    <View style={{ padding: 16 }}>
      <Typography>Content for the third tab</Typography>
    </View>
  </Tabs.Tab>
</Tabs>`;

export const tabsWithIcons = `<Tabs initialActiveIndex={0}>
  <Tabs.Tab title="Home" iconName="home">
    <View style={{ padding: 16 }}>
      <Typography>Home content</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Search" iconName="magnify">
    <View style={{ padding: 16 }}>
      <Typography>Search content</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Settings" iconName="cog">
    <View style={{ padding: 16 }}>
      <Typography>Settings content</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Disabled" disabled>
    <View style={{ padding: 16 }}>
      <Typography>This content is disabled</Typography>
    </View>
  </Tabs.Tab>
</Tabs>`;

export const scrollableAndDisabledTabs = `{/* Scrollable tabs for many items */}
<Tabs scrollable initialActiveIndex={0}>
  <Tabs.Tab title="Tab One">
    <View style={{ padding: 16 }}>
      <Typography>Content for tab one</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Tab Two">
    <View style={{ padding: 16 }}>
      <Typography>Content for tab two</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Tab Three">
    <View style={{ padding: 16 }}>
      <Typography>Content for tab three</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Tab Four">
    <View style={{ padding: 16 }}>
      <Typography>Content for tab four</Typography>
    </View>
  </Tabs.Tab>
</Tabs>

{/* Tabs with disabled state */}
<Tabs initialActiveIndex={0}>
  <Tabs.Tab title="Active">
    <View style={{ padding: 16 }}>
      <Typography>Active tab content</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Disabled" disabled>
    <View style={{ padding: 16 }}>
      <Typography>This content will not be accessible</Typography>
    </View>
  </Tabs.Tab>
  <Tabs.Tab title="Another">
    <View style={{ padding: 16 }}>
      <Typography>Another tab content</Typography>
    </View>
  </Tabs.Tab>
</Tabs>`;
