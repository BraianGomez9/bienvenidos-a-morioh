// Detecta basePath según entorno (localhost o GitHub Pages)
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";

// Ruta base para recursos (imágenes, JSON) según entorno y carpeta donde está la página
// Aquí asumimos que el JS se ejecuta desde /pages/ (tienda.html o carrito.html)
const baseRepoPath = isLocalhost ? "../" : "/bienvenidos-a-morioh/";

// Función para ajustar rutas de imágenes (producto.image)
function fixImagePath(imagePath) {
  // Si la ruta ya es absoluta (http o /), no tocarla
  if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath;
  // Si no, agregar la base para imagenes en carpeta img/
  return baseRepoPath + "img/" + imagePath;
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoGuardado = localStorage.getItem("carrito");
carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

const renderCart = () => {
  let cartItems = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;
  let itemhtml = "";

  carrito.forEach(item => {
    const itemTotal = item.price * item.cantidad;
    total += itemTotal;

    itemhtml += `<div class="cart-item">
        <img src="${fixImagePath(item.image)}" alt="${item.alt}">
        <p><strong>${item.name}</strong></p>
        <p>Precio: $${item.price} x ${item.cantidad}</p>
        <button class="remove-cart-item" data-id="${item.id}">-</button>
        <button class="add-cart-item" data-id="${item.id}">+</button>
        <p>Subtotal: $${itemTotal}</p>
        <div class="add-item-cart">
          <button class="remove-item" data-id="${item.id}">Eliminar</button>
        </div>
      </div>`;
  });

  cartItems.innerHTML = itemhtml;
  cartTotal.innerText = `Total: $${total}`;

  // Botones eliminar item
  let removeItem = document.querySelectorAll(".remove-item");
  removeItem.forEach((button) => {
    button.addEventListener("click", () => {
      const deleteItem = parseInt(button.dataset.id);
      carrito = carrito.filter((item) => item.id !== deleteItem);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCart();
    });
  });

  // Botones aumentar cantidad
  let addItem = document.getElementsByClassName("add-cart-item");
  Array.from(addItem).forEach((button) => {
    button.addEventListener("click", () => {
      const increaseItem = parseInt(button.dataset.id);
      let product = carrito.find((item) => item.id === increaseItem);
      if (product) {
        product.cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCart();
      }
    });
  });

  // Botones disminuir cantidad
  let decrementItem = document.getElementsByClassName("remove-cart-item");
  Array.from(decrementItem).forEach((button) => {
    button.addEventListener("click", () => {
      const decreaseItem = parseInt(button.dataset.id);
      let product = carrito.find(item => item.id === decreaseItem);
      if (product) {
        if (product.cantidad > 1) {
          product.cantidad -= 1;
        } else {
          carrito = carrito.filter(item => item.id !== decreaseItem);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCart();
      }
    });
  });
};

let productsContainer = document.getElementById("products-container");

// Ruta para el JSON de productos
let basePath = isLocalhost
  ? "../../data/products.json" // localhost, considerando que JS está en /pages/js/
  : "https://braiangomez9.github.io/bienvenidos-a-morioh/data/products.json";

if (productsContainer) {
  fetch(basePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Ajustar rutas de imágenes para productos
      data.forEach(product => {
        product.image = fixImagePath(product.image);
      });

      let html = "";
      data.forEach(product => {
        html += `
          <div class="product">
            <div class="product-photo">
              <img src="${product.image}" alt="${product.alt}">
            </div>
            <div class="product-info">
              <p>${product.name}</p>
              <p>$${product.price}</p>
              <div class="product-option">
                <button data-id="${product.id}" class="add-to-cart">Agregar al carrito</button>
              </div>
            </div>
          </div>`;
      });
      productsContainer.innerHTML = html;

      // Agregar eventos a botones agregar al carrito
      const buttons = document.querySelectorAll(".add-to-cart");
      buttons.forEach(el => {
        el.addEventListener("click", () => {
          const idFinded = parseInt(el.dataset.id);
          const getProduct = data.find(product => product.id === idFinded);
          const productInCart = carrito.find(prod => prod.id === idFinded);
          const message = document.getElementById("cart-message");

          if (productInCart) {
            productInCart.cantidad += 1;
          } else {
            carrito.push({ ...getProduct, cantidad: 1 });
          }

          localStorage.setItem("carrito", JSON.stringify(carrito));

          if (message) {
            message.innerText = "Añadido al carrito!";
            message.classList.add("visible");

            setTimeout(() => {
              message.classList.remove("visible");
            }, 3000);
          }

          renderCart(); // Actualizar carrito en pantalla (por si está visible)
          console.log(carrito);
        });
      });
    })
    .catch(error => {
      console.error("Error en la comunicación con la API:", error);
    });
}

// Vaciar carrito completo
const cleanAllCart = document.getElementById("remove-all");
if (cleanAllCart) {
  cleanAllCart.addEventListener("click", () => {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart();
  });
}

renderCart();
