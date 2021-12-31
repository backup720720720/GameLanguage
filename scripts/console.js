(async () => {
    class ConsoleLine {
        constructor(text, color = "#ffffff") {
            this.text = text;
            this.color = color;
            this.stack = 1;
        }

        toString() {
            return (this.stack > 1 ? "[x" + this.stack + "] " : "") + "<span style='color: " + (this.color) + "'>" + this.text.toString().replaceAll("<", "&zwnj;<&zwnj;").replaceAll(">", "&zwnj;>&zwnj;") + "</span><br>";
        }
    }
    class Console {
        constructor(element) {
            this.element = element;
            this.lines = [];
        }

        _last() {
            return this.lines[this.lines.length - 1];
        }

        log(text, color) {
            if(this._last() && this._last().text === text) this._last().stack++;
            else this.lines.push(new ConsoleLine(text, color));
            this.render();
        }

        logf(text, color) {
            this._last().text += text;
            this.render();
        }

        clear() {
            this.lines = [];
            this.render();
        }

        backspace() {
            const lines = this.lines.filter(i=> i.color === "#ffffff");
            const last = this._last();
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