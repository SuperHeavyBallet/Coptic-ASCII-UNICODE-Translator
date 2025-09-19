# COPTIC TRANSLATOR
# ASCII > NFC UNICODE

In a nutshell, this is an internal tool built to take older format ASCII coptic symbols and translate them to the more modern NFC Unicode format.

For example: .swtM ero.f xM.pek.`.maaje becomes: ⲤⲰⲦⲘ ⲈⲢⲞ Ϥ ϨⲘ ⲠⲈⲔ̅ ⲘⲀⲀϪⲈ (Lit Eng: Listen to Him with your mind).

# But Why?

As mentioned, this is a purely internal tool. It may be of use to others who have a need for this specific purpose, so I wanted to expose it in that offchance.

For me, it allowed me to work on my project of transcribing and translating the apocryphal Gospel of Thomas into English for interpretation. Initially it was purely for that, but in the process of research, I found that the existing archives are very old and poorly maintained or made useable. This runs the risk - in my opinion - that this and many other ancient texts, not deemed correct to include in the main canon of religious text are likely to be quietly forgotten and lost to the world outside of dusty archives in private collections. I am a very curious individual, and so the loss of anything even remotely interesting struck me as no bueno!

# So, How?

So, as you can see on the browser UI, an input text field is given, with a translate button and an output field.

If you press Translate without any valid text in the input field, the output will complain.

Instead, you must paste a string of ASCII format characters. All ASCII works, and even English or others will be translated, since they all draw from the same symbol alphabet - but those might not make much sense...

.swtM ero.f xM.pek.`.maaje is the example of ASCII symbols. In the correct environment, this will actually show as the correct Coptic symbols you aim for. But, it is difficult to copy paste and use in other places.

After hitting translate, the Javascript will compare the presented characters and look for edge cases (it is not a simple A = 1, B = 2 chart) and then output the result in the output field.

From here, you can highlight, copy, paste and reuse the new Unicode symbols wherever you desire (If it accepts Unicode...)

There is also a button that will copy the contents of the output text to your clipboard, without having to highlight and right click.

Finally, there is a 'Clear' button to remove all text contents after a confirmation pop up.

# The Algorithm