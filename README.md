After cloning:

```
npm install
npm start
```

To ensure you get TS autocomplete for CSS modules, be sure to add .vscode/settings.json to the root of the project(it will be gitignored) and place the following inside:

```
{
  "typescript.tsdk": "node_modules\\typescript\\lib"
}
```

## Firebase auth emulators

To get the emulators working please run

```
// this will ask you to login into a project
npx firebase init emulators

```

Once you run that command it will ask you to choose the emulator type, just choose auth emulator.
It will ask you to download emulator now and say `yes`

Once the emulators are installed you can run `npm run start:emulators`

Than you can open the `http://localhost:4000/auth` to see the emulator.
