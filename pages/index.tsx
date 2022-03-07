import Head from "next/head";
import { NextPageContext } from "next";
import HelpDialog from "../components/dialog/HelpDialog";
import HeadContent from "../components/HeadContent";
import { formatNow } from "../lib/format";

interface Props {
  cacheParam: string;
}

// This is what tells NextJS to not serve any Javascript to the client.
// It must be included in every page file.  Of course, you may want to have some
// complex pages still send down the large NextJS and React JS bundles, and in that
// case set the value to {unstable_runtimeJS: true}
export const config = {
  unstable_runtimeJS: false,
};

export default function HomePage(props: Props) {
  return (
    <>
      <Head>
        <HeadContent description="A NextJS Example" />
      </Head>

      <main style={{ padding: "24px" }}>
        <h1>NextJS Lite Example</h1>
        <p>
          Welcome! This is a simple example of using NextJS with server side
          only rendering, but with some small amount of JavaScript on the client
          side. It's purpose is to let you use all the awesome NextJS server
          side rendering with ReactJS, without needing to ship many hundreds of
          KB of JavaScript to the clients browser.
        </p>
        <p>
          The code for this project is open source and available{" "}
          <a
            href="https://github.com/shaneosullivan/NextJSLiteExample"
            target="_blank"
          >
            on Github
          </a>
        </p>

        <h2>Server and client side rendering</h2>
        <p>
          This time was rendered by the <strong>formatNow</strong> function on
          the server: <strong>{formatNow()}</strong>.
        </p>
        <p>
          Click <button data-id="genTime">This Button</button> to generate the
          time with the same function on the client side:{" "}
          <strong data-id="genClientTime"></strong>
        </p>
        <p>See the browser.js file for how this is easily done.</p>
        <h2>Dialogs</h2>
        <p>
          Showing and hiding Dialogs is simple. Render the dialogs on the
          server, then show/hide them by listening to click events. Click{" "}
          <button data-id="toggleHelpDialog">This Button</button> to show the
          Help Dialog, and see the browser.ts file for how this is done.
        </p>
        <h2>Dynamic Server Rendering</h2>
        <p>
          Sometimes you do need new UI to be generated, and without a UI
          framework in the browser this can be annoying. Luckily, since we
          already have React we can fetch from an API to get this new content as
          needed.
        </p>
        <p>
          Click <button data-id="fetchApi">This Button</button> to get some new
          UI from the <strong>/api/genUI</strong> API endpoint.
        </p>
        <p data-id="genUITarget"></p>
        <h2>Using this Code</h2>
        <p>
          Feel free to take this code as a start point for your own project.
          While developing, you'll need to have two scripts running.
        </p>
        <ul>
          <li>
            <strong>npm run dev</strong> - this runs the normal NextJS
            development scripts
          </li>
          <li>
            <strong>npm run watch</strong> - this builds the client side only
            code custom to this project. NextJS knows nothing about this.
          </li>
        </ul>
        <p>
          Put any browser-only code into the browser.ts file and it will be
          loaded on the page, but not executed on the server.
        </p>

        <h2>Other examples</h2>
        <ul>
          <li>
            <a href="/reactCode">Use React on the client side without NextJS</a>
          </li>
        </ul>

        <HelpDialog isShown={true} />
      </main>
      <script src={"js/index.js?" + props.cacheParam}></script>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          startPage(
            ${JSON.stringify({
              here: "are",
              some: "example",
              params: "you",
              pass: "from",
              the: "server",
            })}
          );
        `,
        }}
      ></script>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const cacheParam =
    process.env.NODE_ENV === "production" ? "" : "cacheBreak=" + Date.now();

  return {
    props: {
      cacheParam,
    },
  };
}
