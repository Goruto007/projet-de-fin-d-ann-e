function afficherMotdePasse() {
    const input = document.getElementById("login-password");
    const button = event.target;

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🔒";
    } else {
        input.type = "password";
        button.textContent = "🔓";
    }
}

function afficherMotdePasse2() {
    const input = document.getElementById("register-password");
    const button = event.target;

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🔒";
    } else {
        input.type = "password";
        button.textContent = "🔓";
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("utilisateurs")) || [];
}

function saveUsers(users) {
    localStorage.setItem("utilisateurs", JSON.stringify(users));
}

function enregistrerUtilisateur() {
    const nouvelUtilisateur = {
        nomUtilisateur: document.getElementById("username").value.trim(),
        adresse: document.getElementById("adress").value.trim(),
        prenom: document.getElementById("first-name").value.trim(),
        nom: document.getElementById("last-name").value.trim(),
        email: document.getElementById("register-email").value.trim(),
        motDePasse: document.getElementById("register-password").value
    };

    const users = getUsers();
    const existingIndex = users.findIndex((user) => user.email === nouvelUtilisateur.email);

    if (existingIndex >= 0) {
        users[existingIndex] = nouvelUtilisateur;
    } else {
        users.push(nouvelUtilisateur);
    }

    saveUsers(users);
    localStorage.setItem("currentUser", JSON.stringify(nouvelUtilisateur));
    return nouvelUtilisateur;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    const registerForm = document.querySelector(".register-form");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const users = getUsers();
        const user = users.find((savedUser) => savedUser.email === email && savedUser.motDePasse === password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            localStorage.setItem("currentUser", JSON.stringify({
                nomUtilisateur: "musicien",
                prenom: "",
                nom: "",
                email,
                adresse: ""
            }));
        }

        window.location.href = "utilisateur.html";
    });

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        enregistrerUtilisateur();
        window.location.href = "utilisateur.html";
    });
});
