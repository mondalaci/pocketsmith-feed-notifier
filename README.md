# PocketSmith feed notifier

PocketSmith doesn't notify you when some of your feeds go out of sync. `pocketsmith-feed-notifier.mjs` to the rescue! It checks your feeds and emails you about the ones to be resynced.

Copy `config.sample.json` as `config.json` and fill out its fields. You need AWS access for email sending.

Run it on a schedule via cron; see the snippet at the top of `pocketsmith-feed-notifier.mjs`.
