import { Place } from "./store/models";
export const data: Place[] = [
  {
    key: "RST",
    title: "Guatemala City",
    description:
      "800 filtros distribuidos por RST",
    picture:
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Guatemala_City_-_Guatemala.jpg",
    position: [14.6333308, -90.5499978],
    seeMoreLink: "https://es.wikipedia.org/wiki/Ciudad_de_Guatemala",
    quantity: 800,
  },

  {
    key: "XYZ",
    title: "Quetzaltenango",
    description:
    "400 filtros distribuidos por XYZ",
    picture:
    "https://upload.wikimedia.org/wikipedia/commons/1/1a/Quetzaltenango_skyline_2009.JPG",
    position: [14.8446, -91.5232],
    seeMoreLink: "https://es.wikipedia.org/wiki/Quetzaltenango",
    quantity: 400,
  },
  {
    key: "ABC",
    title: "Cobán",
    description:
    '750 filtros distribuidos por ABC',
    picture:
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Cob%C3%A1n.jpg",
    position: [15.4651, -90.3843],
    seeMoreLink: "https://es.wikipedia.org/wiki/Cob%C3%A1n",
    quantity: 750,
  },
];
