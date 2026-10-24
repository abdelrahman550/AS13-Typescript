// Create a class called User.
class User {
  public id: number = Math.floor(Math.random() * 10000);
  private _age: number = 18;
  public notebooksOwned: NoteBook[] = [];

  constructor(
    public name: string,
    public email: string,
    public phone: string,
    age: number,
    private _password: string,
    notebooksOwned?: NoteBook[],
  ) {
    this.age = age;
    if (notebooksOwned) {
      this.notebooksOwned = notebooksOwned;
    }
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60");
    }
    this._age = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public displayInfo(): void {
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

// Create a class called Note.
class Note {
  public id: number = Math.floor(Math.random() * 10000);
  constructor(
    public title: string,
    public content: string,
    // association relationship between Note and User
    public userId: User,
  ) {}

  public preview(): string {
    const contentPreview: string =
      this.content.length > 20
        ? this.content.substring(0, 20) + "..."
        : this.content;

    return contentPreview;
  }
}

// Create a class called NoteBook (With a composition relationship with the Note class).
// Composition: NoteBook owns the Notes stored inside it.
// Notes that belong to a notebook are created through addNote() and kept in
// a private collection, so they can't be accessed or changed from outside.
// They have no life of their own: if the NoteBook is deleted, its Notes go
// with it. (Notes created for Storage are separate from any notebook.)
class NoteBook {
  private noteCollection: Note[] = [];

  constructor(
    public name: string,
    public owner: User,
  ) {
    this.owner.notebooksOwned.push(this);
  }

  public addNote(title: string, content: string): void {
    const note = new Note(title, content, this.owner);
    this.noteCollection.push(note);
  }

  public removeNote(notetitle: string): void {
    this.noteCollection = this.noteCollection.filter(
      (note) => note.title !== notetitle,
    );
    console.log(
      `Note with title "${notetitle}" has been removed from the notebook.`,
    );
  }

  public displayNotes(): void {
    console.log(this.noteCollection);
  }
}

class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): T {
    this.items.push(item);
    return item;
  }

  public removeItem(item: T): void {
    this.items = this.items.filter((i) => i !== item);
  }

  public getAllItems(): T[] {
    return this.items;
  }
}

// Create a class called Admin that extends the User class.
class Admin extends User {
  constructor(
    name: string,
    email: string,
    phone: string,
    age: number,
    password: string,
  ) {
    super(name, email, phone, age, password);
  }

  public createNoteInStorage(
    title: string,
    content: string,
    storage: Storage<Note>,
  ): Note {
    const note = new Note(title, content, this);
    storage.addItem(note);
    return note;
  }

  public deleteNoteFromStorage(note: Note, storage: Storage<Note>): void {
    storage.removeItem(note);
    console.log(
      `Note with title "${note.title}" has been deleted from storage by admin.`,
    );
  }

  public getAllNotesFromStorage(storage: Storage<Note>): Note[] {
    return storage.getAllItems();
  }
}

const user1 = new User("Sandy", "Sandy@gmail.com", "123456789", 25, "password");

const user1NoteBook = new NoteBook("Sandy's Notebook", user1);
user1NoteBook.addNote("Shopping List", "Milk, Eggs, Bread");
user1NoteBook.addNote("Workout Plan", "Monday: Chest, Tuesday: Back");
user1NoteBook.displayNotes();
user1.displayInfo();

const notesStorage = new Storage<Note>();
notesStorage.addItem(
  new Note("Meeting Notes", "Discuss project timeline", user1),
);
const ideasNote = notesStorage.addItem(
  new Note("Ideas", "New app features", user1),
);
console.log({ allNotes: notesStorage.getAllItems() });
notesStorage.removeItem(ideasNote);
console.log({ allNotes: notesStorage.getAllItems() });

const admin1 = new Admin(
  "admin",
  "admin@gmail.com",
  "123456789",
  30,
  "password",
);

const adminNote = admin1.createNoteInStorage(
  "Admin Note",
  "This is an admin note.",
  notesStorage,
);

admin1.createNoteInStorage(
  "Admin Note 2",
  "This is another admin note.",
  notesStorage,
);
admin1.deleteNoteFromStorage(adminNote, notesStorage);
const allNotes = admin1.getAllNotesFromStorage(notesStorage);
console.log({ allNotes });
