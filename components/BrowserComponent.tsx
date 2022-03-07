import { formatNow } from "../lib/format";

interface Props {}

export default function BrowserComponent(props: Props) {
  return (
    <div style={{ color: "red", fontWeight: "bold" }}>
      This is an example of a React component rendered on the client
    </div>
  );
}
