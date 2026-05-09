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