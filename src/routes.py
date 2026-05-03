from src.Application.Controllers.user_controller import UserController
from src.Infrastructure.Middleware.middleware import token_required
from flask import jsonify, make_response

def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
    
    @app.route('/user', methods=['POST'])
    def register_user():
        return UserController.register_user()
    
    @app.route('/activate', methods=['POST'])
    def activate_user():
        return UserController.activate_user()
    
    @app.route('/login', methods=['POST'])
    def login():
        return UserController.login()
    
    @app.route('/editseller/me', methods=['PUT'])
    @token_required
    def edit_seller():
        return UserController.edit_seller()