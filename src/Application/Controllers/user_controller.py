from flask import request, jsonify, make_response
from src.Application.Service.user_service import UserService
import bcrypt

class UserController:
    @staticmethod
    def register_user():
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        senha = data.get('senha')
        cnpj = data.get('cnpj')
        celular = data.get('celular')
        hash_senha = UserController.cryprit_senha(senha)

        if not name or not email or not senha:
            return make_response(jsonify({"erro": "Missing required fields"}), 400)

        user = UserService.create_user(name, email, hash_senha, cnpj, celular)

        return make_response(jsonify({
            "mensagem": "User salvo com sucesso",
            "usuario": user
        }), 200)

    def cryprit_senha(senha):
        return bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())