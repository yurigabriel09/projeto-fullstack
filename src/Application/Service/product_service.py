from src.Domain.product import ProductDomain
from src.Infrastructure.Model.product import Product
from src.config.data_base import db
import os
import uuid



class ProductService:
    @staticmethod
    def create_product(user_id, user_nome, nome, marca, preco, quantidade, foto):

        extensoes_validas = ['jpg', 'jpeg', 'png', 'webp']
        extensao = foto.filename.rsplit('.', 1)[-1].lower()

        if not extensao in extensoes_validas:
            return {
                "success": False,
                "erro": "Formato de imagem inválido. Use jpg, jpeg, png ou webp.",
                "status_code": 400
            }

        user_nome = user_nome.replace(' ', '_').lower()
        pasta_seller = os.path.join('imagens', f"{user_nome}_{user_id}")
        os.makedirs(pasta_seller, exist_ok=True)

        nome_arquivo = f"{uuid.uuid4().hex}.{extensao}"
        caminho_foto = os.path.join(pasta_seller, nome_arquivo)
        foto.save(caminho_foto)

        produto = Product(id_seller=user_id, nome=nome, marca=marca, preco=preco, quantidade=quantidade, foto=caminho_foto, status=1)

        db.session.add(produto)
        db.session.commit()

        return {
            "success": True,
            "dados": ProductDomain.to_dict_create(produto.nome, produto.marca, produto.preco, produto.quantidade, produto.foto, produto.data_cadastro, produto.status)
        }
    