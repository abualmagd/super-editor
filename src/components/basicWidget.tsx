import { useEffect, useRef, useState } from "react";
import {
  addNewPragraph,
  breakAll,
  cursorOut,
  removePragraph,
  rightAroowCursor,
  showDropMenu,
} from "./controller";
import DropMenu, { DropManuState } from "./dropMenu";
import ToolBar from "./toolBar";

export function BasicWidget() {
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
            if (document.activeElement?.innerHTML === "") {
              showDropMenu(e, updateDrop);
            } else {
              updateDrop(0, 0, false);
            }
            break;
          case "!/":
            updateDrop(0, 0, false);
            break;
          case "Enter":
            if (!e.isComposing) addNewPragraph(e);
            break;
          case "Backspace":
            if (
              document.activeElement?.innerHTML === "/" ||
              document.activeElement?.textContent?.length === 1
            ) {
              const el = e.target as HTMLElement;
              el.innerHTML = "";
              const state = new DropManuState(0, 0, false);
              updateDropMenuState((prev) => (prev = state));
            } else {
              removePragraph(e);
            }
            break;
          case "ArrowRight":
            rightAroowCursor();
            break;
          default:
        }
      });

      wrapper.current.addEventListener("focusout", (e: FocusEvent) => {
        updateDrop(0, 0, false);
      });

      //click action on every p

      wrapper.current.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "P" || target.closest("p")) {
          const targetParagraph = target.closest("p");
          if (targetParagraph?.innerHTML === "<br>") {
            breakAll(e);
            targetParagraph!.innerHTML = "";
            target.focus();
          } else if (targetParagraph?.innerHTML === "/") {
            showDropMenu(e, updateDrop);
            breakAll(e);
          } else {
            breakAll(e);
          }
        }
      });
    }
  }, [wrapper]);

  return (
    <div className="editor">
      <div className="editor-body" ref={wrapper} id="wrapper">
        <p id="first" contentEditable></p>
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
