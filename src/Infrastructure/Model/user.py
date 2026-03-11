from src.config.data_base import db 
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)
    cnpj = db.Column(db.Integer, nullable=False)
    celular = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    codigo = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "senha": self.senha,
            "cnpj": self.cnpj,
            "celular": self.celular,
            "status": self.status,
            "codigo": self.codigo
        }
