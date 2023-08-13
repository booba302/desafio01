function productList(product) {
  return `
  <tr>
  <td scope="col">${product._id}</td>
    <td scope="col">${product.title}</td>
    <td scope="col">${product.description}</td>
    <td scope="col">${product.price}</td>
    <td scope="col"><img src=${product.thumbnail}></img></td>
    <td scope="col">${product.code}</td>
    <td scope="col">${product.stock}</td>
    <td scope="col">${product.category}</td>
  </tr>`;
}

const socket = io();
socket.on("sendProdc", (products) => {
  const tdProducts = products.map((product) => productList(product));
  $("#tableProducts").html(tdProducts.join(" "));
});

document.getElementById("button-add").addEventListener("click", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };

  socket.emit("addProdc", product);
  document.getElementById("add-form").reset();
});

document.getElementById("button-del").addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("delProdc", document.getElementById("id").value);
  document.getElementById("del-form").reset();
});
