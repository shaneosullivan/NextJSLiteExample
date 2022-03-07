import { NextApiRequest, NextApiResponse } from "next";
import ReactDOMServer from "react-dom/server";
import ServerComponent from "../../components/ServerComponent";

function getStringValue(str: string | Array<string>): string {
  return Array.isArray(str) ? str[0] : str;
}

export default function genUIApi(req: NextApiRequest, res: NextApiResponse) {
  const { param1, param2 } = req.query;
  const html = ReactDOMServer.renderToStaticMarkup(
    ServerComponent({
      firstWord: getStringValue(param1),
      secondWord: getStringValue(param2),
    })
  );
  res.status(200).send(html);
}
