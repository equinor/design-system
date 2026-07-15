<!-- source: https://documentation.tokens.studio/guides/migrating-from-tokens-studio-for-figma-plugin-to-the-tokens-studio-platform -->

[Guides](/guides)

# Migrating from Tokens Studio for Figma Plugin to the Tokens Studio Platform [​](#migrating-from-tokens-studio-for-figma-plugin-to-the-tokens-studio-platform)

## Prerequisites [​](#prerequisites)

-   A studio account with an active subscription

## Migration Steps [​](#migration-steps)

### Step 1: Export your tokens from Tokens Studio for Figma [​](#step-1-export-your-tokens-from-tokens-studio-for-figma)

Within the Tokens Studio for Figma Plugin, click on the "Tools" icon button on the bottom left of the plugin. Within the menu, select "Export to file/folder".

![](/images/2025-08-14%20at%2014.35.39%20-%20Screengrab@2x.png)

### Step 2: Choose "Multiple Files" for the export [​](#step-2-choose-multiple-files-for-the-export)

You'll be given an option to export your tokens to a single file, or multiple files. To maintain a similar structure within Studio, a multiple file export will ensure that your token sets, themes and configuration are maintained.

When exported, you will be asked to save a Tokens.zip to your system.

![](/images/2025-08-14%20at%2014.39.30%20-%20Screengrab@2x.png)

### Step 3: Create a new project with Studio [​](#step-3-create-a-new-project-with-studio)

In your browser, navigate to [https://app.prod.tokens.studio](https://app.prod.tokens.studio/org). Once logged in, create a new project from the dashboard of your organization to upload the tokens to.

![](/images/2025-08-14%20at%2014.41.40%20-%20Screengrab@2x.png)

### Step 4: Open the upload tokens modal [​](#step-4-open-the-upload-tokens-modal)

Once your project has been created, you will be navigated to the dashboard screen of the project. There is a banner on the top of this screen with an button to "Upload tokens".

![](/images/2025-08-14%20at%2014.43.51%20-%20Screengrab@2x.png)

Once clicked, this will open the modal and allow you to upload the zip file from the previous step.

![](/images/2025-08-14%20at%2014.44.03%20-%20Screengrab@2x.png)

### Step 5: Add the exported zip file to upload [​](#step-5-add-the-exported-zip-file-to-upload)

Drag the zip file from your system, or click the modal area to open a file picker.

Add the zip file and the upload will begin.

![](/images/2025-08-14%20at%2014.47.52%20-%20Screengrab@2x.png)

### Step 6: Verify the tokens were uploaded correctly [​](#step-6-verify-the-tokens-were-uploaded-correctly)

Once the upload is completed, you can close the modal and see your token sets created with the themes present in the theme switcher below.

![](/images/2025-08-14%20at%2014.52.10%20-%20Screengrab@2x.png)

## Next steps [​](#next-steps)

Now that you've got your tokens migrated from Figma to Studio, you have a single source of truth that you can use. That means that you can now pull tokens from Studio into your Figma using our companion plugin, or integrate the CLI into your pipelines.

[Using Companion By Tokens Studio](./../connect-studio-to-figma/using-companion-by-tokens-studio)

[Tokens Studio Cli](./../connect-studio-to-code/tokens-studio-cli)

[Integrating With Github Actions](./integrating-with-github-actions)