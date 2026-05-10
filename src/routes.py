from src.Application.Controllers.user_controller import UserController
from src.Application.Controllers.product_controller import ProductController
from src.Application.Controllers.sales_controller import SalesController
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

    @app.route('/seller/products/list', methods=['GET'])
    @token_required
    def get_products():
        return ProductController.get_products()

    @app.route('/seller/product/list/<int:id>', methods=['GET'])
    @token_required
    def get_product(id):
        return ProductController.get_product(id)

    @app.route('/seller/product/register', methods=['POST'])
    @token_required
    def register_product():
        return ProductController.register_product()
    
    @app.route('/seller/product/edit/<int:id>', methods=['PUT'])
    @token_required
    def edit_product(id):
        return ProductController.edit_product(id)
    
    @app.route('/seller/product/inactivate/<int:id>', methods=['PUT'])
    @token_required
    def inactivate_product(id):
        return ProductController.inactivate_product(id)
    
    @app.route('/seller/product/delete/<int:id>', methods=['DELETE'])
    @token_required
    def delete_product(id):
        return ProductController.delete_product(id)

    #### ROTAS DE VENDAS ####

    @app.route('/seller/sales/list', methods=["GET"])
    @token_required
    def get_sales():
        return SalesController.get_sales()
    
    @app.route('/seller/sales/register', methods=["POST"])
    @token_required
    def register_sale():
        return SalesController.register_sale()