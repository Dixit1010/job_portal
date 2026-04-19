export const calculateMatchScoreService = (jobDescription, resumeText) => {
  const jobWords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
  const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];

  const jobVocab = new Set(jobWords);
  const resumeVocab = new Set(resumeWords);

  // Consider words longer than 3 characters to filter out common stop words
  const requiredKeywords = Array.from(jobVocab).filter(word => word.length > 3);
  
  let matchCount = 0;
  const missingSkills = [];

  requiredKeywords.forEach(keyword => {
    if (resumeVocab.has(keyword)) {
      matchCount++;
    } else {
      missingSkills.push(keyword);
    }
  });

  const matchPercentage = requiredKeywords.length > 0 
    ? Math.round((matchCount / requiredKeywords.length) * 100) 
    : 0;

  return {
    matchPercentage,
    missingSkills: missingSkills.slice(0, 10), // Limit missing skills output
  };
};
