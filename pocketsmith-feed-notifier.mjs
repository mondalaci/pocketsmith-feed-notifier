#!/usr/bin/env node

import axios from 'axios';
import {developerKey} from './config.mjs';

axios.defaults.headers.common['X-Developer-Key'] = developerKey;

async function get(path) {
    return (await axios.get(`https://api.pocketsmith.com/v2/${path}`)).data;
}

const me = await get('me');
const userId = me.id;
const accounts = await get(`users/${userId}/transaction_accounts`);
const outdatedOnlineAccounts = accounts.filter(account => {
    const date = new Date() - new Date(account.updated_at);
    console.log(account.name, account.offline, account.updated_at, date/1000/60/60)
    return !account.offline;
});
