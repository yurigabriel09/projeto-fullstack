from src.Domain.user import UserDomain
from src.Infrastructure.Model.user import User
from src.Infrastructure.http.whats_app import Twilio
from src.config.data_base import db 
from flask import current_app
import bcrypt
import jwt
import datetime


class UserService:
    @staticmethod
    def create_user(nome, email, senha, cnpj, celular, codigo):

        verify_user = User.query.filter_by(email=email).first()
        if verify_user:
            return {
                "success": False,
                "erro": "Usuário já foi cadastrado!",
                "status_code": 409
            }
        
        user = User(nome=nome, email=email, senha=senha, cnpj=cnpj, celular=celular, status=0, codigo=codigo)

        db.session.add(user)
        db.session.commit()   

        Twilio.send_code(codigo)

        return {
            "success": True,
            "dados": UserDomain.to_dict_create(user.nome, user.email, user.cnpj, user.celular, user.status, user.codigo)
        }

    @staticmethod
    def activate_user(email, senha, codigo):
        user = User.query.filter_by(email=email).first()

        if not user:
            return {
                "success": False, 
                "erro": "Usuário não encontrado. Verifique o e-mail e tente novamente.", 
                "status_code": 404
                }
        
        senha_armazenada = user.senha.encode('utf-8') if isinstance(user.senha, str) else user.senha
        senha_valida = bcrypt.checkpw(senha.encode('utf-8'), senha_armazenada)
        if not senha_valida:
            return {
                "success": False, 
                "erro": "Senha inválida", 
                "status_code": 401
                }

        if str(user.codigo) != str(codigo):
            return {
                "success": False, 
                "erro": "Código de ativação inválido", 
                "status_code": 400
                }

        if user.status == 1:
            return {
                "success": False, 
                "erro": "Usuário já está ativo", 
                "status_code": 409
                }

        user.status = 1
        db.session.commit()

        SECRET_KEY = current_app.config["SECRET_KEY"]

        token = jwt.encode(
                {
                    "id": user.id_user,
                    "nome": user.nome,
                    "email": user.email,
                    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

        return {
            "success": True,
            "mensagem": "Usuário ativado com sucesso!",
            "token": token,
            "usuario": UserDomain.to_dict_activate(user.nome, user.email, user.status)
        }
    

    @staticmethod
    def user_login(email, senha):

        user = User.query.filter_by(email=email).first()

        if not user:
            return {
                "success": False,
                "erro": "Usuário não encontrado. Verifique o e-mail e tente novamente",
                "status_code": 404
            }
        
        senha_armazenada = user.senha.encode('utf-8') if isinstance(user.senha, str) else user.senha
        senha_valida = bcrypt.checkpw(senha.encode('utf-8'), senha_armazenada)
        if not senha_valida:
            return {
                "success": False,
                "erro": "Senha inválida!",
                "status_code": 401
            }
        
        if user.status != 1:
            return {
                "success": False,
                "erro": "Usuário não está ativo! Acesse a rota de login e faça a ativação do Seller.",
                "status_code": 403
            }
        
        SECRET_KEY = current_app.config["SECRET_KEY"]

        token = jwt.encode(
                {
                    "id": user.id_user,
                    "nome": user.nome,
                    "email": user.email,
                    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

        return {
            "success": True,
            "token": token,
            "mensagem": "Usuário logado com sucesso!",
            "usuario": UserDomain.to_dict_login(user.nome, user.email)
        }
    

    @staticmethod
    def edit_seller(id, dados):

        user = User.query.filter_by(id_user=id).first()

        if not user:
            return {
                "success": False,
                "erro": "Usuário não encontrado.",
                "status_code": 404
            }
        
        for campo, valor in dados.items():
            if campo == "senha":
                valor = bcrypt.hashpw(valor.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            setattr(user, campo, valor)

        db.session.commit()


        return {
            "success": True,
            "mensagem": "Usuário alterado com sucesso!",
            "usuario": UserDomain.to_dict_login(user.nome, user.email)
        }