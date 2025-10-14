declare module "summarize" {
  /**
   * Summarizes a text into a limited number of sentences.
   * @param text The text to summarize
   * @param maxSentences Maximum number of sentences in the summary (optional)
   * @returns A summarized string
   */
  function summarize(text: string, maxSentences?: number): string;

  export default summarize;
}