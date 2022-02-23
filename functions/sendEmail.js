const nodemailer = require('nodemailer');

exports.sendEmail = async (email, mensaje, titulo)=>{
   
       console.log("Se esta enviando el correo")
       const transporter = nodemailer.createTransport({
            host: "single-9040.banahosting.com",
            port: 587,
            secure: false,
            auth: {
                user: "no-reply@magicplanet.club",
                pass: "M4gic2020*",
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
       await transporter.sendMail({
            from: '"Magic Planet" <no-reply@magicplanet.club>',
            to: email,
            subject: titulo,
            text: mensaje,
        }).then(info => {
            console.log("correo enviado")
            return info;
            // res.json({mensaje: "correo enviado"});
        }).catch(error => {
            
            console.log(error)
            // res.json({mensaje: "error al enviar el correo"});
        });

}