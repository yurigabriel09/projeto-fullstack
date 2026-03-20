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
    
    def to_dict_create(name, email, cnpj, celular, status, codigo):

        return {
            "name": name,
            "email": email,
            "cnpj": cnpj,
            "celular": celular,
            "status": status,
            "codigo": codigo
        }
    
    def to_dict_activate(name, email, status):

        return {
            "name": name,
            "email": email,
            "status": status
        }
    
    def to_dict_login(name, email):

        return {
            "name": name,
            "email": email
        }
