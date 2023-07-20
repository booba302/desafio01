function productList(product) {
  return `
  <tr>
    <td>${product.title}</td>
    <td>${product.description}</td>
    <td>${product.price}</td>
    <td><img src=${product.thumbnail}></img></td>
    <td>${product.code}</td>
    <td>${product.stock}</td>
    <td>${product.category}</td>
  </tr>`;
}

const socket = io();
socket.on("products", (products) => {
  const tdProducts = products.map((product) => productList(product));
  $("#tableProducts").html(tdProducts.join(" "));
});
