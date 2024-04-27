import React from "react";

//the new added <p>
export const pragraphNode = () => {
  const newParagraph = document.createElement("p");
  newParagraph.innerHTML = "";
  newParagraph.classList.add("empty-p");
  newParagraph.classList.add("our-p");
  return newParagraph;
};

//break all empty
//except active one <p>
export const breakAll = () => {
  const paragraphs = document
    .getElementById("newrapper")
    ?.querySelectorAll("p"); // Select all paragraph elements
  // replace all empty p by br

  paragraphs?.forEach((paragraph) => {
    if (paragraph.textContent?.trim() === "") {
      paragraph.innerHTML = "<br>"; // Replace empty content with <br>
    }
  });

  const selection = window.getSelection();

  const curRange = selection?.getRangeAt(0);
  const curP = curRange?.commonAncestorContainer as HTMLElement;
  if (curP?.nodeName.toLocaleLowerCase() === "p" && !curP.textContent) {
    curP.innerHTML = "";
  }
};

// add new <p> when press enter
export const addNewP = () => {
  const newP = pragraphNode();

  const select = window.getSelection();
  const curRange = select?.getRangeAt(0);

  const startCo = curRange?.commonAncestorContainer;

  const parentsNodes = ["p", "h1", "h2", "h3"];
  if (parentsNodes.includes(startCo?.nodeName.toLocaleLowerCase()!)) {
    const strEl = startCo as HTMLElement;
    strEl.after(newP);
  } else {
    const parentP = startCo?.parentElement;
    if (parentsNodes.includes(parentP?.nodeName.toLocaleLowerCase()!)) {
      parentP?.after(newP);
    } else {
      const closestP = parentP?.closest("p");
      if (parentsNodes.includes(closestP?.nodeName.toLocaleLowerCase()!)) {
        closestP?.after(newP);
      } else {
        const wrapper = document.getElementById("newrapper");

        wrapper?.append(newP);
      }
    }
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(newP);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
};

/*remove <p> if its empty and user press Backspace
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
};*/

/*adjust cursor when remove the next <p>
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
};*/

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

export const getOutRangeHtml = (range: Range) => {
  range.collapse(false); // Set the cursor to the end of the rang
  const selection = window.getSelection(); //represent cursor position of user selection
  selection?.removeAllRanges();
  selection?.addRange(range);
};

//show the drop menu function
export const showDropMenu = (updateState: Function) => {
  const sel = window.getSelection();
  const rang = sel?.getRangeAt(0);
  const target = rang?.commonAncestorContainer as HTMLElement;
  if (target.nodeName.toLocaleLowerCase() === "p") {
    return updateState(target!.offsetTop, target!.offsetLeft, true);
  }
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

export function getThePossibleParent(range: Range) {
  const parentsNodes = ["p", "h1", "h2", "h3"];
  const str = range.commonAncestorContainer;
  if (parentsNodes.includes(str!.nodeName.toLowerCase())) {
    return str as HTMLElement;
  } else {
    const strPare = str.parentElement;
    if (parentsNodes.includes(strPare!.tagName.toLowerCase())) {
      return strPare;
    } else {
      const posParent = strPare?.parentElement;
      if (parentsNodes.includes(posParent!.tagName.toLowerCase())) {
        return posParent;
      }
      return posParent?.parentElement;
    }
  }
}
