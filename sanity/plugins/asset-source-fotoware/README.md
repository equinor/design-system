# Fotoware integration for Sanity

Custom asset source plugin to integrate Fotoware with Sanity. This integration uses the Selection and Export widgets from Fotoware in order to select and retrieve assets from Fotoware.

## Authentication

Authentication with Fotoware is done by SSO via oauth2. Due to Sanity being a fully client side application, an external middleware is required to handle the redirect URL in the oauth2 workflow. This is done by an Azure Function that is registered as redirect URL in the Fotoware application.

### Authentication workflow

1. User selects the Fotoware plugin from asset selection dropdown

2. Plugin checks if an access token is present in `localStorage` and access token has not expired (checked via unix timestamp)

   - If an access token is present, but has expired, the token is automatically removed from `localStorage`

3. If no valid access token is present, a popup window is opened linking to the Fotoware login page.

4. The `handleAuthEvent` function is added as a callback to a `message` event listener on the window.

5. If the window receives a `message` from the correct origin (oauth2 redirect URL) with the correct data format, and the `state` is verified to be correct (same as in request to login), the access token with expiration timestamp is stored in `localStorage`. The expiration timestamp is created by getting the current timestamp by getting the current timestamp in seconds, and adding the `expires_in` value that is sent from Fotoware to this timestamp.

## Plugin workflow

If a valid access token is present, an iframe will be rendered containing the Fotoware selection widget. The `handleWidgetEvent` callback function that is added on the window when the React component is mounted is set up to handle any relevant Fotoware events.

### selectionWidgetCancel

This event is broadcast by Fotoware when a user clicks on the cancel button. When received, the Sanity `onClose()` callback is called to close the plugin.

### assetSelected

This event is broadcast by Fotoware when a user has selected the asset they want to use in the selection widget. When this event is received, the Fotoware asset data (as JSON) is stored in React state. This triggers a `useEffect` hook with `asset` as dependency, and sets the `iframeUrl` to that of the _export widget_ - which will then re-render the iframe as export widget with the previously selected asset preloaded.

### assetExported

This event is broadcast by Fotoware when a user has published an export from the export widget in the iframe. This event will contain a link to the published export.

Due to Fotoware not sending CORS headers, we cannot use this URL directly within the Sanity Studio, as passing this to the `onSelect()` callback will fail with a CORS error. To get around this problem, a middleware has been set up in Azure Functions that fetches the image and converts it to a base64 string.

When the `assetExported` event is received, an async call to Azure Function is made containing the URL to the Fotoware image. Once the base64 string has been received, this is then passed to the `onSelect()` callback with the `kind` property set to `base64` - this will then trigger the upload and close the plugin.

---

## Relevant links

- [Using the widgets](https://learn.fotoware.com/Integrations_and_APIs/01_Creating_Integrations_using_Embeddable_Widgets/Using_the_widgets)
- [Asset representation](https://learn.fotoware.com/Integrations_and_APIs/001_The_FotoWare_API/FotoWare_API_Overview/Asset_representation)
