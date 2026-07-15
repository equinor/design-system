<!-- source: https://documentation-v2.tokens.studio/figma/resolving-sync-conflicts.html -->

# Resolving Sync Conflicts [​](#resolving-sync-conflicts)

Sync conflicts occur when a token/variable has been changed in both Studio and Figma since the last sync.

## When Do Conflicts Happen? [​](#when-do-conflicts-happen)

A sync conflict happens when:

-   A token value was changed in Studio
-   The corresponding variable value was changed in Figma
-   Neither change has been synced yet

![Exports tab showing sync status](/images/figma/exports-tab-light.png)![Exports tab showing sync status](/images/figma/exports-tab-dark.png)

## Detecting Conflicts [​](#detecting-conflicts)

When you start a sync:

1.  Studio compares the current state in both Studio and Figma
2.  Conflicts are highlighted in the sync diff
3.  Each conflict shows:
    -   The Studio value
    -   The Figma value
    -   The last synced value (baseline)

## Resolving Conflicts [​](#resolving-conflicts)

For each conflict, choose which value to keep:

1.  **Keep Studio value** — The Studio token value overwrites the Figma variable
2.  **Keep Figma value** — The Figma variable value overwrites the Studio token

You can resolve conflicts individually or in bulk:

-   **Resolve one by one** — Click each conflict and choose a resolution
-   **Keep all Studio values** — Resolve all conflicts in favor of Studio
-   **Keep all Figma values** — Resolve all conflicts in favor of Figma

After resolving all conflicts, click **Confirm Sync** to apply the changes.

## Source of Truth Setting [​](#source-of-truth-setting)

Your project's source-of-truth setting helps minimize conflicts:

-   **Tokens as source** — Studio is authoritative; Figma conflicts default to Studio's value
-   **Variables as source** — Figma is authoritative; conflicts default to Figma's value

Even with a source of truth configured, you can still override individual conflict resolutions.

## Preventing Conflicts [​](#preventing-conflicts)

-   **Sync frequently.** Regular syncs reduce the chance of parallel changes.
-   **Establish clear ownership.** Decide whether designers edit in Figma or Studio, not both simultaneously.
-   **Use the source-of-truth setting.** This makes conflict resolution predictable.

## Next Steps [​](#next-steps)

-   [Syncing variables](./syncing-variables.html)
-   [Connecting to Figma](./connecting-to-figma.html)