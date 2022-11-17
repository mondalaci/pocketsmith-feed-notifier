#!/usr/bin/env node

import util from 'node:util';
import axios from 'axios';
import aws from 'aws-sdk';
import nodemailer from 'nodemailer';
import {config} from './config.mjs';

aws.config.update(config.aws);
const ses = new aws.SES();
const transporter = nodemailer.createTransport({SES: ses});
const sendMail = util.promisify(transporter.sendMail).bind(transporter);

axios.defaults.headers.common['X-Developer-Key'] = config.pocketsmithDeveloperKey;

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

async function get(path) {
    return (await axios.get(`https://api.pocketsmith.com/v2/${path}`)).data;
}

const me = await get('me');
const userId = me.id;

while (true) {
    const accounts = await get(`users/${userId}/transaction_accounts`);
    const onlineAccounts = accounts.filter(account => !account.offline);
    let text = '';
    for (const account of onlineAccounts) {
        const updatedIntervalMs = new Date() - new Date(account.updated_at);
        const updatedHoursAgo = Math.round(updatedIntervalMs/1000/60/60);
        if (updatedHoursAgo > config.updatedHoursLimit) {
            text += `${account.name} updated ${updatedHoursAgo}h ago\n`;
        }
    }

    if (text) {
        sendMail({
            from: config.email.from,
            to: config.email.to,
            subject: 'PocketSmith feed is not updating',
            text,
        });
    }

    await delay(60*60*1000);
}
