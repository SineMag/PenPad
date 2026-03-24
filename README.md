m i<img src="https://socialify.git.ci/SineMag/PenPad/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="PenPad" width="640" height="320" />

# PenPad

PenPad is a note-focused Expo app that uses Expo Router for file-based navigation.

### Hosted link to app: https://penpad.onrender.com

## Project structure

- `app/`: App routes and screens (Expo Router file-based routing).
- `assets/`: Images, fonts, and static assets.
- `components/`: Reusable UI and context providers.
- `constants/`: Theme colors and shared constants.
- `hooks/`: Custom React hooks.
- `scripts/`: Maintenance scripts (example: `reset-project`).
- `types/`: Shared TypeScript types.
- `utils/`: Utility helpers.

## Clone and run

1. Clone the repository.

   ```bash
   git clone https://github.com/SineMag/PenPad.git
   ```

2. Move into the project.

   ```bash
   cd PenPad
   ```

3. Install dependencies.

   ```bash
   npm install
   ```

4. Start the app.

   ```bash
   npx expo start
   ```

## Common scripts

- `npm run start`: Start the Expo dev server.
- `npm run android`: Start and open Android emulator.
- `npm run ios`: Start and open iOS simulator.
- `npm run web`: Start the web build.
- `npm run lint`: Run linting.

## Notes

- Edit screens inside `app/`. Routes are derived from the file structure.
- If you want a clean starter state, run `npm run reset-project`.
