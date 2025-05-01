import { TopicHistoryItem } from "@shared/types";

const TOPIC_HISTORY_KEY = "hn-topic-history";

// Save topic history to localStorage
export const saveTopicHistory = (topicHistory: TopicHistoryItem[]) => {
  try {
    localStorage.setItem(TOPIC_HISTORY_KEY, JSON.stringify(topicHistory));
  } catch (error) {
    console.error("Error saving topic history to localStorage:", error);
  }
};

// Load topic history from localStorage
export const loadTopicHistory = (): TopicHistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(TOPIC_HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Error loading topic history from localStorage:", error);
    return [];
  }
};

// Add a new topic history item
export const addTopicHistoryItem = (newItem: TopicHistoryItem) => {
  const history = loadTopicHistory();
  
  // Check if an entry for today already exists
  const existingIndex = history.findIndex(item => item.date === newItem.date);
  
  if (existingIndex >= 0) {
    // Update existing entry
    history[existingIndex] = newItem;
  } else {
    // Add new entry
    history.push(newItem);
  }
  
  // Keep only the last 7 days
  const recentHistory = history.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 7);
  
  saveTopicHistory(recentHistory);
  return recentHistory;
};