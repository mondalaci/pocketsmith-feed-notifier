# PocketSmith feed notifier

Pocketsmith doesn't notify you when some of your feeds go out of sync. This script does! It checks your feeds in every 24 hours and emails you about the affected ones.

Copy config.sample.json as config.json and fill out its fields. You need AWS access for email sending.

I suggest running this script on a server via PM2.
