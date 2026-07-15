<!-- source: https://documentation.tokens.studio/getting-started/setting-up-studio/import-from-figma-variables -->

[Getting Started](/getting-started)›[Setting up Studio](/getting-started/setting-up-studio)

# Import from Figma variables [​](#import-from-figma-variables)

If you already have design tokens or variables in Figma, you can easily import them into Studio.

### Step 1: Open Figma and your design file [​](#step-1-open-figma-and-your-design-file)

In Figma, ensure you have set up Figma Variables that you want to migrate.

### Step 2: Launch the Tokens Studio for Figma Plugin [​](#step-2-launch-the-tokens-studio-for-figma-plugin)

1.  Go to Plugins > Tokens Studio for Figma.
2.  In the plugin’s interface, click **New empty file**.

![](/images/image%20\(3\).png)

### Step 3: Import Figma Variables [​](#step-3-import-figma-variables)

1.  In the plugin, click the **Styles & Variables** dropdown and select **Import Variables.**
2.  Answer questions about how you want to format your token values. For example, you can choose whether to convert numbers to dimensions, use rem values, etc.
3.  Click **Import**.

![](/images/image%20\(1\)%20\(1\)%20\(1\).png)

INFO

_Tip: You might see collections such as “foundation” or “light” and “dark” in Figma, which will become token sets groups and the modes will become token sets in Studio. The Figma collections will be mapped as Theme Groups and modes as Theme Options in Studio._

### Step 4: Export your design tokens [​](#step-4-export-your-design-tokens)

1.  In the bottom-left of the plugin, click **Export file/folder**.
2.  Choose **Multiple files** and then **Export**.
3.  This will download a .zip file containing your tokens in JSON format. You can save this anywhere locally on your system.

![](/images/image%20\(6\).png)

### Step 5: Upload Tokens to Studio [​](#step-5-upload-tokens-to-studio)

1.  Return to the Tokens Studio app in your browser.
2.  Navigate to your Project Dashboard.
3.  Using the zip file downloaded above, click the **Upload tokens** or drag-and-drop the zip file into the upload area.

![](/images/Import%20Tokens.gif)

### Step 6: Reviewing imported tokens and themes [​](#step-6-reviewing-imported-tokens-and-themes)

1.  Studio will parse the .zip file and create matching sets (e.g., foundation, light, dark).
2.  Verify that your sets and tokens appear correctly in the left-hand panel.
3.  Go to the Themes module on the left panel.
4.  Verify that your theme groups and theme options appear correctly.

![](/images/CleanShot%202025-02-14%20at%2013.55.01@2x.png)

### Step 7: Organizing and Theming Your Tokens [​](#step-7-organizing-and-theming-your-tokens)

Studio supports theming through the concept of Theme Groups and Theme Options. This allows you to toggle between sets like light and dark, or any other variant (for more information on Themes check out [Features > Themes](./../../platform/themes/)).

The Figma collections will be created as Theme Groups and modes will be created as Theme Options.

1.  Open the Theme Panel  
    • In your project, click the Themes tab.
2.  Verify that your collections have been created as Theme Groups (e.g., Color Mode, breakpoint)
3.  Verify that the modes in your collections have been created as Theme Options under the corresponding Theme Group (e.g., Light and Dark in Color Mode)
4.  Click on the Theme Option on the left panel to see the sets that are enabled for the Theme Option.
5.  Open the Tokens tab on the left panel.  
    • At the bottom of the left-hand panel, you can select which theme is active (e.g., Default + Light or Default + Dark).  
    • This will update the token values displayed in the UI.

![](/images/CleanShot%202025-02-14%20at%2013.55.12@2x.png)