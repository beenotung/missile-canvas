# missile-canvas

A canvas app for missile collision.

[Live on CDN](https://missile-canvas.surge.sh)

## Features

- Two bases emitting missiles, tail chasing the missiles from the opposite base
- Pixelated graphics
- Customizable number of missiles
- Very smooth even with a lot of missiles
- Responsive design (for wide screen and tall screen)
- Developed in Typescript

## Development

### Installation

```bash
npm install missile-canvas
```

You can also install `missile-canvas` with [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), or [slnpm](https://github.com/beenotung/slnpm)

### Start Bundler in Watch Mode

```bash
npm run dev
```

### Edit Code

Update the logics in `main.ts` and the UI in `index.html`.

### Open in Browser

Open `index.html` with live server. A web page will open automatically (e.g. on port [5500](http://127.0.0.1:5500/index.html))

Since the html file need to load the bundled JavaScript file, it cannot be opened from file explorer / finder directly.

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
