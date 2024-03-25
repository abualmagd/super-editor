import { BarElements } from "./toolBar";
import React from "react";

//the new added <p>
export const pragraphNode = (document: Document) => {
  const newParagraph = document.createElement("p");
  newParagraph.contentEditable = "true";
  newParagraph.setAttribute("data-placeholder", 'Type "/" for commands...');
  return newParagraph;
};

//break all empty
//except active one <p>
export const breakAll = (e: Event) => {
  const paragraphs = document.getElementById("wrapper")?.querySelectorAll("p"); // Select all paragraph elements
  // replace all empty p by br
  paragraphs?.forEach((paragraph) => {
    if (
      paragraph.textContent?.trim() === "" &&
      paragraph !== document.activeElement
    ) {
      paragraph.innerHTML = "<br>"; // Replace empty content with <br>
    }
  });
};

// add new <p> when press enter
export const addNewPragraph = (e: KeyboardEvent) => {
  e.preventDefault();
  console.log("enterz");
  //add new paragraph
  //and if active p is empty insert<br>
  const newP = pragraphNode(document);
  // add element smoothly
  const target = e.target as HTMLElement;
  target.after(newP);
  //if the current <p> empty break it.
  if (target.innerHTML === "") {
    target.innerHTML = "<br>";
  }

  newP.focus();
};

//remove <p> if its empty and user press Backspace
export const removePragraph = (e: KeyboardEvent) => {
  const wrapper = document.getElementById("wrapper");
  const pElements = wrapper?.querySelectorAll("p");

  //if this last p do not remove
  const target = e.target as HTMLElement;
  if (
    target.textContent?.length === 0 &&
    pElements!.length > 1 &&
    target.previousSibling &&
    target.previousSibling.nodeName !== "p"
  ) {
    try {
      posCursor(e);
    } catch (error) {}

    target.remove();
  }
};

//adjust cursor when remove the next <p>
const posCursor = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const prevElement = target.previousElementSibling as HTMLElement;
  if (
    prevElement?.textContent?.trim() === "" ||
    prevElement?.innerHTML === "<br>"
  ) {
    prevElement!.innerHTML = "";
  }
  const range = document.createRange(); //create range
  range.selectNodeContents(prevElement!); //put all childs of the element inside the range
  range.collapse(false); // Set the cursor to the end of the rang
  const selection = window.getSelection(); //represent cursor position of user selection
  selection?.removeAllRanges();
  selection?.addRange(range); // add our range to the selection so window but cursor in the end of  the element range

  prevElement!.focus();
};

//show the drop menu function
export const showDropMenu = (e: Event, updateState: Function) => {
  const target = e.target as HTMLElement;
  updateState(target!.offsetTop, target!.offsetLeft, true);
};

//show editor toolbar function
export const showToolBar = (e: MouseEvent, updateBarState: Function) => {
  const parent = window.getSelection()?.anchorNode?.parentElement;
  const left = e.clientX;
  const height = e.clientY;
  updateBarState(height, left, true, parent);
};

//get selected text by user
export function getSelectionText() {
  if (window.getSelection()) {
    try {
      var activeElement = document.activeElement as HTMLInputElement;
      if (activeElement && activeElement.value) {
        // firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=85686
        return activeElement.value.substring(
          activeElement.selectionStart!,
          activeElement.selectionEnd!
        );
      } else {
        return window.getSelection()?.toString();
      }
    } catch (e) {}
  } else if (
    document.getSelection() &&
    document.getSelection()?.type !== "Control"
  ) {
    // For IE
    return document.getSelection()?.toString;
  }
}

export function addHeading(
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  tagName: keyof HTMLElementTagNameMap,
  node: HTMLElement | null
) {
  event.stopPropagation();
  const newHeading = document.createElement(tagName);
  newHeading.contentEditable = "true";
  newHeading.innerHTML = node!.innerHTML;
  node!.replaceWith(newHeading);
}

export function reverseToP(
  node: HTMLElement | null,
  event: React.MouseEvent<HTMLElement, MouseEvent>
) {
  event.stopPropagation();
  const oldP = document.createElement("p");
  oldP.innerHTML = node!.innerHTML;
  oldP.contentEditable = "true";
  node!.replaceWith(oldP);
}

export function replaceSelectedText(
  tagName: keyof HTMLElementTagNameMap,
  range: Range
) {
  console.log("conts: ", range.cloneContents().ownerDocument);
  const node = document.createElement(tagName);
  node.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(node);
}

export function removeTagFromSelection(
  tagName: keyof HTMLElementTagNameMap,
  range: Range
) {
  /*const textNode = document.createTextNode(
    range.extractContents().textContent!
  );*/

  var container = document.createElement("span");
  container.appendChild(range.cloneContents());
  const children = container.getElementsByTagName("*");

  const selText = container.innerHTML;
  console.log("t: ", selText);
  const newText = selText.replace("<strong>", "").replace("</strong>", "");
  container.innerHTML = newText;
  const newContent = container.firstChild;
  range.deleteContents();
  range.insertNode(newContent!);
}

/*export function removeThisTage(tagName: keyof HTMLElementTagNameMap) {
  if (window.getSelection()) {
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0);
      const containerElement = range.commonAncestorContainer;
      const parentElement = containerElement.parentNode;
      const content = containerElement.textContent;
      const textNode = document.createTextNode(content!);
      parentElement?.insertBefore(textNode, containerElement);
      range.surroundContents(parentElement!);
      parentElement!.removeChild(containerElement);
    }
  }
}*/

export function getBarActiveElements<BarElements>() {
  const tagName =
    window
      .getSelection()
      ?.anchorNode?.parentElement?.tagName.toLowerCase()
      .toString() ?? "p";
  const bold =
    window.getSelection()?.anchorNode?.parentElement?.style.fontWeight ?? null;

  const activeBarEl = new BarElements(
    tagName,
    bold,
    false,
    false,
    false,
    false,
    false
  );
  //if(window.getSelection()?.anchorNode?.parentElement?.attributes)
}
