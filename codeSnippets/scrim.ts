export const basicScrim = `import { Scrim, Button, Typography, View } from "@equinor/eds-mobile-components";
import { useState } from "react";

const [scrimOpen, setScrimOpen] = useState(false);

<>
  <Button title="Show Scrim" onPress={() => setScrimOpen(true)} />

  <Scrim isOpen={scrimOpen} onPress={() => setScrimOpen(false)}>
    <View style={{ backgroundColor: "white", padding: 24, margin: 20, borderRadius: 12 }}>
      <Typography variant="h5">Scrim Content</Typography>
      <Typography>
        This content appears on top of the scrim overlay.
        Tap the dark area to close.
      </Typography>
      <Button
        title="Close"
        onPress={() => setScrimOpen(false)}
        variant="outlined"
      />
    </View>
  </Scrim>
</>`;
