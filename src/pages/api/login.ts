import prisma from '@/libs/prismadb';
import {comparePasswords} from '@/libs/bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const verifyRecaptcha = async (token: String) => {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  var verificationUrl =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    token;

  return await fetch(verificationUrl, {
    method: 'POST'
  }).then(response => response.json());
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST"){
    try {
      const body = req.body
      const {
        data, 
        // token
      } = body
      
      let {email, password} = data
      
      // Recaptcha response
      // const response = await verifyRecaptcha(token);
  
      // Checking if the reponse sent by reCaptcha success or not and if the score is above 0.5
      // In ReCaptcha v3, a score sent which tells if the data sent from front end is from Human or from Bots. If score above 0.5 then it is human otherwise it is bot
      // For more info check, https://developers.google.com/recaptcha/docs/v3
      // ReCaptcha v3 response, {
      //     "success": true|false,      // whether this request was a valid reCAPTCHA token for your site
      //     "score": number             // the score for this request (0.0 - 1.0)
      //     "action": string            // the action name for this request (important to verify)
      //     "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
      //     "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
      //     "error-codes": [...]        // optional
      //   }
      // if (response.success && response.score >= 0.7) {
        console.log(email, password)
        if (!email || !password){ 
          return res.status(400).json({
            status: "Failed",
            message: "Please fill in all fields."
          })
        }
  
        const user = await prisma.users.findFirst({
          where: {
            email: email
          }
        })
  
        // console.log(user)
  
        await prisma.$disconnect()
        if (!user || await comparePasswords(password, user.password) == false){
          return res.status(400).json({
            status: "Failed",
            message: "Email or password is incorrect.",
          })
          
        } else if (await comparePasswords(password, user.password)){
          return res.status(200).json({
            status: "Success",
            message: "Login success.",
            data: {
              name: user.fullname,
              email: user.email
            }
          })
          
        }
  
  
        
      // } else {
      //   return res.status(400).json({
      //     status: "Failed",
      //     message: "Something went wrong, please try again!!!",
      //   })
        
      // }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: "Failed",
        message: "Something went wrong, please try again!!!",
      })
    }

  }
  
}