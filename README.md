# Airhorn Bot

This is my Discord bot created for use within my own private Discord server, however it is possible to extend this to other servers because my code here is open-source and the registered bot is also public! Some of the functions on it are quite specific so feel free to fork my branch and make it your own.

I wrote this bot because I wanted to continue practicing my Javascript skills and learn NodeJS instead of letting my passion for it go to waste. I use Discord every single day and the people on my server have been asking for quality of life changes to it that Discord itself and other bots don't offer so I figured I'd do it myself.


## Installation
**Node.js 14.0.0 or newer is required.**
Clone this repository and run:
```bash
npm install
```
Once getting all the dependencies situated, you'll need to run the app and require permissions in your discord server. Getting the permissions for your server will require you to launch this URL:

https://discord.com/oauth2/authorize?client_id=811718416150167632&scope=bot

It should prompt you with your discord login and which server you would like to add it to.

Upon getting the bot situated on your server, you run it with:
```bash
node discord.js
```
You can run the server in a background process via nohup and route the logs to a txt file:
```bash
nohup node discord.js >> log.txt 2>&1 &
```

Helpful debugging arguments:
```
node discord.js debug
node discord.js debug cron
```
The `debug` argument will read out all text from the discord server and the `debug cron` arguments will allow you to test out cron jobs by printing every second.

## Important Files
* discord.js
	* the main JS file to run the bot
* commands/
	* exportable modules to your discord.js to execute when called via name and the `!` prefix
* libs/
	* libraries used within the bot that include classes and data structures
	* channels.js
		* the file containing a list of your channels
		* add the IDs of your channels to your `.env` and declare your channel vars in here
	* emojis.js
		* the file containing a list of your emojis
		* add the names of your emojis as shown in the server and declare the emoji variables here
* media/
	* any pictures, videos, etc. of media to be cached for your bot
* scripts/
	* a list of my custom scripts for use in my private server or yours if you find it helpful
* triggers/
	* exportable modules of your text triggers without any commands
	* mine are kept in here to show an example


## References
https://github.com/discordjs/discord.js

https://www.w3schools.com/
