class UserDomain:
    def __init__(self, id, name, email, senha, cnpj, celular, status, codigo):
        self.id = id
        self.name = name
        self.email = email
        self.cnpj = cnpj
        self.celular = celular
        self.senha = senha
        self.status = status
        self.codigo = codigo
    
    def to_dict(name, email, cnpj, celular, status):

        return {
            "name": name,
            "email": email,
            "cnpj": cnpj,
            "celular": celular,
            "status": status          
        }
