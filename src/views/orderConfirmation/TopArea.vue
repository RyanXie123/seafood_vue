<template>
  <div class="top">
    <div class="top__header">
      <div class="iconfont top__header__back" @click="handleBackClick">
        &#xe6a9;
      </div>
      确认订单
    </div>
    <div class="top__receiver">
      <div class="top__receiver__title">收货人姓名</div>
      <div class="top__input">
        <input
          class="top__input__content"
          placeholder="请输入姓名"
          v-model="name"
          @blur="handleInputBlur"
        />
      </div>
      <div class="top__receiver__title">地址</div>
      <div class="top__input">
        <input
          class="top__input__content"
          placeholder="请输入地址"
          v-model="address"
          @blur="handleInputBlur"
        />
      </div>
      <div class="top__receiver__title">手机</div>
      <div class="top__input">
        <input
          class="top__input__content"
          placeholder="请输入手机号"
          v-model="phone"
          @blur="handleInputBlur"
        />
      </div>
      <!-- <div v-if="address" @click="handleAddressClick">
        <div class="top__receiver__address">
          {{address}}
        </div>
        <div class="top__receiver__info">
          <span class="top__receiver__info__name">{{address.name}}</span>
          <span class="top__receiver__info__name">{{address.phone}}</span>
        </div>
        <div class="iconfont top__receiver__icon">&#xe6a9;</div>
      </div> -->
      <!-- <div v-else> -->

      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
// import useAddressEffect from './addressEffect'

export default {
  name: "TopArea",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const shopId = "1";
    const store = useStore();
    console.log("addressInfo" + store.state.addressInfo);
    const addressInfo = reactive(store.state.addressInfo);
    const { address, name, phone } = toRefs(addressInfo);

    const handleBackClick = () => {
      router.back();
    };
    const handleInputBlur = () => {
      store.commit("changeAddressInfo", {
        address: address.value,
        phone: phone.value,
        name: name.value,
      });
    };
    // const handleAddressClick = () => { router.push(`/chooseAddressList/${shopId}`) }
    // const address = useAddressEffect()
    return { handleBackClick, address, name, phone, handleInputBlur };
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/varibles.scss";
@import "../../styles/mixins.scss";
.top {
  position: relative;
  height: 2.8rem;
  background-size: 100% 3rem;
  background-image: linear-gradient(0deg, rgba(0, 145, 255, 0) 4%, #0091ff 50%);
  background-repeat: no-repeat;
  &__input {
    height: 0.32rem;
    margin: -0.1rem 0.1rem 0.06rem 0.1rem;
    padding: 0 0.16rem;
    background: #f9f9f9;
    border: 0.01rem solid rgba(0, 0, 0, 0.1);
    border-radius: 0.06rem;
    border-radius: 0.06rem;
    &__content {
      margin-top: 0.06rem;
      line-height: 0.22rem;
      border: none;
      outline: none;
      width: 100%;
      background: none;
      font-size: 0.16rem;
      color: $content-fontcolor;
      &::placeholder {
        color: $content-notice-fontcolor;
      }
    }
  }
  &__header {
    position: relative;
    padding-top: 0.2rem;
    line-height: 0.24rem;
    color: $bgColor;
    text-align: center;
    font-size: 0.16rem;
    &__back {
      position: absolute;
      left: 0.18rem;
      font-size: 0.22rem;
    }
  }
  &__receiver {
    position: absolute;
    left: 0.18rem;
    right: 0.18rem;
    top: 0.55rem;

    height: 2.3rem;
    background: $bgColor;
    border-radius: 0.04rem;
    &__title {
      line-height: 0.22rem;
      padding: 0.06rem 0 0.14rem 0.06rem;
      font-size: 0.16rem;
      color: $content-fontcolor;
    }
    &__address {
      line-height: 0.2rem;
      padding: 0 0.4rem 0 0.16rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__info {
      padding: 0.06rem 0 0 0.16rem;
      &__name {
        margin-right: 0.06rem;
        line-height: 0.18rem;
        font-size: 0.12rem;
        color: $medium-fontColor;
      }
    }
    &__icon {
      transform: rotate(180deg);
      position: absolute;
      right: 0.16rem;
      top: 0.5rem;
      color: $medium-fontColor;
      font-size: 0.2rem;
    }
  }
}
</style>