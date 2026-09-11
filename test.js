//

const express = require("express");
require("dotenv").config(); //bring in the .env file

const { MongoClient } = require("mongodb"); //bring in the mongodb database driver

const nodemailer = require("nodemailer"); //bring in nodemailer

const url = process.env.DB_CONNECT; //get the connection string from the .env file

const mongo_client = new MongoClient(url); //create a new instance of the MongoClient
// mongo_client.connect().then(() => {
//   console.log("Connected to MongoDB");
// }).catch((error) => {
//   console.error("Error connecting to MongoDB:", error);
// });


const transporter = nodemailer.createTransport({
  //Configures Nodemailer to route emails through Mailtraps fake SMTP server
  host: "sandbox.smtp.mailtrap.io", //on port 587, using mailtrap inbox credentials, allows you to safely test emails without sending them to real addresses
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "1191a8a9097111",
    pass: "13035ce9eb7346",
  },
});

// create a simple server
const server = express(); // initialize express app

server.use(express.json()); //Middleware

// create the routes
// server.get("/search", (request, response) => {
//   //A saple get route returning a hardcoded 200 ok JSON response
//   response.status(200).send({
//     message: "You are on the about route",
//     data: {
//       username: "James",
//       id: 123,
//     },
//   });
// });
// const mongo_client = new MongoClient(process.env.DB_CONNECT); //Create a new instance of the MongoClient class, passing in the connection string from the .env file


server.get("/search",async (request,response) => {
  try {
    // let name = request.query.name;
    // await mongo_client.connect(); //Connects to the MongoDB sever instance
    const user_email = request.query.email;

    if (!user_email || user_email.trim() === "") {
      return response.status(400).send({
        message: "Email parameter is required",
      });
    }
    // await mongo_client.connect(); //Connects to the MongoDB sever instance
    let result = await mongo_client.db(process.env.BACKEND).collection("users").findOne({ email: user_email });
    return response.status(200).send({
      message: "You have successfully retried mail",
      data: result
    });
  } catch (error) {
    console.error("Error retrieving user:",error);
    return response.status(500).send({ message: "Internal server error" });
  }
});

server.get("/find", async (request, response) => {
  let name = request.query.name;
  let user_email = request.query.email;

  let result = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ email: user_email });
  response.status(200).send({
    message: "You have successfully retried mail",
    data: result,
  });
});


server.post("/login", async (request, response) => {
  //Handles user login request
  let fullname = request.body.fullname; //Extracts submitted credentials from the request body.
  let username = request.body.username;
  let password = request.body.password;

  await mongo_client.connect(); //Connects to the MongoDB sever instance

  let result = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .insertOne({
      //Inserts the submitted user credentials into the users collection
      fullname: fullname,
      username: username,
      password: password,
    });

  console.log(result);

  response.status(200).send({
    //Sends back a 200 ok JSON response confirming the user data was stored
    message: "User logged in",
    data: {
      fullname: fullname,
    },
  });
});

server.get("/verify", async (request, response) => {
  //Handles the link a user clicks in their verification email
  let user_email_to_verify = request.query.email; //Retrieves the target emil passed in the url query string

  // check this email
  await mongo_client.connect();

  const find_user = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ email: user_email_to_verify }); //Searches the database for a user with that email

  console.log(find_user);

  if (find_user) {
    //If user exist and

    if (find_user.is_email_verified == false) {
      await mongo_client
        .db(process.env.BACKEND)
        .collection("users")
        .updateOne(
          { email: user_email_to_verify },
          { $set: { is_email_verified: true } },
        ); //updates their status in mongodb to verify and responds with 201

      response.status(201).send({
        message: "Email Verified",
        code: "success",
        data: {
          email: user_email_to_verify,
        },
      });
    } else {
      response.status(200).send({
        //responds with this if user exists and already verified
        message: "Email already verified",
        code: "error",
        data: {
          email: user_email_to_verify,
        },
      });
    }
  } else {
    response.status(400).send({
      //responds with this if user does not exist
      message: "Email does not exist",
      code: "error",
      data: {
        email: user_email_to_verify,
      },
    });
  }
});

server.post("/register", async (request, response) => {
  //Handles new user signup and registration
  let firstname = request.body.firstname;
  let lastname = request.body.lastname;
  let email = request.body.email;
  let password = request.body.password;

  if (
    firstname.length > 0 && //Ensures all parameters are all non empty strings
    lastname.length > 0 &&
    email.length > 0 &&
    password.length > 0
  ) {
    const user = {
      firstname,
      lastname,
      email,
      password,
      is_email_verified: false, //Prepares the user object, defaulting to this, meaning until they verify user verification should be defaulted to false
    };

    //1.  check that the user exists already..

    //2. register the user
    await mongo_client.connect();

    const register_feedback = await mongo_client //saves the new user into the backend-db database inside the users collectio
      .db(process.env.BACKEND)
      .collection("users")
      .insertOne(user);
    if (register_feedback) {
      const verification_link = `http://localhost:3000/verify?email=${email}`; //Constructs a unique verification url pointing to that

      //3.  send a verification email to the user
      const info = await transporter.sendMail({
        //Uses the mail trap transporter configured earlier to send an HTML email containing the verification link to the registered user inbox
        from: '"Backend Team" <team@example.com>', // sender address
        to: email, // list of recipients
        subject: "Please Verify Your Account", // subject line
        text: "Verify your account", // plain text body
        html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email Address</title>
  <style type="text/css">
    /* RESET STYLES */
    body, table, td, p, a, div, span {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    body {
      background-color: #f6f9fc;
      padding: 20px 0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    /* OUTER CONTAINER */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    /* HEADER */
    .header {
      background-color: #4f46e5;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }
    /* BODY */
    .body-content {
      padding: 40px 32px 32px;
    }
    .body-content p {
      color: #1a202c;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .body-content .greeting {
      font-size: 18px;
      font-weight: 600;
    }
    /* VERIFICATION BUTTON */
    .btn-primary {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 40px;
      border-radius: 50px;
      margin: 16px 0 24px;
      box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
      transition: background-color 0.2s ease;
      text-align: center;
    }
    .btn-primary:hover {
      background-color: #4338ca;
    }
    /* FALLBACK LINK (for plain text) */
    .fallback-link {
      word-break: break-all;
      color: #4f46e5;
      font-size: 14px;
      background-color: #f7fafc;
      padding: 12px 16px;
      border-radius: 6px;
      display: block;
      margin: 16px 0 24px;
      border: 1px solid #e2e8f0;
    }
    .fallback-link a {
      color: #4f46e5;
      text-decoration: none;
    }
    /* DIVIDER */
    .divider {
      border-top: 1px solid #e2e8f0;
      margin: 32px 0 24px;
    }
    /* FOOTER */
    .footer {
      padding: 0 32px 32px;
      text-align: center;
    }
    .footer p {
      color: #718096;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    /* MOBILE RESPONSIVE */
    @media screen and (max-width: 480px) {
      .body-content {
        padding: 28px 20px;
      }
      .btn-primary {
        display: block;
        padding: 16px 20px;
        font-size: 17px;
      }
      .header h1 {
        font-size: 20px;
      }
      .fallback-link {
        font-size: 13px;
      }
    }
  </style>
</head>
<body>

  <!-- EMAIL WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f6f9fc;">
    <tr>
      <td align="center" style="padding:20px 16px;">
        <!-- MAIN CONTAINER -->
        <table class="email-container" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:8px;">

          <!-- HEADER -->
          <tr>
            <td class="header" style="background-color:#4f46e5; padding:32px 24px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; margin:0;">Verify Your Email</h1>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td class="body-content" style="padding:40px 32px 16px;">
              <p class="greeting" style="font-size:18px; font-weight:600; color:#1a202c; margin-bottom:12px;">Hello ${firstname},</p>
              <p style="color:#1a202c; font-size:16px; margin-bottom:16px;">
                Thanks for signing up! Please confirm your email address by clicking the button below. This helps us keep your account secure.
              </p>

              <!-- BUTTON (primary CTA) -->
              <div style="text-align:center;">
                <a href="${verification_link}" class="btn-primary" style="display:inline-block; background-color:#4f46e5; color:#ffffff !important; font-size:18px; font-weight:600; text-decoration:none; padding:14px 40px; border-radius:50px; margin:16px 0 24px; box-shadow:0 4px 6px rgba(79,70,229,0.2); text-align:center;">
                  ✓ Verify Email
                </a>
              </div>

              <!-- FALLBACK LINK (if button doesn't render) -->
              <p style="color:#4a5568; font-size:14px; margin:8px 0 4px;">
                Or copy and paste this link into your browser:
              </p>
              <div class="fallback-link" style="word-break:break-all; color:#4f46e5; font-size:14px; background-color:#f7fafc; padding:12px 16px; border-radius:6px; margin:8px 0 24px; border:1px solid #e2e8f0;">
                <a href="${verification_link}" style="color:#4f46e5; text-decoration:none;">{{VERIFICATION_LINK}}</a>
              </div>

              <!-- EXPIRY NOTE -->
              <p style="color:#718096; font-size:14px; margin-top:8px;">
                ⏱️ This link expires in <strong>24 hours</strong> for your security.
              </p>

              <!-- DIVIDER -->
              <div class="divider" style="border-top:1px solid #e2e8f0; margin:32px 0 20px;"></div>

              <!-- SUPPORT TEXT -->
              <p style="color:#4a5568; font-size:14px; margin-bottom:4px;">
                Didn’t request this? You can safely ignore this email.
              </p>
              <p style="color:#4a5568; font-size:14px;">
                Need help? <a href="mailto:support@yourdomain.com" style="color:#4f46e5; text-decoration:none;">support@yourdomain.com</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer" style="padding:0 32px 32px; text-align:center;">
              <p style="color:#718096; font-size:13px; margin-bottom:4px;">
                &copy; 2026 Your Company Name. All rights reserved.
              </p>
              <p style="color:#a0aec0; font-size:12px;">
                123 Main Street, City, Country
              </p>
            </td>
          </tr>

        </table>
        <!-- END MAIN CONTAINER -->
      </td>
    </tr>
  </table>

</body>
</html>
                                `,
      });

      response.status(201).send({
        //sends back a 201 success response
        message: "User account registered successfully!",
        code: "success",
        data: register_feedback,
      });
    } else {
      response.status(500).send({
        // or a 500 server error if insertion fails
        message: "User could not be registered",
        code: "error",
        data: null,
      });
    }
  }
});

// make the server listen for request
server.listen(process.env.PORT, () =>
  //binds and listen for incoming connections on the port specified in my .env file
  console.log(
    `Server is listening on http://${process.env.HOSTNAME}:${process.env.PORT}`,
  ),
);

