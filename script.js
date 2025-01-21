const sequenceInput = document.querySelector("#sequenceInput");
const sequenceDiv = document.querySelector("#sequence");
const resultDiv = document.querySelector("#result");
const arrayTable = document.querySelector("#arrayTable");
const submitButton = document.querySelector("#submit");

const partialSums = array => {
    let sum = 0;
    array.forEach(n => { sum += n; });
    return sum;
}
const sums = array => array.map((n, i) => partialSums(array.slice(0, i + 1)));
const differences = array => array.map((n, i) => array[i] - array[i - 1]).filter(n => n);

const generateArrays = sequence => {
    let triangleSizes = differences([0, ...sequence]);
    const arrayObjects = [];
    while (triangleSizes.some(n => n)) {
        arrayObjects.push({ triangleSizes });
        triangleSizes = triangleSizes.map(n => n ? n - 1 : n);
    }
    let array = [...Array(sequence.at(-1)).keys().map(i => i + 1)];
    let result = [];
    arrayObjects.forEach(arrayObject => {
        triangleSizes = arrayObject.triangleSizes;
        const indexes = sums(triangleSizes);

        arrayObject.array = array;
        arrayObject.tableArray = [];
        indexes.forEach((index, i) => {
            arrayObject.tableArray = [
                ...arrayObject.tableArray,
                ...array.slice([0, ...indexes][i], [0, ...indexes][i + 1]),
                ...Array(arrayObjects[0].triangleSizes[i] - triangleSizes[i]).fill("*")
            ];
        })

        result = [...result, ...triangleSizes.flatMap((n, i) => n == 1 ? array[indexes[i] - 1] : [])]

        array = array.map((n, i) => indexes.includes(i + 1) ? "*" : n);
        array = sums(array.filter(n => n != "*"));
    });
    result.sort((a, b) => a - b);
    return [sequence, result, arrayObjects];
}

const createTableBody = arrays => {
    const tableBody = document.createElement("tbody");

    const sequence = arrays[0]
    const result = arrays[1];
    const arrayObjects = arrays[2]
    sequenceDiv.innerText = "Girilen Dizi: " + sequence.join(" ");
    resultDiv.innerText = "Sonuç: " + result.join(" ");
    arrayObjects.forEach(arrayObject => {
        const tableArray = arrayObject.tableArray;
        const row = document.createElement("tr");
        tableArray.forEach(item => {
            const cell = document.createElement("td");
            cell.innerText = item;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    return tableBody;
}

const constructTable = (sequence) => {
    const arrays = generateArrays(sequence);
    const tableBody = createTableBody(arrays);
    arrayTable.querySelector("tbody").replaceWith(tableBody);
    arrayTable.scrollIntoView({ "behavior": "smooth" });
}

const tableEvent = () => {
    const sequence = sequenceInput.value.trim().split(/[ , ]+/).map(i => +i).sort((a, b) => a - b)
    if (sequence.includes(NaN)) {
        alert("Lütfen artarak ilerleyen, pozitif tam sayılardan oluşan ve virgül veya boşluklarla ayrılmış bir sayı dizisi girin!");
    } else { constructTable(sequence, arrayTable); }
}

sequenceInput.addEventListener("keypress", event => {
    if (event.key === "Enter") { tableEvent(); }
})
submitButton.addEventListener("click", () => { tableEvent(); });

export { constructTable };
