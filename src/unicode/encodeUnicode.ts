/**
 * 此处演示js字符串转换为unicode的方法，以及es6对utf16（四字节码点）的支持
 * 相关链接：
 * Unicode与JavaScript详解 http://www.ruanyifeng.com/blog/2014/12/unicode.html
 *
 */

/**
 * es6 增强了对4字节码点的支持方法
 * String.fromCodePoint() //从Unicode码点返回对应字符
 * String.prototype.codePointAt() //从字符返回对应的码点
 * Array.from(str) //得到正确的4字节码点长度
 * for...of //可遍历4字节码点
 */

/**
 * 为了保持兼容，length属性还是原来的行为方式。为了得到字符串的正确长度，使用 Array.from
 */
// ok
Array.from("𦵏𨧈𥙨").length; // 3

// error
"𦵏𨧈𥙨".length; // 6

/**
 * 输入字符串，输出unicode转义符
 * @param str
 */
function encodeUnicodeByES6(str: string) {
    let result = "";

    for (let s of str) {
        let codePoint = str.codePointAt(0);

        if (!codePoint) {
            return;
        }
        result += "\\u{" + codePoint.toString(16).padStart(4, "0") + "}";
    }

    return result;
}

encodeUnicodeByES6("𦵏𨧈𥙨"); //"\u{26d4f}\u{289c8}\u{25668}"

encodeUnicodeByES6("abcd"); //"\u{0061}\u{0062}\u{0063}\u{0064}"

encodeUnicodeByES6("百度一下"); //"\u{767e}\u{5ea6}\u{4e00}\u{4e0b}"

/**
 * 输入字符串，输出unicode转义符
 * @param str
 */
function encodeUnicodeES5(str: string) {
    return str
        .split("")
        .map((n) => "\\u" + n.charCodeAt(0).toString(16).padStart(4, "0"))
        .join("");
}

encodeUnicodeES5("𦵏𨧈𥙨"); // "\ud85b\udd4f\ud862\uddc8\ud855\ude68"

/**
 * 
 * @param str 
 */
function decodeUnicode(str: string) {
    return str.replace(
        /\\u\w{1,4}|\\u\{\w+\}/g,
        (whole) => {
            const codePoint = Number('0x' + whole.replace(/\\u\{\}/, ''));
            
            if (Number.isNaN(codePoint)) {
                return whole;
            }

            return String.fromCodePoint(codePoint);
        }
    );
}