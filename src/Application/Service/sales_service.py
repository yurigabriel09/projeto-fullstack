from src.Domain.sales import SalesDomain
from src.Infrastructure.Model.sales import Sales
from src.config.data_base import db


class SalesService:

    @staticmethod
    def get_sales(user_id):
        vendas = Sales.query.filter_by(id_seller=user_id).all()

        if not vendas:
            return {
                "success": False,
                "erro": "Nenhuma venda registrada para esse vendedor!",
                "status_code": 404
            }
        
        return {
            "success": True,
            "dados": [venda.to_dict() for venda in vendas]
        }