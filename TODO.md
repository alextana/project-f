### db

#### Create db tables for

- [x] users
- [x] notes
<!-- - [] note relations (a note is linked to another note) ?? -->

### sync layer

- [] when offline everything happens in the local db
- [] when online I want to sync the local db with the server db
- [] the sync layer should be able to handle conflicts
- [] the sync layer doesn't need to work until you're logged in

### local functionality

- [] Make the app usable without logging in, store data in local/index db
- [] Create a note in the local db as soon as new-note is clicked on, send the user to it
- [] Once the note is created in the local db, put it in the queue for syncing with the db
- [] Have a conflict resolution strategy, timestamp based?
- [] Sync the local db with the server db

- [x] setup dexie db to store data locally
- [] come up with a strategy to sync with turso
- [] implement strategy

### usage

- [] search function
- [] display all notes
- [] tags??
- [] all of these shortcuts should be customizable, also if you want the browser shortcuts to work you can opt-in to change them to add `Shift` to it, so it doesn't conflict with the browser shortcuts

### auth

- [x] Implement user authentication with SSO

### notes

- [] make them blocks, think of a potential format
- [] notes should be able to be converted to markdown / json and served as APIs - so if you want to make a website you can use them as an api

#### blocks

- [] paragraph
- [] image
- [] website embed
- [] code
- [] table
- [] todo
- [] heading
- [] quote
- [] email?
- [] excalidraw
- [] tldraw
- [] youtube
- [] spotify
- [] twitter
- [] some kind of math?

### user

- [] profile page
- [] settings page
