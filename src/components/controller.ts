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

//when user click right arrow get out marked or bold text
export const rightAroowCursor = () => {
  const selection = window.getSelection();
  const curRange = selection?.getRangeAt(0);
  if (
    curRange?.commonAncestorContainer.parentNode?.nodeName.toLocaleLowerCase() !==
      "p" &&
    selection?.anchorOffset! >= selection?.anchorNode?.textContent?.length!
  ) {
    const parentEl = curRange?.commonAncestorContainer.parentElement;
    console.log("anchor o: ", selection?.anchorOffset!);
    parentEl?.after("\u200B");
  }
};

//fkn cursor
export const cursorOut = () => {
  const selection = window.getSelection();
  const focusNode = selection?.focusNode;
  console.log("foo: ", focusNode);
  if (focusNode && selection.isCollapsed) {
    // Check if focusNode is a text node
    console.log("s 1 ");

    if (
      focusNode?.nodeName.toLowerCase() === "mark" ||
      focusNode?.nodeName.toLowerCase() === "strong"
    ) {
      console.log("s 3 ");
      // Get the text content of the marked element
      const markedText = focusNode?.textContent;
      // Check if the cursor position is at the end of the text
      const cursorOffset = selection.getRangeAt(0).endOffset;
      if (cursorOffset === markedText?.length) {
        console.log("s 4");
        const range = document.createRange();
        range.selectNodeContents(focusNode!);
        range.collapse(false); // Set the cursor to the end of the rang
        //represent cursor position of user selection
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  // Cursor is not at the end of the last word in a marked element
  return false;
};

export const getOutRangeHtml = (range: Range) => {
  range.collapse(false); // Set the cursor to the end of the rang
  const selection = window.getSelection(); //represent cursor position of user selection
  selection?.removeAllRanges();
  selection?.addRange(range);
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
export function addHeadingz(
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  tagName: keyof HTMLElementTagNameMap,
  range: Range
) {
  event.stopPropagation();

  const parent = range.commonAncestorContainer.parentElement;
  const newHeading = document.createElement(tagName);
  newHeading.contentEditable = "true";
  newHeading.innerHTML = parent!.innerHTML;
  parent!.replaceWith(newHeading);
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
  const node = document.createElement(tagName);
  if (tagName === "code") {
    node.style.backgroundColor = "#f9f9f9";
    node.style.padding = "2px";
    node.style.borderRadius = "15%";
  }

  node.appendChild(range.cloneContents());
  range.deleteContents();
  range.insertNode(node);
}

export function removeTagFromSelection(
  tagName: keyof HTMLElementTagNameMap,
  range: Range
) {
  var container = document.createElement("span");
  container.appendChild(range.cloneContents());
  const selText = container.innerHTML;

  const reg = new RegExp("<" + tagName + "[^>]*>", "g");
  const newText = selText
    .replace(`<${tagName}>`, "")
    .replace(`</${tagName}>`, "")
    .replace(reg, "");

  container.innerHTML = newText;
  range.deleteContents();
  const rang = document.createRange();
  rang.selectNodeContents(container);
  var frag = rang.extractContents();
  range.insertNode(frag);
}

export function getBarActiveElements(range: Range, selection: Selection) {
  var container = document.createElement("div");
  container.appendChild(range.cloneContents());
  var nodes = container.getElementsByTagName("*");
  const parentName =
    selection?.anchorNode?.parentElement?.tagName.toLocaleLowerCase();
  let nodeNames = [parentName];
  for (let i = 0; i < nodes?.length; i++) {
    nodeNames!.push(nodes[i].nodeName.toLowerCase());
  }

  return nodeNames;
}

/* console.log("node outer: ", node?.outerHTML);
  const reg = new RegExp("<" + "p" + "[^>]*>", "g");
  const reg2 = new RegExp("</" + "p" + "[^>]*>", "g");
  node.outerHTML = node.outerHTML
    .replace(reg, `<${tagName} contenteditable='true'>`)
    .replace(reg2, `</${tagName}>`);*/
