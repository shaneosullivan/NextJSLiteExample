# NextJS Lite Example

This is a simple example project of one way to use NextJS with

- Server side only rendering
- No ReactJS or NextJS on the client's browser
- A minimal amount of JavaScript on the client's browser
- A simple build system that supports Typescript to create the client side only code

Feel free to use it as the beginning of your project.

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

Of course, you can use whatever you want in the browser, including Web Components, or even other
client side libraries to render more complex UIs if you want to do so. It's the Open Web, go have fun, but in a highly performant way!
