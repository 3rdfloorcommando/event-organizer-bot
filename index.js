// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder');
var http = require('http');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3978, function()
{
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: 'b4f174b0-2a14-413a-a17d-365683c780fd', appPassword: '4iv3kgfGvEhMEy1JwkJKfCe' });
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
bot.dialog('/', function (session) {
    session.send("Hello World");
});
