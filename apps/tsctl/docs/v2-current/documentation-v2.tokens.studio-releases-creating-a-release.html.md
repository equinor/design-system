<!-- source: https://documentation-v2.tokens.studio/releases/creating-a-release.html -->

# Creating a Release [​](#creating-a-release)

Releases snapshot your design system at a point in time, giving you a versioned record that can trigger automated pipelines.

INFO

Releases are available for both token-based and variable-based projects. See [Project Types](./../getting-started/project-types.html) for details.

## What Is a Release? [​](#what-is-a-release)

A release is an immutable snapshot of your tokens on a specific branch. It records:

-   All tokens and their resolved values at the time of release
-   The version number
-   Who created it and when
-   Which branch and change set it was created from

## Creating a Release [​](#creating-a-release-1)

1.  Go to the **Releases** tab in your project
    
2.  Click **New Release**
    
    ![Releases overview with New Release button](/images/releases/releases-overview-light.png)![Releases overview with New Release button](/images/releases/releases-overview-dark.png)
    
3.  Enter a version number following [semantic versioning](https://semver.org/) (e.g., `1.0.0`)
    
4.  Optionally add release notes describing what changed
    
    ![Create release dialog](/images/releases/create-release-dialog-light.png)![Create release dialog](/images/releases/create-release-dialog-dark.png)
    
5.  Click **Release**
    

Studio creates the snapshot and triggers any configured integrations.

## Semantic Versioning [​](#semantic-versioning)

We recommend using semantic versioning for your releases:

-   **Major** (1.0.0 → 2.0.0) — Breaking changes (tokens removed, renamed, or fundamentally changed)
-   **Minor** (1.0.0 → 1.1.0) — New tokens added, non-breaking changes
-   **Patch** (1.0.0 → 1.0.1) — Bug fixes, minor value tweaks

## What Happens When You Release [​](#what-happens-when-you-release)

When you create a release:

1.  **Snapshot** — Studio captures all resolved token values
2.  **Webhooks** — Any configured webhook endpoints receive a notification with the release payload
3.  **CI Triggers** — Configured GitHub Actions or GitLab CI pipelines are triggered
4.  **History** — The release is added to the version history

## Viewing Past Releases [​](#viewing-past-releases)

1.  Go to the **Releases** tab
2.  Browse the list of past releases
3.  Click a release to see:
    -   The full set of tokens included
    -   The resolved values at that point in time
    -   Release metadata (version, date, author)

## Next Steps [​](#next-steps)

-   [Version history](./version-history.html)
-   [Webhooks](./../integrations/webhooks.html)
-   [CI/CD triggers](./../integrations/ci-cd-triggers.html)