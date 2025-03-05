// src/content-script/modules/utils.js

/**
 * Gets the top-level element for a node.
 * @param {Node} node - The node.
 * @returns {Node} - The top-level element.
 */
export function getTopLevelElement(node) {
  while (node && node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode;
  }
  return node;
}

/**
 * Gets the XPath for a node.
 * @param {Node} node - The node.
 * @returns {string} - The XPath.
 */
export function getXPath(node) {
  const segments = [];

  if (node.nodeType === Node.TEXT_NODE) {
    const parentNode = node.parentNode;
    const siblingTextNodes = Array.from(parentNode.childNodes).filter(
      (sibling) => sibling.nodeType === Node.TEXT_NODE
    );
    const textIndex = siblingTextNodes.indexOf(node) + 1;
    segments.unshift(`#text[${textIndex}]`);
    node = parentNode;
  }

  while (node && node.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling = node.previousSibling;
    while (sibling) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === node.nodeName
      ) {
        index++;
      }
      sibling = sibling.previousSibling;
    }

    const tagName = node.nodeName.toLowerCase();
    segments.unshift(`${tagName}[${index}]`);
    node = node.parentNode;
  }

  return segments.length ? "/" + segments.join("/") : null;
}

/**
 * Gets a node by its XPath.
 * @param {string} xpath - The XPath of the node.
 * @returns {Node|null} - The node or null if not found.
 */
export function getNodeByXPath(xpath) {
  const evaluator = new XPathEvaluator();

  // Check if XPath ends with #text[n], targeting a specific text node
  const textNodeMatch = xpath.match(/(.+)(\/#text\[(\d+)\])$/);
  let node, textNodeIndex;

  if (textNodeMatch) {
    // XPath points to a specific text node
    xpath = textNodeMatch[1]; // Remove #text[n] for parent element lookup
    textNodeIndex = parseInt(textNodeMatch[3]) - 1; // Get the index for text node
  }

  const result = evaluator.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  node = result.singleNodeValue;

  // If a text node index is specified, get the exact text node within the parent
  if (node && textNodeIndex !== undefined) {
    // Get only text nodes
    const textNodes = Array.from(node.childNodes).filter(
      (n) => n.nodeType === Node.TEXT_NODE
    );

    // Check if the index is within the range of available text nodes
    if (textNodeIndex >= 0 && textNodeIndex < textNodes.length) {
      node = textNodes[textNodeIndex];
    } else {
      console.warn("Text node index is out of range:", textNodeIndex);
      node = null; // Set node to null if the index is invalid
    }
  }

  if (!node) {
    console.error("Could not find node for XPath:", xpath);
  }

  return node;
}

/**
 * Checks if the selection is valid.
 * @param {Object} metadata - The selection metadata.
 * @returns {boolean} - True if valid, false otherwise.
 */
export function isValidSelection(metadata) {
  const { startContainerXPath, startOffset, endContainerXPath, endOffset } =
    metadata;

  const startNode = getNodeByXPath(startContainerXPath);

  const endNode = getNodeByXPath(endContainerXPath);
  if (!startNode || !endNode || startNode !== endNode) return false;

  const textNodeLength = startNode.length;
  if (!textNodeLength) return false;

  return !(startOffset > textNodeLength || endOffset > textNodeLength);
}
