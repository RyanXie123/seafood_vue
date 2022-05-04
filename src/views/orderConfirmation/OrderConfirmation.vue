<template>
  <div class="wrapper">
    <TopArea />
    <ProductList />
    <Order />
  </div>
</template>

<script>
//import useCommonAddressEffect from '../../effects/addressEffect'
import TopArea from "./TopArea";
import ProductList from "./ProductList";

import Order from "./Order";

export default {
  name: "OrderConfirmation",
  components: { TopArea, ProductList, Order },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/varibles.scss";
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $dark-bgColor;
  overflow-y: scroll;
}
</style>