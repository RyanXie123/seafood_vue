<template>
  <div class="content">
    <div class="product">
      <div class="product__item" v-for="item in list" :key="item.id">
        <img class="product__item__img" :src="item.get_thumbnail" />
        <div class="product__item__detail">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__sales">{{ item.weight_desc }}</p>
          <p class="product__item__price">
            <span class="product__item__yen">&yen;</span>{{ item.price }}
            <span class="product__item__origin">&yen;{{ item.price }}</span>
          </p>
        </div>
        <div class="product__number">
          <span
            class="product__number__minus"
            @click="
              () => {
                changeCartItem(shopId, item.id, item, -1, shopName);
              }
            "
            >-</span
          >
          {{ getProductCartCount(shopId, item.id) }}
          <span
            class="product__number__plus"
            @click="
              () => {
                changeCartItem(shopId, item.id, item, 1, shopName);
              }
            "
            >+</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, toRefs, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { get } from "../utils/request";
import { useCommonCartEffect } from "../effects/cartEffects";

// 列表内容相关的逻辑
const useCurrentListEffect = (shopId) => {
  const content = reactive({ list: [] });
  const getContentData = async () => {
    const result = await get(`/latest-products`);
    console.log(result);
    if (result?.length) {
      content.list = result;
    }
  };
  watchEffect(() => {
    getContentData();
  });
  const { list } = toRefs(content);
  return { list };
};

// 购物车相关逻辑
const useCartEffect = () => {
  const store = useStore();
  const { cartList, changeCartItemInfo } = useCommonCartEffect();
  const changeShopName = (shopId, shopName) => {
    store.commit("changeShopName", { shopId, shopName });
  };
  const changeCartItem = (shopId, productId, item, num, shopName) => {
    changeCartItemInfo(shopId, productId, item, num);
    changeShopName(shopId, shopName);
  };
  const getProductCartCount = (shopId, productId) => {
    return cartList?.[shopId]?.productList?.[productId]?.count || 0;
  };
  return { cartList, changeCartItem, getProductCartCount };
};

export default {
  name: "Content",
  props: [],
  setup() {
    const shopId = "1";
    const shopName = "testShop";
    const { list } = useCurrentListEffect(shopId);
    const { changeCartItem, cartList, getProductCartCount } = useCartEffect();
    return {
      shopId,
      shopName,
      list,
      changeCartItem,
      cartList,
      getProductCartCount,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/varibles.scss";
@import "../styles/mixins.scss";
.content {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0rem;
  bottom: 0.5rem;
}

.product {
  overflow-y: scroll;
  flex: 1;
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.68rem;
      height: 0.68rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__sales {
      margin: 0.06rem 0;
      font-size: 0.12rem;
      color: $content-fontcolor;
    }
    &__price {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
    &__origin {
      margin-left: 0.06rem;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color: $light-fontColor;
      text-decoration: line-through;
    }
    .product__number {
      position: absolute;
      right: 0;
      bottom: 0.12rem;
      &__minus,
      &__plus {
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        line-height: 0.2rem;
        border-radius: 50%;
        font-size: 0.25rem;
        text-align: center;
      }
      &__minus {
        border: 0.01rem solid $medium-fontColor;
        color: $medium-fontColor;
        margin-right: 0.05rem;
      }
      &__plus {
        background: $btn-bgColor;
        color: $bgColor;
        margin-left: 0.05rem;
      }
    }
  }
}
</style>