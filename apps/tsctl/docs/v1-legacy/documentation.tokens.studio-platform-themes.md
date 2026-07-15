<!-- source: https://documentation.tokens.studio/platform/themes/ -->

[Platform](/platform)

# Themes [​](#themes)

## Overview [​](#overview)

The **Themes Module** in Studio allows you to configure and manage T**heme groups** and T**heme options**, which directly impact the [**Tokens Module**](./../tokens/) and [**Configuration Module**](./../configuration). This ensures a structured approach to managing design variations such as **light mode, dark mode**, or brand-specific themes.

![](/images/Tokens%20and%20Themes.png)

## Accessing the Themes Module [​](#accessing-the-themes-module)

1.  **Navigate to Themes Module:**
    
    -   From the **left panel**, click on **Themes** to enter the module.
2.  **Understanding the Layout:**
    
    -   The **left panel** displays a list of existing **theme groups** and their corresponding **theme options**.  
        
    
    ![](/images/Themes%20Module%20New.png)
    
    -   Each theme option shows:
        -   **Number of token sets configured**
        -   **Number of variables connected to the option**  
            
    
    ![](/images/Themes%20Module%20Options.png)
    

## Creating and Managing Theme Groups [​](#creating-and-managing-theme-groups)

### **Create a New Theme Group** [​](#create-a-new-theme-group)

-   Click on **Create Group**.
-   Enter a **name** for the theme group.
-   Click **Create** to save.

![](/images/Create%20Theme%20Group.gif)

### **Adding Theme Options** [​](#adding-theme-options)

-   Select a **theme group**.
-   Click **Add Option** to create a new theme option.
-   Save the changes.  
    

![](/images/Settings%20Theme%20Options.gif)

## Configuring Token Sets for Theme Options [​](#configuring-token-sets-for-theme-options)

1.  **Select a Theme Option** from the **left panel**.
2.  You will see all available **token sets**.
3.  Assign token sets using one of the following states:
    -   **Disabled:** The token set is not included in the theme option.
    -   **Enabled:** All tokens in the set are included.
    -   **Source:** This is primarily for **Figma Variables**, ensuring references between collections remain intact.

![](/images/Themes%20Module%20Options.png)

### How Themes Reflect in the Tokens Module [​](#how-themes-reflect-in-the-tokens-module)

-   Once you set up **theme groups** and **theme options**, they appear in the **Tokens Module**.
-   Located at the **bottom left navigation**, you can see:
    -   **Theme Groups** (e.g., Brand, Theme)
    -   **Theme Options** (e.g., Light, Dark)

![](/images/Themes%20in%20Tokens%20Module.png)

## Themes in the Configuration Page [​](#themes-in-the-configuration-page)

-   Theme groups are used in the **Configuration Page** to ensure **token resolution** functions correctly across themes.s
-   When Tokens Studio is **linked to the** [**Companion plugin**](./../../connect-studio-to-figma/using-companion-by-tokens-studio) **or** [**Tokens Studio for Figma**](./../../connect-studio-to-figma/using-tokens-studio-for-figma), theme groups translates as **Figma Variable collections**.
-   Theme **options** translate as **Modes** in **Figma Collections**.

### How Themes Reflect as Figma Variables [​](#how-themes-reflect-as-figma-variables)

-   Once you connect Studio to Figma via [**Tokens Studio for Figma plugin**](./../../connect-studio-to-figma/using-tokens-studio-for-figma) or [**Companion by Tokens Studio**](./../../connect-studio-to-figma/using-companion-by-tokens-studio)**,** you can create Figma variables using your design tokens.
-   Theme groups are created as Collections in Figma variables (e.g., Brand, Theme).
-   Theme options are created as Modes inside the variable Collection (e.g., Light, Dark).  
    

![](/images/CleanShot%202025-02-26%20at%2021.44.22@2x.png)

![](/images/CleanShot%202025-02-26%20at%2021.47.27@2x.png)