export const basicPaper = `import { Paper, Typography } from "@equinor/eds-mobile-components";

<Paper elevation="raised" style={{ padding: 16 }}>
  <Typography>
    This is a Paper component with raised elevation.
  </Typography>
</Paper>`;

export const paperElevations = `import { Paper, Typography, Elevation } from "@equinor/eds-mobile-components";

// Available elevations: 'none', 'raised', 'overlay', 'sticky', 'temporaryNav', 'aboveScrim'

<Paper elevation="none" style={{ padding: 16 }}>
  <Typography>No elevation</Typography>
</Paper>

<Paper elevation="raised" style={{ padding: 16 }}>
  <Typography>Raised elevation</Typography>
</Paper>

<Paper elevation="overlay" style={{ padding: 16 }}>
  <Typography>Overlay elevation</Typography>
</Paper>`;
