class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
    if (
      title == "" ||
      description == "" ||
      price == "" ||
      thumbnail == "" ||
      code == "" ||
      stock == ""
    ) {
      console.log("Algunos de los datos no fue ingresado");
    } else {
      const valCode = this.products.filter((product) => product.code == code);

      if (valCode.length !== 0) {
        console.log("Ya hay un producto con ese código");
      } else {
        const product = {
          id: this.products.length == 0 ? 1 : this.products.length + 1,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.products.push(product);
        return console.log(product);
      }
    }
  };

  getProducts = () => {
    return console.log(this.products);
  };

  getProductById = (id) => {
    const findProduct = this.products.filter((product) => product.id == id);

    return findProduct.length == 0
      ? console.log("No se encuentra el producto con el ID proporcionado")
      : console.log(findProduct);
  };
}

const products = new ProductManager();
products.addProduct(
  "Zelda BOTW",
  "Breath Of The Wild",
  3000,
  "http://zeldabotw.jpg",
  "NIN-ZELDA-01",
  50
);
products.addProduct(
  "Zelda TOTK",
  "Tears Of The Kingdom",
  5000,
  "http://zeldatotk.jpg",
  "NIN-ZELDA-02",
  150
);
products.addProduct(
  "Dark Souls",
  "Remastered PC",
  2500,
  "http://dsr-pc.jpg",
  "PC-DSR-01",
  20
);
products.addProduct(
  "Diablo IV",
  "Diablo 4 Deluxe Version",
  6000,
  "http://div-deluxe.jpg",
  "PC-D4-01",
  30
);
products.addProduct(
  "Zelda BOTW",
  "Breath Of The Wild",
  3000,
  "http://zeldabotw.jpg",
  "NIN-ZELDA-01",
  50
);

products.getProducts();
products.getProductById(1);
products.getProductById(5);
