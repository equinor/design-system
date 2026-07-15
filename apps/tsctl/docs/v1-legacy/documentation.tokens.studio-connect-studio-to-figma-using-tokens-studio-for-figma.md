<!-- source: https://documentation.tokens.studio/connect-studio-to-figma/using-tokens-studio-for-figma -->

[Connect Studio to Figma](/connect-studio-to-figma)

# Using Tokens Studio for Figma [​](#using-tokens-studio-for-figma)

**Prerequisites**:

-   [Api Keys](./../settings/api-keys)

### Step 1: Open a Figma design file [​](#step-1-open-a-figma-design-file)

This can be an empty file to ensure that your production designs are not affected while setting up connection with Studio.

### Step 2: Install/Launch Tokens Studio for Figma [​](#step-2-installlaunch-tokens-studio-for-figma)

1.  Go to Plugins > Tokens Studio for Figma.
2.  In the plugin’s interface, open a "New empty file".

![](/images/Screenshot%202025-11-21%20at%203.37.32%E2%80%AFPM.png)![](/images/Screenshot%202025-11-21%20at%203.53.08%E2%80%AFPM.png)

### Step 3: Adding a new sync provider [​](#step-3-adding-a-new-sync-provider)

1.  Open the Settings tab on the plugin.
2.  Click on Add new sync provider.
3.  Select Token Studio from the list.

![](/images/Screenshot%202025-11-21%20at%204.26.29%E2%80%AFPM.png)![](/images/Screenshot%202025-11-21%20at%204.30.12%E2%80%AFPM%20\(1\).png)

### Step 4: Setting up Token Studio sync [​](#step-4-setting-up-token-studio-sync)

1.  Return to Studio and go to the dashboad on the left panel.
2.  Click on Find your API key. You can also jump to the API keys page by using the keyboard shortcut cmd+k.
3.  The API key is linked to the user which means that it gives access to all the Organisations and Projects that a user is part of.

For more info read [Platform > API keys](./../settings/api-keys).

![](/images/Screenshot%202025-11-21%20at%204.33.04%E2%80%AFPM.png)

### Step 5: Creating your API key [​](#step-5-creating-your-api-key)

1.  Click on create an api key.
2.  Give your API key a name.
3.  Select the necessary scopes ( [Api Keys](./../settings/api-keys)for more details on what scope to choose)
4.  Click create token.
5.  Copy your API key.

IMPORTANT: Your API key will not be visible again, so make sure to copy it.

![](/images/Screenshot%202025-11-21%20at%204.39.58%E2%80%AFPM%20\(1\).png)![](/images/Screenshot%202025-11-21%20at%204.41.06%E2%80%AFPM.png)

![](/images/Screenshot%202025-11-21%20at%204.41.29%E2%80%AFPM.png)

### Step 6: Finish adding Studio sync on the plugin [​](#step-6-finish-adding-studio-sync-on-the-plugin)

1.  Return to Figma, on the plugin click on the sync provider we just created
2.  Give a name for the sync for easy identification.
3.  Enter the API key we just copied in the Personal Access Token field.
4.  Choose the Organisation that you want to connect.
5.  Choose the Project that you want to connect.
6.  You are now connected to Studio and your tokens should reflect in the plugin under the Tokens tab

![](/images/Screenshot%202025-11-21%20at%204.55.08%E2%80%AFPM.png)![](/images/Screenshot%202025-11-21%20at%204.53.10%E2%80%AFPM.png)

### Step 7: Bi-directional syncing [​](#step-7-bi-directional-syncing)

1.  Connection with Studio and the plugin is a bi-directional sync.
2.  Any changes on Studio can be pulled in the plugin by clicking on sync icon at the bottom left of the plugin.
3.  Any changes on the plugin will be automatically updated on the studio.