/**
 * Shared topic extraction functionality for analyzing HN stories
 * Used by both web and mobile apps for topic visualization
 */

import { Story, TopicData } from './types';
import { stripHtml } from './utils';

// English stopwords to filter out
const stopwords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'in', 'of', 'if', 'it',
  'its', 'it\'s', 'this', 'that', 'these', 'those', 'from', 'as', 'with', 'has',
  'have', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may',
  'might', 'can', 'could', 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your',
  'his', 'her', 'our', 'their', 'what', 'which', 'who', 'whom', 'whose', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'about', 'also', 'then', 'there'
]);

// Technical stopwords specific to HN content
const technicalStopwords = new Set([
  'http', 'https', 'www', 'com', 'org', 'net', 'io', 'html', 'css', 'js',
  'javascript', 'code', 'app', 'application', 'web', 'website', 'site',
  'server', 'client', 'database', 'api', 'framework', 'library', 'module',
  'function', 'class', 'method', 'object', 'array', 'string', 'number',
  'boolean', 'null', 'undefined', 'gui', 'ui', 'ux', 'user', 'users',
  'interface', 'implementation', 'algorithm', 'data', 'structure', 'logic',
  'programming', 'software', 'hardware', 'system', 'systems', 'tech', 'technology',
  'development', 'developer', 'developers', 'programming', 'programmer', 'programmers',
  'git', 'github', 'repository', 'repo', 'branch', 'commit', 'push', 'pull', 'merge'
]);

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  
  // Convert to lowercase and split by non-alphanumeric characters
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2) // Filter out very short words
    .filter(word => !stopwords.has(word)) // Filter out stopwords
    .filter(word => !technicalStopwords.has(word)); // Filter out technical stopwords
}

/**
 * Simple stemming function to reduce words to their base form
 */
function stem(word: string): string {
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

/**
 * Extract topics from text content
 */
export const extractTopics = (
  textContent: string[],
  maxTopics: number = 20
): TopicData => {
  // Process all text contents
  const words: { [key: string]: number } = {};
  
  textContent.forEach(text => {
    const tokens = tokenize(text);
    
    tokens.forEach(token => {
      const stemmed = stem(token);
      words[stemmed] = (words[stemmed] || 0) + 1;
    });
  });
  
  // Convert to array and sort by frequency
  const wordsArray = Object.entries(words)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxTopics);
  
  return {
    name: 'topics',
    children: wordsArray
  };
};

/**
 * Extract topics from an array of stories
 */
export const extractTopicsFromStories = (stories: Story[], maxTopics: number = 20): TopicData => {
  const textContent = stories.map(story => {
    // Combine title and text (if available)
    let content = story.title || '';
    if (story.text) {
      content += ' ' + stripHtml(story.text);
    }
    return content;
  });
  
  return extractTopics(textContent, maxTopics);
};