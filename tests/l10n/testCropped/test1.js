/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * This test tests the Preferences window and its sub-windows for cropped
 * elements.
 */

// Include the required modules
var domUtils = require("../../../lib/dom-utils");
var localization = require("../../../lib/localization");
var prefs = require("../../../lib/prefs");
var utils = require("../../../lib/utils");

const GET_BY_ID = domUtils.DOMWalker.GET_BY_ID;
const GET_BY_SELECTOR = domUtils.DOMWalker.GET_BY_SELECTOR;
const WINDOW_CURRENT = domUtils.DOMWalker.WINDOW_CURRENT;
const WINDOW_MODAL= domUtils.DOMWalker.WINDOW_MODAL;
const WINDOW_NEW = domUtils.DOMWalker.WINDOW_NEW;

function setupModule(module) {
  controller = mozmill.getBrowserController();
}

function prefPaneInit(controller, prefDialog) {
  var dtds = ["chrome://passwordmgr/locale/passwordManager.dtd",
              "chrome://browser/locale/preferences/content.dtd",
              "chrome://browser/locale/preferences/cookies.dtd",
              "chrome://pippki/locale/certManager.dtd",
              "chrome://pippki/locale/deviceManager.dtd",
              "chrome://pippki/locale/validation.dtd"];
  var properties = ["chrome://browser/locale/preferences/preferences.properties"];

  var ids = [
    { getBy : GET_BY_ID,
      id : "paneMain",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog,
      subContent : [
        { getBy : GET_BY_ID,
          id : "useBookmark",
          target : WINDOW_MODAL}
      ]},
    { getBy : GET_BY_ID,
      id : "paneTabs",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog},
    { getBy : GET_BY_ID,
      id : "paneContent",
      target : WINDOW_CURRENT, windowHandler :
      prefDialog, subContent : [
        { getBy : GET_BY_ID,
          id : "popupPolicyButton",
          target : WINDOW_NEW,
          title : utils.getProperty(properties, "popuppermissionstitle")},
        { getBy : GET_BY_SELECTOR,
          selector : "#enableImagesRow button",
          target : WINDOW_NEW,
          title : utils.getProperty(properties, "imagepermissionstitle")},
        { getBy : GET_BY_ID,
          id : "advancedJSButton",
          target : WINDOW_MODAL},
        { getBy : GET_BY_ID,
          id : "advancedFonts",
          target : WINDOW_MODAL},
        { getBy : GET_BY_ID,
          id : "colors",
          target : WINDOW_MODAL},
        { getBy : GET_BY_ID,
          id : "chooseLanguage",
          target : WINDOW_MODAL}
      ]},
    { getBy : GET_BY_ID,
      id : "paneApplications",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog},
    { getBy : GET_BY_ID,
      id : "panePrivacy",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog,
      subContent : [
        { getBy : GET_BY_ID,
          id : "historyMode",
          target : WINDOW_CURRENT,
          value : "remember"},
        { getBy : GET_BY_ID,
          id : "historyMode",
          target : WINDOW_CURRENT,
          value : "dontremember"},
        { getBy : GET_BY_ID,
          id : "historyMode",
          target : WINDOW_CURRENT,
          value : "custom",
          subContent : [
            { getBy : GET_BY_ID,
              id : "privateBrowsingAutoStart",
              target : WINDOW_CURRENT},
            { getBy : GET_BY_ID,
              id : "cookieExceptions",
              target : WINDOW_NEW,
              title : utils.getProperty(properties, "cookiepermissionstitle")},
            { getBy : GET_BY_ID,
              id : "showCookiesButton",
              target : WINDOW_NEW,
              title : utils.getEntity(dtds, "window.title")}
          ]
        }
      ]},
    { getBy : GET_BY_ID,
      id : "paneSecurity",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog,
      subContent : [
        { getBy : GET_BY_ID,
          id : "addonExceptions",
          target : WINDOW_NEW,
          title : utils.getProperty(properties, "addons_permissions_title")},
        { getBy : GET_BY_ID,
          id : "passwordExceptions",
          target : WINDOW_NEW,
          title : utils.getEntity(dtds, "savedPasswordsExceptions.title")},
        { getBy : GET_BY_ID,
          id : "useMasterPassword",
          target : WINDOW_MODAL},
        { getBy : GET_BY_ID,
          id : "showPasswords",
          target : WINDOW_NEW,
          title : utils.getEntity(dtds, "savedPasswords.title")}
      ]},
    { getBy : GET_BY_ID,
      id : "paneAdvanced",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog,
      subContent : [
        { getBy : GET_BY_ID,
          id : "generalTab",
          target : WINDOW_CURRENT,
          windowHandler : prefDialog},
        { getBy : GET_BY_ID,
          id : "networkTab",
          target : WINDOW_CURRENT,
          windowHandler : prefDialog,
          subContent : [
            { getBy : GET_BY_ID,
              id : "connectionSettings",
              target : WINDOW_MODAL},
            { getBy : GET_BY_ID,
              id : "offlineNotifyExceptions",
              target : WINDOW_NEW,
              title : utils.getProperty(properties, "offlinepermissionstitle")}
          ]},
        { getBy : GET_BY_ID,
          id : "updateTab",
          target : WINDOW_CURRENT,
          windowHandler : prefDialog,
          subContent : [
            { getBy : GET_BY_ID,
              id : "showUpdateHistory",
              target : WINDOW_MODAL}
          ]},
        { getBy : GET_BY_ID,
          id : "encryptionTab",
          target : WINDOW_CURRENT,
          windowHandler : prefDialog,
          subContent : [
            { getBy : GET_BY_ID,
              id : "viewCertificatesButton",
              target : WINDOW_NEW,
              title : utils.getEntity(dtds, "certmgr.title")},
            { getBy : GET_BY_ID,
              id : "viewCRLButton",
              target : WINDOW_NEW,
              title : utils.getEntity(dtds, "validation.crlmanager.label")},
            { getBy : GET_BY_ID,
              id : "viewSecurityDevicesButton",
              target : WINDOW_NEW,
              title : utils.getEntity(dtds, "devmgr.title")},
            { getBy : GET_BY_ID,
              id : "verificationButton",
              target : WINDOW_MODAL}
          ]},
      ]},
    { getBy : GET_BY_ID,
      id : "paneSync",
      target : WINDOW_CURRENT,
      windowHandler : prefDialog}
  ];

  return ids;
}

function prefPanesCroppedTest(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);

  var ids = prefPaneInit(controller, prefDialog);

  var domWalker = new domUtils.DOMWalker(controller,
                                         localization.filterCroppedNodes,
                                         localization.checkDimensions,
                                         localization.processDimensionsResults);

  domWalker.walk(ids);

  prefDialog.close();
}

function testPrefWindowCroppedElements() {
  prefs.openPreferencesDialog(controller, prefPanesCroppedTest);
}
