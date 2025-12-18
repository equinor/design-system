export const environmentBanner = `import { 
  EnvironmentBanner, 
  EnvironmentProvider 
} from "@equinor/eds-mobile-components";

// Development Environment
<EnvironmentProvider currentEnvironment="dev">
  <EnvironmentBanner />
</EnvironmentProvider>

// Test Environment
<EnvironmentProvider currentEnvironment="test">
  <EnvironmentBanner />
</EnvironmentProvider>

// Q&A Environment
<EnvironmentProvider currentEnvironment="qa">
  <EnvironmentBanner />
</EnvironmentProvider>`;
