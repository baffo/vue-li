# vue-li-image

[![npm](https://img.shields.io/npm/v/vue-li-image.svg)](https://www.npmjs.com/package/vue-li-image)
[![npm](https://img.shields.io/npm/dm/vue-li-image.svg)](https://www.npmjs.com/package/vue-li-image)

A Vue.js component to lazy load an image automatically when it enters the viewport using the [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

This is an opinionated upgrade of the original Vue Lazy Image loading library [v-lazy-image](https://github.com/alexjoverm/v-lazy-image) including certain fixes already submitted as pull requests on the original library, which were never merged. Kudos to [Alex Jover](https://github.com/alexjoverm/v-lazy-image) for the original idea!

## Usage

```bash
npm install vue-li-image
```

_**Warning:** You'll need to install the [w3c Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) in case you're targeting a browser which doesn't support it._

You can register the component globally so it's available in all your apps:

```js
import Vue from "vue";
import { VueLiPlugin } from "vue-li-image";

Vue.use(VueLiPlugin);
```

Or use it locally in any of your components:

```js
import VueLi from "vue-li-image";

export default {
  components: {
    VueLi
  }
};
```

You must pass an `src` property with the link of the image:

```html
<template>
  <vue-li src="http://lorempixel.com/400/200/" />
</template>
```

That image will be loaded as soon as the image enters the viewport.

## Progressive Loading

You can use the `src-placeholder` property to define an image that is shown until the `src` image is loaded.

When the `src` image is loaded, a `vue-li-loaded` class is added, so you can use it to perform animations. For example, a blur effect:

```html
<template>
  <vue-li
    src="https://cdn-images-1.medium.com/max/1600/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
    src-placeholder="https://cdn-images-1.medium.com/max/80/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
  />
</template>

<style scoped>
.vue-li {
  filter: blur(10px);
  transition: filter 0.7s;
}
.vue-li {
  filter: blur(0);
}
</style>
```

In case you are using Webpack bundler for images too (just like Vue-cli):
```html
<vue-li
  src="https://cdn-images-1.medium.com/max/1600/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
  :src-placeholder="require('../assets/img.jpg')"
/>
```

You could listen to the `intersect` and `load` events for more complex animations and state handling:

```html
<template>
  <vue-li
    src="https://cdn-images-1.medium.com/max/1600/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
    src-placeholder="https://cdn-images-1.medium.com/max/80/1*xjGrvQSXvj72W4zD6IWzfg.jpeg"
    @intersect="..."
    @load="..."
  />
</template>
```

[@jmperezperez](https://twitter.com/jmperezperez) has written about the [progressive loading technique](https://jmperezperez.com/more-progressive-image-loading/) on his blog, in case you want a deeper explanation.

## Responsive Images

Using the `srcset` property you can set images for different resolutions:

```html
<template>
  <vue-li
    srcset="image.jpg 1x, image_2x.jpg 2x"
  />
</template>
```

When using the `srcset` attribute is recommended to use also `src` as a fallback for browsers that don't support the `srcset` and `sizes` attributes:

```html
<template>
  <vue-li
    srcset="image-320w.jpg 320w, image-480w.jpg 480w"
    sizes="(max-width: 320px) 280px, 440px"
    src="image-480w.jpg"
  />
</template>
```

The `srcset` prop is combinable with `src-placeholder` in order to apply progressive loading.

## Picture

If you want to wrap the `img` in a `picture` tag, use the prop `usePicture`. You can then use slots to add additional elements above the `img` element`.

```html
<vue-li
  srcset="image-320w.jpg 320w, image-480w.jpg 480w"
  alt="Fallback"
  use-picture
>
  <source srcset="image-320w.jpg 320w, image-480w.jpg 480w" />
</vue-li>

```

Renders as:

```html
<picture>
  <source srcset="image-320w.jpg 320w, image-480w.jpg 480w" />
  <img srcset="image-320w.jpg 320w, image-480w.jpg 480w" alt="Fallback" />
</picture>
```

Note you can use the [picture polyfill](https://github.com/scottjehl/picturefill).

## API

Aside from the following API, you can pass any *img* attribute, such as `alt`, and they'll be added to the rendered `<img>` tag.

_Fields marked as (\*) are required._

### Props

| Name                   | Type          | Default       | Description                                                                                                                                               |
| ---------------------- | ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                  | String _(\*)_ |       -       | Image `src` to lazy load when it intersects with the viewport                                                                                             |
| `src-placeholder`      | String        | ' '           | If defined, it will be shown until the `src` image is loaded. <br> Useful for progressive image loading, [see demo](https://codesandbox.io/s/9l3n6j5944)  |
| `src-fallback`      | String        | ' '           | If defined, it will be shown if the `src` image fails to load   |
| `srcset`               | String        |       -       | Images to be used for different resolutions                                                                                                               |
| `intersection-options` | Object        | () => ({})    | The [Intersection Observer options object](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Creating_an_intersection_observer). |
| `use-picture`          | Boolean       | false         | Wrap the img in a picture tag. |

### Events

| Name        | Description                                              |
| ----------- | -------------------------------------------------------- |
| `intersect` | Triggered when the image intersects the viewport         |
| `load`      | Triggered when the lazy image defined in `src` is loaded |
| `error`     | Triggered when the lazy image defined in `src` fails to load |
