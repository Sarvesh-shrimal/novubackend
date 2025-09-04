const swaggerJSDoc = require("swagger-jsdoc")
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.3",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "Example API docs",
        },
        servers: [{ url: "http://localhost:3003" }],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/userRoutes/*.js", "./index.js"] // files to scan for @openapi comments
});

module.exports  = swaggerSpec