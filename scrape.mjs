import puppeteer from 'puppeteer'

export const getBookingData = async (url) => {
  const calendarDivSelector = 'div.MuiCardContent-root.css-1qw96cp'
  const dayGSelector = 'g'
  const dayDataTooltipSelector = 'div.MuiPopper-root.MuiTooltip-popper.MuiTooltip-popperArrow.css-1j3rzha'
  const dateParagraphSelector = 'p.MuiTypography-root.MuiTypography-body2.MuiTypography-alignCenter.css-1xor1fu'
  const bookedSpanSelector = 'div.MuiBox-root.css-o7fz2l span.MuiTypography-root.MuiTypography-body2.css-98uirh'
  const avgRateSpanSelector = 'div.MuiBox-root.css-0 span.MuiTypography-root.MuiTypography-body2.css-1c082rw'
  const monthlyBookings = []

  try {
    console.log('Initializing browser...')

    var browser = await puppeteer.launch()
    const page = await browser.newPage()

    console.log('Navigating to page...')

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 })

    console.log('Finding calendars...')

    await page.waitForSelector(calendarDivSelector)
    var calHandles = await page.$$(calendarDivSelector)
    if (!calHandles?.length === 0) throw Error('No calendars found')

    for (const calHandle of calHandles) {
      var monthBookingData = []
      var headingHandle = await calHandle?.$('h5')
      if (!headingHandle) throw Error('Calendar heading handle is undefined')

      const month = await page.evaluate((el) => el.textContent, headingHandle)

      console.log(`FOUND: ${month} calendar`)
      console.log(`Finding days in ${month} calendar...`)

      var daysHandles = await calHandle?.$$(dayGSelector)
      if (daysHandles?.length === 0) throw ('ERROR: Could not find days handles')

      console.log(`FOUND: ${daysHandles.length} days in ${month} calendar`)
      console.log(`Extracting data for ${daysHandles.length} days in ${month}...`)

      for (const dayHandle of daysHandles) {
        await dayHandle.hover()
        await page.waitForSelector(dayDataTooltipSelector, { visible: true })
        const tooltipHandle = await page.$(dayDataTooltipSelector)

        if (tooltipHandle) {
          const dateStr = await page.$eval(
            dateParagraphSelector, (el) => el.textContent
          )
          const numBookedStr = await page.$eval(
            bookedSpanSelector, (el) => el.textContent
          )
          const avgRateStr = await page.$eval(
            avgRateSpanSelector, (el) => el.textContent
          )

          const bookings = parseInt(numBookedStr, 10)
          const match = avgRateStr.match(/\d+/)
          const avgRate = match ?? parseInt(match[0], 10)

          monthBookingData.push({ month, date: dateStr, bookings, avgRate })
          await tooltipHandle.dispose()
        }

        await page.mouse.move(0, 0)
        await page.waitForSelector(dayDataTooltipSelector, { hidden: true })
      }

      if (monthBookingData.length !== daysHandles.length) {
        throw Error(
          `Number of extracted data does not match number of days for ${month}`
        )
      }

      monthlyBookings.push(monthBookingData)
      await headingHandle?.dispose()
    }

    return monthlyBookings
  } catch (err) {
    throw err
  } finally {
    for (const h of daysHandles) await h?.dispose()
    await headingHandle?.dispose()
    for (const h of calHandles) await h?.dispose()
    await browser?.close()
  }
}
