/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../../lib/addons");
var { expect } = require("../../../../../lib/assertions");

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.addonsManager = new addons.AddonsManager(aModule.controller);
}

function teardownModule(aModule) {
  aModule.addonsManager.close();

  aModule.controller.restartApplication();
}

/**
 * Test uninstalling the blocklisted extension
 */
function testUninstallBlocklistedExtension() {
  addonsManager.open();

  var addons = addonsManager.getAddons({attribute: "name",
                                        value: persisted.addon.name});

  // Check that the extension is disabled
  expect.ok(!addonsManager.isAddonEnabled({addon: addons[0]}),
            "The addon is disabled");

  addonsManager.removeAddon({addon: addons[0]});
}
