class UserDomain:
    def __init__(self, id, name, email, senha, cnpj, celular, status):
        self.id = id
        self.name = name
        self.email = email
        self.cnpj = cnpj
        self.celular = celular
        self.senha = senha
        self.status = status
    
    def to_dict(id, name, email, senha, cnpj, celular, status):

        return {
            "id": id,
            "name": name,
            "email": email,
            "cnpj": cnpj,
            "celular": celular,
            "status": status          
        }
