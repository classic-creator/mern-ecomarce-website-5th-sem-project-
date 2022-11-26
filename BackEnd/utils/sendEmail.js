const nodeMailer = require("nodemailer")
//const { options } = require("../routs/productRout")

const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        Port:process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }

    })
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
   await transporter.sendMail(mailOptions)
}

module.exports=sendEmail