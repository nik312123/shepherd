/* eslint-disable no-console */

import {register} from 'register-service-worker';

if(process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready: function() {},
        registered: function() {},
        cached: function() {},
        updatefound: function() {},
        updated: function() {
            window.location.reload();
        },
        offline: function() {},
        error: function(error) {
            console.error('Error during service worker registration:', error);
        }
    });
}
