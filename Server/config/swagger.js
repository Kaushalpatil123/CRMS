const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const swaggerUrl = process.env.backendurl

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API',
      version: '1.0.0',
      description: 'A simple Express CRM API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: swaggerUrl, 
      },
    ],
  },
  apis: ['./routes/*.js', './docs.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };