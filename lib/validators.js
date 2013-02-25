"use strict";

var _ = require('underscore');
var helpers = require('./helpers');

function isDef(args) {
    return args.length >= 2 && _.isFunction(args[1]);
}

function isReturn(str) {
    return _.isString(str) && _.isString(helpers.pickReturnVar(str));
}

function isKeywordName(str) {
    return _.isString(str) && !_.isEmpty(str) && !isReturn(str);
}

function isSingleRun(runCommand) {
    if(runCommand.length === 1) {
        return isKeywordName(runCommand[0]);
    }

    if(runCommand.length === 2) {
        return _.isArray(runCommand[1]) || isReturn(runCommand[1]); 
    }

    if(runCommand.length === 3) {
        return _.isArray(runCommand[1]) && isReturn(runCommand[2]);
    }

    throw new Error("Unknown exception in isSingleRun " + JSON.stringify(runCommand));
}

function isRun(args) {
    var grouped = helpers.splitBy(args, isKeywordName);

    if(!_.initial(grouped).every(isSingleRun)) {
        return false;
    }

    var lastGroup = _.last(grouped);
    if(helpers.isPlainObject(_.last(lastGroup))) {
        lastGroup = _.initial(lastGroup);
    }

    return isSingleRun(lastGroup);
}

function isLib(args) {
    return args.length === 2 && isKeywordName(args[0]) && _.isFunction(args[1]);
}

function isSuite(args) {
    return args.length === 1 && helpers.isPlainObject(args[0]);
}

var validators = Object.freeze({
    isSuite: isSuite,
    isDef: isDef,
    isLib: isLib,
    isRun: isRun,
    isReturn: isReturn
});

module.exports = validators;