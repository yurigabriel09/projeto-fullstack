from flask import request, jsonify, make_response
from src.Application.Service.product_service import ProductService


class ProductController:
    @staticmethod
    def register_product():
        user_id = request.user['id']
        user_nome = request.user['nome']

        nome = request.form.get('nome')
        marca = request.form.get('marca')
        preco = request.form.get('preco')
        quantidade = request.form.get('quantidade')
        foto = request.files.get('foto')

        if not nome or not marca or not preco or not quantidade or not foto:
            return make_response(jsonify({"erro": "Um dos campos está faltando: nome, marca, preco, quantidade ou foto. Verifique e tente novamente."}), 400)
        
        try:
            quantidade = int(quantidade)
            preco = float(preco)
        except ValueError:
            return make_response(jsonify({"erro": "Preço e quantidade devem ser numéricos."}), 400)

        if quantidade < 0 or preco < 0:
            return make_response(jsonify({"erro": "Preço e quantidade não podem ser negativos."}), 400)

        
        produto = ProductService.create_product(user_id, user_nome, nome, marca, preco, quantidade, foto)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])

        return make_response(jsonify({
            "mensagem": "Produto cadastrado com sucesso!",
            "produto": produto["dados"]
        }), 201)