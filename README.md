# Second Brain
An Electron based productivity application made for easily clearing your mind, while not letting go of your current task.

Store thoughts, ideas and sidetracks in a hidden to-do list as they appear, without interrupting what you're currently engaged in. Your second brain is just one keyboard shortcut away.

## Shortcuts and interface

- **Ctrl/Cmd+alt+I** : Insert new thought

The field pops up in the foreground and is automatically focused, press enter to save the thought.

![popup-gif](./readme_assets/popup_preview.gif)

- **Ctrl/Cmd+alt+B** : Open the list of stored-away thoughts

Use the left circle to tick a task, or delete entries with the delete button. Closing this window will exit the application, while minimizing it will hide it invisible from the taskbar/dock.

![todolist-prev](./readme_assets/todolist_preview.png)

## How to run

### NodeJS
- Clone the repo
- run ```npm install && npm start``` from the base directory

### Packaged executable
- Open a terminal window in the base repo directory
- Install electron-packager using ```npm install electron-packager -g```
- Package the application specifying your architecture and platform using (for example): ```electron-packager "./" second-brain --platform=win32 --arch=x86_64```
- Run the executable that was created
