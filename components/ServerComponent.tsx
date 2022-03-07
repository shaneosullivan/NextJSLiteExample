import { formatNow } from "../lib/format";

interface Props {
  firstWord: string;
  secondWord: string;
}

export default function ServerComponent(props: Props) {
  return (
    <div style={{ color: "red", fontWeight: "bold" }}>
      This is an example of a React component rendered on the server via a call
      to the <strong>/api/genUI</strong> API endpoint. It uses{" "}
      <strong>ReactDOMServer.renderToStaticMarkup</strong>
      to generate the HTML to be returned by the API. The first parameter the
      API received was "{props.firstWord}" and the second parameter was "
      {props.secondWord}", called at {formatNow()}
    </div>
  );
}
