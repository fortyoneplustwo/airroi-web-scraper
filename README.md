# Task
A client wanted to determine the total monthly revenue from Airbnb bookings listed on Airroi for the next 12 months. Unfortunately, this data was not readily available on the website. Instead, the site provided 12 calendars, each representing an upcoming month. Hovering over a specific day in the calendar revealed a tooltip displaying additional details, such as the number of bookings for that day and the average rate.

![image](https://github.com/user-attachments/assets/1f1e914f-01a4-4295-9dc3-42c5e711b973)


# Solution
I developed a web scraper using Puppeteer to simulate hovering over each day in all 12 calendars. When a tooltip appeared, I extracted the date, number of bookings, and average rate, enabling me to calculate the monthly revenue.
