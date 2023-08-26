const puppeteer = require("puppeteer");
const express = require("express");
const cache = require("memory-cache");

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/data", async (req, res) => {

  //   const cachedData = cache.get('movieData'); // Try to get data from cache

  //   if (cachedData) {
  //       console.log('Data retrieved from cache');
  //       res.json(cachedData);
  //       return;
  //   }

  // try {
  //   const browser = await puppeteer.launch({ headless: false });
  //   const page = await browser.newPage();

  //   // handle dialogs
  //   page.on("dialog", async (dialog) => {
  //     await dialog.accept(); // Automatically press OK
  //   });

  //   await page.goto("https://www.fsk.de/?seitid=491&tid=70");

  //   // Cookies dialog
  //   await page.click(".buttonAll");
  //   // select date
  //   await page.select("#datvon_Day_ID", "20");

  //   await page.evaluate(() => {
  //     // select selectbox "Kino"
  //     const checkbox = document.querySelector('input[name="kino"]');
  //     if (checkbox) checkbox.checked = true;

  //     // select radio "nach Datum"
  //     const radioButtonDate = document.querySelector(
  //       'input[type="radio"][name="sortaz"][value="0"]'
  //     );
  //     if (radioButtonDate) radioButtonDate.checked = true;

  //     // select radio "nur Filme mit Freigabebegründung"
  //     const radioButton = document.querySelector(
  //       'input[type="radio"][name="db"][value="beg"]'
  //     );
  //     if (radioButton) radioButton.checked = true;
  //   });

  //   // press search button
  //   await page.click('input[name="submit_alle"]');

  //   // Wait for the item blocks to appear
  //   await page.waitForSelector(".item_small");

  //   // Wait for an additional amount of time to ensure the content is fully rendered
  //   await page.waitForTimeout(2000);

  //   const data = await page.evaluate(() => {
  //     const results = [];

  //     // Select elements with specific tag
  //     const itemBlocks = document.querySelectorAll(".item_small");

  //     itemBlocks.forEach((item) => {
  //       // get FSK out of the image using regular expressions
  //       const fskElement = item.querySelector(".fsk_icon_pos");
  //       let fskNumber = null;

  //       const innerClassName = fskElement.querySelector("div").className;
  //       const match = innerClassName.match(/fsk(\d+)/);

  //       if (match && match[1]) {
  //         fskNumber = match[1];
  //       }

  //       const elements = Array.from(item.querySelectorAll(".label"));
  //       let deskriptorenText = "";

  //       const foundElement = elements.find(
  //         (element) => element.textContent.trim() == "Deskriptoren"
  //       );

  //       if (foundElement) {
  //         const nextTdElement = foundElement.parentElement.nextElementSibling;

  //         if (nextTdElement) {
  //           const spanElement = nextTdElement.querySelector("span");

  //           if (spanElement) {
  //             deskriptorenText = spanElement.textContent.trim();
  //           }
  //         }
  //       }

  //       const outputJSON = {
  //         title: item.querySelector(".title").textContent.trim(),
  //         fsk: fskNumber,
  //         deskriptoren: deskriptorenText,
  //       };

  //       results.push(outputJSON);
  //     });

  //     return results;
  //   });

  //   await browser.close();

  //   cache.put('movieData', data, 3600000); // Store data for 1 hour

  //   res.json(data); // Return the data as JSON

    res.json({ title: "Yoooo, it works!" });

  } catch (error) {
    res.status(500).json({ error: "An error occured." });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
