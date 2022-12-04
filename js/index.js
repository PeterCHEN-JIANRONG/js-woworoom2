const apiPath = "peter104js2022";
const apiBaseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`;
let products = [];
let cartsData = {};

// DOM
const productListDom = document.querySelector(".productWrap");
const cartsTableDom = document.querySelector(".shoppingCart-table");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderForm = document.querySelector(".orderInfo-form");
const orderSubmitBtn = document.querySelector(".orderInfo-btn");

// validate - constraints 約束條件
const constraints = {
  "姓名": {
    presence:{
      allowEmpty:false,
      message:"必填"
    }
  },
  "電話": {
    presence:{
      allowEmpty:false,
      message:"必填"
    },
    length:{
      minimum:8,
      maximum:12,
      tooShort:"最少%{count}碼",
      tooLong:"最多%{count}碼",
    }
  },
  "Email": {
    presence:{
      allowEmpty:false,
      message:"必填"
    },
    email: {
      message:"必須是正確的格式(例:apple@gmail.com)"
    }
  },
  "寄送地址": {
    presence:{
      allowEmpty:false,
      message:"必填"
    }
  },
  "交易方式": {
    presence: {
        allowEmpty: false,
        message: "是必填欄位"
    }
  }
}

// function

// 取得產品列表
function getProducts() {
  const url = `${apiBaseUrl}/products`;
  axios
    .get(url)
    .then((res) => {
      products = res.data.products;
      // console.log(products);
      renderProducts(products);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 渲染產品列表
function renderProducts(data) {
  let str = "";
  data.forEach((item) => {
    str += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt="${item.title}"
      title="${item.description}"
    />
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>`;
    productListDom.innerHTML = str;
  });
}

// 取得購物車
function getCarts(){
  const url = `${apiBaseUrl}/carts`;
  axios.get(url).then(res=>{
    cartsData = res.data;
    // console.log(cartsData);
    renderCarts(cartsData);
  }).catch(err=>{
    console.log(err);
  })
}

// 加入購物車
function addCart(productId){
  const url = `${apiBaseUrl}/carts`;
  let quantity = 1; // 購買數量, 預設為 1

  if(cartsData.carts?.length > 0){
    // 查看購物車是否已有該產品, 數量累加
    cartsData.carts.forEach(item=>{
      if(item.product.id === productId){
        quantity+=item.quantity;
      }
    })
  }

  const data = {
    productId,
    quantity
  }
  axios.post(url,{data}).then(res=>{
    // console.log(res.data);
    getCarts();
  }).catch(err=>{
    console.log(err);
  })
}

// 修改單筆購物車數量

// 刪除單筆購物車
function deleteCarts(cartsId){
  const url = `${apiBaseUrl}/carts/${cartsId}`;
  axios.delete(url).then(res=>{
    // console.log(res.data);
    getCarts();
  }).catch(err=>{
    console.log(err);
  })
}

// 刪除全部購物車
function deleteAllCarts(){
  const url = `${apiBaseUrl}/carts`;
  axios.delete(url).then(res=>{
    // console.log(res.data);
    getCarts();
  }).catch(err=>{
    console.log(err);
  })
};

// 渲染購物車
function renderCarts(data) {
  let str = '';

  // 判斷購物車有無資料
  if(data.carts?.length > 0) {

    str = `<tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>`;

    data.carts.forEach(item=>{
      str+=`<tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="${item.product.title}" title="${item.product.description}" />
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${item.product.price}</td>
      <td>${item.quantity}</td>
      <td>NT$${item.product.price*item.quantity}</td>
      <td class="discardBtn" data-id="${item.id}">
        <a href="#" class="discardBtn material-icons" data-id="${item.id}"> clear </a>
      </td>
    </tr>`;
    })
  
    str+=`<tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
        <p>總金額</p>
      </td>
      <td>NT$${data.finalTotal}</td>
    </tr>`
  } else {
    str+= `<tr>
        <td>您尚未購買任何商品，請前往選購！</td>
      </tr>`
  }
cartsTableDom.innerHTML = str;
}

// 建立訂單
function postOrder(){

  // 表單驗證
  if(!checkFormIsSuccess()){
    return
  }

  const url = `${apiBaseUrl}/orders`;
  const data = {
    "user": {
      "name": customerName.value,
      "tel": customerPhone.value,
      "email": customerEmail.value,
      "address": customerAddress.value,
      "payment": tradeWay.value
    }
  }

  axios.post(url, {data}).then(res=>{
    // console.log(res.data);
    getCarts();
    successAlertMsg("建立訂單成功");
    orderForm.reset();
  }).catch(err=>{
    errorAlertMsg(err.response.data.message);
  });
}

// 成功訊息
function successAlertMsg(message){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500
  });
}

// 失敗訊息
function errorAlertMsg(message){
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 1500
  });
}

// addEventListener 綁監聽事件

// 產品列表: 加入購物車
productListDom.addEventListener("click", function(e){
  // 取消 a 連結預設瀏覽器動作
  e.preventDefault();

  // 判斷是否點到[加入購物車]按鈕
  if(!e.target.getAttribute("class")?.includes("addCardBtn")){
    console.log("沒有點到加入購物車");
    return 
  }
  
  // 取產品id, 
  // 寫法一
  // const {id} = e.target.dataset;
  // 寫法二
  const id = e.target.getAttribute("data-id")
  addCart(id);
});

// 購物車列表
cartsTableDom.addEventListener("click",function(e){
  e.preventDefault();


  // 刪除全部購物車
  if(e.target.getAttribute("class")?.includes("discardAllBtn")){
    deleteAllCarts();
    return;
  }

  // 刪除單筆購物車商品
  if(e.target.getAttribute("class")?.includes("discardBtn")){
    const {id} = e.target.dataset;
    deleteCarts(id)
    return
  }

  console.log('沒有點到刪除按鈕');
})

// 送出訂單
orderSubmitBtn.addEventListener("click", function(e){
  e.preventDefault();
  postOrder();
})


// 檢查訂單資料
function checkFormIsSuccess(){
  const errors = validate(orderForm, constraints);

  customerName.nextElementSibling.textContent = '';
  customerPhone.nextElementSibling.textContent = '';
  customerEmail.nextElementSibling.textContent = '';
  customerAddress.nextElementSibling.textContent = '';
  tradeWay.nextElementSibling.textContent = '';
  
  if(!errors){
    return true; // 驗證成功
  } else {
    customerName.nextElementSibling.textContent = errors["姓名"]?errors["姓名"][0]:'';
    customerPhone.nextElementSibling.textContent = errors["電話"]?errors["電話"][0]:'';
    customerEmail.nextElementSibling.textContent = errors["Email"]?errors["Email"][0]:'';
    customerAddress.nextElementSibling.textContent = errors["寄送地址"]?errors["寄送地址"][0]:'';
    tradeWay.nextElementSibling.textContent = errors["交易方式"]?errors["交易方式"][0]:'';
    return false; // 驗證失敗
  }
}

function init() {
  getProducts();
  getCarts();
}

init();
