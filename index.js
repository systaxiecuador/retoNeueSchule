import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

// Tu nombre de usuario de GitHub
const githubUser = "systaxiecuador";

// Haces la solicitud POST
fetch("https://api-challenge.neue.schule/api/challenge/request-code", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ github_user: githubUser }),
})
  .then(response => response.json())
  .then(data => {
    const authCode = data.authorization_code;
    console.log("Código recibido:", authCode);
    enviarCV(authCode); 
  });

  async function enviarCV(authCode) {
  const formData = new FormData();

  const cvPath = path.join(process.cwd(), 'cvoscar.pdf');

  formData.append("github_user", "systaxiecuador");
  formData.append("github_repo_url", "https://github.com/systaxiecuador/retoNeueSchule");
  formData.append("authorization_code", authCode);
  formData.append("cv", fs.createReadStream(cvPath));

  try {
    const response = await fetch("https://api-challenge.neue.schule/api/challenge/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log("¡Éxito!", result.message);
    } else {
      console.error("Error:", result.message);
    }
  } catch (error) {
    console.error("Hubo un error con la solicitud:", error);
  }
}