## sync engine

### logged out

[] save everything in indexed db
[x] have all the notes marked as userId: local

### login

[] on every login mark all the pre-existing 'local' notes to have a user id
[] sync all of the notes to the server db (worker)

### logout

[] you should still retain the indexed db
[] any new note will be userID 'local'
