/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MozMill Test code.
 *
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aaron Train <atrain@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// Include required modules
var prefs = require("../../../shared-modules/testPrefsAPI");
var softwareUpdate = require("../../../shared-modules/testSoftwareUpdateAPI");

const TIMEOUT = 5000;

var setupModule = function() {
 controller = mozmill.getBrowserController();
 
 update = new softwareUpdate.softwareUpdate();
}

/**
 * Performs a check for a software update failure: 'Update XML file malformed (200)'
 */
var testSoftwareUpdateAutoProxy = function() {

 // Check if the user has permissions to run the update
 controller.assertJS("subject.isUpdateAllowed == true",
                     {isUpdateAllowed: update.allowed});
 
 // Open the software update dialog and wait until the check has been finished
 update.openDialog(controller);
 update.waitForCheckFinished();
 
 // Check to see if there are browser updates
 try {
   update.controller.waitForEval("subject.update.updatesFound == true", TIMEOUT, 100,
                                 {update: update});
 } catch(ex) {
   controller.assertJS("subject.currentPage == subject.noUpdatesFoundPage",
                      {currentPage: update.currentPage, noUpdatesFoundPage: 
                       softwareUpdate.WIZARD_PAGES.noUpdatesFound});
 }
 
 update.closeDialog();
}
