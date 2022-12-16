After cloning the repo, to install

```
npm install
cd client && npm install
```

To start the server

```
cd /path/to/hotrod
npm run dev
```

To start client development

```
cd client && npm run watch
```

Client compile time is super slow due to bundling for prod everytime also using `ts` to transpile transcript code to javascript.
That's fine for now.

`localhost:8000/1` will make a call to `/api/1` to get the puzzle input.
puzzle inputs are in `index.ts` in a pretty rudimentary way.
all of the logic is in client side and can be found in `client/src/App.tsx`

you can add a `.env` file to the root directory with `PORT=X` to set a different port than `8000`.
