class UserDomain:
    def __init__(self, id, nome, email, senha, cnpj, celular, status, codigo):
        self.id = id
        self.nome = nome
        self.email = email
        self.cnpj = cnpj
        self.celular = celular
        self.senha = senha
        self.status = status
        self.codigo = codigo
    
    def to_dict_create(nome, email, cnpj, celular, status, codigo):

        return {
            "nome": nome,
            "email": email,
            "cnpj": cnpj,
            "celular": celular,
            "status": status,
            "codigo": codigo
        }
    
    def to_dict_activate(nome, email, status):

        return {
            "nome": nome,
            "email": email,
            "status": status
        }
    
    def to_dict_login(nome, email):

        return {
            "nome": nome,
            "email": email
        }
