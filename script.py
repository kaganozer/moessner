def partialSum(array: list):
    summ = 0
    for index, item in enumerate(array):
        if item != "*":
            summ += item
            array[index] = summ


def generateArrays(sequence: list):
    arrays = []
    arrays.append(sequence)

    array = ["*"] + [i + 1 for i in range(sequence[-1])] + ["*"]
    arrays.append([i for i in array])

    array = ["*" if item in sequence else item for item in array]
    arrays.append([i for i in array])

    result = []
    for index, number in enumerate(sequence):
        prev = sequence[index - 1]
        if number == 1:
            result.append(number)
        if prev == number - 1:
            result.append(number)
    while any([item != "*" for item in array]):
        partialSum(array)
        arrays.append([i for i in array])

        for index, item in enumerate(array):
            if item != "*":
                prevItem = array[index - 1]
                nextItem = array[index + 1]
                if nextItem == "*":
                    if prevItem == "*":
                        result.append(item)
                    array[index] = "*"

        arrays.append([i for i in array])
    result.sort()
    arrays.append(result)
    return arrays


sequence = [int(item) for item in input("Input the number sequence seperated by spaces: ").split(" ")]
arrays = generateArrays(sequence)
for array in arrays:
    print(array)
