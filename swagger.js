const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FEED-MEDIA API',
      version: '1.0.0',
      description: 'API for FEED-MEDIA app'
    },
    servers: [
      {
        url: 'http://localhost:4000'
      },
      {
        url: 'https://feed-api-2h09.onrender.com'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./**/*.controller.js', './**/*.routes.js']
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs
};
