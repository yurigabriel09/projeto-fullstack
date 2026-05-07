from flask import Flask, send_from_directory
from src.config.data_base import init_db
from src.routes import init_routes
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    CORS(app, origins=["http://localhost:5173"])

    init_db(app)
    init_routes(app)

    # Serve a pasta /imagens da raiz do projeto
    @app.route('/imagens/<path:filename>')
    def serve_imagens(filename):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'imagens'))
        return send_from_directory(base_dir, filename)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)