/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include the required modules
var { expect } = require("../../../../lib/assertions");
var prefs = require("../../../lib/prefs");
var utils = require("../../../lib/utils");

const PREF_BROWSER_IN_CONTENT = "browser.preferences.inContent";
const PREF_BROWSER_INSTANT_APPLY = "browser.preferences.instantApply";

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.lastSelectedPaneId = undefined;

  prefs.preferences.setPref(PREF_BROWSER_IN_CONTENT, false);
  if (mozmill.isWindows) {
    prefs.preferences.setPref(PREF_BROWSER_INSTANT_APPLY, false);
  }
}

function teardownModule(aModule) {
  prefs.openPreferencesDialog(controller, prefPaneResetCallback);
  prefs.preferences.clearUserPref(PREF_BROWSER_IN_CONTENT);
  prefs.preferences.clearUserPref(PREF_BROWSER_INSTANT_APPLY);
}

/**
 * Test the Preferences dialog retains state
 */
function testPreferencesDialogRetention() {
  // Choose the Privacy pane
  prefs.openPreferencesDialog(controller, prefPaneSetCallback);

  // And check if the Privacy pane is still selected
  prefs.openPreferencesDialog(controller, prefPaneCheckCallback);
}

/**
 * Select the Advanced and the Privacy pane
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function prefPaneSetCallback(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);

  prefDialog.paneId = 'paneAdvanced';
  prefDialog.paneId = 'panePrivacy';

  // Store actual paneId
  lastSelectedPaneId = prefDialog.paneId;
  prefDialog.close();
}

/**
 * The Privacy pane should still be selected
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function prefPaneCheckCallback(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);

  expect.waitFor(function () {
    return prefDialog.paneId === lastSelectedPaneId;
  }, "The privacy pane has been selected");
  prefDialog.close();
}

/**
 * Reset the current pane to the main options
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function prefPaneResetCallback(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);

  prefDialog.paneId = 'paneMain';
  prefDialog.close();
}
