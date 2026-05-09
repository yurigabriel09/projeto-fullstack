from src.config.data_base import db

class User(db.Model):
    __tablename__ = 'users'
    id_user = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.String, nullable=False)
    celular = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    codigo = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id_user,
            "nome": self.nome,
            "email": self.email,
            "senha": self.senha,
            "cnpj": self.cnpj,
            "celular": self.celular,
            "status": self.status,
            "codigo": self.codigo
        }
