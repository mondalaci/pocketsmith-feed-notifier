#!/usr/bin/env node

import axios from 'axios';
import moment from 'moment';
import {developerKey} from './config.mjs';

axios.defaults.headers.common['X-Developer-Key'] = developerKey;

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

function getTimestamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function log(message) {
    const timestamp = getTimestamp();
    console.log(`${timestamp} ${message}`);
}

async function get(path) {
    return (await axios.get(`https://api.pocketsmith.com/v2/${path}`)).data;
}

const me = await get('me');
const userId = me.id;

while (true) {
    const accounts = await get(`users/${userId}/transaction_accounts`);
    const onlineAccounts = accounts.filter(account => !account.offline);
    for (const account of onlineAccounts) {
        const date = new Date() - new Date(account.updated_at);
        log(`${account.name} | ${account.updated_at} | ${Math.round(date/1000/60/60)}h ago`);
    };
    await delay(60*60*1000);
}
