// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require("express");
// const session = require("express-session")
// require("dotenv").config(); // Bring in the .env file
// const bcrypt = require("bcrypt")


// const { MongoClient } = require("mongodb"); // Bring in the mongodb database driver
// const nodemailer = require("nodemailer"); // Bring in nodemailer

// const url = process.env.DB_CONNECT; // Get the connection string from .env
// const mongo_client = new MongoClient(url); // Create a new instance of MongoClient

// const transporter = nodemailer.createTransport({
//   // Configures Nodemailer to route emails through Mailtrap's fake SMTP server
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   secure: false, // Use STARTTLS
//   auth: {
//     user: "1191a8a9097111",
//     pass: "13035ce9eb7346",
//   },
// });

// // Initialize express app
// //const server = express();
// //server.use(express.json()); // Middleware for JSON body parsing

// // create a simple server !!!!!
// const server = express();


// server.use(session({
//   secret: "this is a simple1234567sec",
//   resave: false,
//   saveUninitialized: true,
//   cookie: function(req) {
//     var match = req.url.match(/^\/([^/]+)/);
//     return {
//       path: match ? '/' + match[1] : '/',
//       httpOnly: true,
//       secure: req.secure || false,
//       maxAge: 60000
//     }
//   }
// }))

// server.use(express.json()); // Middleware for JSON body parsing


// // ==================== ROUTES ==================== //

// server.get("/search",async (request,response) => {
  
//   let user_email = request.query.email;

//   // if (!user_email || user_email.trim() === "") {
//   //   return response.status(400).send({
//   //     message: "Email parameter is required",
//   //   });
//   // }

//   let result = await mongo_client.db(process.env.BACKEND).collection("users").findOne({ email: user_email })
//    response.status(200).send({
//     message: "You have successfully retrieved mail",
//     data: result,
//   });
// });

// server.get("/find", async (request, response) => {
//   let user_email = request.query.email;

//   let result = await mongo_client
//     .db(process.env.BACKEND)
//     .collection("users")
//     .findOne({ email: user_email });

//   response.status(200).send({
//     message: "You have successfully retrieved mail",
//     data: result,
//   });
// });

// //TO LOGIN
// // server.post("/login", async (request, response) => {
// //   let fullname = request.body.fullname;
// //   let username = request.body.username;
// //   let password = request.body.password;


//   // let result = await mongo_client
//   //   .db(process.env.BACKEND)
//   //   .collection("users")
//   //   .insertOne({
//   //     fullname: fullname,
//   //     username: username,
//   //     password: password,
//   //   });

//   // console.log(result);

//   // response.status(200).send({
//   //   message: "User logged in",
//   //   data: {
//   //     fullname: fullname,
//   //   },
//   // });

// //LEARNING LOGIN SESSIONS, WE WOULD BE USING USERNAME AND PASSWORD...AFTER LEARNING THIS, I CAN COMMENT IT OUT
//   server.post("/login", async (request, response) => {
  
//   let username = request.body.username;
//     let password = request.body.password;
    
//     // check the username if it exists
//   let result = await mongo_client.db(process.env.BACKEND).collection("users").findOne({ email: email });

//   if(result){
//       // the user/account exists
//       // validate password
//       response.send({
//         message: "Login works"
//       })

//   }else{
//     // the user/acscount does not exists
//     response.status(404).send({
//       message: "Invalid account. Email does not exist",
//       code: 'error',
//       data: null
//     })

//   }

// })

// server.get("/verify", async (request, response) => {
//   let user_email_to_verify = request.query.email;

//   const find_user = await mongo_client
//     .db(process.env.BACKEND)
//     .collection("users")
//     .findOne({ email: user_email_to_verify });

//   console.log(find_user);

//   if (find_user) {
//     if (find_user.is_email_verified == false) {
//       await mongo_client
//         .db(process.env.BACKEND)
//         .collection("users")
//         .updateOne(
//           { email: user_email_to_verify },
//           { $set: { is_email_verified: true } },
//         );

//       response.status(201).send({
//         message: "Email Verified",
//         code: "success",
//         data: {
//           email: user_email_to_verify,
//         },
//       });
//     } else {
//       response.status(200).send({
//         message: "Email already verified",
//         code: "error",
//         data: {
//           email: user_email_to_verify,
//         },
//       });
//     }
//   } else {
//     response.status(400).send({
//       message: "Email does not exist",
//       code: "error",
//       data: {
//         email: user_email_to_verify,
//       },
//     });
//   }
// });

// server.post("/register", async (request, response) => {
//   let firstname = request.body.firstname;
//   let lastname = request.body.lastname;
//   let email = request.body.email;
//   let password = request.body.password;

//  if(firstname?.length > 0 && lastname?.length > 0 && email?.length > 0 && password?.length > 0){

//         let hashed_password = bcrypt.hashSync(password, 10)
//         const user = {
  
//    const user = {
//             firstname: firstname,
//             lastname: lastname,
//             email,
//             password: hashed_password,
//             is_email_verified: false
//           }
          
//           //1.  check that the user exists already..

//         try{
//                 //2. register the user
//         await mongo_client.connect();

//     const register_feedback = await mongo_client
//       .db(process.env.BACKEND)
//       .collection("users")
//       .insertOne(user);

//     if (register_feedback) {
//       const verification_link = `http://localhost:3000/verify?email=${email}`;

//       await transporter.sendMail({
//         from: '"Backend Team" <team@example.com>',
//         to: email,
//         subject: "Please Verify Your Account",
//         text: `Verify your account by visiting: ${verification_link}`,
//         html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Verify Your Email Address</title>
//   <style type="text/css">
//     body, table, td, p, a {
//       margin: 0;
//       padding: 0;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//       line-height: 1.5;
//     }
//     body { background-color: #f6f9fc; padding: 20px 0; }
//     .email-container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff;
//       border-radius: 8px;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.06);
//     }
//     .header {
//       background-color: #4f46e5;
//       padding: 32px 24px;
//       text-align: center;
//     }
//     .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; }
//     .body-content { padding: 40px 32px 32px; }
//     .btn-primary {
//       display: inline-block;
//       background-color: #4f46e5;
//       color: #ffffff !important;
//       font-size: 18px;
//       font-weight: 600;
//       text-decoration: none;
//       padding: 14px 40px;
//       border-radius: 50px;
//       margin: 16px 0 24px;
//     }
//     .fallback-link {
//       word-break: break-all;
//       color: #4f46e5;
//       background-color: #f7fafc;
//       padding: 12px 16px;
//       border-radius: 6px;
//       border: 1px solid #e2e8f0;
//     }
//   </style>
// </head>
// <body>
//   <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f6f9fc;">
//     <tr>
//       <td align="center" style="padding:20px 16px;">
//         <table class="email-container" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; background:#ffffff; border-radius:8px;">
//           <tr>
//             <td class="header">
//               <h1>Verify Your Email</h1>
//             </td>
//           </tr>
//           <tr>
//             <td class="body-content">
//               <p style="font-size:18px; font-weight:600; margin-bottom:12px;">Hello ${firstname},</p>
//               <p style="font-size:16px; margin-bottom:16px;">
//                 Thanks for signing up! Please confirm your email address by clicking the button below.
//               </p>
//               <div style="text-align:center;">
//                 <a href="${verification_link}" class="btn-primary">✓ Verify Email</a>
//               </div>
//               <p style="font-size:14px; margin:8px 0 4px; color:#4a5568;">Or copy and paste this link into your browser:</p>
//               <div class="fallback-link">
//                 <a href="${verification_link}" style="color:#4f46e5; text-decoration:none;">${verification_link}</a>
//               </div>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`,
//       });

//       response.status(201).send({
//         message: "User account registered successfully!",
//         code: "success",
//         data: register_feedback,
//       });
//     } else {
//       response.status(500).send({
//         message: "User could not be registered",
//         code: "error",
//         data: null,
//       });
//     }
//   } else {
//     response.status(400).send({
//       message: "All fields are required",
//       code: "error",
//       data: null,
//     });
//   }
// });

// // ==================== DATABASE & SERVER START ==================== //

// // Connect to MongoDB first, then start the Express server
// mongo_client
//   .connect()
//   .then(() => {
//     console.log("Connected to MongoDB successfully");

//     server.listen(process.env.PORT, () => {
//       console.log(
//         `Server is listening on http://${process.env.HOSTNAME}:${process.env.PORT}`,
//       );
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to MongoDB:", error);
//   });



const dns = require("node:dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first")

const express = require("express");
var cors = require("cors");
const session = require("express-session");
require("dotenv").config(); // Bring in the .env file
const bcrypt = require("bcrypt");

const { MongoClient } = require("mongodb"); // Bring in the mongodb database driver
const nodemailer = require("nodemailer"); // Bring in nodemailer

const url = process.env.DB_CONNECT; // Get the connection string from .env
const mongo_client = new MongoClient(url); // Create a new instance of MongoClient

const transporter = nodemailer.createTransport({
  // Configures Nodemailer to route emails through Mailtrap's fake SMTP server
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // Use STARTTLS
  auth: {
    user: "1191a8a9097111",
    pass: "13035ce9eb7346",
  },
});

// Initialize express app
//const server = express();
//server.use(express.json()); // Middleware for JSON body parsing

// create a simple server !!!!!
const server = express();
server.use(cors());

server.use(
  session({
    secret: "this is a simple1234567sec",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60000,
    },
  }),
);

server.use(express.json()); // Middleware for JSON body parsing

// ==================== ROUTES ==================== //

server.get("/search", async (request, response) => {
  let user_email = request.query.email;

  // if (!user_email || user_email.trim() === "") {
  //   return response.status(400).send({
  //     message: "Email parameter is required",
  //   });
  // }

  let result = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ email: user_email });

  response.status(200).send({
    message: "You have successfully retrieved mail",
    data: result,
  });
});

server.get("/find", async (request, response) => {
  let user_email = request.query.email;

  let result = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ email: user_email });

  response.status(200).send({
    message: "You have successfully retrieved mail",
    data: result,
  });
});

//TO LOGIN
// server.post("/login", async (request, response) => {
//   let fullname = request.body.fullname;
//   let username = request.body.username;
//   let password = request.body.password;

//   let result = await mongo_client
//     .db(process.env.BACKEND)
//     .collection("users")
//     .insertOne({
//       fullname: fullname,
//       username: username,
//       password: password,
//     });

//   console.log(result);

//   response.status(200).send({
//     message: "User logged in",
//     data: {
//       fullname: fullname,
//     },
//   });
// });

//LEARNING LOGIN SESSIONS, WE WOULD BE USING USERNAME AND PASSWORD...AFTER LEARNING THIS, I CAN COMMENT IT OUT
server.post("/login", async (request, response) => {
  let username = request.body.username;
  let password = request.body.password;

  // check the username if it exists
  let result = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ username: username }); // checked by username as defined in request body

  if (result) {
    // the user/account exists
    // validate password
    response.send({
      message: "Login works",
    });
  } else {
    // the user/account does not exist
    response.status(404).send({
      message: "Invalid account. Email does not exist",
      code: "error",
      data: null,
    });
  }
});

server.get("/verify", async (request, response) => {
  let user_email_to_verify = request.query.email;

  const find_user = await mongo_client
    .db(process.env.BACKEND)
    .collection("users")
    .findOne({ email: user_email_to_verify });

  console.log(find_user);

  if (find_user) {
    if (find_user.is_email_verified == false) {
      await mongo_client
        .db(process.env.BACKEND)
        .collection("users")
        .updateOne(
          { email: user_email_to_verify },
          { $set: { is_email_verified: true } },
        );

      response.status(201).send({
        message: "Email Verified",
        code: "success",
        data: {
          email: user_email_to_verify,
        },
      });
    } else {
      response.status(200).send({
        message: "Email already verified",
        code: "error",
        data: {
          email: user_email_to_verify,
        },
      });
    }
  } else {
    response.status(400).send({
      message: "Email does not exist",
      code: "error",
      data: {
        email: user_email_to_verify,
      },
    });
  }
});

server.post("/register", async (request, response) => {
  let firstname = request.body.firstname;
  let lastname = request.body.lastname;
  let email = request.body.email;
  let password = request.body.password;
  let bio = request.body.bio;

  if (
    firstname?.length > 0 &&
    lastname?.length > 0 &&
    email?.length > 0 &&
    password?.length > 0 &&
    bio?.length > 0
  ) {
    let hashed_password = bcrypt.hashSync(password, 10);

    const user = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashed_password,
      bio: bio,
      is_email_verified: false,
    };

    //1.  check that the user exists already..

    try {
      //2. register the user
      await mongo_client.connect();

      const register_feedback = await mongo_client
        .db(process.env.BACKEND)
        .collection("users")
        .insertOne(user);

      if (register_feedback) {
        const verification_link = `http://localhost:3000/verify?email=${email}`;

        await transporter.sendMail({
          from: '"Backend Team" <team@example.com>',
          to: email,
          subject: "Please Verify Your Account",
          text: `Verify your account by visiting: ${verification_link}`,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email Address</title>
  <style type="text/css">
    body, table, td, p, a {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    body { background-color: #f6f9fc; padding: 20px 0; }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .header {
      background-color: #4f46e5;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; }
    .body-content { padding: 40px 32px 32px; }
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
    }
    .fallback-link {
      word-break: break-all;
      color: #4f46e5;
      background-color: #f7fafc;
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f6f9fc;">
    <tr>
      <td align="center" style="padding:20px 16px;">
        <table class="email-container" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; background:#ffffff; border-radius:8px;">
          <tr>
            <td class="header">
              <h1>Verify Your Email</h1>
            </td>
          </tr>
          <tr>
            <td class="body-content">
              <p style="font-size:18px; font-weight:600; margin-bottom:12px;">Hello ${firstname},</p>
              <p style="font-size:16px; margin-bottom:16px;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>
              <div style="text-align:center;">
                <a href="${verification_link}" class="btn-primary">✓ Verify Email</a>
              </div>
              <p style="font-size:14px; margin:8px 0 4px; color:#4a5568;">Or copy and paste this link into your browser:</p>
              <div class="fallback-link">
                <a href="${verification_link}" style="color:#4f46e5; text-decoration:none;">${verification_link}</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        });

        response.status(201).send({
          message: "User account registered successfully!",
          code: "success",
          data: register_feedback,
        });
      } else {
        response.status(500).send({
          message: "User could not be registered",
          code: "error",
          data: null,
        });
      }
    } catch (err) {
      response.status(500).send({
        message: "Server error",
        error: err.message,
      });
    }
  } else {
    response.status(400).send({
      message: "All fields are required",
      code: "error",
      data: null,
    });
  }
});

// ==================== DATABASE & SERVER START ==================== //

// Connect to MongoDB first, then start the Express server
mongo_client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB successfully");

    server.listen(process.env.PORT, () => {
      console.log(
        `Server is listening on http://${process.env.HOSTNAME}:${process.env.PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
