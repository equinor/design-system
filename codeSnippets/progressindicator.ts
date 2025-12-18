export const circularProgress = `import { CircularProgress } from "@equinor/eds-mobile-components";

// Indeterminate (loading)
<CircularProgress size={48} color="primary" />

// Determinate (with progress value)
<CircularProgress size={48} color="primary" value={0.5} />
<CircularProgress size={48} color="neutral" value={0.75} />`;

export const linearProgress = `import { LinearProgress } from "@equinor/eds-mobile-components";

// Indeterminate (loading)
<LinearProgress />

// Determinate (with progress value)
<LinearProgress value={0.3} />
<LinearProgress value={0.6} />`;

export const dotProgress = `import { DotProgress } from "@equinor/eds-mobile-components";

<DotProgress size={48} color="primary" />`;
