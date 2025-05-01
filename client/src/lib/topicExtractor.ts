import { removeStopwords } from 'stopword';
import compromise from 'compromise';

interface Topic {
  name: string;
  value: number;
}

interface TopicData {
  name: string;
  children: Topic[];
}

// Simple tokenizer function instead of using natural.WordTokenizer
function tokenize(text: string): string[] {
  // Split on any non-alphanumeric character and filter out empty strings
  return text.split(/[^a-zA-Z0-9]+/).filter(Boolean);
}

// Simple stemmer function instead of using natural.PorterStemmer
function stem(word: string): string {
  // Very basic stemming - just lowercase the word for now
  return word.toLowerCase();
}

// Custom stopwords to filter out from technical content
const CUSTOM_STOPWORDS = [
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
  'be', 'been', 'being', 'do', 'does', 'did', 'doing', 'have', 'has', 
  'had', 'having', 'get', 'gets', 'got', 'getting', 'can', 'could', 
  'will', 'would', 'should', 'may', 'might', 'must', 'need', 'needs', 
  'needed', 'should', 'shall', 'just', 'more', 'most', 'other', 'some', 
  'such', 'no', 'not', 'only', 'very', 'i', 'me', 'my', 'myself', 'we', 
  'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 
  'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 
  'those', 'am', 'how', 'when', 'where', 'why', 'with', 'from', 'into', 
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 
  'then', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few', 
  'more', 'most', 'for', 'of', 'at', 'by', 'about', 'against', 'between', 
  'through', 'like', 'make', 'made', 'making', 'one', 'two', 'three', 
  'four', 'five', 'first', 'second', 'third', 'new', 'old', 'thing',
  'comment', 'ask', 'tell', 'said', 'say', 'says', 'use', 'using', 'used',
  'sure', 'show', 'think', 'thinking', 'thought', 'know', 'knowing', 'known',
  'going', 'want', 'see', 'seen', 'look', 'looking', 'looked', 'time', 'day',
  'week', 'month', 'year', 'anyone', 'everyone', 'someone'
];

/**
 * Extract topics from text content
 * @param textContent Array of text strings to analyze
 * @param maxTopics Maximum number of topics to return
 * @returns Topics with weights for visualization
 */
export const extractTopics = (
  textContent: string[], 
  maxTopics: number = 20
): TopicData => {
  // Combine all the text into one string
  const allText = textContent.join(' ');
  
  // Use compromise for entity extraction
  const doc = compromise(allText);
  const topics = doc.topics().json();
  const companies = doc.organizations().json();
  
  // Get topics and organizations from compromise
  const entityTerms: string[] = [
    ...topics.map((t: any) => t.text),
    ...companies.map((c: any) => c.text)
  ];
  
  // Tokenize text
  let tokens = tokenize(allText.toLowerCase());
  
  // Remove stopwords 
  tokens = removeStopwords(tokens);
  tokens = tokens.filter((token: string) => !CUSTOM_STOPWORDS.includes(token.toLowerCase()));
  
  // Remove short tokens (less than 3 chars) and non-alphabetic tokens
  tokens = tokens.filter((token: string) => token.length > 2 && /^[a-zA-Z]+$/.test(token));
  
  // Add the entity terms to our tokens with higher weight
  tokens = [...tokens, ...entityTerms, ...entityTerms]; // Add twice for higher weighting
  
  // Count word frequencies
  const wordFrequency: { [key: string]: number } = {};
  tokens.forEach((token: string) => {
    const stemmed = stem(token);
    wordFrequency[stemmed] = (wordFrequency[stemmed] || 0) + 1;
  });
  
  // Create a map to track the most common non-stemmed word for each stem
  const stemToWord: { [key: string]: string } = {};
  tokens.forEach((token: string) => {
    const stemmed = stem(token);
    if (!stemToWord[stemmed] || token.length > stemToWord[stemmed].length) {
      stemToWord[stemmed] = token;
    }
  });
  
  // Sort by frequency and take the top N
  const topTopics = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTopics)
    .map(([stem, count]) => ({
      name: stemToWord[stem] || stem,
      value: count
    }));
  
  return {
    name: "Topics",
    children: topTopics
  };
};

/**
 * Extract topics from an array of stories
 * @param stories Array of Hacker News stories
 * @param maxTopics Maximum number of topics to return
 * @returns Topics with weights for visualization
 */
export const extractTopicsFromStories = (stories: any[], maxTopics: number = 20): TopicData => {
  // Extract relevant text from stories
  const textContent = stories.map(story => {
    return [
      story.title || '',
      story.text || '',
      story.type || ''
    ].join(' ');
  });
  
  return extractTopics(textContent, maxTopics);
};