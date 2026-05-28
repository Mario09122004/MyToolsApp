# My Tools Apps
This mobile app, is making to have all my tools in one place. Because exist a lot of tools, but in diference apps and I want to have all in one place.

## Technology
- React Native
- Expo
- TypeScript
- Gluestack UI
- SQLite
- Drizzle


## Design
- The app should be minimalist and modern.
- The app should have a dark mode and a light mode.

---

## Functional Modules

### Notes
This module acts as a personal notepad integrated with a local SQLite database using Drizzle ORM (saving entries in the `tasks` schema table).
- **Visuals**: Displays notes in a scrollable list of clean cards featuring the title, formatted date, and a brief snippet of the content.
- **Creation & Modification**: A modal form handles both creating new notes and editing existing ones.
- **Deletion**: Long-pressing a note card triggers a confirmation dialog (`AlertDialog`) to permanently delete it.

### Random
This module helps make decisions by spinning a virtual roulette wheel with custom options.
- **Options Input**: Users enter options in a text area, separating them with line breaks (Enter).
- **Wheel & Physics**: Renders a dynamic SVG roulette wheel divided proportionally. It supports swipe-to-spin gestures with realistic momentum deceleration.
- **Winner Handling**: Once the wheel stops, a modal displays the selected winner. Users can choose to dismiss the alert or discard the option, which automatically removes it from the input list for subsequent spins.

---

## Notes modules tasks

Tasks:
- Fix the problem that doing when the user write quickly and dupli the text. (It's because the screen is rendering all, to solve it, maybe I can specify what component re-rendering to do every thing so quickly)

## Modules to make
- Birthdays
- Habits
- Task
- Projects
- Loans
- Send message by location
- Entrepreneurship