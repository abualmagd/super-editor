import { useState } from "react";
import {
  addHeading,
  removeTagFromSelection,
  replaceSelectedText,
  reverseToP,
} from "./controller";

export default function ToolBar({
  height,
  left,
  show,
  container,
}: ToolBarState) {
  const handleHClick = (e: any) => {
    e.stopPropagation();

    if (container?.tagName.toLocaleLowerCase() === "h1") {
      reverseToP(container, e);
    } else {
      addHeading(e, "h1", container);
    }
  };

  const handleStrong = (e: any) => {
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection!.rangeCount > 0) {
      // Check if there's a selection
      const range = selection!.getRangeAt(0);
      if (range.collapsed) {
        // Do nothing if nothing is selected
        return;
      }
      const nodlist = range.cloneContents().childNodes; //nodlist
      var container = document.createElement("div");
      container.appendChild(range.cloneContents());
      var nodes = container.getElementsByTagName("*");
      console.log("ls:", nodlist);

      let nodeNames = [];
      for (let i = 0; i < nodes?.length; i++) {
        nodeNames!.push(nodes[i].nodeName.toLowerCase());
      }
      console.log("nodnames:", nodeNames);

      if (nodeNames!.includes("strong")) {
        console.log("ok stronged");
        removeTagFromSelection("strong", range);
      } else {
        replaceSelectedText("strong", range);
      }
    }
  };

  const handleEm = (e: any) => {
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection!.rangeCount > 0) {
      // Check if there's a selection
      const range = selection!.getRangeAt(0);
      if (range.collapsed) {
        // Do nothing if nothing is selected
        return;
      }
      const nodlist = range.cloneContents().childNodes; //nodlist
      console.log("ls:", nodlist);
      let nodeNames = [];
      for (let i = 0; i < nodlist?.length; i++) {
        nodeNames!.push(nodlist[i].nodeName.toLowerCase());
      }

      if (nodeNames!.includes("em")) {
        console.log("ok emmmmmed");
        removeTagFromSelection("em", range);
      } else {
        replaceSelectedText("em", range);
      }
    }
  };

  return (
    <div
      id="toolbar"
      className="tool-bar-wrapper"
      style={{
        display: show ? "flex" : "none",
        top: height - 65,
        left: left - 60,
      }}
    >
      <div className="list-btns">
        <button onClick={(e) => handleHClick(e)}>H1</button>
        <button>H2</button>
        <button>H3</button>
        <button onClick={(e) => handleStrong(e)}>B</button>
        <button onClick={(e) => handleEm(e)}>em</button>
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

// bar elements
export class BarElements {
  tageName: String;
  bold: string | null;
  link: boolean;
  italic: boolean;
  strike: boolean;
  highLight: boolean;
  inlineCode: boolean;

  constructor(
    tageName: String,
    bold: string | null,
    link: boolean,
    italic: boolean,
    strike: boolean,
    highLight: boolean,
    inlineCode: boolean
  ) {
    this.bold = bold;
    this.link = link;
    this.italic = italic;
    this.highLight = highLight;
    this.strike = strike;
    this.inlineCode = inlineCode;
    this.tageName = tageName;
  }
}
