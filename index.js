import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const githubUser = "systaxiecuador";

fetch("https://chatbot.novacrm.pro/api/auth-codes/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ github_user: githubUser }),
})
  .then(response => {
    if (!response.ok) throw new Error(`Error al obtener el código: ${response.statusText}`);
    return response.json();
  })
  .then(data => {
    const authCode = data.code;
    console.log("Código recibido:", authCode);
    enviarCV(authCode);
  });

  async function enviarCV(authCode) {
    const formData = new FormData();
    const cvPath = path.join(__dirname, 'cvoscar.pdf');
    console.log(cvPath);
    formData.append("code", authCode);
    formData.append("url", "https://github.com/systaxiecuador/retoNeueSchule");
    formData.append("pdf", fs.createReadStream(cvPath));
    
    formData.submit("https://chatbot.novacrm.pro/api/submit/", (err, res) => {
      if (err) {
        console.error("Error al enviar el formulario:", err);
        return;
      }
      
      if (res.statusCode < 200 || res.statusCode >= 300) {
        console.error(`Error del servidor (${res.statusCode}): ${res.statusMessage}`);
        res.on('data', (chunk) => console.error('Cuerpo del error:', chunk.toString()));
        return;
      }
      console.log("¡Éxito! El servidor respondió con estado:", res.statusCode);
      res.on('data', (chunk) => console.log('Respuesta del servidor:', chunk.toString()));
    });
}