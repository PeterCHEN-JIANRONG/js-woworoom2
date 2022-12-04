const apiPath = "peter104js2022";
const apiBaseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`;
let products = [];
let cartsData = {};

// DOM
const productListDom = document.querySelector(".productWrap");
const cartsTableDom = document.querySelector(".shoppingCart-table");

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

function init() {
  getProducts();
  getCarts();
}

init();
