var app = require('./config/custom-express')();

app.listen(21228, function(){
  console.log('Servidor rodando na porta 21228.');
});
