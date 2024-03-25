export default function DropMenu({ left, height, show }: DropManuState) {
  return (
    <div
      style={{
        backgroundColor: "red",
        height: "250px",
        width: "250px",
        position: "absolute",
        top: height + 30,
        left: left,
        zIndex: 2,
        display: show ? "block" : "none",
      }}
    >
      <ul className="list">
        <li>code</li>
        <li>image</li>
        <li>low</li>
      </ul>
    </div>
  );
}

export class DropManuState {
  left: any;
  height: any;
  show = false;

  constructor(left: any, height: any, show: boolean) {
    this.left = left;
    this.height = height;
    this.show = show;
  }
}
