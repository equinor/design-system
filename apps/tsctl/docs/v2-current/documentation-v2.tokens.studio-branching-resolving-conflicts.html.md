<!-- source: https://documentation-v2.tokens.studio/branching/resolving-conflicts.html -->

# Resolving Conflicts [​](#resolving-conflicts)

Conflicts occur when the same token is modified on both your branch and the target branch (usually main). Studio detects these conflicts automatically and provides tools to resolve them.

## When Do Conflicts Happen? [​](#when-do-conflicts-happen)

A conflict happens when:

-   You changed a token's value on your branch
-   Someone else changed the same token on main (or the main branch moved forward with a merge from another branch)
-   Both changes happened after your branch was created

This is the same concept as a merge conflict in Git, but applied to individual tokens.

## Detecting Conflicts [​](#detecting-conflicts)

When you open the merge preview, Studio checks for conflicts:

1.  Go to your branch
2.  Click **Merge Preview**
3.  Conflicts are highlighted in the preview

You can also check conflicts at any time:

1.  Open your branch
2.  Click **Conflict Details**
3.  See a detailed list of all conflicting tokens

## Resolving Conflicts [​](#resolving-conflicts-1)

For each conflict, you choose which version to keep:

1.  Open the conflict resolution view
2.  For each conflicting token, you'll see:
    -   **Your version** — The value on your branch
    -   **Their version** — The value on the target branch
    -   **Base version** — The value before either change
3.  Choose one:
    -   **Keep yours** — Use your branch's value
    -   **Keep theirs** — Use the target branch's value
4.  Once all conflicts are resolved, click **Complete Resolution**
5.  You can now proceed with the merge

## Avoiding Conflicts [​](#avoiding-conflicts)

To minimize conflicts:

-   **Keep branches short-lived.** The longer a branch exists, the more likely it is that main will diverge.
-   **Communicate with your team.** If two people are working on the same tokens, coordinate to avoid parallel changes.
-   **Merge frequently.** Merge main into your branch periodically to stay up to date.
-   **Use branch reviews.** A review process helps catch potential conflicts early.

## Next Steps [​](#next-steps)

-   [Merging changes](./merging-changes.html)
-   [Branch reviews](./branch-reviews.html)
-   [How branching works](./how-branching-works.html)