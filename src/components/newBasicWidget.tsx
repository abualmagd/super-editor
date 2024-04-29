import { useEffect, useRef, useState } from "react";
import { showDropMenu, addNewP, breakAll, handlePaste } from "./newController";
import DropMenu, { DropManuState } from "./dropMenu";
import ToolBar from "./popMenu";
import { rightAroowCursor } from "./newController";

export function NewBasicWidget() {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const st = new DropManuState(0, 0, false);
  const [dropMenuState, updateDropMenuState] = useState(st);

  const updateDrop = (hight: any, left: any, show: boolean) => {
    const state = new DropManuState(left, hight, show);
    updateDropMenuState((prev) => (prev = state));
  };

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.addEventListener("keydown", (e: KeyboardEvent) => {
        switch (e.key) {
          case "/":
            console.log("/");

            showDropMenu(updateDrop);

            break;
          case "!/":
            updateDrop(0, 0, false);
            break;
          case "Enter":
            e.preventDefault();
            addNewP();
            breakAll();

            break;
          case "Backspace":
            const state = new DropManuState(0, 0, false);
            updateDropMenuState((prev) => (prev = state));
            if (
              wrapper.current?.childNodes.length === 1 &&
              document.activeElement?.textContent?.length === 0
            ) {
              console.log("do nothing");
              e.preventDefault();
            }
            break;
          case "ArrowRight":
            rightAroowCursor();
            break;
          default:
        }
      });
      wrapper.current.addEventListener("click", (e: MouseEvent) => {
        breakAll();
      });

      wrapper.current.addEventListener("focusout", (e: FocusEvent) => {
        updateDrop(0, 0, false);
      });

      wrapper.current.addEventListener("paste", handlePaste);
    }
  }, [wrapper]);

  return (
    <div className="editor">
      <div
        className="editor-body"
        ref={wrapper}
        id="newrapper"
        contentEditable
        suppressContentEditableWarning
      >
        <p className="empty-p our-p"></p>
      </div>
      <DropMenu
        left={dropMenuState.left}
        height={dropMenuState.height}
        show={dropMenuState.show}
      />

      <ToolBar />
    </div>
  );
}
