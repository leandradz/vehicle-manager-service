import { DynamoConnection } from '../../src/config/dynamoConfig'

describe('DynamoConnection', () => {
    it('should create and return a DynamoDB client instance', () => {
        const instance = DynamoConnection.getInstance()
        expect(instance.getClient()).toBeDefined()
    })
    it('should always return the same instance (singleton)', () => {
        const instance1 = DynamoConnection.getInstance()
        const instance2 = DynamoConnection.getInstance()
        expect(instance1).toBe(instance2)
    })
})
