let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoGuardado = localStorage.getItem("carrito");
carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

const renderCart = () => {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total")

    if (!cartItems || !cartTotal) return

    cartItems.innerHTML = ""
    let total = 0
    let itemhtml = ""

    carrito.forEach(item => {
        const itemTotal = item.price * item.cantidad
        total += itemTotal;

        itemhtml += `<div class="cart-item">
        <img src="${item.image}" alt="${item.alt}">
                <p><strong>${item.name}</strong></p>
                <p>Precio: $${item.price} x ${item.cantidad}</p>
                <button class="remove-cart-item" data-id="${item.id}">-</button>
                <button class="add-cart-item" data-id="${item.id}">+</button>
                <p>Subtotal: $${itemTotal}</p>
                <div class="add-item-cart">
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        `
    })

    cartItems.innerHTML = itemhtml;
    cartTotal.innerText = `Total: $${total}`

    let removeItem = document.querySelectorAll(".remove-item")
    removeItem.forEach((button) => {
        button.addEventListener("click", () => {
            const deleteItem = parseInt(button.dataset.id)
            carrito = carrito.filter((item) => item.id !== deleteItem)
            renderCart();
        })
    })
    let addItem = document.getElementsByClassName("add-cart-item")
    Array.from(addItem).forEach((button) => {
        button.addEventListener("click", () => {
            const increaseItem = parseInt(button.dataset.id)
            let product = carrito.find((item) => item.id === increaseItem)
            if (product) {
                product.cantidad += 1
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCart();
            }
        })
    })

    let decrementItem = document.getElementsByClassName("remove-cart-item");
    Array.from(decrementItem).forEach((button) => {
        button.addEventListener("click", () => {
            const discreaseItem = parseInt(button.dataset.id);
            let product = carrito.find(item => item.id === discreaseItem);
            if (product) {
                if (product.cantidad > 1) {
                    product.cantidad -= 1;
                } else {
                    carrito = carrito.filter(item => item.id !== discreaseItem);
                }
                localStorage.setItem("carrito", JSON.stringify(carrito));
                renderCart();
            }
        })
    })
}


let productsContainer = document.getElementById("products-container")

if (productsContainer) {
    fetch("../data/products.json")
        .then(response => response.json())
        .then(data => {
            let html = "";
            data.forEach((product) => {
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
                </div>`
            })
            productsContainer.innerHTML = html;
            const buttons = document.querySelectorAll(".add-to-cart");
            buttons.forEach((el) => {
                el.addEventListener("click", () => {
                    const idFinded = parseInt(el.dataset.id);
                    let getProduct = data.find(product => product.id === idFinded);
                    let productInCart = carrito.find(prod => prod.id === idFinded);
                    const message = document.getElementById("cart-message");

                    if (productInCart) {
                        productInCart.cantidad += 1;
                    } else {
                        carrito.push({ ...getProduct, cantidad: 1 });
                    }
                    localStorage.setItem("carrito", JSON.stringify(carrito));

                    // Mostrar el mensaje agregando la clase visible
                    message.innerText = "Añadido al carrito!";
                    message.classList.add("visible");

                    // Después de 3 segundos quitar la clase para ocultar el mensaje
                    setTimeout(() => {
                        message.classList.remove("visible");
                    }, 3000);

                    console.log(carrito);
                });
            });

        })
        .catch(error => {
            console.error('Error en la comunicación con la API:', error);
        });
}

let cleanAllCart = document.getElementById("remove-all")

cleanAllCart.addEventListener("click", () => {
    carrito = []
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart();
})


renderCart();