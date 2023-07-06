import fs from "fs";

export default class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./products.json";
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products),
        "utf-8"
      );
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const products = await this.getProducts();
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Algunos de los datos no fue ingresado");
    } else {
      const valCode = products.some((product) => product.code === code);
      if (valCode) return console.log("Ya hay un producto con ese código");
      try {
        const product = {
          id: products.length == 0 ? 1 : products.length + 1,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        products.push(product);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products),
          "utf-8"
        );
        return product;
      } catch (error) {
        console.log("error: " + error);
      }
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const findProduct = products.find((product) => product.id == id);

      return findProduct.length == 0
        ? "No se encuentra el producto con el ID proporcionado"
        : findProduct;
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async updateProduct(id, product) {
    try {
      const products = await this.getProducts();
      const updProduct = await this.getProductById(id);
      !product.title ? updProduct.title : (updProduct.title = product.title);
      !product.description
        ? updProduct.description
        : (updProduct.description = product.description);
      !product.price ? updProduct.price : (updProduct.price = product.price);
      !product.thumbnail
        ? updProduct.thumbnail
        : (updProduct.thumbnail = product.thumbnail);
      !product.code ? updProduct.code : (updProduct.code = product.code);
      !product.stock ? updProduct.stock : (updProduct.stock = product.stock);
      const newProducts = products.filter((product) => product.id != id);
      newProducts.push(updProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProducts),
        "utf-8"
      );
      return updProduct;
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const delProduct = await this.getProductById(id);
      const newProduct = products.filter((product) => product.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProduct),
        "utf-8"
      );
      return delProduct;
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}
