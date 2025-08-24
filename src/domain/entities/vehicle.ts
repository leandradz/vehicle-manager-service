export class Vehicle {
    constructor(
        public id: string,
        public brand: string,
        public model: string,
        public fabricationDate: number,
        public color: string,
        public price: number,
        public isAvailable: boolean = true,
        public saleId: string | null = null
    ) {
        this.id = id
        this.brand = brand
        this.model = model
        this.fabricationDate = fabricationDate
        this.color = color
        this.price = price
        this.isAvailable = isAvailable
        this.saleId = saleId
    }
}
