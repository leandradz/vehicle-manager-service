import { Vehicle } from '../../../src/domain/entities/vehicle'
import { DynamoVehicleRepository } from '../../../src/drivers/database/vehicleModel'
import * as libDynamodb from '@aws-sdk/lib-dynamodb'

describe('DynamoVehicleRepository', () => {
    let sendMock: jest.SpyInstance
    let repo: DynamoVehicleRepository
    let vehicle: Vehicle

    beforeEach(() => {
        sendMock = jest.spyOn(
            libDynamodb.DynamoDBDocumentClient.prototype,
            'send'
        )
        repo = new DynamoVehicleRepository()
        vehicle = new Vehicle(
            '1',
            'Ford',
            'Fiesta',
            2020,
            'blue',
            10000,
            true,
            null
        )
    })

    afterEach(() => {
        sendMock.mockRestore()
    })

    it('should create a vehicle', async () => {
        sendMock.mockResolvedValueOnce({})
        const result = await repo.create(vehicle)
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('isAvailable', true)
        expect(sendMock).toHaveBeenCalled()
    })

    it('should throw if create fails', async () => {
        sendMock.mockRejectedValueOnce(new Error('put error'))
        await expect(repo.create(vehicle)).rejects.toThrow('put error')
    })

    it('should get a vehicle', async () => {
        sendMock.mockResolvedValueOnce({ Item: { ...vehicle } })
        const result = await repo.get('1')
        expect(result).toEqual(vehicle)
    })

    it('should return null if get not found', async () => {
        sendMock.mockResolvedValueOnce({})
        const result = await repo.get('2')
        expect(result).toBeNull()
    })

    it('should throw if get fails', async () => {
        sendMock.mockRejectedValueOnce(new Error('get error'))
        await expect(repo.get('1')).rejects.toThrow('get error')
    })

    it('should update a vehicle', async () => {
        sendMock.mockResolvedValueOnce({
            Attributes: { ...vehicle, brand: 'GM' },
        })
        const result = await repo.update('1', { brand: 'GM' })
        expect(result).toEqual({ ...vehicle, brand: 'GM' })
    })

    it('should throw if update fails', async () => {
        sendMock.mockRejectedValueOnce(new Error('update error'))
        await expect(repo.update('1', { brand: 'Ford' })).rejects.toThrow(
            'update error'
        )
    })

    it('should filter vehicles by availability and sort by price', async () => {
        const items = [
            { ...vehicle, id: '1', price: 200 },
            { ...vehicle, id: '2', price: 100 },
        ]
        sendMock.mockResolvedValueOnce({ Items: items })
        const result = await repo.filterByAvailability(true)
        expect(result[0].price).toBe(100)
        expect(result[1].price).toBe(200)
    })

    it('should return empty array if Items is undefined', async () => {
        sendMock.mockResolvedValueOnce({})
        const result = await repo.filterByAvailability(false)
        expect(result).toEqual([])
    })

    it('should return empty array if Items is empty', async () => {
        sendMock.mockResolvedValueOnce({ Items: [] })
        const result = await repo.filterByAvailability(false)
        expect(result).toEqual([])
    })

    it('should return array with one vehicle if Items has one', async () => {
        const items = [{ ...vehicle, id: '1', price: 123 }]
        sendMock.mockResolvedValueOnce({ Items: items })
        const result = await repo.filterByAvailability(true)
        expect(result).toHaveLength(1)
        expect(result[0].price).toBe(123)
    })

    it('should throw if filterByAvailability fails', async () => {
        sendMock.mockRejectedValueOnce(new Error('scan error'))
        await expect(repo.filterByAvailability(true)).rejects.toThrow(
            'scan error'
        )
    })
})
