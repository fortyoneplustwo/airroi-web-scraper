import { calculateMonthlyRevenue } from "./calculateMonthlyRevenue.mjs"

const main = async () => {
  const url1 = 'https://www.airroi.com/atlas/charts/trend?country-code=MU&state=Rivi%C3%A8re-du-Rempart-District&city=Grand-Baie'
  const url2 = 'https://www.airroi.com/atlas/charts/trend?country-code=MU&state=Pamplemousses&city=Trou-aux-Biches'
  const url3 = 'https://www.airroi.com/atlas/charts/trend?country-code=MU&state=Rivi%C3%A8re-du-Rempart-District&city=Pereybere'

  try {
    await calculateMonthlyRevenue(url1, 'Grand-Baie.txt')
    console.log('\n')
    await calculateMonthlyRevenue(url2, 'Trou-aux-Biches.txt')
    console.log('\n')
    await calculateMonthlyRevenue(url3, 'Pereybere.txt')
  } catch (err) {
    console.error(err)
  }
}

main()
