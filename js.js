window.addEventListener('DOMContentLoaded', function() {
    
    const inputTextArea = document.getElementById("inputTextArea");
    const outputTextArea = this.document.getElementById("outputTextArea");

    const translateButton = this.document.getElementById("translateTextButton");


    translateButton.addEventListener("click", (e) =>{
        e.preventDefault();

        let currentInputText = inputTextArea.value;

        if(currentInputText.trim() !== "")
        {
            let convertedText = convertCoptic(currentInputText).normalize('NFC');
            outputTextArea.textContent = convertedText;
        }
        else
        {
            outputTextArea.textContent = "Nothing to translate, boss!";
        }
            
        
        
    })

  
    const copyBtn = document.getElementById('copyBtn');

    copyBtn.addEventListener('click', async () => {
        const text = outputTextArea.textContent || '';

        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'COPIED';
        setTimeout(()=> copyBtn.textContent = 'COPY', 1200);

    });

    const clearBtn = document.getElementById('clearBtn');

    clearBtn.addEventListener('click', (e) =>{
        e.preventDefault();

        if(this.window.confirm("Are you sure you want to clear text contents?"))
        {
            outputTextArea.textContent = "";
            inputTextArea.value = "";
        }
    })

});

// combining overline mark
const OVERLINE = "\u0305";





// base single-letter map (lowercase to uppercase Coptic)
const SINGLE = {
    "a":"Ⲁ","b":"Ⲃ","g":"Ⲅ","d":"Ⲇ","e":"Ⲉ","z":"Ⲍ",
    "h":"Ⲏ","q":"Ⳓ", // <— was "Ⲑ"
    "i":"Ⲓ","k":"Ⲕ","l":"Ⲗ","m":"Ⲙ",
    "n":"Ⲛ","o":"Ⲟ","p":"Ⲡ","r":"Ⲣ","s":"Ⲥ","t":"Ⲧ",
    "u":"Ⲩ","w":"Ⲱ","f":"Ϥ","y":"Ⲩ","c":"Ⲥ","v":"Ⲃ"
  };

// digraphs (order matters)
const DIGRAPHS = [
    [/ch/gi, "Ⲑ"],   // you want ch -> theta (as your “echp`” shows)
    [/th/gi, "Ⲑ"],
    [/ph/gi, "Ⲫ"],
    [/kh/gi, "Ⲭ"],
    [/ps/gi, "Ⲯ"],
    [/sh/gi, "Ϣ"],
    [/ti/gi, "Ϯ"],
    [/ou/gi, "ⲞⲨ"]
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



// --- add/replace this dotted-capitals rule (replaces the N. special) ---
/*
  Any capital followed by a dot is a suspended letter: overline it.
  Example: "M." -> Ⲙ̅, "N." -> Ⲛ̅
*/
function overlineDottedCapitals(t) {
    return t.replace(/\b([A-Z])\./g, (_, cap) => {
      const mapped = SINGLE[cap.toLowerCase()] || cap;
      return mapped + OVERLINE;
    });
  }

// main converter
function convertCoptic(input) {
    let t = input;
  
    t = t.replace(/\bcwmas\b/g, "ⲐⲰⲘⲀⲤ"); // Thomas
  
    // nomina sacra first
    NOMINA.forEach(([pat, repl]) => { t = t.replace(pat, repl); });

     // normalize ".`" -> "`" so your existing rule matches
t = t.replace(/\.`/g, "`");
  
    // general dotted-capitals suspension (covers M. N. etc.)
    t = overlineDottedCapitals(t);

   
  
    t = t.replace(/([A-Za-z$]+)`/g, (_, seg) => {
        // apply digraphs within the segment first
        DIGRAPHS.forEach(([pat, repl]) => { seg = seg.replace(pat, repl); });
      
        let out = "";
        for (const ch of seg) {
          const sp = specials(ch);
          if (sp) { out += sp; continue; }
          const mapped = SINGLE[ch.toLowerCase()] || ch;
      
          if (/[A-Z]/.test(ch)) out += mapped + OVERLINE;
          else out += mapped;
        }
        // overline the final letter of the segment
        return out.slice(0, -1) + out.slice(-1) + OVERLINE;
      });
  
    // '!' -> iota with diaeresis
    t = t.replace(/!/g, "Ⲓ\u0308");
  
    // digraphs (order matters)
    DIGRAPHS.forEach(([pat, repl]) => { t = t.replace(pat, repl); });
  
    // character-by-character fallback
    let out = "";
    for (let ch of t) {
      const sp = specials(ch);
      if (sp) { out += sp; continue; }
      const map = SINGLE[ch.toLowerCase()];
      out += map ? map : ch;
    }
    return out;
  }
