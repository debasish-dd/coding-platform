import {
  getJudge0LanguageID,
  pollBatchResults,
  submitBatchToJudge0,
} from "../libs/judge0.js";
import { db } from "../libs/db.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolution,
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "Test cases are required" });
    }

    if (!referenceSolution || typeof referenceSolution !== "object") {
      return res.status(400).json({ message: "Reference solution required" });
    }

    const controller = new AbortController();
    let firstError = null;

    await Promise.all(
      Object.entries(referenceSolution).map(
        async ([language, solutionCode]) => {
          if (controller.signal.aborted) return;
          try {
            const languageID = getJudge0LanguageID(language);
            if (!languageID) {
              throw new Error(`Unsupported language: ${language}`);
            }

            const submission = testCases.map(({ input, output }) => ({
              language_id: languageID,
              source_code: solutionCode,
              stdin: input.trim() + "\n",
              expected_output: output.trim() + "\n",
            }));

            const submissionResult = await submitBatchToJudge0(submission);

            if (!submissionResult) {
              throw new Error("Judge0 submission failed");
            }

            const tokens = submissionResult.map((r) => r.token);
            const results = await pollBatchResults(tokens);

            results.forEach((result, i) => {
              if (result.status.id !== 3) {
                throw new Error(`Failed for ${language} on test case ${i + 1}`);
              }
            });
          } catch (err) {
            if (!firstError) {
              firstError = err;
              controller.abort();
            }
          }
        },
      ),
    );

    if (firstError) throw firstError;

    const newProblem = await db.problem.create({
  data: {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolution,
    userId: req.user.id,
  },
});

    return res.status(201).json({
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const check = async (req, res) => {
  return res.status(200).json({ message: "Check endpoint is working" });
};
