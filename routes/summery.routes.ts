import express, { type Request, type Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import summarize from "summarize";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Fetch webpage
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (SummarizerBot/1.0)" },
    });

    const $ = cheerio.load(data);

    // Extract paragraphs
    const paragraphs: string[] = [];
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text) paragraphs.push(text);
    });

    if (paragraphs.length === 0) {
      return res.json({ summary: "No readable text found on the page." });
    }

    const mainText = paragraphs.join("\n\n");

    // Use summarize package
    const result = summarize(mainText, 3); // returns an object
    const summaryText = result?.summary || mainText.slice(0, 500); // extract plain summary

    // Return only text summary
    res.json({ summary: summaryText });
  } catch (error) {
    console.error("Error fetching or summarizing webpage:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
