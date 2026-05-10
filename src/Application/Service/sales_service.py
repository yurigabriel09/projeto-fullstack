from src.Domain.sales import SalesDomain
from src.Infrastructure.Model.sales import Sales
from src.Infrastructure.Model.product import Product
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
                "preco_unitario": produto.preco if produto else None,
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

        if produto.status != 1:
            return {
                "success": False,
                "erro": "Produto não está ativo!",
                "status_code": 400
            }

        if quantidade > produto.quantidade:
            return {
                "success": False,
                "erro": "Quantidade maior que o estoque disponível! Verifique e tente novamente.",
                "status_code": 400
            }
        valor_venda = quantidade * produto.preco

        produto.quantidade -= quantidade
        
        venda = Sales(id_seller=user_id, id_produto=product_id, quantidade=quantidade, valor=valor_venda)

        db.session.add(venda)
        db.session.commit()

        return {
            "success": True,
            "dados": venda.to_dict()
        }