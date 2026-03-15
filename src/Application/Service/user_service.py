from src.Domain.user import UserDomain
from src.Infrastructure.Model.user import User
from src.Infrastructure.http.whats_app import Twilio
from src.config.data_base import db 
import bcrypt

class UserService:
    @staticmethod
    def create_user(name, email, senha, cnpj, celular, codigo):
        user = User(name=name, email=email, senha=senha, cnpj=cnpj, celular=celular, status=0, codigo=codigo)

        for key, value in user.__dict__.items():
            print(key, value)

        db.session.add(user)
        db.session.commit()   

        Twilio.send_code(codigo)

        return UserDomain.to_dict(user.name, user.email, user.cnpj, user.celular, user.status, user.codigo)


    @staticmethod
    def activate_user(email, senha, codigo):
        # Busca o usuário no banco pelo e-mail
        user = User.query.filter_by(email=email).first()

        # Verifica se o usuário existe
        if not user:
            return {"success": False, "message": "Usuário não encontrado. Verifique o e-mail e tente novamente.", "status_code": 404}

        # Verifica se a senha está correta
        senha_valida = bcrypt.checkpw(senha.encode('utf-8'), user.senha)
        if not senha_valida:
            return {"success": False, "message": "Senha inválida", "status_code": 401}

        # Verifica se o código de ativação está correto
        if str(user.codigo) != str(codigo):
            return {"success": False, "message": "Código de ativação inválido", "status_code": 400}

        # Verifica se o usuário já está ativo
        if user.status == 1:
            return {"success": False, "message": "Usuário já está ativo", "status_code": 409}

        # Ativa o usuário (status 0 -> 1)
        user.status = 1
        db.session.commit()

        return {
            "success": True,
            "message": "Usuário ativado com sucesso",
            "usuario": UserDomain.to_dict(user.name, user.email, user.cnpj, user.celular, user.status, user.codigo)
        }