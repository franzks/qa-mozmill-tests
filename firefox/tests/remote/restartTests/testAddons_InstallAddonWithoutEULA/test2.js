/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../../lib/addons");
var { assert } = require("../../../../../lib/assertions");
var prefs = require("../../../../lib/prefs");
var tabs = require("../../../../lib/tabs");

const PREF_INSTALL_DIALOG = "security.dialog_enable_delay";
const PREF_LAST_CATEGORY = "extensions.ui.lastCategory";

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.addonsManager = new addons.AddonsManager(aModule.controller);

  tabs.closeAllTabs(aModule.controller);
}

function teardownModule(aModule) {
  prefs.preferences.clearUserPref(PREF_INSTALL_DIALOG);
  prefs.preferences.clearUserPref(PREF_LAST_CATEGORY);

  delete persisted.addon;

  addons.resetDiscoveryPaneURL();
  aModule.addonsManager.close();

  aModule.controller.stopApplication(true);
}

function testInstallAddonWithoutEULA() {
  addonsManager.open();

  addonsManager.setCategory({
    category: addonsManager.getCategoryById({id: "extension"})
  });

  var addon = addonsManager.getAddons({attribute: "name",
                                       value: persisted.addon.name})[0];
  assert.ok(addonsManager.isAddonInstalled({addon: addon}),
            "The add-on has been correctly installed");
}

setupModule.__force_skip__ = "Bug 992187 - Test failure 'addButton is undefined'";
teardownModule.__force_skip__ = "Bug 992187 - Test failure 'addButton is undefined'";
