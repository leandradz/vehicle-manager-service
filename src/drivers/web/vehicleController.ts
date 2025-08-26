import { Router, Request, Response } from 'express'
import { VehicleUseCase } from '../../useCases/vehicle'
import { Vehicle } from '../../domain/entities/vehicle'

export class VehicleController {
    private readonly routes: Router

    constructor(private readonly VehicleUseCase: VehicleUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        /**
         * @swagger
         * /:
         *   post:
         *     summary: Cria um novo veículo
         *     tags:
         *       - Vehicles
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Vehicle'
         *     responses:
         *       201:
         *         description: Veículo criado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Vehicle'
         *       500:
         *         description: Erro ao criar veículo
         */
        this.routes.post('/', this.create.bind(this))

        /**
         * @swagger
         * /{vehicleId}:
         *   put:
         *     summary: Atualiza um veículo existente
         *     tags:
         *       - Vehicles
         *     parameters:
         *       - in: path
         *         name: vehicleId
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Vehicle'
         *     responses:
         *       200:
         *         description: Veículo atualizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Vehicle'
         *       500:
         *         description: Erro ao atualizar veículo
         */
        this.routes.put('/:vehicleId', this.update.bind(this))

        /**
         * @swagger
         * /list:
         *   get:
         *     summary: Lista veículos ordenados por preço
         *     tags:
         *       - Vehicles
         *     parameters:
         *       - in: query
         *         name: isAvailable
         *         required: false
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Lista de veículos
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/Vehicle'
         *       500:
         *         description: Erro ao buscar veículos
         */
        this.routes.get('/list', this.list.bind(this))

        /**
         * @swagger
         * /{vehicleId}:
         *   get:
         *     summary: Busca veículo por ID
         *     tags:
         *       - Vehicles
         *     parameters:
         *       - in: path
         *         name: vehicleId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Veículo encontrado
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Vehicle'
         *       404:
         *         description: Veículo não encontrado
         *       500:
         *         description: Erro ao buscar veículo
         */
        this.routes.get('/:vehicleId', this.findById.bind(this))
        return this.routes
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body
            if (
                !data.brand ||
                !data.model ||
                !data.fabricationDate ||
                !data.color ||
                !data.price
            ) {
                throw new Error('All fields are required')
            }
            const tempId = data.id || ''
            const vehicle = new Vehicle(
                tempId,
                data.brand,
                data.model,
                data.fabricationDate,
                data.color,
                data.price,
                data.isAvailable ?? true,
                data.saleId ?? null
            )
            const result = await this.VehicleUseCase.create(vehicle)
            res.status(201).json(result)
        } catch (error) {
            console.log('Failed to create vehicle', error)
            res.status(500).json({ error: 'Failed to create vehicle' })
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.params
            const newData = req.body
            const vehicleFound = await this.VehicleUseCase.findById(vehicleId)
            if (!vehicleFound) {
                throw new Error('Vehicle not found')
            }
            const updatedVehicle = new Vehicle(
                vehicleId,
                newData.brand ?? vehicleFound.brand,
                newData.model ?? vehicleFound.model,
                newData.fabricationDate ?? vehicleFound.fabricationDate,
                newData.color ?? vehicleFound.color,
                newData.price ?? vehicleFound.price,
                newData.isAvailable ?? vehicleFound.isAvailable,
                newData.saleId ?? vehicleFound.saleId
            )
            const result = await this.VehicleUseCase.update(updatedVehicle)
            res.status(200).json(result)
        } catch (error) {
            console.log('Failed to update vehicle', error)
            res.status(500).json({ error: 'Failed to update vehicle' })
        }
    }

    public async findById(req: Request, res: Response): Promise<void> {
        try {
            const { vehicleId } = req.params
            const vehicleFound = await this.VehicleUseCase.findById(vehicleId)
            if (!vehicleFound) {
                res.status(404).json({ error: 'Vehicle not found' })
                return
            }

            res.status(200).json(vehicleFound)
        } catch (error) {
            console.log('Failed to search vehicle', error)
            res.status(500).json({ error: 'Failed to search vehicle' })
        }
    }

    public async list(req: Request, res: Response): Promise<void> {
        try {
            const { isAvailable } = req.query
            const vehicles =
                await this.VehicleUseCase.listVehiclesOrderedByPrice(
                    isAvailable === 'true'
                )
            res.status(200).json(vehicles)
        } catch (error) {
            console.log('Failed to search vehicles', error)
            res.status(500).json({ error: 'Failed to search vehicles' })
        }
    }
}
