# My Notes - Note Taking App

## Overview

This is a client-side note-taking application built with vanilla HTML, CSS, and JavaScript. The app allows users to create, edit, delete, and search through their notes with a clean, modern interface. All data is stored locally in the browser using localStorage, making it a lightweight solution that doesn't require a backend server or database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Pure Vanilla JavaScript**: No frameworks or libraries used, keeping the application lightweight and dependency-free
- **Class-based Architecture**: Uses ES6 classes to organize code with a main `NotesApp` class handling all functionality
- **Event-driven Design**: Implements event listeners for user interactions like adding notes, searching, and keyboard shortcuts
- **Component-based Structure**: Separates concerns between HTML structure, CSS styling, and JavaScript functionality

### Data Management
- **localStorage Persistence**: All notes are stored in the browser's localStorage for data persistence across sessions
- **In-memory Operations**: Notes are loaded into memory on app initialization and synchronized with localStorage on changes
- **Real-time Updates**: UI updates immediately reflect data changes without page refreshes

### User Interface Design
- **Responsive Design**: Mobile-first approach with flexible layouts that adapt to different screen sizes
- **Modern CSS**: Uses CSS Grid/Flexbox, gradients, and smooth animations for a polished user experience
- **Interactive Elements**: Includes features like character counters, search functionality, and visual feedback for user actions

### Key Features Architecture
- **CRUD Operations**: Full create, read, update, delete functionality for notes
- **Search Functionality**: Real-time search filtering through note content
- **Keyboard Shortcuts**: Supports Ctrl/Cmd+Enter for quick note addition
- **Character Counting**: Live character count display for user feedback

## External Dependencies

This application has no external dependencies and runs entirely in the browser:

- **No Backend Services**: All functionality is client-side only
- **No External APIs**: No third-party API integrations
- **No Package Dependencies**: Uses only vanilla web technologies (HTML5, CSS3, ES6+ JavaScript)
- **Browser APIs Only**: Relies solely on standard browser APIs like localStorage and DOM manipulation
- **No Build Tools**: Can be run directly in any modern web browser without compilation or build processes

The application is designed to be completely self-contained and portable, requiring only a web browser to function.