from src.Domain.user import UserDomain
from src.Infrastructure.Model.user import User
from src.config.data_base import db 

class UserService:
    @staticmethod
    def create_user(name, email, senha, cnpj, celular):
        user = User(name=name, email=email, senha=senha, cnpj=cnpj, celular=celular, status=0)      

        for key, value in user.__dict__.items():
            print(key, value)

        db.session.add(user)
        db.session.commit()   

        return UserDomain.to_dict(user.id, user.name, user.email, user.senha, user.cnpj, user.celular, user.status)
