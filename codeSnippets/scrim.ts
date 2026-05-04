export const basicScrim = `import { Scrim, Button, Typography, View } from "@equinor/eds-mobile-components";
import { useState } from "react";

const [scrimOpen, setScrimOpen] = useState(false);

<>
  <Button label="Show Scrim" onPress={() => setScrimOpen(true)} />

  <Scrim isOpen={scrimOpen} onPress={() => setScrimOpen(false)}>
    <View style={{ backgroundColor: "white", padding: 24, margin: 20, borderRadius: 12 }}>
      <Typography.Header size="lg">Scrim Content</Typography.Header>
      <Typography>
        This content appears on top of the scrim overlay.
        Tap the dark area to close.
      </Typography>
      <Button
        label="Close"
        onPress={() => setScrimOpen(false)}
        variant="secondary"
      />
    </View>
  </Scrim>
</>`;
