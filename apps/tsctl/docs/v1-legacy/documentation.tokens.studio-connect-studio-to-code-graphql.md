<!-- source: https://documentation.tokens.studio/connect-studio-to-code/graphql -->

[Connect Studio to Code](/connect-studio-to-code)

# GraphQL [​](#graphql)

If you're looking to automate Tokens Studio data for build pipelines or pull it to another project or tool you're using, we offer a GraphQL endpoint that you can query directly.

**Prerequisites**:

-   [Api Keys](./../settings/api-keys)

## **Accessing the GraphQL endpoint** [​](#accessing-the-graphql-endpoint)

### Step 1: **Access the Apollo Sandbox:** [​](#step-1-access-the-apollo-sandbox)

![](/images/CleanShot%202025-03-27%20at%2023.29.43@2x.png)

Open the **GraphQL endpoint** [**https://graphql.app.tokens.studio/graphql**](https://graphql.app.tokens.studio/graphql)

### Step 2: **Configure the Authorization Header** [​](#step-2-configure-the-authorization-header)

Open the **Connection settings** modal by clicking on the Gear icon in the top menu bar.

![](/images/2025-07-17%20at%2012.10.25%20-%20Screengrab@2x.png)

Within the **Connection settings** modal, there is a **Shared headers** section. Select "Authorization header" in the header key input.

WARNING

You will need an API key generated from the Tokens Studio platform. If you don't have this available, you can follow [these instructions to generate one](./#creating-an-api-key).

In the value input: `Bearer <API_KEY>` (replace `<API_KEY>` with your API key. Click save.

![](/images/CleanShot%202025-03-27%20at%2023.33.13@2x.png)

### Step 3: **View the available queries:** [​](#step-3-view-the-available-queries)

![](/images/CleanShot%202025-03-27%20at%2023.34.36@2x.png)

The query section will show the available queries as can be seen in the [SDK-CLI documentation > Query page](https://tokens-studio.github.io/studio-app/types/Query.html).

![](/images/CleanShot%202025-03-27%20at%2023.34.14@2x.png)

## Example: Running a Query [​](#example-running-a-query)

### Step 1: Choose the query to use [​](#step-1-choose-the-query-to-use)

![](/images/CleanShot%202025-03-28%20at%2000.04.12@2x%20\(1\).png)

Click on `projects(...): PaginatedProjects!` in the Fields section. This will automatically populate the base query in the Operations section of the Apollo playground.

### Step 2: Add the model to return. [​](#step-2-add-the-model-to-return.)

![](/images/CleanShot%202025-03-28%20at%2000.04.56@2x.png)

Add `data: [Project!]!`. Again, this will auto-populate the Operations field. This step is needed because the Projects list is a paginated response.

### Step 3: Add the fields you want returned [​](#step-3-add-the-fields-you-want-returned)

![](/images/CleanShot%202025-03-28%20at%2000.05.33@2x.png)

Click on `name: String!` and `organizationId: String!` to add them to the query

Your query should be the following now:

graphql

```
query Projects($organization: String!) {
  projects(organization: $organization) {
    data {
      organizationId
      name
    }
  }
}
```

### Step 4: Add variables [​](#step-4-add-variables)

In the "**Variables**" section, we need to add the organisation id. To get the organisation ID, Navigate to your organization in Studio. Copy the **Organization ID** from the URL (after `/org/`).

![](/images/CleanShot%202025-03-28%20at%2000.06.14@2x.png)

Return to the Apollo Sandbox, enter the organisation id in the "**Variables section**".

json

```
{
    "organization": "<org-ID>"
}
```

### Step 5: Run the Query [​](#step-5-run-the-query)

![](/images/CleanShot%202025-03-28%20at%2000.07.30@2x.png)

Click the button in the top right corner to receive a list of projects in the response. The name and organization id will be displayed for each item in the list.