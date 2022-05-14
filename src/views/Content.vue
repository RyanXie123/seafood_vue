<template>
  <div class="content">
    <div class="category">
      <div
        :class="{
          category__item: true,
          'category__item--active': currentTab === tab,
        }"
        v-for="tab in tabs"
        :key="tab"
        @click="() => handleTabClick(tab)"
      >
        {{ tab }}
      </div>
    </div>
    <div class="product">
      <div class="product__item" v-for="item in list" :key="item.id">
        <img class="product__item__img" :src="item.get_thumbnail" />
        <div class="product__item__detail">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__sales">{{ item.weight_desc }}</p>
          <p class="product__item__price">
            <span class="product__item__yen">&euro;</span>{{ item.price }}
            <span class="product__item__origin">&euro;{{ item.price }}</span>
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
  const content = reactive({ list: [], tabs: [] });
  const currentTab = ref("");

  var totalData = [];
  const getContentData = async () => {
    const result = await get(`/category_list`);
    console.log(result);
    totalData = result;

    if (result?.length) {
      content.list = result[0].products;
      currentTab.value = result[0].name;
      for (let tabData of result) {
        content.tabs.push(tabData.name);
      }
    }
  };
  watchEffect(() => {
    getContentData();
  });
  const handleTabClick = (tab) => {
    currentTab.value = tab;
    for (let tabData of totalData) {
      if (tabData.name == tab) {
        content.list = tabData.products;
      }
    }
  };

  const { list, tabs } = toRefs(content);
  return { list, tabs, currentTab, handleTabClick };
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
    const { list, tabs, currentTab, handleTabClick } =
      useCurrentListEffect(shopId);
    const { changeCartItem, cartList, getProductCartCount } = useCartEffect();
    return {
      shopId,
      shopName,
      list,
      tabs,
      currentTab,
      changeCartItem,
      cartList,
      getProductCartCount,
      handleTabClick,
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
  top: 0.44rem;
  bottom: 0.5rem;
}
.category {
  overflow-y: scroll;
  height: 100%;
  width: 0.76rem;
  background: $search-bgColor;
  &__item {
    line-height: 0.4rem;
    text-align: center;
    font-size: 0.14rem;
    color: #333;
    &--active {
      background: $bgColor;
    }
  }
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