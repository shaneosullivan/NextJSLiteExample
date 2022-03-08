# NextJS Lite Example

This is a simple example project of one way to use NextJS with

- Server side only rendering
- No ReactJS or NextJS on the client's browser
- A minimal amount of JavaScript on the client's browser
- A simple build system that supports Typescript to create the client side only code

The purpose is to ship as close to zero KB of JavaScript to the browser as possible. This project
is mostly a demonstration of a simple build system that can run alongside NextJS to create a minimal
browser bundle per page (or none at all), with some simple examples of things you might want to do
in JavaScript/Typescript, without resorting to loading client side libraries.

Hopefully in the future (written March 2022), the NextJS team will enable such functionality themselves and additional tools like this will not be necessary. But for now, this has worked very well in my projects, and hopefully will be of use in yours too.

Feel free to use it as the beginning of your project. See it running live at [https://next-js-lite-example.vercel.app/](https://next-js-lite-example.vercel.app/)

## Using it

Check out the code and run

```
  npm i
```

to install all the dependencies. Then open two terminal windows. In the first, type

```
npm run dev
```

That starts up the normal NextJS developer scripts. In the second terminal type

```
npm run watch
```

This starts the custom build script for the client side only code.

Open up a browser at `localhost:3000` to see it running.

This project has a few examples of simple things you can do without React or NextJS client side libraries, such as:

- Sharing Typescript code between the client and the server, so code such as formatters can be written once and used in both environments.
- Rendering, showing and hiding dialogs.
- Dynamic rendering of complex UI on the server, and requested via `fetch()` on the client.
- Pulling in a UI library for a single page if needed.

Of course, you can use whatever you want in the browser, including Web Components, or even other
client side libraries to render more complex UIs if you want to do so. It's the Open Web, go have fun, but in a highly performant way!

## Using with Existing Project

If you have an existing project and want to set up client side only Typescript usage, do the following:

- Make a folder `/scripts` at the root of your NextJS project, and copy the `build-browser.js` file into it.
- Make a folder `/browser` into which you put the files to be transpiled. The output of the transpilation will be in `/public/js`
- Update your `tsconfig.json` to have `"tmp/*.js"` in the `include` array.
- Add the following to the `scripts` section of `package.json`: `"watch": "node scripts/build-browser.js --watch",`
- Replace the `build` script in `package.json` with: `"build": "node scripts/build-browser.js --minify && next build",`

Also note that this was all tested with Node 16. Your mileage may vary with earlier versions of Node.
