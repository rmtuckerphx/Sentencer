var assert = require("assert");

var SentencerLite = require('../index.js');

describe('SentencerLite:', function () {

  it('should exist', function () {
    assert(SentencerLite);
  });

  describe('API', function () {

    it('should include a `configure` function', function () {
      assert(SentencerLite.configure);
    });

    it('should merge a new action', function () {
      SentencerLite.configure({
        actions: {
          firstNewAction: function () { return 'hello'; }
        }
      });

      assert.equal(SentencerLite.actions.firstNewAction(), 'hello');
    });

    it('should accept another action merge later', function () {
      SentencerLite.configure({
        actions: {
          secondNewAction: function () { return 'hello again'; }
        }
      });

      assert.equal(SentencerLite.actions.firstNewAction(), 'hello', 'first action still exists');
      assert.equal(SentencerLite.actions.secondNewAction(), 'hello again', 'second action exists as well');
    });

    it('should include a `make` function', function () {
      assert(SentencerLite.make);
    });

    it('should merge a new custom list', function () {
      SentencerLite.configure({
        customLists: [
          {
            key: "animal",
            values: ["dog", "cat", "elephant"],
            articlize: "an_animal", // if named, add action that calls articlize
            pluralize: "animals"    // if named, add action that calls pluralize
          }
        ]
      });

      assert(SentencerLite.actions.animal);
      assert(SentencerLite.actions.an_animal);
      assert(SentencerLite.actions.animals);

      assert.notEqual(["dog", "cat", "elephant"].indexOf(SentencerLite.actions.animal()), -1, "missing animal");
      assert.notEqual(["a dog", "a cat", "an elephant"].indexOf(SentencerLite.actions.an_animal()), -1, "missing an_animal");
      assert.notEqual(["dogs", "cats", "elephants"].indexOf(SentencerLite.actions.animals()), -1, "missing animals");
    });

  });

  describe('Templating', function () {

    describe('# Custom Actions', function () {

      it('{{ firstNewAction }}', function () {
        assert.equal(SentencerLite.make('{{ firstNewAction }}'), 'hello');
      });

      it('{{ secondNewAction }}', function () {
        assert.equal(SentencerLite.make('{{ secondNewAction }}'), 'hello again');
      });

      it('should return {{ action }} if it does not exist', function () {
        assert.equal(SentencerLite.make('{{ nonexistent thing }}'), '{{ nonexistent thing }}');
      });

    });

    describe('# Custom Actions With Arguments', function () {

      SentencerLite.configure({
        actions: {
          withArgument: function (number) {
            return number;
          },
          withArguments: function () {
            return arguments.length;
          }
        }
      });

      it('should allow an action with one argument', function () {
        assert.equal(SentencerLite.make('{{ withArgument(1) }}'), 1);
      });

      it('should allow an action with multiple arguments', function () {
        assert.equal(SentencerLite.make('{{ withArguments(1,2,3) }}'), 3);
      });

      it('should cast arguments as numbers when possible, otherwise strings', function () {
        var result = null;

        SentencerLite.configure({
          actions: {
            test: function () {
              result = Array.prototype.slice.call(arguments);
            }
          }
        });

        SentencerLite.make('{{ test(1, hey hello, 2) }}');
        assert.deepEqual(result, [1, 'hey hello', 2]);
      });

      it('should fail silently if an action with arguments does not exist', function () {
        assert.deepEqual(SentencerLite.make('{{ nonExistentThing(1,2,3) }}'), '');
      });

      it('pass text through if someone tries to exploit eval', function () {
        assert.deepEqual(
          SentencerLite.make('{{ nothing; console.log("This should not evaluate"); }}'),
          '{{ nothing; console.log("This should not evaluate"); }}'
        );
      });

      it('should pass text through when handed some garbage', function () {
        assert.deepEqual(
          SentencerLite.make('{{ &@#&(%*@$UU#I$HTRIGUHW$@) }}'),
          '{{ &@#&(%*@$UU#I$HTRIGUHW$@) }}'
        );
      });

    });

    describe('# Custom Lists', function () {

      it('{{ animal }}', function () {
        assert.notEqual(["dog", "cat", "elephant"].indexOf(SentencerLite.make('{{ animal }}')), -1, "missing animal");
      });

      it('{{ an_animal }}', function () {
        assert.notEqual(["a dog", "a cat", "an elephant"].indexOf(SentencerLite.make('{{ an_animal }}')), -1, "missing an_animal");
      });

      it('{{ animals }}', function () {
        assert.notEqual(["dogs", "cats", "elephants"].indexOf(SentencerLite.make('{{ animals }}')), -1, "missing animals");
      });

    });
  });

  describe('Test Print', function () {

    it('should have logged a sentence', function () {
      console.log(SentencerLite.make("      I saw {{ an_animal }}, 1 {{ animal }}, and 2 {{ animals }}."));
    });

  });

});