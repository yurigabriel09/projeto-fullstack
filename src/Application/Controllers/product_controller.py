from flask import request, jsonify, make_response
from src.Application.Service.product_service import ProductService


class ProductController:
    @staticmethod
    def get_products():

        user = request.user['id']
        produtos = ProductService.get_products(user)

        if not produtos["success"]:
            return make_response(jsonify({"erro": produtos["erro"]}), produtos["status_code"])
        
    
        return make_response(jsonify({
            "produtos": produtos["dados"]
        }), 200)
    
    
    @staticmethod
    def get_product(product_id):

        user_id = request.user['id']
        produto = ProductService.get_product(product_id, user_id)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])

        return make_response(jsonify({
            "produto": produto["dados"]
        }), 200)


    @staticmethod
    def register_product():
        user_id = request.user['id']
        user_nome = request.user['nome']

        nome = request.form.get('nome')
        marca = request.form.get('marca')
        preco = request.form.get('preco')
        quantidade = request.form.get('quantidade')
        categoria = request.form.get('categoria')
        descricao = request.form.get('descricao')
        foto = request.files.get('foto')

        if not nome or not marca or not preco or not quantidade or not categoria or not foto:
            return make_response(jsonify({"erro": "Um dos campos está faltando: nome, marca, preco, quantidade ou foto. Verifique e tente novamente."}), 400)
        
        try:
            quantidade = int(quantidade)
            preco = float(preco)
        except ValueError:
            return make_response(jsonify({"erro": "Preço e quantidade devem ser numéricos."}), 400)

        if quantidade < 0 or preco <= 0:
            return make_response(jsonify({"erro": "Preço e quantidade não podem ser negativos."}), 400)

        
        produto = ProductService.create_product(user_id, user_nome, nome, marca, preco, quantidade, categoria, descricao, foto)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])

        return make_response(jsonify({
            "mensagem": "Produto cadastrado com sucesso!",
            "produto": produto["dados"]
        }), 201)
    

    @staticmethod
    def edit_product(product_id):

        user_id = request.user['id']
        user_nome = request.user['nome']

        foto = request.files.get('foto')

        campos_editaveis = {"nome", "marca", "preco", "quantidade", "categoria", "descricao"}

        dados_filtrados = {key: value for key, value in request.form.items() if key in campos_editaveis}

        if not dados_filtrados and not foto:
            return make_response(jsonify({"erro": "Nenhum campo válido para atualização."}), 400)

        produto = ProductService.edit_product(product_id, user_id, user_nome, dados_filtrados, foto)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])
        
        return make_response(jsonify({
            "mensagem": produto["mensagem"],
            "produto": produto["produto"]
        }), 200)
    

    @staticmethod
    def inactivate_product(product_id):

        user_id = request.user['id']

        produto = ProductService.inactivate_product(product_id, user_id)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])
        
        return make_response(jsonify({
            "mensagem": produto["mensagem"],
            "produto": produto["dados"]
        }), 200)
    

    @staticmethod
    def delete_product(product_id):

        user_id = request.user['id']

        produto = ProductService.delete_product(product_id, user_id)

        if not produto["success"]:
            return make_response(jsonify({"erro": produto["erro"]}), produto["status_code"])
        
        return make_response(jsonify({
            "mensagem": produto["mensagem"],
            "produto": produto["dados"]
        }), 200)