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
  .then(response => response.json())
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
    try {
        const response = await fetch("https://chatbot.novacrm.pro/api/submit/", {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        });
        const result = await response.json();
        console.log("Mensaje: ", result.message);
        console.log("Url: ", result.source_url);
        console.log("Pdf: ", result.pdf_url);
        console.log("Código: ", result.code);
        console.log("Intento: ", result.attempt);

    } catch (error) {
        console.error("Hubo un error con la solicitud:", error);
    }
}