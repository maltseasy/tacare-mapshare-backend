/**
 * @file
 * This file implements the <tt>DSAuthCodeGrant</tt> class.
 * It handles the OAuth Authorization Code Grant flow.
 * It also looks up the user's default account and baseUrl
 *
 * For the purposes of this example, it ignores the refresh
 * token that is returned from DocuSign. In production,
 * depending on your use case, you can store and then use the
 * refresh token instead of requiring the user to re-authenticate.
 * @author DocuSign
 */
"use strict";
const moment = require("moment"), docusign = require("docusign-esign"), dsConfig = require("../dsconfig.js").config, passport = require("passport"), { promisify } = require("util"), baseUriSuffix = "/restapi", tokenReplaceMinGet = 60;
/**
 * Manages OAuth Authentication Code Grant with DocuSign.
 * @constructor
 * @param {object} req - The request object.
 */
let DSAuthCodeGrant = function _DSAuthCodeGrant(req) {
    this._debug_prefix = "DSAuthCodeGrant";
    this._accessToken = req.user && req.user.accessToken;
    this._refreshToken = req.user && req.user.refreshToken;
    this._tokenExpiration = req.user && req.user.tokenExpirationTimestamp; // when does the token expire?
    this._accountId = req.session && req.session.accountId; // current account
    this._accountName = req.session && req.session.accountName; // current account's name
    this._basePath = req.session && req.session.basePath; // current base path. eg https://na2.docusign.net/restapi
    this._dsApiClient = null; // the docusign sdk instance
    this._dsConfig = null;
    this._debug = true; // ### DEBUG ### setting
    this._dsApiClient = new docusign.ApiClient();
    if (this._basePath) {
        this._dsApiClient.setBasePath(this._basePath);
    }
    if (this._accessToken) {
        this._dsApiClient.addDefaultHeader("Authorization", "Bearer " + this._accessToken);
    }
};
// Public constants
/**
 * Exception when setting an account
 * @constant
 */
DSAuthCodeGrant.prototype.Error_set_account = "Error_set_account";
/**
 * Exception: Could not find account information for the user
 * @constant
 */
DSAuthCodeGrant.prototype.Error_account_not_found = "Could not find account information for the user";
/**
 * Exception when getting a token, "invalid grant"
 * @constant
 */
DSAuthCodeGrant.prototype.Error_invalid_grant = "invalid_grant"; // message when bad client_id is provided
// public functions
DSAuthCodeGrant.prototype.login = function (req, res, next) {
    // Reset
    this.internalLogout(req, res);
    passport.authenticate("docusign")(req, res, next);
};
DSAuthCodeGrant.prototype.oauth_callback1 = (req, res, next) => {
    // This callback URL is used for the login flow
    passport.authenticate("docusign", { failureRedirect: "/ds/login" })(req, res, next);
};
DSAuthCodeGrant.prototype.oauth_callback2 = function _oauth_callback2(req, res, next) {
    //console.log(`Received access_token: ${req.user.accessToken.substring(0,15)}...`);
    console.log(`Received access_token: |${req.user.accessToken}|`);
    console.log(`Expires at ${req.user.tokenExpirationTimestamp.format("dddd, MMMM Do YYYY, h:mm:ss a")}`);
    req.flash("info", "You have authenticated with DocuSign.");
    this._dsApiClient.addDefaultHeader("Authorization", "Bearer " + req.user.accessToken);
    this.getDefaultAccountInfo(req);
    // If an example was requested, but authentication was needed (and done),
    // Then do the example's GET now.
    // Else redirect to home
    if (req.session.eg) {
        let eg = req.session.eg;
        req.session.eg = null;
        res.redirect(`/${eg}`);
    }
    else {
        res.redirect("/");
    }
};
/**
 * Clears the DocuSign authentication session token
 * https://account-d.docusign.com/oauth/logout
 * @function
 */
DSAuthCodeGrant.prototype.logout = function _logout(req, res) {
    let logoutCB = encodeURIComponent(res.locals.hostUrl + "/ds/logoutCallback"), oauthServer = dsConfig.dsOauthServer, client_id = dsConfig.dsClientId, logoutURL = `${oauthServer}/logout?client_id=${client_id}&redirect_uri=${logoutCB}&response_mode=logout_redirect`;
    //console.log (`Redirecting to ${logoutURL}`);
    //res.redirect(logoutURL);
    // Currently, the OAuth logout API method has a bug: ID-3276
    // Until the bug is fixed, just do a logout from within this app:
    this.logoutCallback(req, res);
};
/**
 * Clears the user information including the tokens.
 * @function
 */
DSAuthCodeGrant.prototype.logoutCallback = function _logout(req, res) {
    req.logout(); // see http://www.passportjs.org/docs/logout/
    this.internalLogout(req, res);
    req.flash("info", "You have logged out.");
    res.redirect("/");
};
/**
 * Clears the object's and session's user information including the tokens.
 * @function
 */
DSAuthCodeGrant.prototype.internalLogout = function _internalLogout(req, res) {
    this._accessToken = null;
    this._refreshToken = null;
    this._tokenExpiration = null;
    this._accountId = null;
    this._accountName = null;
    this._basePath = null;
    req.session.accountId = null;
    req.session.accountName = null;
    req.session.basePath = null;
};
/**
 * Find the accountId, accountName, and baseUri that will be used.
 * The dsConfig.targetAccountId may be used to find a specific account (if the user has access to it).
 * Side effect: store in the session
 * @function
 * @param req the request object
 */
DSAuthCodeGrant.prototype.getDefaultAccountInfo = function _getDefaultAccountInfo(req) {
    const targetAccountId = dsConfig.targetAccountId, accounts = req.user.accounts;
    let account = null; // the account we want to use
    // Find the account...
    if (targetAccountId) {
        account = accounts.find(a => a.account_id == targetAccountId);
        if (!account) {
            throw new Error(this.Error_account_not_found);
        }
    }
    else {
        account = accounts.find(a => a.is_default);
    }
    // Save the account information
    this._accountId = account.account_id;
    this._accountName = account.account_name;
    this._basePath = account.base_uri + baseUriSuffix;
    req.session.accountId = this._accountId;
    req.session.accountName = this._accountName;
    req.session.basePath = this._basePath;
    this._dsApiClient.setBasePath(this._basePath);
    console.log(`Using account ${this._accountId}: ${this._accountName}`);
};
/**
 * Returns a promise method, {methodName}_promise, that is a
 * promisfied version of the method parameter.
 * The promise method is created if it doesn't already exist.
 * It is cached via attachment to the parent object.
 * @function
 * @param obj An object that has method methodName
 * @param methodName The string name of the existing method
 * @returns {promise} a promise version of the <tt>methodName</tt>.
 */
DSAuthCodeGrant.prototype.makePromise = function _makePromise(obj, methodName) {
    let promiseName = methodName + "_promise";
    if (!(promiseName in obj)) {
        obj[promiseName] = promisify(obj[methodName]).bind(obj);
    }
    return obj[promiseName];
};
/**
 * This is the key method for the object.
 * It should be called before any API call to DocuSign.
 * It checks that the existing access token can be used.
 * If the existing token is expired or doesn't exist, then
 * a new token will be obtained from DocuSign by telling the
 * user that they must authenticate themself.
 * @function
 * @param integer bufferMin How long must the access token be valid
 * @returns boolean tokenOK
 */
DSAuthCodeGrant.prototype.checkToken = function _checkToken(bufferMin = tokenReplaceMinGet) {
    let noToken = !this._accessToken || !this._tokenExpiration, now = moment(), needToken = noToken || moment(this._tokenExpiration).subtract(bufferMin, "m").isBefore(now);
    if (this._debug) {
        if (noToken) {
            this._debug_log("checkToken: Starting up--need a token");
        }
        if (needToken && !noToken) {
            this._debug_log("checkToken: Replacing old token");
        }
        //if (!needToken) {this._debug_log('checkToken: Using current token')}
    }
    return !needToken;
};
/**
 * Store the example number in session storage so it will be
 * used after the user is authenticated
 * @function
 * @param object req The request object
 * @param string eg The example number that should be started after authentication
 */
DSAuthCodeGrant.prototype.setEg = function _setEg(req, eg) {
    req.session.eg = eg;
};
/**
 * Getter for the object's <tt>dsApiClient</tt>
 * @function
 * @returns {DSApiClient} dsApiClient
 */
DSAuthCodeGrant.prototype.getDSApi = function () {
    return this._dsApiClient;
};
/**
 * Getter for the object's <tt>accessToken</tt>
 * First check its validity via checkToken
 * @function
 * @returns {BearerToken} accessToken
 */
DSAuthCodeGrant.prototype.getAccessToken = function () {
    return this._accessToken;
};
/**
 * Getter for the <tt>accountId</tt>
 * @function
 * @returns {string} accountId
 */
DSAuthCodeGrant.prototype.getAccountId = function () {
    return this._accountId;
};
/**
 * Getter for the <tt>accountName</tt>
 * @function
 * @returns {string} accountName
 */
DSAuthCodeGrant.prototype.getAccountName = function () {
    return this._accountName;
};
/**
 * Getter for the <tt>baseUri</tt>
 * @function
 * @returns {string} baseUri
 */
DSAuthCodeGrant.prototype.getBasePath = function () {
    return this._basePath;
};
/**
 * If in debug mode, prints message to the console
 * @function
 * @param {string} m The message to be printed
 * @private
 */
DSAuthCodeGrant.prototype._debug_log = function (m) {
    if (!this._debug) {
        return;
    }
    console.log(this._debug_prefix + ": " + m);
};
/**
 * If in debug mode, prints message and object to the console
 * @function
 * @param {string} m The message to be printed
 * @param {object} obj The object to be pretty-printed
 * @private
 */
DSAuthCodeGrant.prototype._debug_log_obj = function (m, obj) {
    if (!this._debug) {
        return;
    }
    console.log(this._debug_prefix + ": " + m + "\n" + JSON.stringify(obj, null, 4));
};
module.exports = DSAuthCodeGrant; // SET EXPORTS for the module.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRFNBdXRoQ29kZUdyYW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0RTQXV0aENvZGVHcmFudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7R0FXRztBQUVILFlBQVksQ0FBQztBQUViLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFDOUIsUUFBUSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUNwQyxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUMzQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUM5QixFQUFFLFNBQVMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDL0IsYUFBYSxHQUFHLFVBQVUsRUFDMUIsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBQzFCOzs7O0dBSUc7QUFDSCxJQUFJLGVBQWUsR0FBRyxTQUFTLGdCQUFnQixDQUFDLEdBQUc7SUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQztJQUN2QyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyw4QkFBOEI7SUFDckcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsa0JBQWtCO0lBQzFFLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FB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