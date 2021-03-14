const { computeRentalFee } = require('../../utils/helper')

describe('computeRentalFee', () => {
    it('returns the correct rental fee', () => {
        
        const result = computeRentalFee(10, 0.5)
        expect(result).toBe(5)
    })

})