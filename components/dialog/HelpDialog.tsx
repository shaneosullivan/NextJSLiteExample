import Dialog from "./Dialog";

interface Props {
  isShown: boolean;
}

export default function HelpDialog(props: Props) {
  return (
    <Dialog dialogName="helpDialog" maxWidth={800} isShown={props.isShown}>
      <h2>Hi There</h2>
      <p>
        This is an example dialog that you can show on startup. A little bit of
        JavaScript on the client is all that is needed to show and hide it.
      </p>
    </Dialog>
  );
}
