document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const shop = document.getElementById("shop");
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const clearCartButton = document.getElementById("clear-cart");
  const productsContainer = document.getElementById("products");
  const cartContainer = document.getElementById("cart");
  const showLoginLink = document.getElementById("show-login");
  const showRegisterLink = document.getElementById("show-register");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    console.log(value, "value");
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  };

  const eraseCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  };

  const simulateTokenGeneration = (username, password) => {
    return `${username}-fake-token-12345`;
  };

  const checkLoginStatus = () => {
    const token = getCookie("auth_token");
    const username = getCookie("username");
    if (token) {
      loginForm.style.display = "none";
      registerForm.style.display = "none";
      shop.style.display = "block";
      loadProducts();
      loadCart(username); // Load cart based on logged-in user
    } else {
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      shop.style.display = "none";
    }
  };

  registerButton.addEventListener("click", () => {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    if (username && password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find((user) => user.username === username);

      if (existingUser) {
        alert("Username already exists. Please choose another one.");
      } else {
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful. You can now log in.");
        showLoginForm();
      }
    } else {
      alert("Please enter both username and password.");
    }
  });

  loginButton.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        const token = simulateTokenGeneration(username, password);
        setCookie("auth_token", token, 1);
        setCookie("username", username, 1);
        checkLoginStatus();
      } else {
        alert("Invalid username or password.");
      }
    } else {
      alert("Please enter both username and password.");
    }
  });

  logoutButton.addEventListener("click", () => {
    eraseCookie("auth_token");
    eraseCookie("username");
    checkLoginStatus();
  });

  clearCartButton.addEventListener("click", () => {
    const username = getCookie("username");
    localStorage.removeItem(`cart_${username}`); // Remove cart data specific to the logged-in user
    loadCart(username); // Reload cart after clearing
  });

  const loadProducts = () => {
    const products = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 2, name: "Product 2", price: 20 },
      { id: 3, name: "Product 3", price: 30 },
    ];

    productsContainer.innerHTML = "";
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
      productsContainer.appendChild(productDiv);
    });
  };

  const loadCart = (username) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    cartContainer.innerHTML = "";

    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "cart-item";
      cartItemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
            `;
      cartContainer.appendChild(cartItemDiv);
    });
  };

  window.addToCart = (name, price) => {
    const username = getCookie("username");
    let cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    cart.push({ name, price });
    localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
    loadCart(username); // Reload cart after adding item
  };

  const showLoginForm = () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    shop.style.display = "none";
  };

  const showRegisterForm = () => {
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    shop.style.display = "none";
  };

  showLoginLink.addEventListener("click", showLoginForm);
  showRegisterLink.addEventListener("click", showRegisterForm);

  checkLoginStatus();
});
