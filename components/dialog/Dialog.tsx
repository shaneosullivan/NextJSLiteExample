import { CSSProperties } from "react";

interface Props {
  children: React.ReactNode;
  dialogName: string;
  disableCloseButton?: boolean;
  isShown?: boolean;
  maxWidth?: number;
  width?: number;
}

export default function Dialog(props: Props) {
  const { maxWidth, width } = props;
  const style: CSSProperties = {};
  if (width) {
    style.width = `${width}px`;
  }
  if (maxWidth) {
    style.maxWidth = `${maxWidth}px`;
  }

  return (
    <div
      className={"Dialog" + (!props.isShown ? " hidden" : "")}
      data-id={props.dialogName}
    >
      <div className="DialogContent" style={style}>
        <div style={{ paddingBottom: "8px" }}>{props.children}</div>
        {!props.disableCloseButton ? (
          <div
            style={{ paddingBottom: "24px", paddingTop: "16px" }}
            className="DialogFooter"
          >
            <button data-id="closeDialog" title="Close this dialog">
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
