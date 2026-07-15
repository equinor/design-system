<!-- source: https://documentation.tokens.studio/plugins/companion-by-tokens-studio -->

[Plugins](/plugins)

# Companion by Tokens Studio [​](#companion-by-tokens-studio)

**Companion by Tokens Studio** is a Figma plugin designed to seamlessly sync and consume design tokens from Tokens Studio as variables in Figma. It ensures your design tokens are always structured and accessible within your Figma files, reflecting updates made in Studio.

![](/images/Companion%20Plugin.png)

### Setting Up Companion by Tokens Studio [​](#setting-up-companion-by-tokens-studio)

#### Step 1: Install and Launch the Plugin [​](#step-1-install-and-launch-the-plugin)

-   Open your Figma design file.
-   Navigate to **Plugins > Companion by Tokens Studio** and run the plugin.

#### Step 2: Syncing Tokens from Tokens Studio [​](#step-2-syncing-tokens-from-tokens-studio)

To set up the connection and sync your tokens:

1.  **Configure the API Key**:
    -   Refer to the Tokens Studio [API Keys](https://tokens.studio/platform) section to generate an API key.
    -   Paste the API key into the Companion plugin interface.
    -   Select your organization and project to complete the connection.
2.  **View Tokens**:
    -   Once synced, all design tokens created in Tokens Studio will be visible in the Companion plugin.
    -   Tokens are organized by **collections** and **modes** (modes) which corresponds to Theme Groups and Theme Options in Studio.

![](/images/Api%20key%20to%20companion.gif)

#### Step 3: Creating Variables in Figma [​](#step-3-creating-variables-in-figma)

1.  In your Figma file, navigate to the bottom of the Companion plugin interface and click **Create**.
2.  Variables will be generated in Figma, replicating the structure of your tokens in Studio:
    -   Theme Groups as Collections.
    -   Theme options structured as modes.

![](/images/Export%20Tokens%20to%20Figma%20Variables%20Companion%20Plugin.gif)

### Updating and Monitoring Tokens [​](#updating-and-monitoring-tokens)

#### Fetching Updates from Studio [​](#fetching-updates-from-studio)

-   If changes are made in Studio, click **Fetch from Studio** in the plugin to sync the updates.
-   Click **Create** again to generate the updated variables in Figma. Only the differential updates will be applied.

![](/images/Fetch%20Updates.png)

#### Watch Mode [​](#watch-mode)

-   Activate **Watch Mode** by clicking the **Watch Icon** in the plugin.
    -   This minimizes the plugin but monitors changes in Studio.
    -   Every 5 seconds, updates in Studio are automatically fetched and applied in Figma.
-   To stop Watch Mode, simply deactivate it by clicking the cancel button.

![](/images/Watch%20Mode%20Companion.gif)

### Managing Variables [​](#managing-variables)

-   **Delete Variables**: Use the **Delete Variables** button to remove all variables created through the plugin in the current Figma file.

### Watch the video walkthrough [​](#watch-the-video-walkthrough)