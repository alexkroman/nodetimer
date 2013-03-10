var Browser = require("zombie");
var assert = require("assert");

var browser = new Browser({silent: true});
browser.visit("http://localhost:3000/", function () {

  assert.ok(browser.success);

  browser.clickLink("Sign up", function() {

    browser
      .fill("name", "Alex Kroman")
      .fill("email", "alexkroman@gmail.com")
      .fill("username", "alexkroman")
      .fill("password", "123456")
      .pressButton("Sign up", function() {

        assert.ok(browser.success);
        assert.equal(browser.text("title"), "Node Timer for Alex Kroman");

        browser
          .fill("#doing", "I am #doing something")
          .pressButton("Start", function() {

            assert.ok(browser.success);

            browser.clickLink("Tags", function () {
              assert.ok(browser.success);
            });

          });

      });

  });

});
