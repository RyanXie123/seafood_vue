<template>
  <div class="title">
    <div class="iconfont title__back" @click="handleBackClick">&#xe6a9;</div>
    所有订单
  </div>
  <div class="wrapper">
    <div class="query">
      <div>订单日期筛选：</div>
      <input
        type="date"
        id="birthday"
        name="birthday"
        v-model="dateRef"
        @change="dateChangedHandler"
      />
    </div>

    <div v-if="list.length === 0 && has_data" style="text-align: center">
      <h2 style="margin-top: 50%">您还没有下单哦</h2>
    </div>

    <div class="orders">
      <div class="order" v-for="(item, index) in list" :key="index">
        <!-- {{ item.name }} -->
        <div class="order__time">下单时间:{{ item.created_at }}</div>
        <div v-for="(orderItem, index) in item.items" :key="index">
          <div class="order__item">
            <img class="order__img" :src="orderItem.product.get_thumbnail" />
            <div class="order__middle">
              <div>{{ orderItem.product.name }}</div>
              <div>{{ orderItem.product.name }}</div>
              <div>x{{ orderItem.quantity }}</div>
            </div>
            <div class="order__price">
              <div>&euro; {{ orderItem.price }}</div>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div style="">订单金额: &euro; {{ item.paid_amount }}</div>
          <div style="">订单状态: 已下单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { get } from "../../utils/request";
import { reactive, ref, toRefs, watchEffect } from "vue";
import moment from "moment";
const useOrderListEffect = (date) => {
  const data = reactive({ list: [] });
  let has_data = ref(false);
  const getNearbyList = async (date) => {
    const result = await get("/orders", { date: date });

    console.log(result);
    data.list = result;
    has_data.value = true;
  };
  getNearbyList(date);
  const { list } = toRefs(data);
  return { list, has_data, getNearbyList };
};
export default {
  setup() {
    const router = useRouter();
    const handleBackClick = () => {
      router.back();
    };

    let date = moment(new Date()).format("YYYY-MM-DD");
    console.log(date);
    let dateRef = ref(date);

    const store = useStore();
    console.log(store.state.addressInfo.phone);
    const { list, has_data, getNearbyList } = useOrderListEffect(date);
    const dateChangedHandler = () => {
      console.log(dateRef.value);
      getNearbyList(dateRef.value);
    };
    return { handleBackClick, list, has_data, dateRef, dateChangedHandler };
  },
};
</script>

<style lang='scss' scoped>
@import "../../styles/varibles.scss";
.query {
  padding: 0.1rem 0.2rem;
}
.wrapper {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0.44rem;
  bottom: 0rem;
  right: 0;
  background: $dark-bgColor;
}
.title {
  line-height: 0.44rem;
  background: $bgColor;
  font-size: 0.16rem;
  color: $content-fontcolor;
  text-align: center;
  &__back {
    position: absolute;
    left: 0.18rem;
    font-size: 0.22rem;
  }
}
.order {
  margin: 0.16rem 0.18rem;
  padding: 0.16rem;
  background: $bgColor;
  &__middle {
    flex: 1;
  }
  &__time {
    color: $light-fontColor;
    font-size: 0.08rem;
    margin-bottom: 0.16rem;
  }
  &__price {
    text-align: center;
    padding-top: 0.1rem;
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0 0.16rem 0.16rem 0;
  }
  &__img {
    width: 0.46rem;
    height: 0.46rem;
    margin-right: 0.16rem;
  }
  &__title {
    margin-bottom: 0.16rem;
    line-height: 0.22rem;
    font-size: 0.16rem;
    color: $content-fontcolor;
  }
  &__status {
    float: right;
    font-size: 0.14rem;
    color: $light-fontColor;
  }
  &__content {
    display: flex;
    &__imgs {
      flex: 1;
    }
    &__img {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.12rem;
    }
    &__info {
      width: 0.7rem;
    }
    &__price {
      margin-bottom: 0.04rem;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
      text-align: right;
    }
    &__count {
      line-height: 0.14rem;
      font-size: 0.12rem;
      color: $content-fontcolor;
      text-align: right;
    }
  }
}
</style>