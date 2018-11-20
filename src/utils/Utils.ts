export default class Utils {
    static lineBreaksToArray(htmlElement: Element): Array<string> {
        let currentTitleArray: Array<string> = [];
        if (htmlElement) {
            let text: string = htmlElement.textContent as string;
            let words = text.split(" ");
            htmlElement.textContent = "";
            let height = 0;
            let lastFoundWordIndex: number = 0;

            for (let i = 0; i < words.length; i++) {
                if(i === 0) {
                    htmlElement.textContent = words[i];
                }else {
                    htmlElement.textContent = htmlElement.textContent + " " + words[i];
                }
                
                if ((htmlElement.getBoundingClientRect().height > height && i > 0)) {                    
                    currentTitleArray.push(words.slice(lastFoundWordIndex, i).join(" ").trim());
                    lastFoundWordIndex = i;
                }
                height = htmlElement.getBoundingClientRect().height;
            }
            currentTitleArray.push(
                words.slice(lastFoundWordIndex, words.length).join(" ")
            );
        }
        
        return currentTitleArray;
    }


    static toggleBodyClass(className: string): void {
      let element: HTMLElement = document.body;
      if (element.classList) {
        element.classList.toggle(className);
      } else {
        var classes = element.className.split(' ');
        var existingIndex = classes.indexOf(className);
      
        if (existingIndex >= 0)
          classes.splice(existingIndex, 1);
        else
          classes.push(className);
      
          element.className = classes.join(' ');
      }
    }

    static setBodyClass(className: string): void {
      let element: HTMLElement = document.body;
      if (element.classList) {
        for (let index = 0; index < element.classList.length; index++) {
          element.classList.remove(element.classList.item(index)!)
        }
        element.classList.add(className);
      } else {
        element.className = className;
      }
    }
}