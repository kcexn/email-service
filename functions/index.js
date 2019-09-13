const functions = require('firebase-functions');
const nodemailer = require ('nodemailer');
const { google } = require('googleapis');
const request = require('request-promise');
const cors = require('cors')({origin: true});

exports.sendMail = functions.https.onRequest((request,response) => {
  cors(request,response,() => {});
  if (request.method === "POST") {
    const credentials = require('./credentials.json');
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
    		credentials.web.client_id, // Client ID
    		credentials.web.client_secret, // Client Secret
    		credentials.web.redirect_uris[1] // Redirect URL
    );
    oauth2Client.setCredentials({
    		refresh_token: credentials.refresh_token
    });
    const accessToken = oauth2Client.getAccessToken()
    
    const smtpTransport = nodemailer.createTransport({
    		service: "gmail",
    		auth: {
    		  type: "OAuth2",
    		  user: "068ant@gmail.com",
    		  clientId: credentials.web.client_id,
    		  clientSecret: credentials.web.client_secret, 
    		  refreshToken: credentials.refresh_token,
    		  accessToken: accessToken
    		}
    });
    
    const mailOptions = {
    		from: request.body.Name + " " + "<" + request.body.Email + ">",
    		to: "068ant@gmail.com",
    		subject: "NodeJS email with OAUTH2",
    		generateTextFromHTML: true,
    		html: "<h1>" + request.body.Name + "</h1>" + " " 
			+ "<p> has sent you: " + request.body.Body + "</p>" + " "
			+ "<p> from: " + request.body.Email
    }
    
    smtpTransport.sendMail(mailOptions, (error, response) => {
    		error ? response.status(500) : response.status(200);
    		smtpTransport.close();
    });
    response.send("OK");
  }else if ( request.method !== "OPTIONS" ) {
	response.status(405)
    response.setHeader("Allow", "POST");
    response.send();
  }
});
  
  
  
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// 
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
