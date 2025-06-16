Follow these steps to ensure a smooth and consistent release process.

## 1. Create a Release Ticket

- Open a new release ticket (issue) in your project management tool.
- Note the ticket/issue number for use in the release branch name.

## 2. Create a New Release Branch

- In your terminal, create a new branch for the release using the following command:

  ```bash
  git checkout -b release-[ticket/issue number]
  ```

  - Replace `[ticket/issue number]` with the actual number. For example: `release-3692`.

## 3. Generate Release Notes

- Navigate to the **code** section on GitHub and go to [**Releases**](https://github.com/equinor/design-system/releases).
- Click [**Draft New Release**](https://github.com/equinor/design-system/releases/new).

  - **Name the Release**: Use the naming convention `eds-core-react@[version]`. Replace `[version]` with the new version number.
  - **Version number** Look at the [commit history](https://github.com/equinor/design-system/commits/develop/) to define what [sem version](https://semver.org/) we should use in the release.
  - **Tag Creation**: Select **Create a new tag on publish** and use the same value as release name.
  - **Generate Release Notes**:

    - Automatically generate the release notes.
    - Copy and paste the generated notes into the `CHANGELOG.md` file in your new release branch.
    - Filter out commits unrelated to the release, such as updated dev dependencies, changes to GitHub actions, etc.
    - Review and modify the notes to match the existing format, improving commit messages if needed.

  - Copy changelog back to release notes and save the release as a **Draft**.

## 4. Update the Version Number

- Open the `package.json` file and update the version number to the new release version.

## 5. Commit Changes

- Stage the changes and commit them with a clear message:
- If multiple packages are changed we should include this in the commit message. This will eventually be used as title in our pull request.

  ```bash
  git commit -m "🔖 Release eds-core-react@[version]"
  ```

  - Replace `[version]` with the version number, e.g., `0.42.5`.
  - Push changes

## 6. Create a Pull Request (PR)

- Open a pull request for the new release branch.
- In the PR description, include a reference to the release ticket: `resolves #[ticket/issue number]`.

## 7. Run GitHub Actions to Publish

- Go to **GitHub Actions**.
- Find the **Publish [package]** workflow.
- **Run the Workflow**:
  - Select the release branch you created.
  - **Tag for npm**: Use `latest`.
  - **Environment for Storybook**: Set to `production`.
- Ensure the workflow runs successfully by reviewing the action logs.
- Ensure the new version is published to npm [(@equinor/eds-core-react)](https://www.npmjs.com/package/@equinor/eds-core-react)

## 8. Merge Pull Request to Develop

- Once the release is published successfully, merge the pull request into the `develop` branch.
  - Ensure all changed packages are included in the release title for clarity.

## 9. Publish the Release on GitHub

- Go back to [**Releases**](https://github.com/equinor/design-system/releases) on GitHub.
- Publish the release. Ensure that all packages with changes have a unique release.

## 10. Update Master and Push Changes

- Switch to the `master` branch:

  ```bash
  git checkout master
  ```

- Rebase `master` with the latest changes from `develop`:

  ```bash
  git rebase develop
  ```

- Push the updates to the remote repository:

  ```bash
  git push
  ```

---

## 11. Verify

- Verify the new version is available on [npmjs](https://www.npmjs.com/package/@equinor/eds-core-react?activeTab=versions).
- Verify the new [storybook](https://storybook.eds.equinor.com/) is published.

## 12. Celebrate

- Announce the release in #eds-design-system
  Here's a template for future release announcements:

---

We've just released:

- **[package-name-1] v[version-number-1]**
- **[package-name-2] v[version-number-2]**

### **[Package-Name-1]:**

**Added**

- ✨ [Feature-1]: [Short description of the feature] by @[author]
- ✨ [Feature-2]: [Short description of the feature] by @[author]

**Fixed**

- 🐛 [Fix-1]: [Short description of the fix] by @[author]
- 🐛 [Fix-2]: [Short description of the fix] by @[author]

### **[Package-Name-2]:**

**Added**

- ✨ [Feature-1]: [Short description of the feature] by @[author]

> Note: [Include any important dependency or compatibility notes here.]

---

**Best,**  
The EDS Core Team

---
