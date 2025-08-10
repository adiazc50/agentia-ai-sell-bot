import { useParams } from "react-router-dom";
import Index from "./Index";

// Mapa de slugs -> etiqueta bonita
const CITY_LABEL: Record<string, string> = {
  "medellin": "Medellín","bogota": "Bogotá","cali": "Cali","barranquilla": "Barranquilla",
  "cartagena": "Cartagena","bucaramanga": "Bucaramanga","cucuta": "Cúcuta","pereira": "Pereira",
  "manizales": "Manizales","armenia": "Armenia","ibague": "Ibagué","pasto": "Pasto",
  "monteria": "Montería","neiva": "Neiva","villavicencio": "Villavicencio","popayan": "Popayán",
  "sincelejo": "Sincelejo","tunja": "Tunja","yopal": "Yopal","riohacha": "Riohacha",
  "quibdo": "Quibdó","florencia": "Florencia","mocoa": "Mocoa","mitu": "Mitú",
  "san-andres": "San Andrés","leticia": "Leticia","inirida": "Inírida",
  "puerto-carreno": "Puerto Carreño","valledupar": "Valledupar","santa-marta": "Santa Marta",
  "ciudad-de-panama": "Ciudad de Panamá"
};

export default function City() {
  // Hoy no usamos la ciudad para cambiar la UI,
  // pero la dejamos lista por si mañana quieres personalizar textos.
  const { slug = "" } = useParams();
  const city = CITY_LABEL[slug] ?? slug.replace(/-/g, " ");

  // La UI será EXACTAMENTE la misma del home:
  return <Index />;
}
