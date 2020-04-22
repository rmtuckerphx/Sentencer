# Sentencer Lite

`Sentencer Lite` is a Javascript module for madlibs-style sentence templating. It has been forked from [Sentencer](https://github.com/kylestetz/Sentencer), which is a great module.

For those who create custom lists that are more specific than nouns and adjectives and who don't need the word files (totaling 78.3 KB), consider this module.

It is a simple templating engine that accepts strings with actions embedded in them:

```javascript
"This is {{ an_animal }}."
```

Where each action returns a random string selected from a list:

```javascript
"This is a dog."
```

Think of it as madlibs for Javascript. Want to roll your own lorem ipsum generator? `Sentencer Lite` allows you to write the structure of your sentences and plug in any kind of vocabulary you choose.

### How

`npm install sentencer-lite --save`

Here are all of the options, described in detail below.

```javascript
var SentencerLite = require('sentencer-lite');

SentencerLite.configure({

  // lists that generate actions for the template engine to use.
  customLists: [
    {
      // add action for animal
      key: "animal",
      values: ["dog", "cat", "elephant"],
      // if named, add action for articlize
      articlize: "an_animal",
      // if named, add action for pluralize
      pluralize: "animals"
    },
    {
        key: "band",
        values: ["The Beatles", "The Who", "Styx"],
        // no key or empty value, don't articlize
        articlize: "",
        // no key or empty value, don't pluralize
        pluralize: ""
    }
  ],

  // additional actions for the template engine to use.
  // you can also redefine the preset actions here if you need to.
  // See the "Add your own actions" section below.
  actions: {
    my_action: function(){
      return "something";
    }
  }
});
```

### Actions

`Sentencer Lite` works by recognizing "actions" within `{{ double_brackets }}`. It replaces these actions with strings. There are no default actions, but you can extend `Sentencer Lite` to include any custom list or action you need!

NOTE: If you want default actions such as `{{ noun }}`, `{{ a_noun }}`, `{{ nouns }}`, `{{ adjective }}`, and `{{ an_adjective }}` then [Sentencer](https://github.com/kylestetz/Sentencer) is a better option for you.


The actions in `Sentencer Lite` are written semantically so that your sentence template still reads as a sentence. While this was simply a design decision, it does make templates easier to read and you are encouraged to follow this format if you create custom actions.

### Add your own actions

When configuring `Sentencer Lite` you can provide your own "actions", which are just functions that return something. The name of the function that you pass into `actions` is how you will reference it within a sentence template.

Here's an example of an action that returns a random number from 1 to 10.

```javascript
var SentencerLite = require('sentencer-lite');

SentencerLite.configure({
  actions: {
    number: function() {
      return Math.floor( Math.random() * 10 ) + 1;
    }
  }
});

console.log( SentencerLite.make("I can count to {{ number }}.")
// "I can count to 5."
```

#### Actions can take arguments

You can pass arguments into your actions. We can use this to make a smarter version of the random number generator above...

```javascript
var SentencerLite = require('sentencer-lite');

SentencerLite.configure({
  actions: {
    number: function(min, max) {
      return Math.floor( Math.random() * (max - min) ) + min;
    }
  }
});

console.log( SentencerLite.make("I can count to {{ number(8, 10) }}.")
// "I can count to 8."
```

### Add your own custom lists
When configuring `Sentencer Lite` you can provide your own custom lists, which are converted to "actions". The `key` sets the name of the action and the `values` the list of values where one is selected when the action is called. You can also specify a name for the `articlize` and/or `pluralize` actions. These names are referenced within a sentence template.

Here is an example of an animal list that includes options to prefix with an article or to make it plural.

```javascript
var SentencerLite = require('sentencer-lite');

SentencerLite.configure({
  customLists: [
    {
        key: "animal",
        values: ["dog", "cat", "elephant"],
        articlize: "an_animal",
        pluralize: "animals"
    }
  ],
});

console.log( SentencerLite.make("I saw {{ an_animal }}, 1 {{ animal }}, and 2 {{ animals }}.")
// "I saw an elephant, 1 dog, and 2 cats."
```

### Where are the verbs?

Verb pluralization, singularization, and tense modification are difficult computer science problems. `Sentencer Lite` doesn't aim to solve those problems, however _present tense_ verb pluralization/singularization is an experimental feature of [`natural`](https://github.com/NaturalNode/natural) and could be integrated if necessary.

-----------

`Sentencer Lite` was forked from [Sentencer](https://github.com/kylestetz/Sentencer) and is maintained by [Mark Tucker](https://github.com/rmtuckerphx).

[Sentencer](https://github.com/kylestetz/Sentencer) was created and is maintained by [Kyle Stetz](https://github.com/kylestetz). The original prototype came out of [Metaphorpsum](https://github.com/kylestetz/metaphorpsum) but has been rewritten from the ground up.

