
export const getJudge0LanguageID = (language) => {
    
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "CPP": 54,
        "JAVASCRIPT": 63,
        "C": 50,
    }

    return languageMap[language.toUpperCase()]
}

export const submitBatchToJudge0 = async (submissions) => {
    const {data } = await axios.post(`${process.env.JUDGE0_URL}submissions/batch?base64_encode=false`, {
        submissions: submissions
    })

    console.log("submission result ->  " , data);
    
    return data
}

export const pollBatchResults = async (tokens) => {
    while (true) {
        const {data} =  await axios.get(`${process.env.JUDGE0_URL}submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        const results = data.submissions;
        
        const allCompleted = results.every(result => result.status.id !== 1 && result.status.id !== 2);
        if (allCompleted) {
            return results;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again
    }
}