from src.config.data_base import db
from datetime import datetime, timezone

class Sales(db.Model):
    __tablename__ = 'sales'
    id_venda = db.Column(db.Integer, primary_key=True)
    id_seller = db.Column(db.Integer, db.ForeignKey('users.id_user'), nullable=False)
    id_produto = db.Column(db.Integer, db.ForeignKey('products.id_product'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Float, nullable=False)
    valor = db.Column(db.Float, nullable=False)
    data_venda = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    
    def to_dict(self):
        return {
            "id_venda": self.id_venda,
            "id_seller": self.id_seller,
            "id_product": self.id_produto,
            "quantidade": self.quantidade,
            "valor": self.valor,
            "data_venda": self.data_venda
        }