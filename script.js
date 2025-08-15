function typeWriterEffect(elementId, text, delay = 100, loop = false) {
    let index = 0;
    const element = document.getElementById(elementId);

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, delay);
        } else if (loop) {
            setTimeout(() => {
                element.innerHTML = "";
                index = 0;
                type();
            }, 2000);
        }
    }
    type();
}

stypeWriterEffect("present-day", "Present Day, Present Time", 100, true);
