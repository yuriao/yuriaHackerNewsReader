# Hacker News Reader Application

This repository contains a modern Hacker News reader with both web and mobile versions. The application is designed to provide an enhanced, user-centric news consumption experience with innovative reading interfaces and intelligent interaction design.

## Project Structure

The project is organized into three main parts:

### 1. Shared Code (`/shared`)

This directory contains code that is shared between web and mobile applications:

- `types.ts` - Type definitions used across the project
- `api.ts` - API functions for accessing Hacker News data
- `utils.ts` - Utility functions
- `topicExtractor.ts` - Functions for extracting topics from stories

### 2. Web Application (`/web`)

React-based web application:

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point

### 3. Mobile Application (`/mobile`)

React Native mobile application:

- `App.tsx` - Main application component
- `/src` - Source code
  - `/components` - Reusable UI components

## Features

- Browse top, new, best, ask, show, and job stories from Hacker News
- View story details and comments
- Analyze trending topics with data visualizations
- Responsive design for both web and mobile
- Dark/light mode support

## Setup and Running

### Web Application

1. Install dependencies:
   ```
   cd web
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

### Mobile Application

1. Install dependencies:
   ```
   cd mobile
   npm install
   ```

2. Start the Expo development server:
   ```
   npm start
   ```

## Tech Stack

- **Web**: React, TypeScript, Tailwind CSS, TanStack Query, Recharts, Wouter
- **Mobile**: React Native, Expo, TypeScript
- **Common**: Shared API client, TypeScript, D3.js

## Troubleshooting

If you encounter issues with the mobile application, check the `mobile/TROUBLESHOOTING.md` file for common solutions.