import { getBookingData } from "./scrape.mjs";
import { createWriteStream } from "fs"

export const calculateMonthlyRevenue = async (url, filename) => {
  console.log(`======= Calculating monthly revenue for ${filename} =======`)

  try {
    var monthlyBookings = await getBookingData(url)
  } catch (err) {
    throw Error(`Error scraping page ${url}: ${err}`)
  }

  try {
    const monthlyRevenue = monthlyBookings.map((dailyBookings) =>
      dailyBookings.reduce((acc, { month, bookings, avgRate }) => {
        return {
          month: month,
          revenue: acc.revenue + (bookings * avgRate)
        }
      }, { month: '', revenue: 0 })
    )

    const fileStream = createWriteStream(filename)
    monthlyRevenue.forEach(({ month, revenue }) => 
      fileStream.write(`${month}: ${revenue}\n`)
    )
    fileStream.end()

    console.log(`File ${filename} written successfully`)
  } catch (err) {
    throw Error(`Error calculating monthly revenue for ${url}: ${err}`)
  }
}

