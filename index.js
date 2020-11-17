const { createElement, Fragment } = require('react');

module.exports.ghost = createElement;

module.exports.ghosts = createElement.bind(null, Fragment, null);
