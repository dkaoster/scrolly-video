# ScrollyVideo.js

A webcomponent built with svelte for scroll-based (or other externally controlled) playback.

## 🚀 Installation (Web)

Add html code to your page:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

Require javascript in your page (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/scrolly-video@latest/dist/scrolly-video.js" />
```

You can replace `@latest` with specific version, example `@1.0.0`.

## 📦 Installation (NPM Module - Browserify/Webpack)

Install npm module: `npm install scrolly-video --save`
Add html code to your page:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

Require javascript in your app:

```javascript
require("scrolly-video");
```

or

```javascript
import "scrolly-video";
```

## 🔵 Installation (React)

Install npm module with `npm install scrolly-video --save`:
Import module in your `src/App.js` on header:

```javascript
import "scrolly-video";
```

Add html code to your `App.js` template:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

## 🔴 Installation (Angular)

Install npm module with `npm install scrolly-video --save`:
Import module in your `app/app.modules.ts` on header:

```javascript
import "scrolly-video";
```

Add html code to your html component:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

## 🟠 Installation (Svelte)

Install npm module with `npm install scrolly-video --save`:
Import module in your `src/App.svelte` on header:

```javascript
import "scrolly-video";
```

Add html code to your html component:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

## 🟢 Installation (Vue)

Install npm module with `npm install scrolly-video --save`:
Import module in your `src/App.vue` and add webcomponent to ignoreElements of vue config:

```javascript
import Vue from "vue";
import "scrolly-video";

Vue.config.ignoredElements = ["scrolly-video"];
```

Add html code to your html component:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

## 🧰 Options / Attributes

Any props added to this element will are passed into a standard HTML `<video />` tag. 

Additional parameters:

| Parameter       | Description                                                    | Values  | Default      |
|:----------------|:---------------------------------------------------------------|:--------|:-------------|
| src             | The URL of the video                                           | URL     |              |
| transitionspeed | Sets the maximum playbackRate for this video                   | Number  | 8            |
| cover           | Forces the video to cover in it's container                    | Boolean | true         |
| sticky          | Whether the video should have `position: sticky`               | Boolean | true         |
| full            | Whether the video should take up the entire viewport           | Boolean | true         |
| usewebcodecs    | Whether the library should use the webcodecs method, see below | Boolean | true         |
| debug           | Whether to log debug information                               | Boolean | false        |

Additionally, there are two functions provided to set currentTime manually:

***setCurrentTime*** (`setTime | Number`): A number between 0 and `video.duration` that specifies the number of seconds into the video.

***setCurrentTimePercent*** (`setPercentage | Number`): A number between 0 and 1 that specifies the percentage position of the video.

#### HTML Code with attributes:

```html
<scrolly-video src="https://your-video-url.mp4" />
```

## Technical Details and Cross Browser Differences
To make this library perform optimally in all browsers, three different approaches are taken to animating the video.

### Method 1: WebCodecs and Canvas

Using the new WebCodecs API we are able to get all frames in the video and have them ready to draw to a canvas. This method is the most performant, but has two drawbacks: first, depending on the device and the size of the video, using the WebCodecs API will take some time to process all the frames, so the animation will not be available immediately upon page load. Secondly, the WebCoedecs API is currently only available on Chrome, and the WebCodecs polyfill does not work for this application.

If WebCodecs is not supported by the browser or has not finished processing all frames, it falls back to method 2:

### Method 2: HTML5 Video and playbackRate

This method simply embeds the video with an HTML `<video>` tag, and it plays the video when the video needs to be animated. To adjust to the scroll speed, this method modulates the `playbackRate` attribute on the video in order to dynamically mimic a faster or slower scroll speed. This method is extremely smooth when the scroll direction is moving the video forward, but unfortunately does not work in reverse because `playbackRate` cannot be a negative value.

Thus, if the video needs to be animated backwards, this library falls back to method 3.

### Method 3: HTML5 Video and currentTime

This method is the way that scrollytelling videos have traditionally been done, using an HTML `<video>` tag and skipping directly to frames using currentTime. However, this method requires the video to be encoded at keyframe = 1, which causes the video to be a lot larger or the quality to drop. Unfortunately, this is the only option for scenarios where methods 1 and 2 are not supported, or on mobile safari browsers where somehow this method performs better than method 2. Thus, to achieve maximum performance under all circumstances, it is still recommended to encode videos with keyframe = 1, if possible.

---

Created by: [Daniel Kao](https://www.diplateevo.com/)
