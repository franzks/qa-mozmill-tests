/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../../lib/addons");
var {assert} = require("../../../../../lib/assertions");
var tabs = require("../../../../lib/tabs");

const TIMEOUT_USER_SHUTDOWN = 2000;

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.addonsManager = new addons.AddonsManager(aModule.controller);

  tabs.closeAllTabs(aModule.controller);

  aModule.installedAddon = null;
}

function teardownModule(aModule) {
  aModule.controller.restartApplication();
}

/**
 * Verifies the theme is installed and enabled
 */
function testThemeIsInstalled() {
  addonsManager.open();

  // Verify the plain-theme is installed
  var plainTheme = addonsManager.getAddons({attribute: "value",
                                            value: persisted.theme[0].id})[0];

  assert.ok(addonsManager.isAddonInstalled({addon: plainTheme}),
            "The theme '" + persisted.theme[0].id + "' is installed");

  // Verify the plain-theme is enabled
  assert.ok(addonsManager.isAddonEnabled({addon: plainTheme}),
            "The theme '" + persisted.theme[0].id + "' is enabled");

  // Enable the default theme
  var defaultTheme = addonsManager.getAddons({attribute: "value",
                                              value: persisted.theme[1].id})[0];

  addonsManager.enableAddon({addon: defaultTheme});

  // Verify that default theme is marked to be enabled
  assert.equal(defaultTheme.getNode().getAttribute("pending"), "enable");

  // We need access to this addon in teardownModule
  installedAddon = defaultTheme;
}
