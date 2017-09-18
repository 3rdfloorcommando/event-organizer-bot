var builder = require('botbuilder');
require('dotenv-extended').load();
var request = require('request');

var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhIQnlLVS0wRHFBcU1aaDZaRlBkMlZXYU90ZyIsImtpZCI6IkhIQnlLVS0wRHFBcU1aaDZaRlBkMlZXYU90ZyJ9.eyJhdWQiOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2Y4NDllMmY0LTdmNWUtNDljMy1iM2U0LWY0NDJhYWE2Y2E0My8iLCJpYXQiOjE1MDU3NTEwNDIsIm5iZiI6MTUwNTc1MTA0MiwiZXhwIjoxNTA1NzU0OTQyLCJhY3IiOiIxIiwiYWlvIjoiWTJWZ1lMaXArcW9uS0VJN21FdnZUWUNuUHRzSjE2aFV6dnk2MlFLSFFpVkRmNm10TEFJQSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiI3NTNlNWI1My1hNzViLTQ2YmMtOGZjZi1lMDMzMTE4NjgwNmIiLCJhcHBpZGFjciI6IjEiLCJlX2V4cCI6MjYyODAwLCJlbmZwb2xpZHMiOltdLCJmYW1pbHlfbmFtZSI6IlBhbGxld2VsYSIsImdpdmVuX25hbWUiOiJOdXdhbiIsImlwYWRkciI6IjQzLjI1MC4yNDIuMjMwIiwibmFtZSI6Ik51d2FuIFBhbGxld2VsYSIsIm9pZCI6ImRkNmIwMjVjLWEyMTYtNDYzNC1iZWM4LTE2NWMxMzIyNWVjZiIsInB1aWQiOiIxMDAzN0ZGRTlDMzIyQjdFIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBNYWlsLlJlYWQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI3ZXo5aUd0ZEFJMWhabmlPdkNmZm9QdVRBXzQwd0owMXU4WGx6SnYzeHZZIiwidGlkIjoiZjg0OWUyZjQtN2Y1ZS00OWMzLWIzZTQtZjQ0MmFhYTZjYTQzIiwidW5pcXVlX25hbWUiOiJOdXdhbi5QYWxsZXdlbGFAc3lzY29sYWJzLmNvbSIsInVwbiI6Ik51d2FuLlBhbGxld2VsYUBzeXNjb2xhYnMuY29tIiwidmVyIjoiMS4wIn0.nFFUb-Xdu_BR8cM-qjWK0tiWnnptSwfqxZQ6cOFMxedRMBKIB5RCQwXX2fx4OC_n80CxWXwfrOeuGUseDrbyDKLhD-e4xWJ299i5oldvKEV0kS2hBRi5XTYM2QKYGlT33g_vMqIzmuc2JJEzqkhGXmed8A8oUtwXoM3QjdfkZopRnY-sygGFCTOZzOcu5GAtsoqE7Xt9N6hnWgaBDamEo_9aVnH9t_FP6U_qO_6Cl4yvl_kEig099mDneHDO652ucwyDKxRbMC7k0w_bs5jYQbcrsdbCIBkeITMblz6HaH96H41jJWkAfSpcQ5VRFsHrZyhJAnDx4F970wfq6phUoQ';
exports.initialStep = function (session, args, next) {
    session.send("Great!!!!");
    next();
};

exports.eventSubject =[
    function (session) {
        builder.Prompts.text(session, 'What is the event title?');
    },
    function (session, results, next) {
        session.userData.eventSubject = results.response;
        next();
    }];

exports.eventDescription =[
    function (session) {
        builder.Prompts.text(session, 'Can you give a small description about the event so the others can understand the purpose more?');
    },
    function (session, results, next) {
        session.userData.eventDescription = results.response;
        next();
    }];

exports.eventStartDateTime =[
    function (session) {

        builder.Prompts.time(session, 'What is the start time of the event?');
    },
    function (session, results,next) {
        //session.userData.startTime = builder.EntityRecognizer.resolveTime([results.response]);
        session.userData.startTime = "starttime";
        next();
    }];

exports.eventEndDateTime =[
    function (session) {
        builder.Prompts.time(session, 'What is the end time of the event?');
    },
    function (session, results,next) {
        //session.userData.endTime = builder.EntityRecognizer.resolveTime([results.response]);
        session.userData.endTime = 'endtime';
        next();
    }];

exports.sendEventCreateRequest =[
    function (session) {
        request({
            url: 'https://outlook.office.com/api/v2.0/me/events',
            method: 'POST',
                auth: {
                    'bearer': token
                },
                headers: [
                    {
                        name: 'Content-Type',
                        value: 'application/json'
                    }
                ],
                json: true,   // <--Very important!!!
                body: {
            "Subject": "rrrr",
            "Body": {
                "ContentType": "HTML",
                "Content": "dddd"
            }
            ,
            "Start": {
                "DateTime": "2017-10-01T18:05:00",
                "TimeZone": "Pacific Standard Time"
            }
            ,
            "End": {
                "DateTime": "2017-10-01T19:00:00",
                "TimeZone": "Pacific Standard Time"
            }
            ,
            "Attendees": [
                {
                    "EmailAddress": {
                        "Address": "nwnpallewelaentc@gmail.com"
                    }, "Type": "Required"
                }
            ]
        }
                //postData:
            },
            function (error, response, body) {


                if (!error && response.statusCode == 201) {
                    var info = JSON.parse(body);
                    console.log(info);


                } else {
                    console.log(response.statusCode);

                    session.send(error);
                }
            });
    }];





