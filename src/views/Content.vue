<template>
  <div class="position">
    <span class="iconfont position__icon">&#xe6c5;</span>
    {{ query.location_str }}
  </div>
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
      <template v-for="item in list" :key="item.id">
        <div v-if="item.on_shelf" class="product__item">
          <img
            :id="item.id"
            v-gallery="item.id"
            class="product__item__img"
            :src="item.get_thumbnail"
            :data-large="item.get_image"
          />
          <img
            v-if="item.stock < item.weight"
            class="product__item__soldout"
            src="https://apidjackets.seafood.fit/media/uploads/sold_out.png"
          />
          <img
            v-if="item.get_image2"
            v-show="false"
            v-gallery="item.id"
            class="product__item__img"
            :src="item.get_image2"
          />
          <div
            class="product__item__detail"
            @click="previewImageTestWechat(item.get_image, item.id)"
          >
            <h4 class="product__item__title">
              {{ item.name }}
            </h4>
            <p class="product__item__sales">{{ item.weight_desc }}</p>
            <p class="product__item__price">
              <span class="product__item__yen">&euro;</span>{{ item.price }}
              <!-- <span class="product__item__origin">&euro;{{ item.price }}</span> -->
            </p>
            <p
              v-if="item.stock < 4 && item.stock > 0"
              class="product__item__price"
            >
              仅剩{{ item.stock }}件
              <!-- <span class="product__item__origin">&euro;{{ item.price }}</span> -->
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
        <Toast v-if="show" :message="toastMessage" />
      </template>
    </div>
  </div>
</template>

<script>
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { get } from "../utils/request";
import { useCommonCartEffect } from "../effects/cartEffects";
import Toast, { useToastEffect } from "../components/Toast";
import wx from "weixin-js-sdk";
import VConsole from "vconsole";
const vConsole = new VConsole();
// 列表内容相关的逻辑
const useCurrentListEffect = (shopId) => {
  document.title = "海鲜预定";
  const content = reactive({ list: [], tabs: [] });
  const currentTab = ref("");
  let currentTabIndex = 0;
  var totalData = [];
  const getContentData = async () => {
    const result = await get(`/category_list`);
    console.log(result);
    totalData = result;
    checkSoldoutFromCart();
    if (result?.length) {
      content.list = result[currentTabIndex].products;
      currentTab.value = result[currentTabIndex].name;
      var tabs = [];
      for (let tabData of result) {
        tabs.push(tabData.name);
      }
      content.tabs = tabs;
    }
  };

  const { cleanCartSoldoutProduct } = useCommonCartEffect();
  const checkSoldoutFromCart = () => {
    for (let tabData of totalData) {
      for (let product of tabData.products) {
        if (product.stock < product.weight) {
          cleanCartSoldoutProduct("1", product.id);
        }
      }
    }
  };
  watchEffect(() => {
    getContentData();
  });
  const handleTabClick = (tab) => {
    currentTab.value = tab;
    currentTabIndex = content.tabs.indexOf(tab);
    console.log("currentTabIndex: " + currentTabIndex);
    for (let tabData of totalData) {
      if (tabData.name == tab) {
        content.list = tabData.products;
      }
    }
  };

  const { list, tabs } = toRefs(content);
  return { list, tabs, currentTab, handleTabClick, getContentData };
};

// 购物车相关逻辑
const useCartEffect = (showToast) => {
  const store = useStore();
  const { cartList, changeCartItemInfo } = useCommonCartEffect();
  const changeShopName = (shopId, shopName) => {
    store.commit("changeShopName", { shopId, shopName });
  };
  const changeCartItem = (shopId, productId, item, num, shopName) => {
    console.log(item.stock);
    const cartcount = getProductCartCount(shopId, productId);
    console.log(cartcount);
    if (item.stock == 0) {
      showToast("该商品已售磬");
      return;
    }
    if (cartcount + num > item.stock) {
      showToast("该商品库存不足");
      return;
    }

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
  components: { Toast },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();

    const shopId = "1";
    const shopName = "testShop";
    const { list, tabs, currentTab, handleTabClick, getContentData } =
      useCurrentListEffect(shopId);
    const {
      changeCartItem,
      cartList,
      getProductCartCount,
      cleanCartSoldoutProduct,
    } = useCartEffect(showToast);
    const previewImage = (id) => {
      // this.$hevueImgPreview(url);
      console.log("previewImage" + id);
      document.getElementById(id).click();
    };
    const previewImageTestWechat = (url, id) => {
      wx.previewImage({
        urls: [url],
      });

      // document.getElementById(id).click();
    };
    const tId = setInterval(() => {
      // getContentData();
    }, 5000);

    onUnmounted(() => {
      clearInterval(tId);
    });
    onMounted(() => {
      console.log("onMounted");
    });
    // console.log(wx);
    const route = useRoute();
    console.log(route.query);
    const query = route.query;
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
      previewImage,
      previewImageTestWechat,
      show,
      toastMessage,
      query,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/varibles.scss";
@import "../styles/mixins.scss";
.position {
  position: relative;
  // padding: 0.16rem 0.24rem 0.16rem 0;
  line-height: 0.2rem;
  font-size: 0.12rem;
  @include ellipsis;
  .position__icon {
    position: relative;
    top: 0.01rem;
    font-size: 0.2rem;
  }
  .position_notice {
    position: absolute;
    right: 0;
    top: 0.17rem;
    font-size: 0.2rem;
  }
  color: $content-fontcolor;
}
.content {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0.22rem;
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
      flex: 1;
    }
    &__img {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.16rem;
    }
    &__soldout {
      width: 0.7rem;
      height: 0.7rem;
      left: 0.05rem;
      position: absolute;
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
      bottom: 0.2rem;
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