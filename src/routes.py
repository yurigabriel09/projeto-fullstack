from src.Application.Controllers.user_controller import UserController
from src.Application.Controllers.product_controller import ProductController
from src.Infrastructure.Middleware.middleware import token_required
from flask import jsonify, make_response

def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
    
    #### ROTAS DE SELLER ####

    @app.route('/seller/register', methods=['POST'])
    def register_user():
        return UserController.register_user()

    @app.route('/seller/activate', methods=['POST'])
    def activate_user():
        return UserController.activate_user()

    @app.route('/seller/login', methods=['POST'])
    def login():
        return UserController.login()

    @app.route('/seller/edit', methods=['PUT'])
    @token_required
    def edit_seller():
        return UserController.edit_seller()
    

    #### ROTAS DE PRODUTO ####

    @app.route('/product/register', methods=['POST'])
    @token_required
    def register_product():
        return ProductController.register_product()