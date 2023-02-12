#!/usr/bin/env node

import {readFile} from 'node:fs/promises';
import util from 'node:util';
import axios from 'axios';
import aws from 'aws-sdk';
import nodemailer from 'nodemailer';

const configFilename = process.argv.length > 2 ? process.argv[2] : 'config.json';
const config = JSON.parse(await readFile(configFilename));

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

    if (text && config.emailComment) {
        text += `\n${config.emailComment}`;
    }

    if (text) {
        sendMail({
            from: config.email.from,
            to: config.email.to,
            subject: `PocketSmith ${config.accountName} feed is not updating`.replace('  ', ' '),
            text,
        });
    }

    await delay(24*60*60*1000);
}
