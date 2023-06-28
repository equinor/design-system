type Cargo = any

const dataGenerator = (length = 20) => {
  let data = []
  for (let i = 0; i < length; i++) {
    data = [
      ...data,
      {
        qty: Math.floor(Math.random() * 10000),
        cargoId: `${i + 1}`,
        status: 'OK',
        parcels: ['', ''],
        carrier: 'Boat',
      },
    ]
  }
  return data
}

const data = dataGenerator()

export default data
