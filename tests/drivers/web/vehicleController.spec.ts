import { VehicleController } from '../../../src/drivers/web/vehicleController'
import { VehicleUseCase } from '../../../src/useCases/vehicle'
import { Vehicle } from '../../../src/domain/entities/vehicle'
import { Request, Response } from 'express'

describe('VehicleController', () => {
    let controller: VehicleController
    let mockUseCase: jest.Mocked<VehicleUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockUseCase = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            listVehiclesOrderedByPrice: jest.fn(),
        } as unknown as jest.Mocked<VehicleUseCase>
        controller = new VehicleController(mockUseCase)
        req = { body: {}, params: {}, query: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    })

    it('should instantiate and setup routes', () => {
        const routes = controller.setupRoutes()
        expect(typeof routes.use).toBe('function')
        expect(typeof routes.get).toBe('function')
        expect(typeof routes.post).toBe('function')
        expect(typeof routes.put).toBe('function')
    })

    it('should have create, update, findById, list methods', () => {
        expect(typeof controller.create).toBe('function')
        expect(typeof controller.update).toBe('function')
        expect(typeof controller.findById).toBe('function')
        expect(typeof controller.list).toBe('function')
    })

    describe('create', () => {
        it('should create a vehicle and return 201', async () => {
            req.body = {
                id: '1',
                brand: 'Toyota',
                model: 'Corolla',
                fabricationDate: 2020,
                color: 'Prata',
                price: 80000,
            }
            mockUseCase.create.mockResolvedValue({ id: '1' } as Vehicle)
            await controller.create(req as Request, res as Response)
            expect(mockUseCase.create).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ id: '1' })
        })
        it('should return 500 if missing fields', async () => {
            req.body = { brand: 'Toyota' }
            await controller.create(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create vehicle',
            })
        })
        it('should return 500 on useCase error', async () => {
            req.body = {
                id: '1',
                brand: 'Toyota',
                model: 'Corolla',
                fabricationDate: 2020,
                color: 'Prata',
                price: 80000,
            }
            mockUseCase.create.mockRejectedValue(new Error('fail'))
            await controller.create(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create vehicle',
            })
        })
    })

    describe('update', () => {
        it('should update a vehicle and return 200', async () => {
            req.params = { vehicleId: '1' }
            req.body = { brand: 'Honda' }
            mockUseCase.findById.mockResolvedValue({
                id: '1',
                brand: 'Toyota',
            } as Vehicle)
            mockUseCase.update.mockResolvedValue({
                id: '1',
                brand: 'Honda',
            } as Vehicle)
            await controller.update(req as Request, res as Response)
            expect(mockUseCase.findById).toHaveBeenCalledWith('1')
            expect(mockUseCase.update).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ id: '1', brand: 'Honda' })
        })
        it('should return 500 if vehicle not found', async () => {
            req.params = { vehicleId: '1' }
            mockUseCase.findById.mockResolvedValue(null)
            await controller.update(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update vehicle',
            })
        })
        it('should return 500 on useCase error', async () => {
            req.params = { vehicleId: '1' }
            req.body = { brand: 'Honda' }
            mockUseCase.findById.mockResolvedValue({
                id: '1',
                brand: 'Toyota',
            } as Vehicle)
            mockUseCase.update.mockRejectedValue(new Error('fail'))
            await controller.update(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update vehicle',
            })
        })
    })

    describe('findById', () => {
        it('should return vehicle and 200', async () => {
            req.params = { vehicleId: '1' }
            mockUseCase.findById.mockResolvedValue({ id: '1' } as Vehicle)
            await controller.findById(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ id: '1' })
        })
        it('should return 404 if not found', async () => {
            req.params = { vehicleId: '1' }
            mockUseCase.findById.mockResolvedValue(null)
            await controller.findById(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Vehicle not found',
            })
        })
        it('should return 500 on useCase error', async () => {
            req.params = { vehicleId: '1' }
            mockUseCase.findById.mockRejectedValue(new Error('fail'))
            await controller.findById(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to search vehicle',
            })
        })
    })

    describe('list', () => {
        it('should return vehicles and 200', async () => {
            req.query = { isAvailable: 'true' }
            mockUseCase.listVehiclesOrderedByPrice.mockResolvedValue([
                { id: '1' } as Vehicle,
            ])
            await controller.list(req as Request, res as Response)
            expect(mockUseCase.listVehiclesOrderedByPrice).toHaveBeenCalledWith(
                true
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith([{ id: '1' }])
        })
        it('should return 500 on useCase error', async () => {
            req.query = { isAvailable: 'true' }
            mockUseCase.listVehiclesOrderedByPrice.mockRejectedValue(
                new Error('fail')
            )
            await controller.list(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to search vehicles',
            })
        })
    })
})
