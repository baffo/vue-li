const VueLiComponent = {
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
      default: () => ({})
    },
    usePicture: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data: () => ({ observer: null, intersected: false, loaded: false, notFound: false }),
  computed: {
    srcImage() {
      if (this.notFound) {
        return this.srcFallback;
      }
      return this.intersected && this.src ? this.src : this.srcPlaceholder;
    },
    srcsetImage() {
      if (this.notFound) {
        return false;
      }
      return this.intersected && this.srcset ? this.srcset : false;
    }
  },
  methods: {
    load() {
      if (this.$el.getAttribute("src") !== this.srcPlaceholder) {
        this.loaded = true;
        this.$emit("load", this.$el);
      }
    },
    error() {
      this.notFound = true;
      this.$emit("error", this.$el)
    }
  },
  render(h) {
    let img = h("img", {
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
  mounted() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(entries => {
        // Use `intersectionRatio` because of Edge 15's
        // lack of support for `isIntersecting`.
        // See: https://github.com/w3c/IntersectionObserver/issues/211
        if (entries.some(e => e.isIntersecting || e.intersectionRatio > 0)) {
          this.intersected = true;
          this.observer.disconnect();
          this.$emit("intersect", this.$el);
        }
      }, this.intersectionOptions);
      this.observer.observe(this.$el);
    }
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    } else {
      return
    }
  }
};

export default VueLiComponent;

export const VueLiPlugin = {
  install: (Vue, opts) => {
    Vue.component("VueLi", VueLiComponent);
  }
};
