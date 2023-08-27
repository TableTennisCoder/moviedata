const puppeteer = require("puppeteer");
const express = require("express");
const cache = require("memory-cache");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Function to handle the extratcing logic and return the desired data
async function extractDataFromPage(page) {
  // Wait for the item blocks to appear
  await page.waitForSelector(".item_small");

  // Wait for an additional amount of time to ensure the content is fully rendered
  await page.waitForTimeout(2000);

  // Find the elements and extract the data
  const data = await page.evaluate(() => {
    const results = [];

    const itemBlocks = document.querySelectorAll(".item_small");

    itemBlocks.forEach((item) => {
      // 1. Search for FSK
      const fskElement = item.querySelector(".fsk_icon_pos");
      let fskNumber = null;

      const innerClassName = fskElement.querySelector("div").className;
      // using some regular expressions to extract the number (e.g. 12)
      const match = innerClassName.match(/fsk(\d+)/);

      if (match && match[1]) {
        fskNumber = match[1];
      }

      // 2. Search for Deskriptoren
      const elements = Array.from(item.querySelectorAll(".label"));
      let deskriptorenText = "";

      const foundElement = elements.find(
        (element) => element.textContent.trim() == "Deskriptoren"
      );

      if (foundElement) {
        const nextTdElement = foundElement.parentElement.nextElementSibling;

        if (nextTdElement) {
          const spanElement = nextTdElement.querySelector("span");

          if (spanElement) {
            deskriptorenText = spanElement.textContent.trim();
          }
        }
      }

      // JS Object to store all the extracted data
      const outputJSON = {
        title: item.querySelector(".title").textContent.trim(),
        fsk: fskNumber,
        deskriptoren: deskriptorenText,
      };

      // add it to our array
      results.push(outputJSON);
    });

    // return the results array with all the objects in it after extracting from the webpage
    return results;
  });

  // return the whole data to use it later -> combine and display it
  return data;
}

// when user visits the endpoint "/api/data" this code will execute
app.get("/", async (req, res) => {
  const cachedData = cache.get("movieData");

  // If there are data in cache, use it, otherwise extract them using puppeteer -> takes a few seconds
  if (cachedData) {
    console.log("Data retrieved from cache");
    res.json(cachedData);
    return;
  }

  try {
    // start / open browser
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // handle dialogs and accept them (in our case cookie dialog)
    page.on("dialog", async (dialog) => {
      await dialog.accept(); // Automatically press OK
    });

    // visit webpage
    await page.goto("https://www.fsk.de/?seitid=491&tid=70");

    // accept all cookies
    await page.click(".buttonAll");
    // select date in selectbox
    await page.select("#datvon_Day_ID", "20");

    // Fill out form to get to the movies page
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[name="kino"]');
      if (checkbox) checkbox.checked = true;

      const radioButtonDate = document.querySelector(
        'input[type="radio"][name="sortaz"][value="0"]'
      );
      if (radioButtonDate) radioButtonDate.checked = true;

      const radioButton = document.querySelector(
        'input[type="radio"][name="db"][value="beg"]'
      );
      if (radioButton) radioButton.checked = true;
    });

    // Click search
    await page.click('input[name="submit_alle"]');

    // extract the data from first
    const dataPage1 = await extractDataFromPage(page);

    // click next page "2"
    await page.click('.submitLink[value="2"]');
    // extract data from second page
    const dataPage2 = await extractDataFromPage(page);
    // click next page "3"
    await page.click('.submitLink[value="3"]');
    // extract data from second page
    const dataPage3 = await extractDataFromPage(page);

    // combine data from page 1 and 2
    const combinedData = dataPage1.concat(dataPage2, dataPage3);

    await browser.close();

    cache.put("movieData", combinedData,  43200000); // cache for 12h

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: "Oooooops, something went wrong :(" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
