from src.Application.Controllers.user_controller import UserController
from flask import jsonify, make_response

def init_routes(app):    
    @app.route('/api', methods=['GET'])
    def health():
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    

    # @app.route('/users', methods=['GET'])
    # def get_users():
    #     pass
    
    @app.route('/user', methods=['POST'])
    def register_user():
        return UserController.register_user()
    
    @app.route('/activate', methods=['POST'])
    def activate_user():
        return UserController.activate()
        
    

