# PocketSmith feed notifier

PocketSmith doesn't notify you when some of your feeds go out of sync. `pocketsmith-feed-notifier.mjs` to the rescue! It checks your feeds in every 24 hours, and emails you about the ones to be resynced.

Copy `config.sample.json` as `config.json` and fill out its fields. You need AWS access for email sending.

I suggest running this script on a server via [PM2](https://pm2.keymetrics.io/).
