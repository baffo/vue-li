/**
 * vue-li v1.0.0
 * (c) 2021 baffo <undefined>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var VueLiComponent = {
  props: {
    src: {
      type: String,
      required: true
    },
    srcPlaceholder: {
      type: String,
      default: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    },
    srcFallback: {
      type: String,
      default: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    },
    srcset: {
      type: String
    },
    intersectionOptions: {
      type: Object,
      default: function () { return ({}); }
    },
    usePicture: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data: function () { return ({ observer: null, intersected: false, loaded: false, notFound: false }); },
  computed: {
    srcImage: function srcImage() {
      if (this.notFound) {
        return this.srcFallback;
      }
      return this.intersected && this.src ? this.src : this.srcPlaceholder;
    },
    srcsetImage: function srcsetImage() {
      if (this.notFound) {
        return false;
      }
      return this.intersected && this.srcset ? this.srcset : false;
    }
  },
  methods: {
    load: function load() {
      if (this.$el.getAttribute("src") !== this.srcPlaceholder) {
        this.loaded = true;
        this.$emit("load", this.$el);
      }
    },
    error: function error() {
      this.notFound = true;
      this.$emit("error", this.$el);
    }
  },
  render: function render(h) {
    var img = h("img", {
      attrs: {
        src: this.srcImage,
        srcset: this.srcsetImage
      },
      domProps: this.$attrs,
      class: {
        "vue-li-image": true,
        "vue-li-loaded": this.loaded
      },
      on: { load: this.load, error: this.error }
    });
    if (this.usePicture) {
      if (!this.intersected) {
        return h("picture", {attrs: {style: "padding: 1px;"}, domProps: this.$attrs});
      } else {
        return h("picture", { on: { load: this.load } }, this.intersected ? [ this.$slots.default, img ] : [] );
      }
    } else {
      return img;
    }
  },
  mounted: function mounted() {
    var this$1 = this;

    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(function (entries) {
        // Use `intersectionRatio` because of Edge 15's
        // lack of support for `isIntersecting`.
        // See: https://github.com/w3c/IntersectionObserver/issues/211
        if (entries.some(function (e) { return e.isIntersecting || e.intersectionRatio > 0; })) {
          this$1.intersected = true;
          this$1.observer.disconnect();
          this$1.$emit("intersect", this$1.$el);
        }
      }, this.intersectionOptions);
      this.observer.observe(this.$el);
    }
  },
  destroyed: function destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    } else {
      return
    }
  }
};

var VueLiPlugin = {
  install: function (Vue, opts) {
    Vue.component("VueLi", VueLiComponent);
  }
};

exports['default'] = VueLiComponent;
exports.VueLiPlugin = VueLiPlugin;
