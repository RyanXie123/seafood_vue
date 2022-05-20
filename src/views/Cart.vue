<template>
  <div
    class="mask"
    v-if="showCart && calculations.total > 0"
    @click="handleCartShowChange"
  />
  <div class="cart">
    <div class="product" v-if="showCart && calculations.total > 0">
      <div class="product__header">
        <div
          class="product__header__all"
          @click="() => setCartItemsChecked(shopId)"
        >
          <span
            class="product__header__icon iconfont"
            v-html="calculations.allChecked ? '&#xe656;' : '&#xec59;'"
          >
          </span>
          全选
        </div>
        <div class="product__header__clear">
          <span
            class="product__header__clear__btn"
            @click="() => cleanCartProducts(shopId)"
            >清空购物车</span
          >
        </div>
      </div>
      <template v-for="item in productList" :key="item.id">
        <div class="product__item" v-if="item.count > 0">
          <div
            class="product__item__checked iconfont"
            v-html="item.check ? '&#xe656;' : '&#xec59;'"
            @click="() => changeCartItemChecked(shopId, item.id)"
          />
          <img class="product__item__img" :src="item.get_thumbnail" />
          <div class="product__item__detail">
            <h4 class="product__item__title">{{ item.name }}</h4>
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
                  changeCartItemInfo(shopId, item.id, item, -1);
                }
              "
              >-</span
            >
            {{ item.count || 0 }}
            <span
              class="product__number__plus"
              @click="
                () => {
                  changeCartItemInfo(shopId, item.id, item, 1);
                }
              "
              >+</span
            >
          </div>
        </div>
      </template>
    </div>
    <div class="check">
      <div class="check__icon">
        <img
          src="https://apidjackets.seafood.fit/media/uploads/basket.png"
          class="check__icon__img"
          @click="handleCartShowChange"
        />
        <div class="check__icon__tag">{{ calculations.total }}</div>
      </div>
      <div class="check__info">
        总计：<span class="check__info__price"
          >&euro; {{ calculations.price }}</span
        >
      </div>
      <div class="check__btn2">
        <router-link :to="{ path: '/orderList' }"> 我的订单 </router-link>
      </div>

      <div
        v-if="calculations.total > 0"
        class="check__btn"
        @click="handleGotoConfirmOrder"
      >
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useCommonCartEffect } from "../effects/cartEffects";
import { get } from "../utils/request";
import wx from "weixin-js-sdk";
// 获取购物车信息逻辑
const useCartEffect = (shopId) => {
  const store = useStore();
  const { cartList, changeCartItemInfo } = useCommonCartEffect();

  const calculations = computed(() => {
    const productList = cartList[shopId]?.productList;
    const result = { total: 0, price: 0, allChecked: true };
    if (productList) {
      for (let i in productList) {
        const product = productList[i];
        result.total += product.count;
        if (product.check) {
          result.price += product.count * product.price;
        }
        if (product.count > 0 && !product.check) {
          result.allChecked = false;
        }
      }
    }
    result.price = result.price.toFixed(2);
    return result;
  });

  const productList = computed(() => {
    const productList = cartList[shopId]?.productList || [];
    return productList;
  });

  const changeCartItemChecked = (shopId, productId) => {
    store.commit("changeCartItemChecked", { shopId, productId });
  };

  const cleanCartProducts = (shopId) => {
    store.commit("cleanCartProducts", { shopId });
  };

  const setCartItemsChecked = (shopId) => {
    store.commit("setCartItemsChecked", { shopId });
  };

  return {
    calculations,
    productList,
    cleanCartProducts,
    changeCartItemInfo,
    changeCartItemChecked,
    setCartItemsChecked,
  };
};

// 展示隐藏购物车逻辑
const toggleCartEffect = () => {
  const showCart = ref(false);
  const handleCartShowChange = () => {
    showCart.value = !showCart.value;
  };
  return { showCart, handleCartShowChange };
};

export default {
  name: "Cart",
  setup() {
    const shopId = "1";
    const {
      calculations,
      productList,
      cleanCartProducts,
      changeCartItemInfo,
      changeCartItemChecked,
      setCartItemsChecked,
    } = useCartEffect(shopId);
    const { showCart, handleCartShowChange } = toggleCartEffect();

    let day = 0;
    let hour = 0;
    onMounted(async () => {
      const delivery_data = await get(`/delivery`);
      console.log(delivery_data);
      day = delivery_data.day;
      hour = delivery_data.hour;
    });

    const nowDate = new Date();
    const nowDay = nowDate.getDay();
    const nowHours = nowDate.getHours();

    const canOrderOutVenice = nowDay == day && nowHours < hour;
    const all_days = ["天", "一", "二", "三", "四", "五", "六"];
    const route = useRoute();
    console.log(route.query);
    const { is_venice, location_str } = route.query;
    const router = useRouter();
    console.log(is_venice);
    console.log("location_str:" + location_str);
    let handleGotoConfirmOrder = () => {
      alert("亲，请开启小程序的位置权限");
      // router.push({
      //   path: `/orderConfirmation/${shopId}`,
      // });
    };
    if (is_venice && location_str) {
      const in_italy =
        location_str.indexOf("意大利") != -1 ||
        location_str.toLowerCase().indexOf("italy") != -1;
      handleGotoConfirmOrder = () => {
        if (is_venice === "true" || canOrderOutVenice) {
          router.push({
            path: `/orderConfirmation/${shopId}`,
          });
        } else if (in_italy) {
          alert(`威尼斯岛外用户暂时不支持下单, 仅支持每周${all_days[day]}下单`);
        } else {
          alert(`威尼斯岛外用户暂时不支持下单`);
          // router.push({
          //   path: `/orderConfirmation/${shopId}`,
          // });
        }
      };
    }

    return {
      calculations,
      shopId,
      productList,
      cleanCartProducts,
      changeCartItemInfo,
      changeCartItemChecked,
      setCartItemsChecked,
      showCart,
      handleCartShowChange,
      handleGotoConfirmOrder,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/varibles.scss";
@import "../styles/mixins.scss";
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.cart {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: $bgColor;
}
.product {
  overflow-y: scroll;
  flex: 1;
  background: $bgColor;
  &__header {
    display: flex;
    line-height: 0.52rem;
    border-bottom: 1px solid $content-bgColor;
    font-size: 0.14rem;
    color: $content-fontcolor;
    &__all {
      width: 0.64rem;
      margin-left: 0.18rem;
    }
    &__icon {
      display: inline-block;
      margin-right: 0.1rem;
      vertical-align: top;
      color: $btn-bgColor;
      font-size: 0.2rem;
    }
    &__clear {
      flex: 1;
      margin-right: 0.16rem;
      text-align: right;
      &__btn {
        display: inline-block;
      }
    }
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__checked {
      line-height: 0.5rem;
      margin-right: 0.2rem;
      color: $btn-bgColor;
      font-size: 0.2rem;
    }
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      margin: 0.06rem 0 0 0;
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
      bottom: 0.26rem;
      &__minus,
      &__plus {
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        line-height: 0.16rem;
        border-radius: 50%;
        font-size: 0.2rem;
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
.check {
  display: flex;
  height: 0.49rem;
  border-top: 0.01rem solid $content-bgColor;
  line-height: 0.49rem;
  &__icon {
    position: relative;
    width: 0.6rem;
    &__img {
      display: block;
      margin: 0.12rem auto;
      width: 0.28rem;
      height: 0.26rem;
    }
    &__tag {
      position: absolute;
      left: 0.35rem;
      top: 0.04rem;
      padding: 0 0.04rem;
      min-width: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background-color: $hightlight-fontColor;
      border-radius: 0.1rem;
      font-size: 0.12rem;
      text-align: center;
      color: #fff;
      transform: scale(0.5);
      transform-origin: left center;
    }
  }
  &__info {
    flex: 1;
    color: $content-fontcolor;
    font-size: 0.12rem;
    &__price {
      line-height: 0.49rem;
      color: $hightlight-fontColor;
      font-size: 0.18rem;
    }
  }
  &__btn {
    width: 0.98rem;
    background-color: #0091ff;
    text-align: center;
    font-size: 0.14rem;
    a {
      color: $bgColor;
      text-decoration: none;
    }
    color: $bgColor;
  }
  &__btn2 {
    width: 0.98rem;
    background-color: #0091ff;
    border-right: 1px solid lightgray;
    text-align: center;
    font-size: 0.14rem;
    a {
      color: $bgColor;
      text-decoration: none;
    }
  }
}
</style>