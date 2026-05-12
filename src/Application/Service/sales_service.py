from src.Domain.sales import SalesDomain
from src.Domain.product import ProductDomain
from src.Domain.user import UserDomain
from src.Infrastructure.Model.sales import Sales
from src.Infrastructure.Model.product import Product
from src.Infrastructure.Model.user import User
from src.config.data_base import db


class SalesService:

    @staticmethod
    def get_sales(user_id):
        vendas = Sales.query.filter_by(id_seller=user_id).all()

        if not vendas:
            return {
                "success": True,
                "dados": [],
            }
        
        resultado = []

        for venda in vendas:
            produto = Product.query.filter_by(id_product=venda.id_produto).first()
            resultado.append({
                "id": venda.id_venda,
                "produto_nome": produto.nome if produto else None,
                "produto_id": venda.id_produto,
                "quantidade": venda.quantidade,
                "preco_unitario": venda.preco_unitario,
                "valor": venda.valor,
                "data_venda": venda.data_venda.strftime("%d/%m/%Y %H:%M") if venda.data_venda else None
            })

        return {
            "success": True,
            "dados": resultado
        }
    

    @staticmethod
    def register_sale(user_id, product_id, quantidade):
        
        produto = Product.query.filter_by(id_product=product_id, id_seller=user_id).first()

        if not produto:
            return {
                "success": False,
                "erro": "Produto não encontrado!",
                "status_code": 404
            }
        
        user = User.query.filter_by(id_user=user_id).first()

        if not user:
            return {
                "success": False,
                "erro": "Seller não encontrado!",
                "status_code": 404
            }

        try:
            ProductDomain.pode_vender(produto.status, quantidade, produto.quantidade)
            UserDomain.pode_vender(user.status)
        except ValueError as e:
            return {"success": False, "erro": str(e), "status_code": 400}
        
        valor_venda = quantidade * produto.preco

        produto.quantidade -= quantidade
        
        venda = Sales(id_seller=user_id, id_produto=product_id, quantidade=quantidade, preco_unitario=produto.preco, valor=valor_venda)

        db.session.add(venda)
        db.session.commit()

        return {
            "success": True,
            "dados": venda.to_dict()
        }