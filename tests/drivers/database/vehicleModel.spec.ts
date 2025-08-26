import { DynamoVehicleRepository } from '../../../src/drivers/database/vehicleModel'

describe('DynamoVehicleRepository', () => {
    let repo: DynamoVehicleRepository

    beforeEach(() => {
        repo = new DynamoVehicleRepository()
    })

    it('should have create, get, update, filterByAvailability methods', () => {
        expect(typeof repo.create).toBe('function')
        expect(typeof repo.get).toBe('function')
        expect(typeof repo.update).toBe('function')
        expect(typeof repo.filterByAvailability).toBe('function')
    })

    it('filterByAvailability should return a Promise', () => {
        const result = repo.filterByAvailability(true)
        expect(result).toBeInstanceOf(Promise)
    })
})
