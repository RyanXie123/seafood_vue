<template>
  <div class="products">
    <div class="products__wrapper">
      <div class="products__list">
        <div class="products__title">购物清单</div>
        <div
          v-for="item in productList"
          :key="item.id"
          class="products__item"
          @click="handleItemClicked(item.id)"
        >
          <img
            class="products__item__img"
            :src="item.get_thumbnail"
            :id="item.id"
            v-gallery="item.id"
            :data-large="item.get_image"
          />
          <div class="products__item__detail">
            <h4 class="products__item__title">{{ item.name }}</h4>
            <p class="products__item__price">
              <span>
                <span class="products__item__yen">&euro; </span>
                {{ item.price }} x {{ item.count }}
              </span>
              <span class="products__item__total">
                <span class="products__item__yen">&euro; </span>
                {{ (item.price * item.count).toFixed(2) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useCommonCartEffect } from "../../effects/cartEffects";
export default {
  name: "ProductList",
  setup() {
    const route = useRoute();
    const shopId = "1";
    const { shopName, productList } = useCommonCartEffect(shopId);
    const handleItemClicked = (id) => {
      document.getElementById(id).click();
    };
    return { shopName, productList, handleItemClicked };
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/varibles.scss";
@import "../../styles/mixins.scss";
.products {
  margin: 0.16rem 0.18rem 0.1rem 0.18rem;
  background: $bgColor;

  &__title {
    padding: 0.16rem;
    font-size: 0.16rem;
    color: $content-fontcolor;
  }
  &__wrapper {
    overflow-y: scroll;
    margin: 0 0.18rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.6rem;
    top: 3rem;
  }
  &__list {
    background: $bgColor;
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0 0.16rem 0.16rem 0.16rem;
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__detail {
      flex: 1;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      display: flex;
      margin: 0.06rem 0 0 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &__total {
      flex: 1;
      text-align: right;
      color: $dark-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
  }
}
</style>