const nodemailer = require("nodemailer");   

const getVerifyEmailHtml = (data) => {
  console.log('getVerifyEmailHtml data', data)
    let html = `
      <div>
        <div>
          Welcome ${data.username},
        </div>
        <div>
          Click on the url to verify the email <a href="${data.url}">${data.url}</a>
        </div>
         
      </div>
    
    `

    return html
}


const emailSender = (props) => {

    const smtpTrans = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // company's email and password
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const getEmailHtml = () => {
        let html = ''
        if(props.type='verifyToken')
        {
          html = getVerifyEmailHtml(props.data)
        }
        console.log('html', html)
        return html
      }

    const getSubject = () => {
      let sub = ''
      if(props.type='verifyToken')
      {
        sub = 'Verification Email'
      }
      return sub
    }

      // email options
    const mailOpts = {
        from: process.env.GMAIL_EMAIL,
        to: props.mailTo,
        subject: getSubject(props),
        html: getEmailHtml(props),
      };

    

      // send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
          console.log('error', error)
        } else {
            console.log('success')
        }
    });


    console.log('props', props)
} 



module.exports = {
    emailSender
};