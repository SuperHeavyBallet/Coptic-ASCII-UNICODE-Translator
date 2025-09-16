window.addEventListener('DOMContentLoaded', function() {
    
    const inputTextArea = document.getElementById("inputTextArea");
    const outputTextArea = this.document.getElementById("outputTextArea");

    const submitButton = this.document.getElementById("submitTextButton");


    submitButton.addEventListener("click", (e) =>{
        e.preventDefault();

        let currentInputText = inputTextArea.value;

        let convertedText = convertCoptic(currentInputText);
        outputTextArea.textContent = convertedText;
    })
});

// combining overline mark
const OVERLINE = "\u0305";



// base single-letter map (lowercase to uppercase Coptic)
const SINGLE = {
  "a":"Ⲁ","b":"Ⲃ","g":"Ⲅ","d":"Ⲇ","e":"Ⲉ","z":"Ⲍ",
  "h":"Ⲏ","q":"Ⲑ","i":"Ⲓ","k":"Ⲕ","l":"Ⲗ","m":"Ⲙ",
  "n":"Ⲛ","o":"Ⲟ","p":"Ⲡ","r":"Ⲣ","s":"Ⲥ","t":"Ⲧ",
  "u":"Ⲩ","w":"Ⲱ","f":"Ϥ","y":"Ⲩ","c":"Ⲥ","v":"Ⲃ"
};

// digraphs (order matters)
const DIGRAPHS = [
  [/ch/g, "Ⲑ"],  // theta
  [/th/g, "Ⲑ"],  // fallback
  [/ph/g, "Ⲫ"],
  [/kh/g, "Ⲭ"],
  [/ps/g, "Ⲯ"],
  [/sh/g, "Ϣ"],
  [/ti/g, "Ϯ"],
  [/ou/g, "ⲞⲨ"]
];

// nomina sacra (expand as needed)
const NOMINA = [
  [/\bIS\b/g, "Ⲓ" + OVERLINE + "Ⲥ" + OVERLINE],
  [/\bIC\b/g, "Ⲓ" + OVERLINE + "Ⲥ" + OVERLINE],
  [/\bXC\b/g, "Ⲭ" + OVERLINE + "Ⲥ" + OVERLINE]
];

// special symbols
function specials(ch) {
  if (ch === "$") return "Ⳃ";  // lunate sigma
  if (ch === "j") return "Ϫ";
  if (ch === "x") return "Ϩ";
  if (ch === ".") return " ";  // dots = space

  return null;
}

// overline handler: add U+0305 to last letter
function applyOverline(str) {
  if (!str) return str;
  return str.slice(0,-1) + str.slice(-1) + OVERLINE;
}

// main converter
function convertCoptic(input) {
  let t = input;

  t = t.replace(/\bcwmas\b/g, "ⲐⲰⲘⲀⲤ"); // Thomas

  // handle N. → Ⲛ̅
  t = t.replace(/\bN\./g, "Ⲛ" + OVERLINE);
  t = t.replace(/\bn\./g, "ⲛ" + OVERLINE);

  // nomina sacra
  NOMINA.forEach(([pat,repl]) => { t = t.replace(pat, repl); });

  // suspensions with backtick (word` → apply overline to last letter)
  t = t.replace(/([A-Za-z$]+)`/g, (_,seg) => applyOverline(convertCoptic(seg)));

// '!' marks iota with diaeresis in this ASCII scheme (e.g., !oudas -> Ⲓ̈ⲟⲩⲇⲁⲥ)
t = t.replace(/!/g, "Ⲓ\u0308");

  // digraphs
  DIGRAPHS.forEach(([pat,repl]) => { t = t.replace(pat, repl); });

  // character by character
  let out = "";
  for (let ch of t) {
    const sp = specials(ch);
    if (sp) { out += sp; continue; }
    const map = SINGLE[ch.toLowerCase()];
    if (map) out += map;
    else out += ch;
  }

  return out;
}
