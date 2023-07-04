export type Data = {
  qty: number
  cargoId: string
  status: string
  parcels: Array<string>
  carrier: string
}

const dataGenerator = (length = 20) => {
  let data: Array<Data> = []
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

export const data = dataGenerator()
