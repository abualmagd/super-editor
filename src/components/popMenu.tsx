import { useEffect, useState } from "react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link,
  Strikethrough,
} from "lucide-react";

import {
  addHeading,
  getBarActiveElements,
  getThePossibleParent,
  removeTagFromSelection,
  replaceSelectedText,
  reverseToP,
} from "./newController";
import BarBtn from "./barBtn";
import { keyboardKey } from "@testing-library/user-event";

export default function ToolBar() {
  //remove state and work with document
  const [myState, updateMyState] = useState(
    new ToolBarState(0, 0, false, null)
  );

  const [activeArray, updateActive] = useState<(string | undefined)[]>([]);

  const handleHeading = (e: any, tageName: keyof HTMLElementTagNameMap) => {
    e.stopPropagation();

    if (myState.container?.tagName.toLocaleLowerCase() === tageName) {
      reverseToP(myState.container, e);
      updateMyState(new ToolBarState(0, 0, false, null));
    } else {
      addHeading(e, tageName, myState.container);
      updateMyState(new ToolBarState(0, 0, false, null));
    }
  };

  const handleEditing = (e: any, tageName: keyof HTMLElementTagNameMap) => {
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection!.rangeCount > 0) {
      // Check if there's a selection
      const range = selection!.getRangeAt(0);
      if (range.collapsed) {
        // Do nothing if nothing is selected
        return;
      }
      var container = document.createElement("div");
      container.appendChild(range.cloneContents());
      var nodes = container.getElementsByTagName("*");

      let nodeNames: any[] = [];
      for (let i = 0; i < nodes?.length; i++) {
        nodeNames!.push(nodes[i].nodeName.toLowerCase());
      }

      if (nodeNames!.includes(tageName)) {
        removeTagFromSelection(tageName, range);
        const newNodeNames = nodeNames.filter((n) => n !== tageName);
        updateActive(newNodeNames);
      } else {
        replaceSelectedText(tageName, range);
        nodeNames!.push(tageName);
        updateActive(nodeNames);
      }
    }
  };

  useEffect(() => {
    const wrapper = document.getElementById("newrapper");

    wrapper?.addEventListener("mouseup", (e: MouseEvent) => {
      if (window.getSelection()) {
        const selection = window.getSelection();
        if (selection!.rangeCount > 0) {
          // Check if there's a selection
          const range = selection!.getRangeAt(0);
          console.log("par: ", range.commonAncestorContainer);
          /*get the parent node*/
          const parentContainer = getThePossibleParent(range);
          const rect = range.getBoundingClientRect();
          //change active elements
          updateActive(() => getBarActiveElements(range, selection!));
          updateMyState(
            new ToolBarState(
              rect.left + rect.width / 2,
              rect.height > 30
                ? rect.top - rect.height
                : rect.top - rect.height * 1.8,
              true,
              parentContainer!
            )
          );
          if (range.collapsed) {
            // Do nothing if nothing is selected
            updateMyState(new ToolBarState(0, 0, false, null));
            return;
          }
        }
      } else {
        updateMyState(new ToolBarState(0, 0, false, null));
      }
    });
    wrapper?.addEventListener("keyup", (e: keyboardKey) => {
      updateMyState(new ToolBarState(0, 0, false, null));
    });
  }, []);

  const BackColor = (name: string) => {
    return activeArray.includes(name) ? "gainsboro" : "transparent";
  };

  const HeadBackColor = (name: string) => {
    return myState.container?.tagName.toLocaleLowerCase() === name
      ? "gainsboro"
      : "transparent";
  };

  return (
    <div
      id="toolbar"
      className="tool-bar-wrapper"
      style={{
        display: myState.show ? "flex" : "none",
        top: myState.height,
        left: myState.left,
        height: 32,
        transform: "translateX(-50%)",
      }}
    >
      <div className="list-btns">
        <BarBtn
          label={"heading 1"}
          icon={<Heading1 size={16} />}
          onPress={(e) => handleHeading(e, "h1")}
          groundColor={HeadBackColor("h1")}
        />
        <BarBtn
          label={"heading 2"}
          icon={<Heading2 size={16} />}
          onPress={(e) => handleHeading(e, "h2")}
          groundColor={HeadBackColor("h2")}
        />
        <BarBtn
          label={"heading 3"}
          icon={<Heading3 size={16} />}
          onPress={(e) => handleHeading(e, "h3")}
          groundColor={HeadBackColor("h3")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "strong")}
          label={"bold"}
          icon={<Bold size={14} />}
          groundColor={BackColor("strong")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "em")}
          label={"italic"}
          icon={<Italic size={14} />}
          groundColor={BackColor("em")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "s")}
          label={"strike"}
          icon={<Strikethrough size={14} />}
          groundColor={BackColor("s")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "mark")}
          label={"highlight"}
          icon={<Highlighter size={14} />}
          groundColor={BackColor("mark")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "code")}
          label={"inline code"}
          icon={<Code size={14} />}
          groundColor={BackColor("code")}
        />
        <BarBtn
          onPress={(e) => handleEditing(e, "a")}
          label={"link"}
          icon={<Link size={14} />}
          groundColor={BackColor("a")}
        />
      </div>
    </div>
  );
}

export class ToolBarState {
  left: any;
  height: any;
  show = false;
  container: HTMLElement | null;
  constructor(
    left: any,
    height: any,
    show: boolean,
    container: HTMLElement | null
  ) {
    this.left = left;
    this.height = height;
    this.show = show;
    this.container = container;
  }
}
