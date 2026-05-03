from flask import request, jsonify, make_response
from src.Application.Service.user_service import UserService
import bcrypt
import random

class UserController:
    @staticmethod
    def register_user():
        data = request.get_json()

        nome = data.get('nome')
        email = data.get('email')
        senha = data.get('senha')
        cnpj = data.get('cnpj')
        celular = data.get('celular')

        hash_senha = UserController.crypt_senha(senha)
        codigo = UserController.create_code()

        if not nome or not email or not senha:
            return make_response(jsonify({"erro": "Missing required fields"}), 400)

        user = UserService.create_user(nome, email, hash_senha, cnpj, celular, codigo)

        return make_response(jsonify({
            "mensagem": "User salvo com sucesso",
            "usuario": user
        }), 200)


    def crypt_senha(senha):
        return bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
    

    def create_code():
        return random.randint(1000, 9999)
    

    @staticmethod
    def activate_user():
        data = request.get_json()

        email = data.get('email')
        senha = data.get('senha')
        codigo = data.get('codigo')

        if not email or not senha or not codigo:
            return make_response(jsonify({"erro": "Missing required fields: email, senha e codigo são obrigatórios"}), 400)

        resultado = UserService.activate_user(email, senha, codigo)

        if not resultado["success"]:
            return make_response(jsonify({"erro": resultado["erro"]}), resultado["status_code"])

        return make_response(jsonify({
            "mensagem": "Usuário ativado com sucesso",
            "usuario": resultado["usuario"]
        }), 200)
    

    @staticmethod
    def login():
        data = request.get_json()

        email = data.get('email')
        senha = data.get('senha')

        if not email or not senha:
            return make_response(jsonify({"erro": "Os campos de e-mail e senha são obrigatórios."}), 400)
        
        resultado = UserService.user_login(email, senha)

        if not resultado["success"]:
            return make_response(jsonify({"erro": resultado["erro"]}), resultado['status_code'])

        return make_response(jsonify({
            "mensagem": resultado['mensagem'],
            "usuario": resultado['usuario'],
            "token": resultado['token']
        }), 200)
    

    @staticmethod
    def edit_seller():
        data = request.get_json()
        user_id = request.user['id']

        if not data:
            return make_response(jsonify({"erro": "Nenhum dado fornecido para ser editado."}), 400)
        
        campos_editaveis = {"nome", "email", "senha", "cnpj", "celular"}

        dados_filtrados = {key: value for key, value in data.items() if key in campos_editaveis}

        if not dados_filtrados:
            return {"message": "Nenhum campo válido para atualização"}, 400


        resultado = UserService.edit_seller(user_id, dados_filtrados)

        if not resultado["success"]:
            return make_response(jsonify({"erro": resultado["erro"]}), resultado['status_code'])
        
        return make_response(jsonify({
            "mensagem": resultado['mensagem'],
            "usuario": resultado['usuario']
        }), 200)