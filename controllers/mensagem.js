
var count = 0;

const mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: '31.170.161.43',
  user: 'u695513924_clinica',
  password: '@Mhj197704',
  database: 'u695513924_podologia'
});

module.exports = function () {

  const cron = require("node-cron");

  // cron.schedule("*/5 * * * * *", function () {//teste 5 segundos
  cron.schedule("* * * * *", function () {
    // console.log("Running Cron Job");
    execute();
  });
}

function execute() {
  validateLog();
  buscarMensagensParaEnviar();
}

function validateLog(){
  count++;
  if(count % 720 == 0){
    console.log(new Date());
  } 
}

function buscarMensagensParaEnviar() {
  // console.log("enviarEmails " );

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query("select * from mensagem where status = " + 1, function (err, mensagens) {
      if (err) {
        throw err;
      } else {
        // console.log( "mensagens: ", mensagens );
        mensagens.forEach(element => {
          atualizarStatus(element, enviarEmail(element));
          // console.log(element.email);
        });
      }
    });

    connection.release();
  });

}

function enviarEmail(element) {
  const nodeMailer = require("nodemailer");
  // let testAccount = nodemailer.createTestAccount();
  let transporter = nodeMailer.createTransport({
    host: "smtp.hostinger.com.br",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "clinica@podologialabarca.com.br", // generated ethereal user
      pass: "@Mhj197704" // generated ethereal password
    }
  });

  var mensagem = ''+
  '<b>Olá ' + element.nome + ',</b><br>'+
  '<b>Recebimos a sua mensagem, assim que possível retornaremos.</b><br><br><br>'+
  '<b>Mensagem enviada:<b><br>'+
  '<b>' + element.mensagem + '</b><br><br><br>'+
  '<b>Mensagem Enviada Via www.podologialabarca.com.br</b>'
  ;

  const mailOptions = {
    from: 'Podologia Labarca clinica@podologialabarca.com.br', // sender address
    to: element.nome + ' ' + element.email,//'jane.doe@example.com', // list of receivers
    bcc: 'podologialabarca@gmail.com;mhjmhj2002@gmail.com',
    subject: element.titulo,//'Hello there!', // Subject line
    // text: element.mensagem,//'A Message from Node Cron App', // plain text body
    html: mensagem
  };
  transporter.sendMail(mailOptions, function (error, info) {

    if (error) {
      console.log(error);
      return 3;
    }
    // console.log(info.messageId);
    // console.log("enviado");
    return 2;
  });
  return 2;
}

function atualizarStatus(element, status) {
  // console.log("status " + status);
  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query("update mensagem set status = " + status + " where id = " + element.id, function (err, retorno) {
      if (err) {
        throw err;
      } else {
        // console.log( retorno );
      }
    });

    connection.release();
  });
}