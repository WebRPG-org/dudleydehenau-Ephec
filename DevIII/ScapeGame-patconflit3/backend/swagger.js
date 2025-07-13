const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "E-Organizer API",
    description:
      "API defined for a sample project during the course 'Développement Informatique III' à l'EPHEC Louvain-la-Neuve",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);