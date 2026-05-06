import axios from "axios";

export const getJudge0LanguageID = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const submitBatchToJudge0 = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_URL}submissions/batch`,
    { submissions },
    { params: { base64_encoded: false } }
  );
  return data;
};

const MAX_RETRIES = 10;
const INITIAL_DELAY_MS = 500;
const MAX_BACKOFF_MS = 8000;

export const pollBatchResults = async (tokens) => {
  await new Promise((res) => setTimeout(res, INITIAL_DELAY_MS));

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
          fields: "stdout,stderr,status,compile_output",
        },
      }
    );

    if (!data || !Array.isArray(data.submissions)) {
      throw new Error("Invalid Judge0 response");
    }

    const results = data.submissions;
    const allCompleted = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (allCompleted) return results;

    const delay = Math.min(1000 * Math.pow(2, attempt), MAX_BACKOFF_MS);
    await new Promise((res) => setTimeout(res, delay));
  }

  throw new Error("Polling timeout exceeded");
};