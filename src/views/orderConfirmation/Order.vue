<template>
  <div class="order">
    <div class="order__price">
      总计 <span class="order__price__num">&yen; {{ calculations.price }}</span>
    </div>
    <div class="order__btn" @click="() => handleShowConfirmChange(true)">
      提交订单
    </div>
  </div>
  <div
    class="mask"
    v-show="showConfirm"
    @click="() => handleShowConfirmChange(false)"
  >
    <div class="mask__content" @click.stop>
      <h3 class="mask__content__title">确认要提交订单吗？</h3>
      <!-- <p class="mask__content__desc">请尽快完成支付，否则将被取消</p> -->
      <div class="mask__content__btns">
        <div
          class="mask__content__btn mask__content__btn--first"
          @click="() => handleShowConfirmChange(false)"
        >
          再想想
        </div>
        <div
          class="mask__content__btn mask__content__btn--last"
          @click="() => handleConfirmOrder(false)"
        >
          确认订单
        </div>
      </div>
    </div>
  </div>
  <div class="mask" v-show="showSuccess">
    <div class="mask__content" @click.stop>
      <h3 class="mask__content__successtitle">订单提交成功</h3>
      <div class="mask__content__backbtns">
        <div
          class="mask__content__btn mask__content__btn--last"
          @click="handleBackClick"
        >
          返回商品页
        </div>
      </div>
    </div>
  </div>
  <Toast v-if="show" :message="toastMessage" />
</template>

<script>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { post } from "../../utils/request";
import { useCommonCartEffect } from "../../effects/cartEffects";
import Toast, { useToastEffect } from "../../components/Toast";
// import useAddressEffect from "./addressEffect";

// 下单相关逻辑
const useMakeOrderEffect = (
  shopId,
  shopName,
  productList,
  address,
  showToast
) => {
  //   const router = useRouter()
  const store = useStore();
  const showSuccess = ref(false);
  const handleConfirmOrder = async (isCanceled) => {
    const items = [];
    for (let i in productList.value) {
      const product = productList.value[i];
      items.push({
        product: product.id,
        quantity: product.count,
        price: (product.price * product.count).toFixed(2),
      });
    }

    // if (store.state.addressInfo.name === "") {
    //   console.log("name");
    //   showToast("请输入姓名");
    //   return;
    // }

    const data = {
      name: store.state.addressInfo.name,
      address: store.state.addressInfo.address,
      phone: store.state.addressInfo.phone,
      items: items,
    };
    console.log(data);
    try {
      const result = await post("/checkout/", data);
      console.log(result);
      showSuccess.value = true;
    } catch (e) {}
  };
  return { handleConfirmOrder, showSuccess };
};

// 蒙层展示相关的逻辑
const useShowMaskEffect = (showToast) => {
  const showConfirm = ref(false);
  const store = useStore();
  const handleShowConfirmChange = (status) => {
    if (store.state.addressInfo.name === "") {
      showToast("请输入姓名");
      return;
    }
    if (store.state.addressInfo.address === "") {
      showToast("请输入地址");
      return;
    }
    if (store.state.addressInfo.name === "") {
      showToast("请输入手机号");
      return;
    }
    showConfirm.value = status;
  };
  return { showConfirm, handleShowConfirmChange };
};

export default {
  name: "Order",
  components: { Toast },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();

    const route = useRoute();
    const shopId = "1";
    // const address = useAddressEffect()
    const address = "";
    const showloading = ref(false);

    const { calculations, shopName, productList } = useCommonCartEffect(shopId);
    const { handleConfirmOrder, showSuccess } = useMakeOrderEffect(
      shopId,
      shopName,
      productList,
      address,
      showToast
    );
    const { showConfirm, handleShowConfirmChange } =
      useShowMaskEffect(showToast);

    const router = useRouter();

    //       const cleanCartProducts = (shopId) => {
    //     store.commit("cleanCartProducts", { shopId });
    //   };
    const store = useStore();

    const handleBackClick = () => {
      store.commit("cleanCartProducts", { shopId });
      router.back();
    };
    return {
      showConfirm,
      handleShowConfirmChange,
      calculations,
      handleConfirmOrder,
      showloading,
      showSuccess,
      handleBackClick,
      show,
      toastMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/varibles.scss";
.order {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  height: 0.49rem;
  line-height: 0.49rem;
  background: $bgColor;
  &__price {
    flex: 1;
    text-indent: 0.24rem;
    font-size: 0.14rem;
    color: $content-fontcolor;
    &__num {
      line-height: 0.49rem;
      color: $hightlight-fontColor;
      font-size: 0.18rem;
    }
  }
  &__btn {
    width: 0.98rem;
    background: $btn-bgColor;
    color: $bgColor;
    text-align: center;
    font-size: 0.14rem;
  }
}
.mask {
  z-index: 1;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 1.56rem;
    background: $bgColor;
    text-align: center;
    border-radius: 0.04rem;
    &__successtitle {
      margin: 0.54rem 0 0 0;
      line-height: 0.26rem;
      font-size: 0.25rem;
      color: $content-fontcolor;
    }
    &__title {
      margin: 0.24rem 0 0 0;
      line-height: 0.26rem;
      font-size: 0.18rem;
      color: $content-fontcolor;
    }
    &__desc {
      margin: 0.08rem 0 0 0;
      font-size: 0.14rem;
      color: $medium-fontColor;
    }
    &__btns {
      display: flex;
      margin: 0.5rem 0.58rem;
    }
    &__backbtns {
      display: flex;
      margin: 0.3rem 0.58rem;
    }
    &__btn {
      flex: 1;
      line-height: 0.32rem;
      border-radius: 0.16rem;
      font-size: 0.14rem;
      &--first {
        margin-right: 0.15rem;
        border: 0.01rem solid $btn-bgColor;
        color: $btn-bgColor;
      }
      &--last {
        margin-left: 0.15rem;
        box-sizing: border-box;
        width: 1rem;
        background: $btn-bgColor;
        color: #fff;
      }
    }
  }
}
</style>