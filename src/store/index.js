import Vuex from 'vuex'
const getLocalAddress = () => {
  if (localStorage.addressInfo) {
    return JSON.parse(localStorage.addressInfo);
  }
  else {
    return {
      address: "",
      phone: "",
      name: ""
    };
  }
}
const SetLocalAddress = (state) => {
  const { addressInfo } = state;
  const addressInfoString = JSON.stringify(addressInfo);
  localStorage.addressInfo = addressInfoString;
}

const setLocalCartList = (state) => {
  const { cartList } = state
  const cartListString = JSON.stringify(cartList)
  localStorage.cartList = cartListString
}

const getLocaCartList = () => {

  // { shopId: {shopName:'', productList:{ productId: {} }}}
  if (localStorage.cartList) {
    return JSON.parse(localStorage.cartList) || {}
  }
  else {
    return {};
  }

}

export default Vuex.createStore({
  state: {
    cartList: getLocaCartList(),
    addressInfo: getLocalAddress()
  },
  mutations: {
    changeAddressInfo(state, payload) {
      const { address, phone, name } = payload;
      state.address = address;
      state.phone = phone;
      state.name = name;
      SetLocalAddress(state);
    },


    changeCartItemInfo(state, payload) {
      const { shopId, productId, productInfo } = payload
      let shopInfo = state.cartList[shopId] || {
        shopName: '', productList: {}
      }
      let product = shopInfo.productList[productId]
      if (!product) {
        productInfo.count = 0
        product = productInfo
      }
      product.count = product.count + payload.num
      if (payload.num > 0) { product.check = true }
      if (product.count < 0) { product.count = 0 }
      shopInfo.productList[productId] = product
      state.cartList[shopId] = shopInfo
      setLocalCartList(state)
    },
    changeShopName(state, payload) {
      const { shopId, shopName } = payload
      const shopInfo = state.cartList[shopId] || {
        shopName: '', productList: {}
      }
      shopInfo.shopName = shopName
      state.cartList[shopId] = shopInfo
      setLocalCartList(state)
    },
    changeCartItemChecked(state, payload) {
      const { shopId, productId } = payload
      const product = state.cartList[shopId].productList[productId]
      product.check = !product.check
      setLocalCartList(state)
    },
    cleanCartProducts(state, payload) {
      const { shopId } = payload
      state.cartList[shopId].productList = {}
      setLocalCartList(state)
    },
    setCartItemsChecked(state, payload) {
      const { shopId } = payload
      const products = state.cartList[shopId].productList
      if (products) {
        for (let key in products) {
          const product = products[key]
          product.check = true
        }
      }
      setLocalCartList(state)
    }
  }
})
