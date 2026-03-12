from src.Domain.user import UserDomain
from src.Infrastructure.Model.user import User
from src.Infrastructure.http.whats_app import Twilio
from src.config.data_base import db 

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
