import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import { Router } from 'express'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fase 4: Vehicle Manager Service API',
            version: '1.0.0',
            description: 'Fase 4: API para gerenciar cadastro de veículos',
        },
    },
    components: {
        schemas: {
            Vehicle: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '123abc' },
                    brand: { type: 'string', example: 'Toyota' },
                    model: { type: 'string', example: 'Corolla' },
                    color: { type: 'string', example: 'Preto' },
                    fabricationDate: { type: 'integer', example: 2022 },
                    price: {
                        type: 'number',
                        format: 'float',
                        example: 25000,
                    },
                    isAvailable: { type: 'boolean', example: true },
                    saleId: { type: 'string', example: 'sale123' },
                },
                required: [
                    'brand',
                    'model',
                    'fabricationDate',
                    'price',
                    'color',
                ],
            },
        },
    },
    apis: ['./src/drivers/web/*.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const swaggerRouter = Router()

swaggerRouter.use('/', swaggerUi.serve)
swaggerRouter.get('/', swaggerUi.setup(swaggerDocs))

export default swaggerRouter
