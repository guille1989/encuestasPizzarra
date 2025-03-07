import React, { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";

const STRING_CONECTION = "3.91.242.67:8082";

const opcionesConEmojis = {
  "Excelente": "⭐⭐⭐⭐⭐",
  "Buena": "⭐⭐⭐⭐",
  "Aceptable": "⭐⭐⭐",
  "Regular": "⭐⭐",
  "Mala": "⭐",
  "Muy rápido": "🏎️",
  "Razonable": "🚗",
  "Un poco lento": "🐢",
  "Muy lento": "⏳",
  "Amable y atento": "😊",
  "Correcta, pero mejorable": "🙂",
  "Indiferente": "😐",
  "Mala atención": "😠",
  "Sí, definitivamente": "✅",
  "Tal vez": "🤔",
  "No": "❌",
  "Cara para lo que recibí": "💸"
};

export default function EncuestaApp() {
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [fechaRespuesta, setFechaRespuesta] = useState("");

  useEffect(() => {
    //setFechaRespuesta para saber si el cliente ya respondió la encuesta en format dd/mm/yyyy
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setFechaRespuesta(`${day}/${month}/${year}`);
    axios.get(`http://${process.env.REACT_APP_URL_LOCAL}/api/encuestas`).then((res) => {
      console.log(res.data)
      setEncuestas(res.data);
    });
  }, []);

  const handleRespuesta = (encuestaId, respuesta) => {
    setRespuestas((prev) => ({ ...prev, [encuestaId]: respuesta }));
  };

  const enviarRespuestas = async () => {
    if (localStorage.getItem("encuesta-respondida") === fechaRespuesta) {
      alert("Ya has respondido esta encuesta.");
      return;
    }
  
    try {
      for (const [encuestaId, respuesta] of Object.entries(respuestas)) {
        await axios.post(`http://${process.env.REACT_APP_URL_LOCAL}/api/responder`, { encuestaId, respuesta });
      }
      setMensaje("¡Respuestas enviadas!");
      localStorage.setItem("encuesta-respondida", fechaRespuesta);
    } catch (error) {
      console.error("Error al enviar respuestas", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>
        Encuesta de Satisfacción de la Pizzarra 100% Masa Madre
      </h1>
      {
      encuestas.map((encuesta) => (
        <div key={encuesta._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", marginBottom: "10px" }}>
          <p style={{ fontWeight: "bold" }}>{encuesta.pregunta}</p>
          <div style={{ marginTop: "10px" }}>
            {encuesta.opciones.map((opcion) => (
              <button
                key={opcion}
                style={{
                  margin: "5px",
                  padding: "8px 12px",
                  border: "1px solid #007bff",
                  backgroundColor: respuestas[encuesta._id] === opcion ? "#007bff" : "white",
                  color: respuestas[encuesta._id] === opcion ? "white" : "#007bff",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => handleRespuesta(encuesta._id, opcion)}
              >
                {opcionesConEmojis[opcion] || ""} {opcion}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        onClick={enviarRespuestas}
      >
        Enviar respuestas
      </button>
      {mensaje && <p style={{ color: "green", marginTop: "10px" }}>{mensaje}</p>}
    </div>
  );
}
