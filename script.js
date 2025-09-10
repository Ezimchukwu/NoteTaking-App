/**
 * Note Taking App - Vanilla JavaScript
 * Handles creating, editing, deleting, and searching notes
 * Uses localStorage for data persistence
 */

class NotesApp {
    constructor() {
        this.notes = [];
        this.editingId = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadNotesFromStorage();
        this.bindEvents();
        this.displayNotes();
        this.updateCharCounter();
    }

    /**
     * Bind event listeners to DOM elements
     */
    bindEvents() {
        const noteInput = document.getElementById('noteInput');
        const addBtn = document.getElementById('addNoteBtn');
        const searchInput = document.getElementById('searchInput');

        // Add note button click
        addBtn.addEventListener('click', () => this.handleAddOrUpdateNote());

        // Enter key in textarea (Ctrl/Cmd + Enter to add note)
        noteInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.handleAddOrUpdateNote();
            }
        });

        // Character counter
        noteInput.addEventListener('input', () => this.updateCharCounter());

        // Search functionality
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Clear search on escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.target.value = '';
                this.handleSearch('');
            }
        });
    }

    /**
     * Load notes from localStorage
     */
    loadNotesFromStorage() {
        try {
            const storedNotes = localStorage.getItem('notes');
            this.notes = storedNotes ? JSON.parse(storedNotes) : [];
        } catch (error) {
            console.error('Error loading notes from storage:', error);
            this.notes = [];
        }
    }

    /**
     * Save notes to localStorage
     */
    saveNotesToStorage() {
        try {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes to storage:', error);
            alert('Error saving notes. Please try again.');
        }
    }

    /**
     * Generate unique ID for notes
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Get current timestamp
     */
    getCurrentTimestamp() {
        return new Date().toLocaleString();
    }

    /**
     * Validate note text
     */
    validateNote(text) {
        const trimmedText = text.trim();
        
        if (!trimmedText) {
            alert('Please enter some text for your note.');
            return false;
        }

        if (trimmedText.length > 5000) {
            alert('Note is too long. Please keep it under 5000 characters.');
            return false;
        }

        return true;
    }

    /**
     * Handle adding or updating a note
     */
    handleAddOrUpdateNote() {
        const noteInput = document.getElementById('noteInput');
        const addBtn = document.getElementById('addNoteBtn');
        const noteText = noteInput.value;

        if (!this.validateNote(noteText)) {
            noteInput.focus();
            return;
        }

        if (this.editingId) {
            // Update existing note
            this.updateNote(this.editingId, noteText.trim());
            this.exitEditMode();
        } else {
            // Add new note
            this.addNote(noteText.trim());
        }

        // Clear input and update display
        noteInput.value = '';
        this.updateCharCounter();
        noteInput.focus();
    }

    /**
     * Add a new note
     */
    addNote(text) {
        const note = {
            id: this.generateId(),
            text: text,
            createdAt: this.getCurrentTimestamp(),
            updatedAt: this.getCurrentTimestamp()
        };

        this.notes.unshift(note); // Add to beginning of array
        this.saveNotesToStorage();
        this.displayNotes();

        // Add animation to new note
        setTimeout(() => {
            const noteCard = document.querySelector(`[data-note-id="${note.id}"]`);
            if (noteCard) {
                noteCard.classList.add('new');
                setTimeout(() => noteCard.classList.remove('new'), 300);
            }
        }, 10);
    }

    /**
     * Update an existing note
     */
    updateNote(id, text) {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        if (noteIndex !== -1) {
            this.notes[noteIndex].text = text;
            this.notes[noteIndex].updatedAt = this.getCurrentTimestamp();
            this.saveNotesToStorage();
            this.displayNotes();
        }
    }

    /**
     * Delete a note
     */
    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotesToStorage();
            this.displayNotes();

            // Exit edit mode if deleting the note being edited
            if (this.editingId === id) {
                this.exitEditMode();
            }
        }
    }

    /**
     * Enter edit mode for a note
     */
    editNote(id) {
        const note = this.notes.find(note => note.id === id);
        if (note) {
            const noteInput = document.getElementById('noteInput');
            const addBtn = document.getElementById('addNoteBtn');

            noteInput.value = note.text;
            noteInput.focus();
            noteInput.setSelectionRange(note.text.length, note.text.length);

            this.editingId = id;
            addBtn.textContent = 'Update Note';
            addBtn.classList.remove('btn-add');
            addBtn.classList.add('btn-edit');

            this.updateCharCounter();

            // Scroll to input area
            noteInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Exit edit mode
     */
    exitEditMode() {
        const noteInput = document.getElementById('noteInput');
        const addBtn = document.getElementById('addNoteBtn');

        this.editingId = null;
        noteInput.value = '';
        addBtn.textContent = 'Add Note';
        addBtn.classList.remove('btn-edit');
        addBtn.classList.add('btn-add');

        this.updateCharCounter();
    }

    /**
     * Handle search functionality
     */
    handleSearch(searchTerm) {
        const trimmedSearch = searchTerm.trim().toLowerCase();
        
        if (!trimmedSearch) {
            this.displayNotes();
            return;
        }

        const filteredNotes = this.notes.filter(note =>
            note.text.toLowerCase().includes(trimmedSearch)
        );

        this.displayNotes(filteredNotes);
    }

    /**
     * Update character counter
     */
    updateCharCounter() {
        const noteInput = document.getElementById('noteInput');
        const charCounter = document.getElementById('charCounter');
        const count = noteInput.value.length;

        charCounter.textContent = `${count} character${count !== 1 ? 's' : ''}`;

        // Change color based on length
        if (count > 4500) {
            charCounter.style.color = '#f44336';
        } else if (count > 4000) {
            charCounter.style.color = '#ff9800';
        } else {
            charCounter.style.color = '#666';
        }
    }

    /**
     * Create HTML for a single note card
     */
    createNoteCard(note) {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.setAttribute('data-note-id', note.id);

        const isUpdated = note.createdAt !== note.updatedAt;
        const timeInfo = isUpdated 
            ? `Created: ${note.createdAt}<br>Updated: ${note.updatedAt}`
            : `Created: ${note.createdAt}`;

        noteCard.innerHTML = `
            <div class="note-meta">${timeInfo}</div>
            <div class="note-text">${this.escapeHtml(note.text)}</div>
            <div class="note-actions">
                <button class="btn btn-edit" onclick="notesApp.editNote('${note.id}')">
                    Edit
                </button>
                <button class="btn btn-delete" onclick="notesApp.deleteNote('${note.id}')">
                    Delete
                </button>
            </div>
        `;

        return noteCard;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Display notes in the UI
     */
    displayNotes(notesToDisplay = null) {
        const notesContainer = document.getElementById('notesContainer');
        const emptyState = document.getElementById('emptyState');
        const notes = notesToDisplay || this.notes;

        // Clear container
        notesContainer.innerHTML = '';

        if (notes.length === 0) {
            emptyState.classList.remove('hidden');
            notesContainer.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            notesContainer.classList.remove('hidden');

            // Create and append note cards
            notes.forEach(note => {
                const noteCard = this.createNoteCard(note);
                notesContainer.appendChild(noteCard);
            });
        }
    }

    /**
     * Get notes count for external use
     */
    getNotesCount() {
        return this.notes.length;
    }

    /**
     * Export notes as JSON (for backup)
     */
    exportNotes() {
        const dataStr = JSON.stringify(this.notes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * Clear all notes (with confirmation)
     */
    clearAllNotes() {
        if (confirm('Are you sure you want to delete ALL notes? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your notes. Are you absolutely sure?')) {
                this.notes = [];
                this.saveNotesToStorage();
                this.displayNotes();
                this.exitEditMode();
                document.getElementById('searchInput').value = '';
                alert('All notes have been deleted.');
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to cancel edit mode
    if (e.key === 'Escape' && window.notesApp && window.notesApp.editingId) {
        window.notesApp.exitEditMode();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl/Cmd + N to focus note input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('noteInput').focus();
    }
});