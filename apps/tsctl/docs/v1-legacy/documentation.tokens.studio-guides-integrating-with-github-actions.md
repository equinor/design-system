<!-- source: https://documentation.tokens.studio/guides/integrating-with-github-actions -->

[Guides](/guides)

# Integrating with Github Actions [​](#integrating-with-github-actions)

Github Actions provides tooling to create workflows for bundling assets, running tests, building for production and more. Tokens Studio fits in well with that process, allowing teams to pull the latest tokens directly from Tokens Studio into your projects.

#### Prerequisites [​](#prerequisites)

-   [Api Keys](./../settings/api-keys)
-   [Tokens Studio Cli](./../connect-studio-to-code/tokens-studio-cli)
-   Working knowledge of Github and Git

## Example Workflow [​](#example-workflow)

Let's walk through a basic example of setting up a Github Action that will pull the latest updates from Tokens Studio using the [Tokens Studio CLI](./../connect-studio-to-code/tokens-studio-cli).

### Step 1: Get your API Key [​](#step-1-get-your-api-key)

Create a new API Key in Tokens Studio. You can follow our guide to creating one - [Creating A New Api Key](./../settings/api-keys#creating-a-new-api-key). Be sure to keep it safe and close by as we will need it.

### Step 2: Save the API Key to your Github repo [​](#step-2-save-the-api-key-to-your-github-repo)

![](/images/2025-07-30%20at%2012.59.26%20-%20Screengrab@2x.png)

Inside the Github repository that contains your code, click the **Settings tab** in the top bar.

Next, expand the **Secrets and variables** option in the sidebar to view **Actions**

WARNING

**Don't see these options?**

You may need to get permissions adjusted from the Github admin within your organization.

Click the **New repository secret** button to open the form to add your token.

![](/images/2025-07-30%20at%2013.04.07%20-%20Screengrab@2x.png)

In the form, add a **name** of `TOKENS_STUDIO_API_KEY` and paste the API token you created in the **Secret** field. Click **Add secret** to save it.

### Step 3: Install the Tokens Studio CLI to your project [​](#step-3-install-the-tokens-studio-cli-to-your-project)

In your project, install the Tokens Studio SDK package from NPM using your package manager of choice.

bash

```
npm install @tokens-studio/sdk
```

You can see the full instructions here - [Installing The Cli](./../connect-studio-to-code/tokens-studio-cli#installing-the-cli)

### Step 4: Set up your project with Tokens Studio [​](#step-4-set-up-your-project-with-tokens-studio)

Once installed, you will need to configure the SDK to work with your account.

In your terminal run `npx tokensstudio setup --host graphql.prod.tokens.studio`

You will be asked to enter the API Token you created above and will have the ability to configure the organization you'd like to pull from. Once completed, there will be a `.tokensstudio.json` file created. Be sure to include this when you push your updates to Github.

You can find full instructions on how to set this up at [Using The Cli](./../connect-studio-to-code/tokens-studio-cli#using-the-cli).

### Step 5: Create an Node script to run the SDK [​](#step-5-create-an-node-script-to-run-the-sdk)

Since we're going to be asking Github's tooling to run scripts on our behalf, we need to set up a script in our package.json that Github can run.

This may be unique depending on your project needs, but for this example, we'll just pull tokens into our project.

In your package.json file, add a task to your `scripts` object named `tokens:sync`

```
{
    ...,
    "scripts": {
        ...,
        "tokens:sync": "npx tokensstudio pull --host graphql.prod.tokens.studio"
    },
    ...
}
```

INFO

You can name the task whatever you'd like of course, we're just fans of declarative naming.

### Step 6: Set up your Github action [​](#step-6-set-up-your-github-action)

At the root of your project, create a folder named `.github` with a subfolder named `workflows`

Create a file named `pull-tokens.yml` and include the contents below in it.

You'll notice that step 4 asks for a TOKENS\_STUDIO\_API\_KEY. This will use the key we saved in Github earlier.

INFO

This is an example of course. You may need to use different versions of Node or change the process as needed. You can read more about Github Actions in their documentation - [https://docs.github.com/en/actions](https://docs.github.com/en/actions)

```
# .github/workflows/pull-tokens.yml

name: "Sync & Build Design Tokens"

on:
  workflow_dispatch:

jobs:
  sync-and-build-tokens:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      # 1. Check out the repository code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      # 3. Install project dependencies
      - name: Install dependencies
        run: npm install

      # 4. Run the complete token sync process
      - name: Sync, Build, and Format Tokens
        run: npm run tokens:pull
        env:
          TOKENS_STUDIO_API_KEY: ${{ secrets.TOKENS_STUDIO_API_KEY }}

      # 5. Commit files and create PR
      - name: Commit and Create PR
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          if ! git diff --quiet; then
            echo "Changes detected. Creating a new branch and PR."
            
            BRANCH_NAME="tokens/update-$(date +%s)"
            git checkout -b $BRANCH_NAME
            
            git add .
            git commit -m "chore(tokens): Sync and build design tokens"
            git push -u origin $BRANCH_NAME
            
            gh pr create \
              --title "🎨 Sync & Build Design Tokens" \
              --body "This PR was automatically generated and contains the latest token updates from Tokens Studio." \
              --base ${{ github.ref_name }} \
              --head $BRANCH_NAME
          else
            echo "No changes to commit."
          fi
```

### Step 7: Commit and Push your changes to Github [​](#step-7-commit-and-push-your-changes-to-github)

Once everything is completed locally, be sure to add these files to git, commit and push.