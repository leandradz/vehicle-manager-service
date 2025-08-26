import { VehicleUseCase } from '../../src/useCases/vehicle'
import { VehicleRepository } from '../../src/domain/interface/vehicleRepository'
import { Vehicle } from '../../src/domain/entities/vehicle'

describe('VehicleUseCase', () => {
    let mockRepo: jest.Mocked<VehicleRepository>
    let useCase: VehicleUseCase

    beforeEach(() => {
        mockRepo = {
            get: jest.fn(),
            create: jest.fn<Promise<Vehicle>, [Vehicle]>(),
            update: jest.fn<Promise<Vehicle>, [string, Vehicle]>(),
            filterByAvailability: jest.fn(),
        }
        useCase = new VehicleUseCase(mockRepo)
    })

    it('should call get on findById and return vehicle', async () => {
        const vehicle = { id: '1' } as Vehicle
        mockRepo.get.mockResolvedValue(vehicle)
        const result = await useCase.findById('1')
        expect(result).toBe(vehicle)
        expect(mockRepo.get).toHaveBeenCalledWith('1')
    })

    it('should throw if vehicle not found on findById', async () => {
        mockRepo.get.mockResolvedValue(null)
        await expect(useCase.findById('1')).rejects.toThrow('Vehicle not found')
    })

    it('should call create and return created vehicle', async () => {
        const vehicle = { id: '1' } as Vehicle
        mockRepo.create.mockResolvedValue(vehicle)
        const result = await useCase.create(vehicle)
        expect(result).toBe(vehicle)
        expect(mockRepo.create).toHaveBeenCalledWith(vehicle)
    })

    it('should throw if create fails', async () => {
        mockRepo.create.mockResolvedValue(null as unknown as Vehicle)
        await expect(useCase.create({} as Vehicle)).rejects.toThrow(
            'Failed to create vehicle'
        )
    })

    it('should call update and return updated vehicle', async () => {
        const vehicle = { id: '1' } as Vehicle
        mockRepo.update.mockResolvedValue(vehicle)
        const result = await useCase.update(vehicle)
        expect(result).toBe(vehicle)
        expect(mockRepo.update).toHaveBeenCalledWith('1', vehicle)
    })

    it('should throw if update fails', async () => {
        mockRepo.update.mockResolvedValue(null as unknown as Promise<Vehicle>)
        await expect(useCase.update({ id: '1' } as Vehicle)).rejects.toThrow(
            'Failed to update vehicle'
        )
    })

    it('should call filterByAvailability and return vehicles', async () => {
        const vehicles = [{ id: '1' }, { id: '2' }] as Vehicle[]
        mockRepo.filterByAvailability.mockResolvedValue(vehicles)
        const result = await useCase.listVehiclesOrderedByPrice(true)
        expect(result).toBe(vehicles)
        expect(mockRepo.filterByAvailability).toHaveBeenCalledWith(true)
    })
})
