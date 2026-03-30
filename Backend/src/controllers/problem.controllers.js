import {
  getJudge0LanguageID,
  pollBatchResults,
  submitBatchToJudge0,
} from "../libs/judge0.js";

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
      return res
        .status(400)
        .json({ message: "Title, description, and difficulty are required" });
    }

    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageID = getJudge0LanguageID(language);
      if (!languageID) {
        return res
          .status(400)
          .json({ message: `Unsupported language: ${language}` });
      }

      const submission = testCases.map(({ input, output }) => {
        return {
          language_id: languageID,
          source_code: solutionCode,
          stdin: input,
          expected_output: output,
        };
      });

      const submisstionResult = await submitBatchToJudge0(submission);

      const token = submisstionResult.map((result) => result.token);
      console.log("token -> ", token);

      const results = await pollBatchResults(token);

      //    console.log("results -> ", results);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              message: `Reference solution failed for language: ${language} on test case ${i + 1}`,
            });
        }
      }

      const newProblem = {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolution,
      };

      await db.problems.create(newProblem);

      res
        .status(201)
        .json({ message: "Problem created successfully", problem: newProblem });
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    res
      .status(500)
      .json({ message: "Internal server error while creating problem" });
  }
};
