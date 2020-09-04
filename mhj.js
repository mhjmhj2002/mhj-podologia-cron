var app = require('./config/custom-express')();

app.listen(21582, function(){
  console.log('Servidor rodando na porta 21582.');
});
