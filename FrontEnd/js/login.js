// Attendre que le DOM soit entièrement chargé avant d'attacher l'écouteur d'événements
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("#contact .login");  
  const connexionAlert = document.createElement("div");  // Crée un nouvel élément div pour les alertes de connexion
  connexionAlert.id = "connexionAlert";  // Attribue un ID à la nouvelle div
  form.appendChild(connexionAlert);  // Ajoute la div d'alerte au formulaire

  form.addEventListener("submit", async function(e) {
      e.preventDefault();  // Empêche le comportement de soumission de formulaire par défaut
      await connect();  // Appelle la fonction connect
  });

  const connect = async() => {
      let email = document.getElementById("email").value;  // Obtient la valeur de l'email
      let password = document.getElementById("password").value;  // Obtient la valeur du mot de passe

      const url = "http://localhost:5678/api/users/login";
      const data = {email: email, password: password};
      console.log("Données à envoyer :", data);  // Log les données à envoyer

      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",  
                  "Accept": "application/json"
              },
              body: JSON.stringify(data)  
          });
          console.log("Réponse reçue :", response);  

          if (!response.ok) {
              // Affiche un message d'erreur si les identifiants sont incorrects
              connexionAlert.style.visibility = "visible";
              connexionAlert.style.backgroundColor = "rgba(200,0,0,0.5)";
              connexionAlert.textContent = "Erreur : informations incorrectes";

              // Cache le message d'erreur après 5 secondes
              setTimeout(function() {
                  connexionAlert.style.visibility = "hidden";
              }, 5000);
              throw new Error(`Erreur HTTP : ${response.status}`);
          }

          // Si la connexion est réussie :
          const responseData = await response.json();  // Analyse la réponse JSON
          const token = responseData.token;  // Extrait le token
          localStorage.setItem("Token", token);  // Stocke le token dans le localStorage
          window.location.href = "index.html";  // Redirige vers la page principale
      } catch (error) {
          console.error("Erreur lors de la connexion :", error);
      }
  };
});