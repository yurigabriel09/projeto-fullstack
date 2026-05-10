from flask import request, jsonify, make_response
from src.Application.Service.sales_service import SalesService


class SalesController():

    @staticmethod
    def get_sales():
        user_id = request.user['id']
        vendas = SalesService.get_sales(user_id)

        if not vendas["success"]:
            return make_response(jsonify({"erro": vendas["erro"]}), vendas["status_code"])

        return make_response(jsonify({
            "vendas": vendas["dados"]
        }), 200)
    

    @staticmethod
    def register_sale():
        user_id = request.user['id']

        data = request.get_json()
        product_id = data.get('produto_id')
        quantidade = data.get('quantidade')

        if not product_id or not quantidade:
            return make_response(jsonify({"erro": "Produto ou quantidade não fornecidos. Verifique e tente novamente."}), 400)
        try:
            quantidade = int(quantidade)
        except (ValueError, TypeError):
            return make_response(jsonify({"erro": "Quantidade deve ser numérica."}), 400)

        venda = SalesService.register_sale(user_id, product_id, quantidade)

        if not venda["success"]:
            return make_response(jsonify({"erro": venda["erro"]}), venda["status_code"])
        
        return make_response(jsonify({
            "venda": venda["dados"]
        }), 201)