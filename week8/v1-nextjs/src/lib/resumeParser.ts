// Simple keyword extraction from resume text
// Extracts meaningful terms for job matching

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "shall", "can", "need",
  "this", "that", "these", "those", "i", "me", "my", "we", "our",
  "you", "your", "he", "him", "his", "she", "her", "it", "its", "they",
  "them", "their", "what", "which", "who", "whom", "where", "when",
  "how", "not", "no", "nor", "if", "then", "than", "too", "very",
  "just", "also", "so", "as", "each", "every", "all", "both", "few",
  "more", "most", "other", "some", "such", "only", "own", "same",
  "about", "above", "after", "again", "any", "because", "before",
  "between", "during", "into", "through", "under", "until", "up",
]);

const SKILL_PATTERNS = [
  // Programming languages
  /\b(python|javascript|typescript|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r|matlab|sql)\b/gi,
  // Frameworks
  /\b(react|angular|vue|next\.?js|django|flask|spring|rails|express|node\.?js|fastapi|laravel)\b/gi,
  // Tools & platforms
  /\b(aws|azure|gcp|docker|kubernetes|jenkins|git|linux|terraform|ansible)\b/gi,
  // Data & ML
  /\b(machine learning|deep learning|nlp|computer vision|data science|tensorflow|pytorch|pandas|numpy|spark)\b/gi,
  // Domains
  /\b(frontend|backend|full.?stack|devops|cloud|mobile|ios|android|web|api|microservices)\b/gi,
  // Business
  /\b(product management|project management|agile|scrum|analytics|strategy|consulting|finance)\b/gi,
];

export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Extract skill-pattern matches first
  const skills = new Set<string>();
  for (const pattern of SKILL_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => skills.add(m.toLowerCase()));
    }
  }

  // Extract frequent meaningful words
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Get top frequent words (not already in skills)
  const topWords = Object.entries(freq)
    .filter(([w]) => !skills.has(w))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([w]) => w);

  return [...skills, ...topWords];
}
