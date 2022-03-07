import Head from "next/head";
import { NextPageContext } from "next";
import HeadContent from "../components/HeadContent";

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

export default function ReactCodePage(props: Props) {
  return (
    <>
      <Head>
        <HeadContent description="A NextJS Example" />
      </Head>

      <main style={{ padding: "24px" }}>
        <h1>NextJS Lite Example With React</h1>
        <p>
          You can also include React on the page if you like, but without NextJS
          client side code.
        </p>
        <p>
          If you are using the approach espoused by this example project, you'd
          only need to include React on very few pages, and in general never
          send down any NextJS or React code. It's likely that the approach on
          the <a href="/">Index Page</a> of using the API to render React is
          better in most cases, where it's a matter of only rendering something
          once, but in the case where you need a highly interactive component,
          this is a feasible solution.
        </p>
        <p>
          Of course, you could load any client side framework you like, such as
          Preact, Vue etc and use that too.
        </p>
        <p>
          Click <button data-id="genReactUI">This Button</button> to render some
          React here in the browser
        </p>
        <div data-id="reactDestination"></div>
      </main>
      <script src={"js/reactCode.js?" + props.cacheParam}></script>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          startPage();
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
