const defaultUser = {
    nomUtilisateur: "musicien",
    prenom: "",
    nom: "",
    email: "",
    adresse: ""
};

const displayName = document.getElementById("display-name");
const profileFullName = document.getElementById("profile-full-name");
const profileEmail = document.getElementById("profile-email");
const avatarInitials = document.getElementById("avatar-initials");
const cartBadge = document.querySelector(".cart-badge");
const cartCount = document.getElementById("cart-count");
const profileForm = document.getElementById("profile-form");
const logoutBtn = document.getElementById("logout-btn");

function getStoredUser() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        return currentUser;
    }

    const users = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    return users.length > 0 ? users[users.length - 1] : defaultUser;
}

function normalizeUser(user) {
    return {
        nomUtilisateur: user.nomUtilisateur || user.username || defaultUser.nomUtilisateur,
        prenom: user.prenom || user.firstName || "",
        nom: user.nom || user.lastName || "",
        email: user.email || "",
        adresse: user.adresse || user.address || ""
    };
}

function getFullName(user) {
    const fullName = `${user.prenom} ${user.nom}`.trim();
    return fullName || user.nomUtilisateur || "Musicien";
}

function getInitials(user) {
    const source = getFullName(user).split(" ");
    const initials = source.map((part) => part.charAt(0)).join("").slice(0, 2);
    return initials.toUpperCase() || "CC";
}

function updateProfile(user) {
    const fullName = getFullName(user);
    displayName.textContent = user.prenom || user.nomUtilisateur || "musicien";
    profileFullName.textContent = fullName;
    profileEmail.textContent = user.email || "Aucun email enregistre";
    avatarInitials.textContent = getInitials(user);

    document.getElementById("first-name").value = user.prenom;
    document.getElementById("last-name").value = user.nom;
    document.getElementById("username").value = user.nomUtilisateur;
    document.getElementById("email").value = user.email;
    document.getElementById("address").value = user.adresse;
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBadge.textContent = cart.length;
    cartCount.textContent = cart.length;
}

function saveUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    const users = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    const index = users.findIndex((savedUser) => savedUser.email === user.email && user.email);

    if (index >= 0) {
        users[index] = user;
    } else {
        users.push(user);
    }

    localStorage.setItem("utilisateurs", JSON.stringify(users));
}

const user = normalizeUser(getStoredUser());
updateProfile(user);
updateCart();

profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedUser = {
        nomUtilisateur: document.getElementById("username").value.trim() || "musicien",
        prenom: document.getElementById("first-name").value.trim(),
        nom: document.getElementById("last-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        adresse: document.getElementById("address").value.trim()
    };

    saveUser(updatedUser);
    updateProfile(updatedUser);
    alert("Vos informations ont ete mises a jour.");
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "page_de_connection.html";
});

window.addEventListener("storage", updateCart);


