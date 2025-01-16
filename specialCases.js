import katex from 'https://cdn.jsdelivr.net/npm/katex@0.16.19/dist/katex.mjs';
import data from "./specialCases.json" with {type: "json"};
import { constructTable } from './script.js';

const specialCases = document.querySelector("#specialCases");

const createDetails = (caseObject, parentElement) => {
    const details = document.createElement("details");
    parentElement.appendChild(details);

    const summary = document.createElement("summary");
    summary.innerText = caseObject["title"];
    details.appendChild(summary);

    if (["Örnek Dizi"].includes(caseObject["title"])) { details.open = true; }

    caseObject["entries"].forEach(entry => {
        if (entry["title"]) { createDetails(entry, details); }
        else {
            const caseTable = document.createElement("table");
            details.appendChild(caseTable);

            const tableBody = document.createElement("tbody");
            caseTable.appendChild(tableBody);

            for (const [key, value] of Object.entries(entry)) {
                const row = document.createElement("tr");
                row.classList.add(key);

                if (key == "descriptions") {
                    const tableHead = document.createElement("thead");
                    tableHead.appendChild(row);
                    caseTable.insertBefore(tableHead, tableBody);
                } else {
                    tableBody.appendChild(row);
                }

                value.forEach((item, index) => {
                    const cell = document.createElement(key == "descriptions" ? "th" : "td");
                    if (value.length == 1) { cell.colSpan = 2; }

                    if (key == "formulas") {
                        katex.render(`\\displaystyle{${item}}`, cell, {
                            throwOnError: false
                        });
                    }
                    else if (key == "OEIS" && /A[0-9]{6}/.test(item)) {
                        const anchor = document.createElement("a");
                        anchor.href = `https://oeis.org/${item}`;
                        anchor.innerText = item;
                        cell.appendChild(anchor);
                    }
                    else { cell.innerText = item; }

                    if (key == "sequences" && index == 0) {
                        const tryButton = document.createElement("button");

                        const buttonIcon = document.createElement("span");
                        buttonIcon.innerText = "</>"
                        buttonIcon.classList.add("buttonIcon");

                        const buttonText = document.createElement("span");
                        buttonText.innerText = "Dene"
                        buttonText.classList.add("buttonText");

                        tryButton.classList.add("try");
                        tryButton.appendChild(buttonIcon);
                        tryButton.appendChild(buttonText);

                        tryButton.addEventListener("click", () => {
                            const sequence = item.split(/[, ]+/).map(i => +i).sort((a, b) => a - b);
                            constructTable(sequence);
                        });
                        cell.appendChild(tryButton);
                    }

                    row.appendChild(cell);
                });
            }
        }
    });
}

createDetails(data, specialCases);
