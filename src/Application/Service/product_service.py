from src.Domain.product import ProductDomain
from src.Infrastructure.Model.product import Product
from src.Infrastructure.Model.sales import Sales
from src.config.data_base import db
import os
import uuid


class ProductService:
    @staticmethod
    def get_products(user_id):

        produtos = Product.query.filter_by(id_seller=user_id).all()

        if not produtos:
            return {
                "success": False,
                "erro": "Nenhum produto encontrado para este vendedor!",
                "status_code": 404
            }

        return {
            "success": True,
            "dados": [produto.to_dict() for produto in produtos]
        }
    

    @staticmethod
    def get_product(product_id, user_id):

        produto = Product.query.filter_by(id_product=product_id, id_seller=user_id).first()        

        if not produto:
            return {
                "success": False,
                "erro": "Nenhum produto encontrado! Verifique e tente novamente",
                "status_code": 404
            }

        return {
            "success": True,
            "dados": produto.to_dict()
        }

    @staticmethod
    def create_product(user_id, user_nome, nome, marca, preco, quantidade, categoria, descricao, foto):

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

        produto = Product(id_seller=user_id, nome=nome, marca=marca, preco=preco, quantidade=quantidade, categoria=categoria, descricao=descricao, foto=caminho_foto, status=1)

        db.session.add(produto)
        db.session.commit()

        return {
            "success": True,
            "dados": ProductDomain.to_dict_create(produto.nome, produto.marca, produto.preco, produto.quantidade, produto.categoria, produto.descricao, produto.foto, produto.data_cadastro, produto.status)
        }


    @staticmethod
    def edit_product(product_id, user_id, user_nome, dados, foto):

        produto = Product.query.filter_by(id_product=product_id, id_seller=user_id).first()

        if not produto:
            return {
                "success": False,
                "erro": "Produto não encontrado! Verifique e tente novamente",
                "status_code": 404
            }

        if foto:
            extensoes_validas = ['jpg', 'jpeg', 'png', 'webp']
            extensao = foto.filename.rsplit('.', 1)[-1].lower()

            if not extensao in extensoes_validas:
                return {
                    "success": False,
                    "erro": "Formato de imagem inválido. Use jpg, jpeg, png ou webp.",
                    "status_code": 400
                }
            
            caminho_antigo = produto.foto

            user_nome = user_nome.replace(' ', '_').lower()
            pasta_seller = os.path.join('imagens', f"{user_nome}_{user_id}")
            os.makedirs(pasta_seller, exist_ok=True)

            nome_arquivo = f"{uuid.uuid4().hex}.{extensao}"
            caminho_foto = os.path.join(pasta_seller, nome_arquivo)
            caminho_foto = caminho_foto.replace('\\', '/')

            foto.save(caminho_foto)
            produto.foto = caminho_foto

            if caminho_antigo and os.path.exists(caminho_antigo):
                os.remove(caminho_antigo)

        for campo, valor in dados.items():
            setattr(produto, campo, valor)

        db.session.commit()

        return {
            "success": True,
            "mensagem": "Produto alterado com sucesso!",
            "produto": ProductDomain.to_dict_edit(produto.nome, produto.marca, produto.preco, produto.quantidade, produto.foto)
        }
    

    @staticmethod
    def inactivate_product(product_id, user_id):

        produto = Product.query.filter_by(id_product=product_id, id_seller=user_id).first()

        if not produto:
            return {
                "success": False,
                "erro": "Produto não encontrado! Verifique e tente novamente",
                "status_code": 404
            }
        
        try:
            ProductDomain.pode_inativar(produto.status)
        except ValueError as e:
            return {"success": False, "erro": str(e), "status_code": 400}
        
        produto.status = 0

        db.session.commit()

        return {
            "success": True,
            "mensagem": "Produto desativado com sucesso!",
            "dados": produto.to_dict()
        }
    

    @staticmethod
    def delete_product(product_id, user_id):
        
        produto = Product.query.filter_by(id_product=product_id, id_seller=user_id).first()

        if not produto:
            return {
                "success": False,
                "erro": "Produto não encontrado!",
                "status_code": 404
            }
        
        vendas = Sales.query.filter_by(id_produto=product_id, id_seller=user_id).all()

        if vendas:
            return {
                "success": False,
                "erro": "Não é possível deletar um produto que possui vendas registradas.",
                "status_code": 409
            }
        
        db.session.delete(produto)
        db.session.commit()

        return {
            "success": True,
            "mensagem": "Produto deletado com sucesso!",
            "dados": produto.to_dict()
        }