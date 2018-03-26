export default class Utils {
    static lineBreaksToArray(htmlElement: Element): Array<string> {
        let currentTitleArray: Array<string> = [];
        if (htmlElement) {
            let text: string = htmlElement.textContent as string;
            let words = text.split(" ");
            htmlElement.textContent = words[0];
            let height = htmlElement.getBoundingClientRect().height;

            let lastFoundWordIndex: number = 0;

            for (let i = 1; i < words.length; i++) {
                htmlElement.textContent =
                    htmlElement.textContent + " " + words[i];

                if (htmlElement.getBoundingClientRect().height > height) {
                    height = htmlElement.getBoundingClientRect().height;

                    currentTitleArray.push(words.slice(lastFoundWordIndex, i).join(" "));
                    lastFoundWordIndex = i;
                }
            }
            currentTitleArray.push(
                words.slice(lastFoundWordIndex, words.length).join(" ")
            );
        }
        return currentTitleArray;
    }
}