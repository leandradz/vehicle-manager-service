import swaggerRouter from '../../src/config/swaggerConfig'

describe('swaggerRouter', () => {
    it('should export a router instance', () => {
        expect(swaggerRouter).toBeDefined()
        expect(typeof swaggerRouter.use).toBe('function')
        expect(typeof swaggerRouter.get).toBe('function')
    })
})
