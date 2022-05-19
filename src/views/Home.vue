<template>
  <div class="wrapper">
    <!-- <div class="title">
      <div class="title__text">商品列表</div>
    </div> -->
    <Content />
    <Cart />
  </div>
</template>

<script>
window.alert = function (name) {
  var iframe = document.createElement("IFRAME");
  iframe.style.display = "none";
  iframe.setAttribute("src", "data:text/plain,");
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
};
import HelloWorld from "@/components/HelloWorld.vue";
import Content from "./Content";
import Cart from "./Cart";
export default {
  name: "Home",
  components: {
    Content,
    Cart,
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/varibles.scss";
.title {
  display: flex;
  line-height: 0.44rem;
  background: $bgColor;
  font-size: 0.2rem;
  color: $content-fontcolor;
  text-align: center;
  font-weight: bold;
  &__text {
    flex: 1;
    text-align: center;
  }
}
.wrapper {
  padding: 0 0.18rem;
}
</style>