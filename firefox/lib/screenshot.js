/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Cu.import("resource://gre/modules/Services.jsm");

// Include the required modules
var utils = require("utils");

/**
 * This function creates a screenshot of the window provided in the given
 * controller and highlights elements from the coordinates provided in the
 * given boxes-array.
 *
 * @param {array of array of int} boxes
 * @param {MozmillController} controller
 */
function create(controller, boxes) {
  var doc = controller.window.document;
  var maxWidth = doc.documentElement.boxObject.width;
  var maxHeight = doc.documentElement.boxObject.height;
  var rect = [];
  for (var i = 0, j = boxes.length; i < j; ++i) {
    rect = boxes[i];
    if (rect[0] + rect[2] > maxWidth) maxWidth = rect[0] + rect[2];
    if (rect[1] + rect[3] > maxHeight) maxHeight = rect[1] + rect[3];
  }
  var canvas = doc.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  var width = doc.documentElement.boxObject.width;
  var height = doc.documentElement.boxObject.height;
  canvas.width = maxWidth;
  canvas.height = maxHeight;
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.save();
  ctx.drawWindow(controller.window, 0, 0, width, height, "rgb(0,0,0)");
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "rgba(255,0,0,0.4)";
  for (var i = 0, j = boxes.length; i < j; ++i) {
    rect = boxes[i];
    ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
  }
  ctx.restore();

  _saveCanvas(canvas);
}

/**
 * Saves a given Canvas object to a file.
 * The path to save the file under should be given on the command line. If not,
 * it will be saved in the temporary folder of the system.
 *
 * @param {canvas} canvas
 */
function _saveCanvas(canvas) {
  // Use the path given on the command line and saved under
  // persisted.screenshotPath, if available. If not, use the path to the
  // temporary folder as a fallback.
  var file = null;
  if ("screenshotPath" in persisted) {
    file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
    file.initWithPath(persisted.screenshotPath);
  }
  else {
    file = Services.dirsvc.get("TmpD", Ci.nsIFile);
  }

  var fileName = utils.appInfo.name + "-" +
                 utils.appInfo.locale + "." +
                 utils.appInfo.version + "." +
                 utils.appInfo.buildID + "." +
                 utils.appInfo.os + ".png";
  file.append(fileName);

  // if a file already exists, don't overwrite it and create a new name
  file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, parseInt("0666", 8));

  // create a data url from the canvas and then create URIs of the source
  // and targets
  var source = Services.io.newURI(canvas.toDataURL("image/png", ""), "UTF8", null);
  var target = Services.io.newFileURI(file)

  // prepare to save the canvas data
  var wbPersist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].
                  createInstance(Ci.nsIWebBrowserPersist);

  wbPersist.persistFlags = Ci.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
  wbPersist.persistFlags |= Ci.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;

  // save the canvas data to the file
  wbPersist.saveURI(source, null, null, null, null, file, null);
}

// Export of functions
exports.create = create;
