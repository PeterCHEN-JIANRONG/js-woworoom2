// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});

import { successAlertMsg, errorAlertMsg } from "./utils/alertMessage.js";

const apiPath = "peter104js2022";
const apiBaseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}`;
const apiToken = "ReqE7UsOWEU6vCaBfpsSvQCwwhs1";
const headers = {
  Authorization: apiToken,
};

// DOM
const orderTable = document.querySelector(".orderPage-table");
const discardAllBtn = document.querySelector(".discardAllBtn");

// function

// 取得訂單列表
function getOrders() {
  const url = `${apiBaseUrl}/orders`;
  axios
    .get(url, { headers })
    .then((res) => {
      // console.log(res.data);
      const { orders } = res.data;
      renderOrders(orders);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 處理訂單狀態
function toggleOrderState(id, state) {
  const data = {
    id,
    paid: !state,
  };

  const url = `${apiBaseUrl}/orders`;
  axios
    .put(url, { data }, { headers })
    .then((res) => {
      // console.log(res.data);
      getOrders();
      successAlertMsg("訂單已更新");
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除單筆訂單
function deleteOrder(id) {
  const url = `${apiBaseUrl}/orders/${id}`;
  axios
    .delete(url, { headers })
    .then((res) => {
      // console.log(res.data);
      getOrders();
      successAlertMsg("訂單已刪除");
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除全部訂單
function deleteAllOrder() {
  const url = `${apiBaseUrl}/orders/`;
  axios
    .delete(url, { headers })
    .then((res) => {
      // console.log(res.data);
      getOrders();
      successAlertMsg("訂單全部刪除");
    })
    .catch((err) => {
      errorAlertMsg(err.response.data.message);
    });
}

// 渲染訂單列表
function renderOrders(orders) {
  let str = `<thead>
  <tr>
      <th>訂單編號</th>
      <th>聯絡人</th>
      <th>聯絡地址</th>
      <th>電子郵件</th>
      <th>訂單品項</th>
      <th>訂單日期</th>
      <th>訂單狀態</th>
      <th>操作</th>
  </tr>
</thead>`;

  // 若購物車為空值
  if (orders.length === 0) {
    str += `<tr>
      <td colspan="8">尚無任何訂單</td>
    </tr>`;

    orderTable.innerHTML = str;
    return;
  }

  orders.forEach((item) => {
    let productsStr = "";
    item.products.forEach((product) => {
      productsStr += `<p>${product.title}x${product.quantity}</p>`;
    });

    str += `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      ${productsStr}
    </td>
    <td>
      <p>${new Date(item.createdAt * 1000).toLocaleDateString()}</p>
      <p>${new Date(item.createdAt * 1000).toLocaleTimeString()}</p>
    </td>
    <td>
      <a href="#" class="orderStatus" data-id="${item.id}" data-state="${
      item.paid
    }">${item.paid ? "已處理" : "未處理"}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" data-id="${
        item.id
      }" value="刪除">
    </td>
  </tr>`;
  });

  orderTable.innerHTML = str;
}

// addEventListener 綁監聽事件
orderTable.addEventListener("click", function (e) {
  e.preventDefault();

  // 刪除單筆訂單
  if (e.target.getAttribute("class")?.includes("delSingleOrder-Btn")) {
    const { id } = e.target.dataset;
    deleteOrder(id);
    return;
  }

  // 處理訂單狀態
  if (e.target.getAttribute("class")?.includes("orderStatus")) {
    const { id } = e.target.dataset;
    const state = e.target.dataset.state === "false" ? false : true;
    toggleOrderState(id, state);
    return;
  }
});

// 刪除全部訂單
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteAllOrder();
});

// 初始化
function init() {
  getOrders();
}

init();
