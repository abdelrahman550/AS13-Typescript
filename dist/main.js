class User {
    name;
    email;
    phone;
    _password;
    id = Math.floor(Math.random() * 10000);
    _age = 18;
    notebooksOwned = [];
    constructor(name, email, phone, age, _password, notebooksOwned) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this._password = _password;
        this.age = age;
        if (notebooksOwned) {
            this.notebooksOwned = notebooksOwned;
        }
    }
    get age() {
        return this._age;
    }
    set age(value) {
        if (value < 18 || value > 60) {
            throw new Error("Age must be between 18 and 60");
        }
        this._age = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    displayInfo() {
        console.log({
            ID: this.id,
            Name: this.name,
            Email: this.email,
            Phone: this.phone,
            Age: this.age,
            notebooksOwned: this.notebooksOwned ?? [],
        });
    }
}
class Note {
    title;
    content;
    userId;
    id = Math.floor(Math.random() * 10000);
    constructor(title, content, userId) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
    preview() {
        const contentPreview = this.content.length > 20
            ? this.content.substring(0, 20) + "..."
            : this.content;
        return contentPreview;
    }
}
class NoteBook {
    name;
    owner;
    noteCollection = [];
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
        this.owner.notebooksOwned.push(this);
    }
    addNote(title, content) {
        const note = new Note(title, content, this.owner);
        this.noteCollection.push(note);
    }
    removeNote(notetitle) {
        this.noteCollection = this.noteCollection.filter((note) => note.title !== notetitle);
        console.log(`Note with title "${notetitle}" has been removed from the notebook.`);
    }
    displayNotes() {
        console.log(this.noteCollection);
    }
}
class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
        return item;
    }
    removeItem(item) {
        this.items = this.items.filter((i) => i !== item);
    }
    getAllItems() {
        return this.items;
    }
}
class Admin extends User {
    constructor(name, email, phone, age, password) {
        super(name, email, phone, age, password);
    }
    createNoteInStorage(title, content, storage) {
        const note = new Note(title, content, this);
        storage.addItem(note);
        return note;
    }
    deleteNoteFromStorage(note, storage) {
        storage.removeItem(note);
        console.log(`Note with title "${note.title}" has been deleted from storage by admin.`);
    }
    getAllNotesFromStorage(storage) {
        return storage.getAllItems();
    }
}
const user1 = new User("Sandy", "Sandy@gmail.com", "123456789", 25, "password");
const user1NoteBook = new NoteBook("Sandy's Notebook", user1);
user1NoteBook.addNote("Shopping List", "Milk, Eggs, Bread");
user1NoteBook.addNote("Workout Plan", "Monday: Chest, Tuesday: Back");
user1NoteBook.displayNotes();
user1.displayInfo();
const notesStorage = new Storage();
notesStorage.addItem(new Note("Meeting Notes", "Discuss project timeline", user1));
const ideasNote = notesStorage.addItem(new Note("Ideas", "New app features", user1));
console.log({ allNotes: notesStorage.getAllItems() });
notesStorage.removeItem(ideasNote);
console.log({ allNotes: notesStorage.getAllItems() });
const admin1 = new Admin("admin", "admin@gmail.com", "123456789", 30, "password");
const adminNote = admin1.createNoteInStorage("Admin Note", "This is an admin note.", notesStorage);
admin1.createNoteInStorage("Admin Note 2", "This is another admin note.", notesStorage);
admin1.deleteNoteFromStorage(adminNote, notesStorage);
const allNotes = admin1.getAllNotesFromStorage(notesStorage);
console.log({ allNotes });
export {};
