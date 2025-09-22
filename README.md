# COPTIC TRANSLATOR
## ASCII > NFC UNICODE

## License

This project is licensed under the MIT License – see the LICENSE file for details.

In a nutshell, this is an internal tool built to take older format ASCII coptic symbols and translate them to the more modern NFC Unicode format.

For example: **.swtM ero.f xM.pek.`.maaje** becomes: **ⲤⲰⲦⲘ ⲈⲢⲞ Ϥ ϨⲘ ⲠⲈⲔ̅ ⲘⲀⲀϪⲈ** (Lit Eng: **Listen to Him with your mind**).

**Example**
```
Input:  .swtM ero.f xM.pek.`.maaje
Output: ⲤⲰⲦⲘ ⲈⲢⲞ Ϥ ϨⲘ ⲠⲈⲔ̅ ⲘⲀⲀϪⲈ

Input:  PN` KC` XC`
Output: Ⲡ̅Ⲓ̅ Ⲕ̅Ⲥ̅ Ⲭ̅Ⲥ̅
```

## But Why?

As mentioned, this is a purely internal tool. It may be of use to others who have a need for this specific purpose, so I wanted to expose it in that off-chance.

For me, it allowed me to work on my project of transcribing and translating the apocryphal Gospel of Thomas into English for interpretation. Initially it was purely for that, but in the process of research, I found that the existing archives are very old and poorly maintained or made usable. This runs the risk - in my opinion - that this and many other ancient texts, not deemed correct to include in the main canon of religious text are likely to be quietly forgotten and lost to the world outside of dusty archives in private collections. I am a very curious individual, and so the loss of anything even remotely interesting struck me as no bueno!

## So, How?

So, as you can see on the browser UI, an input text field is given, with a translate button and an output field.

If you press Translate without any valid text in the input field, the output will complain.

Instead, you must paste a string of ASCII format characters. All ASCII works, and even English or others will be translated, since they all draw from the same symbol alphabet - but those might not make much sense...

**.swtM ero.f xM.pek.`.maaje** is the given example of ASCII symbols. In the correct environment, this will actually show as the correct Coptic symbols you aim for. But, it is difficult to copy paste and use in other places.

After hitting translate, the JavaScript will compare the presented characters and look for edge cases (it is not a simple A = 1, B = 2 chart) and then output the result in the output field.

From here, you can highlight, copy, paste and reuse the new Unicode symbols wherever you desire (If it accepts Unicode...)

There is also a button that will copy the contents of the output text to your clipboard, without having to highlight and right click.

Finally, there is a 'Clear' button to remove all text contents after a confirmation pop up.

## Limitations

* q → Ⳓ is corpus-specific; typical mapping is q → Ⲑ.

* ti → Ϯ heuristic (article) is context-based; not universal inside words.

* Place-name contractions are attested but not universal.

* Rendering depends on font; recommend Noto Sans Coptic (and note combining mark behavior).

## Design Choices

* Two-pass digraphs: inside sacred segments first, then globally to catch stragglers.

* Overline strategy: uppercase implies overline in segment; tail guard ensures the final letter is overlined without duplication.

* Backtick & dot conventions: legacy ASCII quirks normalized early for rule stability.

## Performance & correctness notes

* Current approach is O(n) with a few replace passes. Fine for text-length inputs; no UI jank expected.

* Word-boundary use (\b) only applies while still in ASCII; once mapped to Coptic, rules don’t rely on \b.

* Security: no HTML injection; uses .textContent.

## Font/Rendering

* Recommend Noto Sans Coptic; note that combining U+0305 may render thicker if duplicated.



# The Algorithm

I will walk through the process after placing suitable text and pressing submit.

On the click event, the variable:

 ``` js
 let currentInputText = inputTextArea.value;
 ```

is assigned with the value of the Input Text Area.

Then, we check if the Input Text Area is composed of valid text by using 
```js
String.prototype.trim();
``` 
to remove whitespaces, and check that the contents is actual characters.
If it is, then we create a new variable:

```js
let convertedText...;
```

Which is assigned the value of:

```js
copticConverter(currentInputText).normalize('NFC');
```


Which places the currentInputText into that function as the parameter, and normalizes the result to NFC format

Using:
``` js
String.prototype.normalize('NFC')
```

If the Input Text Area value is NOT valid, ie empty space, the output returns a String message to express this.

Now let's look at the actual function:

```js
copticConverter(input)
```

First, a new variable is declared:

```js
let t = input;
```

With the value of the input parameter.

**QUICK FIX FOR SPECIFIC, FREQUENT CASES**

First, we have an 'ugly' solution:

```js
t = t.replace(/\bcwmas\b/g, "ⲐⲰⲘⲀⲤ"); // Thomas
```

Which quickly checks ```t``` via regex for the known quantity of 'Thomas' (bcwmas) which may be quite frequent, and simply replaces those characters with the correct Unicode (ⲐⲰⲘⲀⲤ) rather than continuing through the further checks.

**NOMINA SACRA**

Next, we check against the common Coptic NOMINA SACRA (Sacred Names, usually abbreviations of character names) and replace any found symbols:

``` js
NOMINA.forEach(([pat, repl]) => { t = t.replace(pat, repl); });
```

A collection of common Nomina Sacra in Coptic:

``` 
| Full Coptic Word    | Contracted Form | English Equivalent |
| ------------------- | --------------- | ------------------ |
| ⲓⲏⲥⲟⲩⲥ (Iēsous)     | ⲒⲤ̅ / ⲒⲨ̅       | Jesus              |
| ⲭⲣⲓⲥⲧⲟⲥ (Christos)  | ⲬⲤ̅             | Christ             |
| ⲛⲟⲩⲧⲉ (Noute)       | ⲚⲤ̅             | God                |
| ⲕⲩⲣⲓⲟⲥ (Kyrios)     | ⲔⲤ̅             | Lord               |
| ⲡⲛⲉⲩⲙⲁ (Pneuma)     | ⲠⲒ̅ / ⲠⲒⲢ̅      | Spirit             |
| ⲥⲱⲧⲏⲣ (Sōtēr)       | ⲤⲨ̅             | Savior             |
| ⲥⲧⲁⲩⲣⲟⲥ (Stauros)   | ⲤⲢ̅             | Cross              |
| ⲓⲥⲣⲁⲏⲗ (Israēl)     | Ⲓⲗ̅             | Israel             |
| ⲅⲁⲗⲓⲗⲁⲓⲁ (Galilaia) | ⲅⲗ̅             | Galilee            |
| ⲅⲟⲗⲅⲟⲑⲁ (Golgotha)  | ⲅⲗ̅             | Golgotha           |
| ⲥⲩⲣⲓⲁ (Syria)       | ⲥⲣ̅             | Syria              |
| ⲃⲏⲑⲗⲉⲉⲙ (Bethleem)  | ⲃⲗ̅             | Bethlehem          |

```

The NOMINA SACRA array of key–value pairs (Updated as new names emerge)

``` js
const NOMINA = [
  // Core names
  [/\bIS\b/g, "Ⲓ" + OVERLINE + "Ⲥ" + OVERLINE],   // Jesus
  [/\bIC\b/g, "Ⲓ" + OVERLINE + "Ⲥ" + OVERLINE],   // Jesus (variant)
  [/\bXC\b/g, "Ⲭ" + OVERLINE + "Ⲥ" + OVERLINE],   // Christ
  [/\bNC\b/g, "Ⲛ" + OVERLINE + "Ⲥ" + OVERLINE],   // God
  [/\bKC\b/g, "Ⲕ" + OVERLINE + "Ⲥ" + OVERLINE],   // Lord
  [/\bPN\b/g, "Ⲡ" + OVERLINE + "Ⲓ" + OVERLINE],   // Spirit (Pneuma)
  [/\bSY\b/g, "Ⲥ" + OVERLINE + "Ⲩ" + OVERLINE],   // Savior
  [/\bCR\b/g, "Ⲥ" + OVERLINE + "Ⲣ" + OVERLINE],   // Cross (Stauros)

  // Place names (less common, but attested)
  [/\bIL\b/g, "Ⲓ" + OVERLINE + "ⲗ" + OVERLINE],   // Israel
  [/\bGL\b/g, "ⲅ" + OVERLINE + "ⲗ" + OVERLINE],   // Galilee
  [/\bGLT\b/g, "ⲅ" + OVERLINE + "ⲗ" + OVERLINE],  // Golgotha (variant contraction)
  [/\bSR\b/g, "ⲥ" + OVERLINE + "ⲣ" + OVERLINE],   // Syria
  [/\bBL\b/g, "ⲃ" + OVERLINE + "ⲗ" + OVERLINE]    // Bethlehem
];
```

**Backtick Normalizing**

Next, checks are made for: ``.` `` which needs to be normalized to: `` ` ``  so that later rules run reliably

Normalize: ``.` `` → `` ` ``
Code: 
```js
t = t.replace(/\.`/g, "`");
```

**Overline Capitals**

Next, we check within ```t``` for any general overline dotted capitals

``` js
t = overlineDottedCapitals(t);
```

In this 
```js
overlineDottedCapitals()
``` 
function, we take an argument of ```t``` and check through it for any capitals that require an Overline symbol above to denote special status, eg NOMINA SACRA Abbreviations.

``` js
function overlineDottedCapitals(t) {
    return t.replace(/\b([A-Z])\./g, (_, cap) => {
      const mapped = SINGLE[cap.toLowerCase()] || cap;
      return mapped + OVERLINE;
    });
  }
```

This function checks through ```t``` as a sequence of characters, for any that match the Regex

``` js
/\b([A-Z])\./g
```

\b → word boundary

([A-Z]) → capture a single uppercase letter

\. → immediately followed by a literal period .

So it matches things like I. or X. at the start of a word.

``` js
Callback: (_, cap) => { … }
```

The first argument ```_``` is the whole match (ignored).

cap is the single uppercase letter matched (e.g., "I").

Mapping:

``` js
SINGLE[cap.toLowerCase()] || cap;
```

Looks up the lowercase equivalent in a dictionary called SINGLE.

If there’s no mapping, it just keeps the original uppercase.

Return:

Concatenates the mapped character with OVERLINE (which is \u0305, the combining overline).

So "I." becomes " Ⲓ̅ ", for instance.

In plain English:

This function finds capital letters followed by a dot (a shorthand scribal way of writing nomina sacra) and replaces them with the mapped Coptic letter, marked with an overline.

**SINGLE DICTIONARY**

``` js
const SINGLE = {
    "a":"Ⲁ","b":"Ⲃ","g":"Ⲅ","d":"Ⲇ","e":"Ⲉ","z":"Ⲍ",
    "h":"Ⲏ","q":"Ⳓ","i":"Ⲓ","k":"Ⲕ","l":"Ⲗ","m":"Ⲙ",
    "n":"Ⲛ","o":"Ⲟ","p":"Ⲡ","r":"Ⲣ","s":"Ⲥ","t":"Ⲧ",
    "u":"Ⲩ","w":"Ⲱ","f":"Ϥ","y":"Ⲩ","c":"Ⲥ","v":"Ⲃ"
  };
```

NOTE: "q" by most cases maps to "Ⲑ", but in this old text, "Ⳓ" is required

**Sacred Segments**

Next we walk through this replacement process

``` js
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
        return /\p{L}$/u.test(out) && !out.endsWith(OVERLINE) ? out + OVERLINE : out;

      });
```

**END OF SEGMENT**

First, we check via regex for:

``` js
/([A-Za-z$]+)`/g
```

Which captures a run of ASCII letters (and $) right before a backtick.
Examples matched: IS in ```IS ` ``` , KyriocinKyrioc in ``` KyriocinKyrioc ` ```. The backtick itself isn’t captured; it just marks “end of sacred segment”.

**SEGMENT TREATMENT**

Each of these captured segments is then treated to this process:

**DIGRAPHS**

``` js
(_, seg) => {
  // 1) digraph pass
  DIGRAPHS.forEach(([pat, repl]) => { seg = seg.replace(pat, repl); });
```

``` js
// digraphs (order matters)
const DIGRAPHS = [
    [/ch/gi, "Ⲑ"],   
    [/th/gi, "Ⲑ"],
    [/ph/gi, "Ⲫ"],
    [/kh/gi, "Ⲭ"],
    [/ps/gi, "Ⲯ"],
    [/sh/gi, "Ϣ"],
    [/ti/gi, "Ϯ"],
    [/ou/gi, "ⲞⲨ"]
  ];
```

Digraphs first: We normalize things like OU, TH, etc., before single-letter mapping. This prevents splitting digraphs into separate letters prematurely.

**SPECIALS**

``` js
// special symbols
function specials(ch) {
  if (ch === "$") return "Ⳃ";  // lunate sigma
  if (ch === "j") return "Ϫ";
  if (ch === "x") return "Ϩ";
  if (ch === ".") return " ";  // dots = space

  return null;
}
```

Note - " . " , Period as an input ASCII symbols maps to a blank space, as that is the convention in the ACII-Coptic source alphabet. Decimal places will not work as input.


``` js
 // 2) per-char mapping
  let out = "";
  for (const ch of seg) {
    const sp = specials(ch);
    if (sp) { out += sp; continue; }
```

```specials(ch)``` Acts as a fast escape hatch for basic punctuation/symbols we want to inject verbatim.
 
**SINGLE MAP**

```js
const mapped = SINGLE[ch.toLowerCase()] || ch;
```

Simple Latin→Coptic letter map check for the character

**UPPERCASE OVERLINE RULE**

```js
    // Uppercase source letters get an overline here
    if (/[A-Z]/.test(ch)) out += mapped + OVERLINE;
    else out += mapped;
  }
```

Uppercase rule: If the input letter is uppercase, you add OVERLINE immediately after the mapped letter.

**FINAL LETTER OVERLINE**

```js
  return /\p{L}$/u.test(out) && !out.endsWith(OVERLINE) ? out + OVERLINE : out;
}
```
Final overline: Regardless of case, we always add an OVERLINE to the last output character in the segment, unless it already features an overline.

**Iota With Diaresis**

``` js
    t = t.replace(/!/g, "Ⲓ\u0308");
```

Next, we replace any character that matches ```!``` in ASCII as ```"Ⲓ\u0308"```
The input "Ⲓ\u0308" represents a character combination of the Coptic letter iota (ⲓ) and the combining diaeresis (U+0308). Looking like this: Ⲓ̈

**Digraphs**

Diraphs are checked again for characters that did not fall into previous patterns but may still require conversion.

``` js
const DIGRAPHS = [
    [/ch/gi, "Ⲭ"],   
    [/th/gi, "Ⲑ"],
    [/ph/gi, "Ⲫ"],
    [/kh/gi, "Ⲭ"],
    [/ps/gi, "Ⲯ"],
    [/sh/gi, "Ϣ"],
    [/\bti\b/gi, "Ϯ"],                // exact word 'ti'
    [/\bti(?=\s|[·.,;:!?’'")\]])/gi, "Ϯ"], // article 'ti' before space/punct
    [/ou/gi, "ⲞⲨ"]
  ];
```

``` js
    DIGRAPHS.forEach(([pat, repl]) => { t = t.replace(pat, repl); });
```

**FINAL CHECK**

First, declare an empty string variable for ```out```

``` js
    let out = "";
```

**Specials**

Then, for each character in ```t```, check if it falls under any special cases that were missed to this point:

``` js
function specials(ch) {
  if (ch === "$") return "Ⳃ"; 
  if (ch === "j") return "Ϫ";
  if (ch === "x") return "Ϩ";
  if (ch === ".") return " ";  // dots = space

  return null;
}
```

Note - " . " , Period as an input ASCII symbols maps to a blank space, as that is the convention in the ACII-Coptic source alphabet. Decimal places will not work as input.

``` js
    for (let ch of t) {
      const sp = specials(ch);
      if (sp) { out += sp; continue; }
      const map = SINGLE[ch.toLowerCase()];
      out += map ? map : ch;
    }
```

**ENDING**

And that should ideally present you with a fully converted set of characters properly formatted in Unicode NFC.




