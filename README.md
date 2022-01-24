# scrolly-video

A webcomponent built with svelte for scroll-based (or other externally controlled) playback.

## 🚀 Installation (Web)

1. Add html code to your page:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

2. Require javascript in yourpage (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/scrolly-video@latest/dist/scrolly-video.js"></script>
```

You can replace `@latest` with specific version, example `@1.0.0`.

Below is available a description of `options` values.

## 📦 Installation (NPM Module - Browserify/Webpack)

1. Install npm module: `npm install scrolly-video --save`
2. Add html code to your page:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

3. Require javascript in your app:

```javascript
require("scrolly-video");
```

or

```javascript
import "scrolly-video";
```

Below is available a description of `options` values.

## 🔵 Installation (React)

1. Install npm module with `npm install scrolly-video --save`:
2. Import module in your `src/App.js` on header:

```javascript
import "scrolly-video";
```

3. Add html code to your `App.js` template:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

## 🔴 Installation (Angular)

1. Install npm module with `npm install scrolly-video --save`:
2. Import module in your `app/app.modules.ts` on header:

```javascript
import "scrolly-video";
```

3. Add html code to your html component:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

## 🟠 Installation (Svelte)

1. Install npm module with `npm install scrolly-video --save`:
2. Import module in your `src/App.svelte` on header:

```javascript
import "scrolly-video";
```

3. Add html code to your html component:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

## 🟢 Installation (Vue)

1. Install npm module with `npm install scrolly-video --save`:
2. Import module in your `src/App.vue` and add webcomponent to ignoreElements of vue config:

```javascript
import Vue from "vue";
import "scrolly-video";

Vue.config.ignoredElements = ["scrolly-video"];
```

3. Add html code to your html component:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```

## 🧰 Options / Attributes

Any props added to this element will are passed into a standard HTML `<video />` tag. 

Additional parameters:

| Parameter       | Description                                  | Values | Default value |
|-----------------|----------------------------------------------|--------|---------------|
| transitionSpeed | Sets the maximum playbackRate for this video | Number | 6             |

Additionally, there are two functions provided to set the currentTime:

***setCurrentTime*** (setTime | Number): A number between 0 and video.duration that specifies the number of seconds into the video.

***setCurrentTimePercent*** (setPercentage | Number): A number between 0 to 1 that specifies the percentage position of the video.

#### HTML Code with attributes:

```html
<scrolly-video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" />
```
