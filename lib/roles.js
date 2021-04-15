/**
 * lib/roles.js
 */
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("stormtrooper")
 .readOwn("profile")
 
ac.grant("sith")
 .extend("stormtrooper")
 .createAny("profile")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();