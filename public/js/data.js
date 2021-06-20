// -*- coding: utf-8 -*-

/**
 * * This file contains all application data
 */

var CURRENT_PAGE = (window.location.pathname).split("/").pop();
if (CURRENT_PAGE.split('.')[1] != null) CURRENT_PAGE = CURRENT_PAGE.split('.')[0];

// Create inital Debugger object (Will be saved in singleton design pattern)
const DEBUGGER = new Debugger(CURRENT_PAGE, Debugger.DEFAULT_SETTINGS);
Debugger.info(`Currently in > ${CURRENT_PAGE} < page`);

// * All components that matches given page
const COMPONENTS = {
    '': ['MenuComponent'],
    'index': ['MenuComponent'],
    'features': ['FooterComponent', 'MenuComponent'],
    'about': ['FooterComponent', 'MenuComponent'],
    'faq': ['FooterComponent', 'MenuComponent'],

    // Features
    'earth': ['FooterComponent', 'MenuComponent'],
    'nearby': ['FooterComponent', 'MenuComponent'],
};

// * All usefull styles with their keys
const MAP_DATA = {
    'streets': {
        key: 'rQ7gZ2MALoTqCaR6vhTJ',
        format: '.png',
    },

    'hybrid': {
        key: 'rQ7gZ2MALoTqCaR6vhTJ',
        format: '.jpg',
    }
};


// Returns all needed components for a given page
function getComponents(page) {
    return COMPONENTS[page] || '';
}

// Returns all pages for give component
function getComponentPages(component) {
    let pages = [];

    Object.keys(COMPONENTS).forEach(comp => {
        if (COMPONENTS[comp].includes(component)) pages.push(comp);
    });

    return pages;
}

function getMapData(style) {
    return MAP_DATA[style];
}

