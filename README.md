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
