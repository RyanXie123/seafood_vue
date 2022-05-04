<template>
  <div class="wrapper">
    <Content />
    <Cart />
  </div>
</template>

<script>
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
.wrapper {
  padding: 0 0.18rem;
}
</style>