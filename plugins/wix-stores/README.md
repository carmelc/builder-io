# Builder.io Wix Stores plugin

Easily connect your Swell data to your Builder.io content!
## Installation

Go to [builder.io/account/organization](https://builder.io/account/organization) and press on `@builder.io/plugin-wix-stores` in the list of plugins, then hit save, you'll be prompted for store URL and secretKey.

![Installation screenshot](https://cdn.builder.io/api/v1/image/assets%2F6d39f4449e2b4e6792a793bb8c1d9615%2F18a7201313914cccae7f0311a1a614ae)

You will now see 6 new field types (for [model](https://builder.io/c/docs/guides/getting-started-with-models) fields, [symbol](https://builder.io/c/docs/guides/symbols) inputs, [custom components](https://builder.io/c/docs/custom-react-components) fields), and [custom targeting attributes](https://www.builder.io/c/docs/guides/targeting-and-scheduling#custom-targeting):
1. WixStoresProductHandle
2. WixStoresCollectionHandle
3. WixStoresProduct (not supported yet)
4. WixStoresCollection (not supported yet)
5. WixStoresProductPreview
6. WixStoresCollectionPreview

### Custom targeting
Will be supported when Support for WixStoresProduct and WixStoresCollection is added

### Component model fields

Component models can be used to represent product or collection page templates for all or a specific set of products/collections, using one of the following fields, you'll make previewing the templates for any product or collection straight-forward:

- `Wix Stores Product Preview` is to be used as a custom field on component models, this will allow you to have templated editing url on your component model relevant to the Wix Stores product being previewed, for example you can set the url in your model to:
  `${space.siteUrl}/product/${previewProduct.handle}`, add a custom field of type `Wix Stores Product Preview` to the model, now when you create a new entry, the handle will be added dynamically to the preview url based on the preview product, it is recommended to add a default value to the `Wix Stores Product Preview` custom field, so users will land at a specific product page when developing a template component.

- `Wix Stores Collection Preview` is to be used as a custom field on component models, this will allow you to have templated editing url on your component model relevant to the Wix Stores collection being previewed, for example you can set the url in your model to:
  `${space.siteUrl}/product/${previewCollection.handle}`, add a custom field of type `Wix Stores Collection Preview`, now when you create a new entry, the handle will be added dynamically to the preview url based on the preview product, it is recommended to add a default value to the `Wix Stores Collection Preview` custom field, so users will land at a specific collection page when developing a template component.

### Symbol Inputs
Will be supported when Support for WixStoresProduct and WixStoresCollection is added

## How to develop?

### Install

```bash
git clone https://github.com/BuilderIO/builder.git
cd plugins/wix-stores
npm install
```

### Run

```bash
npm start
```

### Add the plugin in Builder.io

Go to [builder.io/account/organization](https://builder.io/account/organization) and add the localhost URL to the plugin from the plugin settings (`http://localhost:1268/plugin.system.js?pluginId=@builder.io/plugin-wix-stores`)

**NOTE:** Loading http:// content on an https:// website will give you a warning. Be sure to click the shield in the top right of your browser and choose "load unsafe scripts" to allow the http content on Builder's https site when devloping locally

<img alt="Load unsafe script example" src="https://i.stack.imgur.com/uSaLL.png">

Now as you develop you can restart Builder to see the latest version of your plugin.

To uninstall your plugin, just remove it in the plugins UI

### Seeing the plugin in action

Try creating a custom [model](https://builder.io/c/docs/guides/getting-started-with-models), [component](https://builder.io/c/docs/custom-react-components), or [symbol](https://builder.io/c/docs/guides/symbols) using a Swell field, and edit away!

<img src="https://i.imgur.com/uVOLn7A.gif" alt="Seeing your plugin in the editor example gif">

### Frameworks

Builder.io uses [React](https://github.com/facebook/react) and [Material UI](https://github.com/mui-org/material-ui) for the UI, and [Emotion](https://github.com/emotion-js/emotion) for styling.

Using these frameworks in Builder plugins ensures best possible experience and performance.
