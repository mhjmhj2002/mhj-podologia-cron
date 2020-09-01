module.exports = function () {

  // const mysql = require('mysql');

  var pool;
  //  = mysql.createPool({
  //   connectionLimit: 10,
  //   host: '31.170.161.43',
  //   user: 'u695513924_clinica',
  //   password: '@Mhj197704',
  //   database: 'u695513924_podologia'
  // });

  const cron = require("node-cron");

  cron.schedule("*/5 * * * * *", function () {//teste 5 segundos
  // cron.schedule("* * * * *", function () {
    console.log("Running Cron Job");
    execute();
  });
}

function execute() {
  iniciarPool();
  buscarMensagensParaEnviar();
}

function iniciarPool(){

  const mysql = require('mysql');

  this.pool = mysql.createPool({
    connectionLimit: 10,
    host: '31.170.161.43',
    user: 'u695513924_clinica',
    password: '@Mhj197704',
    database: 'u695513924_podologia'
  });
}

function buscarMensagensParaEnviar() {
  console.log("enviarEmails " );

  this.pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query("select * from mensagem where status = " + 1, function (err, mensagens) {
      if (err) {
        throw err;
      } else {
        console.log( mensagens );
        mensagens.forEach(element => {
          if (enviarEmail(element)){
            atualizarStatus(element, 2);
          } else {
            atualizarStatus(element, 3);
          }
          console.log(element.email);
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
  const mailOptions = {
    from: 'Podologia Labarca clinica@podologialabarca.com.br', // sender address
    to: '"' + element.nome + '" ' + element.email,//'jane.doe@example.com', // list of receivers
    cc: 'Podologia Labarca clinica@podologialabarca.com.br',
    subject: element.titulo,//'Hello there!', // Subject line
    // text: element.mensagem,//'A Message from Node Cron App', // plain text body
    html: '<b>Mensagem Enviada Via www.podologialabarca.com.br</b><br><b>' + element.mensagem + '</b>' // html body
  };
  transporter.sendMail(mailOptions, function (error, info) {

    if (error) {
      console.log(error);
      return false;
    }
    console.log(info.messageId);
    console.log("enviado");
    return true;
  });
}

function atualizarStatus(element, status) {
  this.pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    connection.query("update mensagem set status = " + status + " where id = " + element.id, function (err, retorno) {
      if (err) {
        throw err;
      } else {
        console.log( retorno );
      }
    });

    connection.release();
  });
}