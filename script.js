const sequenceInput = document.querySelector("#sequenceInput");
const sequenceDiv = document.querySelector("#sequence");
const resultDiv = document.querySelector("#result");
const arrayTable = document.querySelector("#arrayTable");
const submitButton = document.querySelector("#submit");

const partialSum = array => {
    let sum = 0;
    array.forEach((item, index) => {
        if (item != "*") {
            sum += item;
            array[index] = sum;
        }
    });
}

const generateArrays = sequence => {
    const arrays = [];
    arrays.push(sequence);

    let array = ["*", ...Array(sequence.at(-1)).keys().map(i => i + 1), "*"];
    arrays.push([...array]);

    array = array.map(item => sequence.includes(item) ? "*" : item);
    arrays.push([...array]);

    const result = [];
    sequence.forEach((number, index) => {
        const prev = sequence[index - 1];
        if (number == 1) { result.push(number); }
        if (prev == number - 1) { result.push(number); }
    });
    while (!array.every(item => item == "*")) {
        partialSum(array);
        arrays.push([...array]);

        array.forEach((item, index) => {
            if (item != "*") {
                const prev = array[index - 1];
                const next = array[index + 1];
                if (next == "*") {
                    if (prev == "*") {
                        result.push(item);
                    }
                    array[index] = "*";
                }
            }
        });

        arrays.push([...array]);
    }

    arrays.push([...new Set(result)].sort((a, b) => a - b));
    return arrays;
}

const createTableBody = arrays => {
    const tableBody = document.createElement("tbody");
    
    const sequence = arrays[0]
    const result = arrays.at(-1);
    arrays.forEach((array) => {
        if (array == sequence) {
            sequenceDiv.innerText = "Girilen Dizi: " + sequence.join(" ");
        } else if (array == result) {
            resultDiv.innerText = "Sonuç: " + result.join(" ");
        } else {
            const row = document.createElement("tr");
            array.forEach(item => {
                const cell = document.createElement("td");
                cell.innerText = item;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        }
    });

    return tableBody;
}

const constructTable = (sequence) => {
    const arrays = generateArrays(sequence);
    const tableBody = createTableBody(arrays);
    arrayTable.querySelector("tbody").replaceWith(tableBody);
    arrayTable.scrollIntoView({ "behavior": "smooth" });
}

submitButton.addEventListener("click", () => {
    const sequence = sequenceInput.value.trim().split(/[ , ]+/).map(i => +i).sort((a, b) => a - b)
    if (sequence.includes(NaN)) {
        alert("Lütfen artarak ilerleyen, pozitif tam sayılardan oluşan ve virgül veya boşluklarla ayrılmış bir sayı dizisi girin!");
    } else {
        constructTable(sequence, arrayTable);
    }
});

export { constructTable };
