import { Vehicle } from '../../../src/domain/entities/vehicle'

describe('Vehicle entity', () => {
    it('should create a vehicle with all properties', () => {
        const vehicle = new Vehicle(
            '1',
            'Toyota',
            'Corolla',
            2020,
            'Prata',
            80000,
            true,
            null
        )
        expect(vehicle.id).toBe('1')
        expect(vehicle.brand).toBe('Toyota')
        expect(vehicle.model).toBe('Corolla')
        expect(vehicle.fabricationDate).toBe(2020)
        expect(vehicle.color).toBe('Prata')
        expect(vehicle.price).toBe(80000)
        expect(vehicle.isAvailable).toBe(true)
        expect(vehicle.saleId).toBeNull()
    })

    it('should set default values for isAvailable and saleId', () => {
        const vehicle = new Vehicle('2', 'Honda', 'Civic', 2021, 'Preto', 90000)
        expect(vehicle.isAvailable).toBe(true)
        expect(vehicle.saleId).toBeNull()
    })
})
