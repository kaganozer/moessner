sums = lambda array: [sum(array[: i + 1]) for i in range(len(array))]
differences = lambda array: [array[i] - array[i - 1] for i in range(1, len(array))]


def generateArrays(sequence: list[int]) -> list[list[int | dict[str : list[int]]]]:
    triangleSizes = differences([0] + sequence)

    arrayObjects: list[dict[str : list[int]]] = []
    while any(triangleSizes):
        arrayObjects.append({"triangleSizes": triangleSizes})
        triangleSizes = [n - 1 if n else n for n in triangleSizes]

    array = [i for i in range(1, sequence[-1] + 1)]
    result = []
    for arrayObject in arrayObjects:
        triangleSizes = arrayObject["triangleSizes"]
        indexes = sums(triangleSizes)

        arrayObject["array"] = array
        arrayObject["tableArray"] = []
        for i in range(len(indexes)):
            arrayObject["tableArray"] += array[
                ([0] + indexes)[i] : ([0] + indexes)[i + 1]
            ] + ["*"] * (arrayObjects[0]["triangleSizes"][i] - triangleSizes[i])

        result += [array[indexes[i] - 1] for i, n in enumerate(triangleSizes) if n == 1]

        array = ["*" if i + 1 in indexes else n for i, n in enumerate(array)]
        array = sums([n for n in array if n != "*"])
    result.sort()
    return [sequence, result, arrayObjects]


sequence = [1, 3, 6, 10, 15]
# sequence = [int(item) for item in input("Input the number sequence seperated by spaces: ").split(" ")]

arrays = generateArrays(sequence)
print(arrays[1])
for arrayObject in arrays[2]:
    print(arrayObject["array"])
