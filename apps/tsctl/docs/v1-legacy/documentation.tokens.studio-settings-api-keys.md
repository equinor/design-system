<!-- source: https://documentation.tokens.studio/settings/api-keys -->

[Settings](/settings)

# API keys [​](#api-keys)

## Accessing the API Key Page [​](#accessing-the-api-key-page)

There are multiple ways to navigate to the **API Keys** page:

### From the Project Dashboard [​](#from-the-project-dashboard)

![](/images/Create%20API%20Key%20Light%20mode%20.png)

1.  Open your **Project Dashboard**.
2.  Click on **Create an API Key** to access the API Key management page.

### From the User Panel [​](#from-the-user-panel)

![](/images/CleanShot%202025-02-17%20at%2012.52.32.png)

1.  Locate the **left-side panel** of the interface.
2.  Click on the **API Keys** option to navigate directly to the API management page.

### Using a Keyboard Shortcut [​](#using-a-keyboard-shortcut)

![](/images/Create%20api%20key%20with%20cmd%20k.gif)

1.  Press **Cmd + K** (Mac) or **Ctrl + K** (Windows) to open the **Quick Menu**.
2.  Type **"API Key"** in the search bar.
3.  Select **Manage API Keys** to be redirected to the API Key page.

* * *

## Creating a New API Key [​](#creating-a-new-api-key)

![](/images/Api%20Key%20\(1\).gif)

DANGER

🚨 **Important:** Once created, the API key will only be shown **once**. Make sure to copy and store it securely.

To generate a new API Key:

**Step 1**

Navigate to the **API Keys** page.

![](/images/Create%20API%20Key%20Light%20mode%20%20\(1\).png)

Click on **Create New Token**

![](/images/API%20Keys%20page%20.png)

**Step 2**

Enter a **name** for your API key.

This should something easily identifiable for future reference.

**Step 3**

Set the expiration period for the key.

For additional security, you can choose to have the token become non-functional after a set period of time.

**Step 4**

Set the scope of the key.

![](/images/Create%20new%20PAT%20.png)

Choose the data and actions that users and tools using the token can access and perform.

TIP

If you're using the [Tokens Studio For Figma Plugin](./../plugins/tokens-studio-for-figma-plugin) or the [Companion By Tokens Studio](./../plugins/companion-by-tokens-studio) plugin, you'll need to enable `project:read` , `project:write` and `actor_tokens:create`

| Scope | Description |
| --- | --- |
| `me:read` | Read account data for the currently logged in user. |
| `organizations:read` | Read data about the organization |
| `organizations:write` | Update data and settings for the organization |
| `organizations:admin` | Administer organization data |
| `organizations:user:read` | Read data regarding the users in an organization |
| `organizations:user:invite` | Can invite users to an organizations |
| `organizations:user:write` | Can update user data in an organization |
| `projects:read` | Read project data directly |
| `projects:write` | Update project data |
| `projects:admin` | Administer Projects |
| `actor_tokens:create` | Create actor tokens for the user |

* * *

## Managing API Keys [​](#managing-api-keys)

-   The **API Keys** page displays a list of previously created keys.
-   You can **delete** old keys when they are no longer needed.
-   For security, API keys **cannot be viewed again** after creation.

![](/images/Peronsal%20Access%20Tokens.png)

* * *

## Using API Keys [​](#using-api-keys)

-   API keys can be used to authenticate connections between **Studio** and **Figma** (or other external platforms).
-   They are tied to your **user account**, meaning they grant access to all organizations and projects you are part of.

For more details on using API keys for **Figma integration**, refer to the [Connecting Studio to Figma](./../connect-studio-to-figma/) guide.

* * *

### Security Best Practices [​](#security-best-practices)

-   Store API keys in a **secure password manager**.
-   Avoid sharing API keys publicly or committing them to version control.
-   Regularly **rotate** keys to maintain security.

* * *

### Related [​](#related)

-   [Connect Studio To Figma](./../connect-studio-to-figma/)
-   [Connect Studio To Code](./../connect-studio-to-code/)
-   [Using Tokens Studio For Figma](./../connect-studio-to-figma/using-tokens-studio-for-figma)
-   [Using Companion By Tokens Studio](./../connect-studio-to-figma/using-companion-by-tokens-studio)