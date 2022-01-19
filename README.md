# scrolly-video

A webcomponent built with svelte for scroll-based (or other externally controlled) playback.

## 🚀 Installation (Web)

1. Add html code to your page:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

2. Require javascript in yourpage (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/@ptkdev/scrolly-video@latest/dist/webcomponent.js"></script>
```

You can replace `@latest` with specific version, example `@2.0.1`.

Below is available a description of `options` values.

## 📦 Installation (NPM Module - Browserify/Webpack)

1. Install npm module: `npm install @ptkdev/scrolly-video --save`
2. Add html code to your page:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

3. Require javascript in your app:

```javascript
require("@ptkdev/scrolly-video");
```

or

```javascript
import "@ptkdev/scrolly-video";
```

Below is available a description of `options` values.

## 📖 Installation (Wordpress)

1. Download wordpress plugin from [mirror](https://cdn.jsdelivr.net/npm/@ptkdev/scrolly-video@latest/dist/wordpress/scrolly-video-wordpress-plugin.zip) and install it.
1. Add code to your html widget, example: `Appearance` --> `Widget` --> insert `HTML Widget` and paste html code:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

You can insert this html code in posts, widget, html box or theme.

## 🔵 Installation (React)

1. Install npm module with `npm install @ptkdev/scrolly-video@latest --save`:
2. Import module in your `src/App.js` on header:

```javascript
import "@ptkdev/scrolly-video";
```

3. Add html code to your `App.js` template:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

## 🔴 Installation (Angular)

1. Install npm module with `npm install @ptkdev/scrolly-video@latest --save`:
2. Import module in your `app/app.modules.ts` on header:

```javascript
import "@ptkdev/scrolly-video";
```

3. Add html code to your html component:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

## 🟠 Installation (Svelte)

1. Install npm module with `npm install @ptkdev/scrolly-video@latest --save`:
2. Import module in your `src/App.svelte` on header:

```javascript
import "@ptkdev/scrolly-video";
```

3. Add html code to your html component:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

## 🟢 Installation (Vue)

1. Install npm module with `npm install @ptkdev/scrolly-video@latest --save`:
2. Import module in your `src/App.vue` and add webcomponent to ignoreElements of vue config:

```javascript
import Vue from "vue";
import "@ptkdev/scrolly-video";

Vue.config.ignoredElements = ["scrolly-video"];
```

3. Add html code to your html component:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```

## 🧰 Options / Attributes

| Parameter | Description                                  | Values             | Default value                     | Available since |
| --------- | -------------------------------------------- | ------------------ | --------------------------------- | --------------- |
| header    | Setup top text                               | String             | `make`                            | v1.0.20210319   |
| flip      | Setup middle flip text (separte with commas) | String with commas | `svelte,webcomponents,opensource` | v1.0.20210319   |
| footer    | Setup bottom text                            | String             | `awesome!`                        | v1.0.20210319   |

#### HTML Code with attributes:

```html
<scrolly-video header="make" flip="svelte,webcomponents,opensource" footer="awesome!"></scrolly-video>
```
