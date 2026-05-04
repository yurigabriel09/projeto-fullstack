from src.config.data_base import db
from datetime import datetime, timezone

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    id_seller = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    nome = db.Column(db.String(50), nullable=False)
    marca = db.Column(db.String(50), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    foto = db.Column(db.String(500), nullable=False)
    data_cadastro = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "marca": self.marca,
            "preco": self.preco,
            "quantidade": self.quantidade,
            "foto": self.foto,
            "data_cadastro": self.data_cadastro,
            "status": self.status
        }