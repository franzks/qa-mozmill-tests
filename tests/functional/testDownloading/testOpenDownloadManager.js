/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var downloads = require("../../../lib/downloads");
var prefs = require("../../../lib/prefs");
var utils = require("../../../lib/utils");

const PREF_DOWNLOAD_USE_TOOLKIT = "browser.download.useToolkitUI";


var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();

  // Get an instance of the Download Manager class
  module.dm = new downloads.downloadManager();

  // Enable the old tookit UI to test the download manager
  prefs.preferences.setPref(PREF_DOWNLOAD_USE_TOOLKIT, true);
}

var teardownModule = function(module) {
  prefs.preferences.clearUserPref(PREF_DOWNLOAD_USE_TOOLKIT);

  // If we failed in closing the Download Manager window force it now
  dm.close(true);
}

/**
 * Test opening the Download Manager
 */
var testOpenDownloadManager = function() {
  // Use the main menu
  dm.open(controller, false);
  dm.close();

  // Use the keyboard shortcuts
  dm.open(controller, true);
  dm.close();
}

/**
 * Map test functions to litmus tests
 */
// testOpenDownloadManager.meta = {litmusids : [7979]};
