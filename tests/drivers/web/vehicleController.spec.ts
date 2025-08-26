import { VehicleController } from '../../../src/drivers/web/vehicleController'
import { Router } from 'express'
import { VehicleUseCase } from '../../../src/useCases/vehicle'

const mockUseCase = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    listVehiclesOrderedByPrice: jest.fn(),
} as unknown as VehicleUseCase

describe('VehicleController', () => {
    it('should instantiate and setup routes', () => {
        const controller = new VehicleController(mockUseCase)
        const routes = controller.setupRoutes()
        expect(typeof routes.use).toBe('function')
        expect(typeof routes.get).toBe('function')
        expect(typeof routes.post).toBe('function')
        expect(typeof routes.put).toBe('function')
    })

    it('should have create, update, findById, list methods', () => {
        const controller = new VehicleController(mockUseCase)
        expect(typeof controller.create).toBe('function')
        expect(typeof controller.update).toBe('function')
        expect(typeof controller.findById).toBe('function')
        expect(typeof controller.list).toBe('function')
    })
})
