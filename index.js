var natural = require('natural');
var nounInflector = new natural.NounInflector();
var articles = require('articles');
var randy = require('randy');

// ---------------------------------------------
//                  DEFAULTS
// ---------------------------------------------

function SentencerLite() {
  var self = this;

  self.actions = {
  };

  // function definitions
  self._func_normal = function (values) {
    return randy.choice(values);
  }
  self._func_articlize = function (name) {
    return articles.articlize(self.actions[name]());
  }
  self._func_pluralize = function (values) {
    return nounInflector.pluralize(randy.choice(values));
  }

  self.configure = function (options) {
    // merge actions
    self.actions = { ...self.actions, ...options.actions };
    self._customLists = options.customLists || [];

    self._customLists.forEach(item => {
      self.actions[item.key] = self._func_normal.bind(null, item.values);
      if (item.articlize) {
        self.actions[item.articlize] = self._func_articlize.bind(null, item.key);
      }
      if (item.pluralize) {
        self.actions[item.pluralize] = self._func_pluralize.bind(null, item.values);
      }
    });
  };

  self.use = function (options) {
    var newInstance = new SentencerLite();
    newInstance.configure(options);
    return newInstance;
  };
}

// ---------------------------------------------
//                  THE GOODS
// ---------------------------------------------

SentencerLite.prototype.make = function (template) {
  var self = this;

  var sentence = template;
  var occurrences = template.match(/\{\{(.+?)\}\}/g);

  if (occurrences && occurrences.length) {
    for (var i = 0; i < occurrences.length; i++) {
      var action = occurrences[i].replace('{{', '').replace('}}', '').trim();
      var result = '';
      var actionIsFunctionCall = action.match(/^\w+\((.+?)\)$/);

      if (actionIsFunctionCall) {
        var actionNameWithParens = action.match(/^(\w+)\(/);
        var actionName = actionNameWithParens[1];
        var actionExists = self.actions[actionName];
        var actionContents = action.match(/\((.+?)\)/);
        actionContents = actionContents && actionContents[1];

        if (actionExists && actionContents) {
          try {
            // var args = _.map(actionContents.split(','), maybeCastToNumber);
            var args = actionContents.split(',').map(maybeCastToNumber);
            result = self.actions[actionName].apply(null, args);
          }
          catch (e) { }
        }
      } else {
        if (self.actions[action]) {
          result = self.actions[action]();
        } else {
          result = '{{ ' + action + ' }}';
        }
      }
      sentence = sentence.replace(occurrences[i], result);
    }
  }
  return sentence;
};

function maybeCastToNumber(input) {
  var trimmedInput = input.trim();
  return !Number.isNaN(Number(trimmedInput)) ? Number(trimmedInput) : trimmedInput;
}

// ---------------------------------------------
//                    DONE
// ---------------------------------------------

var instance = new SentencerLite();
module.exports = instance;
