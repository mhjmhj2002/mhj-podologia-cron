function MensagemDao(connection) {
    this._connection = connection;
}

MensagemDao.prototype.getByStatus = function (status, callback) {
    this._connection.query("select * from mensagem where status = " + status,callback);
}

MensagemDao.prototype.getAll = function (callback) {
    this._connection.query("select * from mensagem",callback);
}

MensagemDao.prototype.incluirMensagem = function (email, nome, mensagem, titulo, callback) {
    var query = "insert into mensagem (email, nome, mensagem, titulo) values ('" + email + "', '" + nome + "', '" + mensagem + "', '" + titulo + "')";
    console.log("query: " + query);
    this._connection.query(query,callback);
}

module.exports = function(){
    return MensagemDao;
};