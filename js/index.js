const apiPath = "peter104js2022";
const apiBaseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`;
let products = [];
let cartsData = {};

// DOM
const productListDom = document.querySelector(".productWrap");
const cartsTableDom = document.querySelector(".shoppingCart-table");

// function
function getProducts() {
  const url = `${apiBaseUrl}/products`;
  axios
    .get(url)
    .then((res) => {
      products = res.data.products;
      console.log(products);
      renderProducts(products);
    })
    .catch((err) => {
      console.log(err);
    });
}

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

function getCarts(){
  const url = `${apiBaseUrl}/carts`;
  axios.get(url).then(res=>{
    cartsData = res.data;
    console.log(cartsData);
    renderCarts();
  }).catch(err=>{
    console.log(err);
  })
}

function renderCarts() {
  let str = `<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`;

  cartsData.carts.forEach(item=>{
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
      <a href="#" class="material-icons"> clear </a>
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
  <td>NT$${cartsData.finalTotal}</td>
</tr>`
cartsTableDom.innerHTML = str;
}

function init() {
  getProducts();
  getCarts();
}

init();
