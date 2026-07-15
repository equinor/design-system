<!-- source: https://documentation-v2.tokens.studio/releases/version-history.html -->

# Version History [​](#version-history)

Studio maintains a complete history of all releases, giving you an audit trail of your design system's evolution.

## Viewing Release History [​](#viewing-release-history)

1.  Go to the **Releases** tab
    
    ![Releases overview](/images/releases/releases-overview-light.png)![Releases overview](/images/releases/releases-overview-dark.png)
    
2.  Releases are listed in reverse chronological order
    
3.  Each entry shows the version number, release notes, date, and author
    

## Release Details [​](#release-details)

Click on any release to view its details. The release detail page shows:

-   The version number, title, and release date
    
-   Who created the release
    
-   Release notes describing what changed
    
-   A **Changed tokens** section listing all tokens that were added, updated, or removed compared to the previous release
    
    ![Release detail showing changed tokens](/images/releases/release-detail-light.png)![Release detail showing changed tokens](/images/releases/release-detail-dark.png)
    

Each token set is listed with a summary of changes. Expand a set to see individual token changes with their values.

## Using Releases in Your Pipeline [​](#using-releases-in-your-pipeline)

Releases integrate with your build pipeline through webhooks and CI/CD triggers. When a release is created, Studio can automatically notify your services and kick off builds.

-   **Webhooks** — Receive `release.created` events on your webhook endpoint. See [Webhooks](./../integrations/webhooks.html) for setup.
-   **CI/CD triggers** — Automatically start a pipeline in GitHub Actions, GitLab CI, Azure DevOps, Bitbucket, or CircleCI. See [CI/CD triggers](./../integrations/ci-cd-triggers.html) for setup.
-   **API** — Fetch release data programmatically using the [Releases API](./../api/releases.html).

## Next Steps [​](#next-steps)

-   [Creating a release](./creating-a-release.html)
-   [Webhooks](./../integrations/webhooks.html)
-   [CI/CD triggers](./../integrations/ci-cd-triggers.html)
-   [Releases API](./../api/releases.html)