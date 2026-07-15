<!-- source: https://documentation.tokens.studio/connect-studio-to-code/postman -->

[Connect Studio to Code](/connect-studio-to-code)

# Postman [​](#postman)

**Prerequisites**:

-   [Api Keys](./../settings/api-keys)

### **Using Postman to Call the API** [​](#using-postman-to-call-the-api)

1.  **Set Up a Request:**
    -   Create a new **POST request** in Postman.
    -   Use the same endpoint as Apollo Sandbox.

![](/images/CleanShot%202025-03-28%20at%2015.01.58@2x.png)

2.  **Add Authorization:**

-   In the **Authorization** tab, select **Bearer Token**.
-   Paste your API key into the token field.

![](/images/CleanShot%202025-03-28%20at%2015.02.45@2x.png)

3.  **Check the Headers:**

-   The headers will show a predefined Authorisation.

![](/images/CleanShot%202025-03-28%20at%2015.03.22@2x.png)

4.  **Define the Body:**

-   Go to the Body tab. Select the "raw" option. In the input enter the "operationName" and "variables" as we have defined in the [Apollo Sandbox](./postman#using-the-api-key-with-graphql).

![](/images/CleanShot%202025-03-31%20at%2014.30.23@2x.png)

-   Use the "query" in the "Operation" section of Apollo Sandbox and convert it into a single-line string. You can use this [tool](https://multi-to-single-string.netlify.app/) to convert the query from multi-line to single-line.

![](/images/CleanShot%202025-03-31%20at%2014.20.05@2x.png)

The single line query will look like this:

json

```
query Projects($organization: String!) {\n  projects(organization: $organization) {\n    data {\n      organizationId\n      name\n    }\n  }\n}
```

-   Provide necessary variables (e.g., `organization ID`) in the payload. The final query will look something like this:

json

```
{
    "operationName": "Projects",
    "variables": {
        "organization": "<Org-ID>"
    },
    "query": "query Projects($organization: String!) {\n  projects(organization: $organization) {\n    data {\n      organizationId\n      name\n    }\n  }\n}"
}
```

![](/images/CleanShot%202025-03-31%20at%2014.13.33@2x.png)

5.  **Send the Request:**

-   Execute the request by clicking on "Send" to receive JSON responses similar to the Apollo Sandbox.

![](/images/CleanShot%202025-03-31%20at%2014.13.33@2x%20\(1\).png)