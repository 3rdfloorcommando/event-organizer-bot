// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder');
var http = require('http');
var request = require('request');

var eventOrganizer = require('./dialogs/event-organizer');

var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhIQnlLVS0wRHFBcU1aaDZaRlBkMlZXYU90ZyIsImtpZCI6IkhIQnlLVS0wRHFBcU1aaDZaRlBkMlZXYU90ZyJ9.eyJhdWQiOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2Y4NDllMmY0LTdmNWUtNDljMy1iM2U0LWY0NDJhYWE2Y2E0My8iLCJpYXQiOjE1MDU3NTEwNDIsIm5iZiI6MTUwNTc1MTA0MiwiZXhwIjoxNTA1NzU0OTQyLCJhY3IiOiIxIiwiYWlvIjoiWTJWZ1lMaXArcW9uS0VJN21FdnZUWUNuUHRzSjE2aFV6dnk2MlFLSFFpVkRmNm10TEFJQSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI3NTNlNWI1My1hNzViLTQ2YmMtOGZjZi1lMDMzMTE4NjgwNmIiLCJhcHBpZGFjciI6IjEiLCJlX2V4cCI6MjYyODAwLCJlbmZwb2xpZHMiOltdLCJmYW1pbHlfbmFtZSI6IlBhbGxld2VsYSIsImdpdmVuX25hbWUiOiJOdXdhbiIsImlwYWRkciI6IjQzLjI1MC4yNDIuMjMwIiwibmFtZSI6Ik51d2FuIFBhbGxld2VsYSIsIm9pZCI6ImRkNmIwMjVjLWEyMTYtNDYzNC1iZWM4LTE2NWMxMzIyNWVjZiIsInB1aWQiOiIxMDAzN0ZGRTlDMzIyQjdFIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBNYWlsLlJlYWQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI3ZXo5aUd0ZEFJMWhabmlPdkNmZm9QdVRBXzQwd0owMXU4WGx6SnYzeHZZIiwidGlkIjoiZjg0OWUyZjQtN2Y1ZS00OWMzLWIzZTQtZjQ0MmFhYTZjYTQzIiwidW5pcXVlX25hbWUiOiJOdXdhbi5QYWxsZXdlbGFAc3lzY29sYWJzLmNvbSIsInVwbiI6Ik51d2FuLlBhbGxld2VsYUBzeXNjb2xhYnMuY29tIiwidmVyIjoiMS4wIn0.nFFUb-Xdu_BR8cM-qjWK0tiWnnptSwfqxZQ6cOFMxedRMBKIB5RCQwXX2fx4OC_n80CxWXwfrOeuGUseDrbyDKLhD-e4xWJ299i5oldvKEV0kS2hBRi5XTYM2QKYGlT33g_vMqIzmuc2JJEzqkhGXmed8A8oUtwXoM3QjdfkZopRnY-sygGFCTOZzOcu5GAtsoqE7Xt9N6hnWgaBDamEo_9aVnH9t_FP6U_qO_6Cl4yvl_kEig099mDneHDO652ucwyDKxRbMC7k0w_bs5jYQbcrsdbCIBkeITMblz6HaH96H41jJWkAfSpcQ5VRFsHrZyhJAnDx4F970wfq6phUoQ';

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

var tasksList = {
    "task : Check Events": {
        intent: 'checkEvents'
    },
    "task : Organize a Meeting": {
        intent: 'organizeMeeting'
    }
};

// Create bot dialogs
bot.dialog('/', function (session,args) {
    requestMessageToSelectATask(session);
});

bot.dialog('/chooseTaskType', [
    function(session, args) {
        var report = tasksList[session.message.text];
        session.beginDialog(report.intent);
    }
]).triggerAction({ matches: /(task)/i });


bot.dialog('organizeMeeting',[
    eventOrganizer.initialStep,
    eventOrganizer.eventSubject[0],
    eventOrganizer.eventSubject[1],
    eventOrganizer.eventDescription[0],
    eventOrganizer.eventDescription[1],
    eventOrganizer.eventStartDateTime[0],
    eventOrganizer.eventStartDateTime[1],
    eventOrganizer.eventEndDateTime[0],
    eventOrganizer.eventEndDateTime[1],
    eventOrganizer.sendEventCreateRequest[0]
]).triggerAction({
    matches: 'organizeMeeting'
});



bot.dialog('checkEvents',function (session) {
    session.send("Following are the events you have...");
    request.get('https://outlook.office.com/api/v2.0/me/events?$select=Subject,Organizer,Start,End', {
        'auth': {
            'bearer': token
        }
    },function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            var cards=getEventsAsCards(session,info.value);
            var card=new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            session.send(card).endDialog();

        } else {
            session.send(error);
        }
    });
}).triggerAction({
    matches: 'checkEvents'
});

/**
 * Helper Functions
 */
function requestMessageToSelectATask(session) {
    var userName = "";
    request.get('https://outlook.office.com/api/v2.0/me/', {
        'auth': {
            'bearer': token
        }
    },function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            userName = info.DisplayName;
            session.send("Hello %s, What do you need to do?", userName);
            var cards = getTasksAsCards();
            var tasksOptions = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            session.send(tasksOptions).endDialog();
        } else {
            session.send("Error : "+error);
        }
    });
}

function getTasksAsCards(session) {
    return [
        new builder.HeroCard(session)
            .title('Check Events')
            .text('Choose this option if you need to check your plans for today.')
            /* .images([
             builder.CardImage.create(session, 'https://github.com/smadurange/mha-img/blob/master/traffic-violation-2.jpg')
             ]) */
            .buttons([
                builder.CardAction.imBack(session, 'task : Check Events', 'task : Check Events')
            ]),
        new builder.HeroCard(session)
            .title('Organize a Meeting')
            .text('Choose this option if you want to organize a meeting.')
            /* .images([
             builder.CardImage.create(session, 'https://github.com/smadurange/mha-img/blob/master/lost-property.jpg')
             ]) */
            .buttons([
                builder.CardAction.imBack(session, 'task : Organize a Meeting', 'task : Organize a Meeting')
            ])
    ];
}

function getEventsAsCards(session,events) {
    var cards = [];

    events.forEach(function(value){
        //console.log(value.Subject+'gggggg'+value.Start.DateTime);
        cards.push(new builder.HeroCard(session)
            .title(value.Subject)
            .text('Start time : %s  \n  End time : %s  \n  Organizer : %s ',value.Start.DateTime,value.End.DateTime,value.Organizer.EmailAddress.Name)
            );
    });
    return cards;
}
