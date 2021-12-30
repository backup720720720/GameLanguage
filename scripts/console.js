(async () => {
    class ConsoleLine {
        constructor(text, color = "#ffffff") {
            this.text = text;
            this.color = color;
        }

        toString() {
            return "<span style='color: " + (this.color) + "'>" + this.text.toString().replaceAll("<", "&zwnj;<&zwnj;").replaceAll(">", "&zwnj;>&zwnj;") + "</span><br>";
        }
    }
    class Console {
        constructor(element) {
            this.element = element;
            this.lines = [];
        }

        log(text, color) {
            this.lines.push(new ConsoleLine(text, color));
            this.render();
        }

        logf(text, color) {
            this.lines[this.lines.length - 1].text += text;
            this.render();
        }

        clear() {
            this.lines = [];
            this.render();
        }

        backspace() {
            const lines = this.lines.filter(i=> i.color === "#ffffff");
            const last = lines[lines.length - 1];
            if(last && last.text) {
                last.text = last.text.substring(0, last.text.length - 1);
                this.render();
            }
        }
 
        render() {
            this.element.innerHTML = this.lines.map(i=> i.toString()).join("");
            this.element.scrollTop = this.element.scrollHeight;
        }
    }
    document.Console = Console;
})();