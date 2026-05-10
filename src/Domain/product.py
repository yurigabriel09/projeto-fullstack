class ProductDomain:
    def __init__(self, id, id_seller, nome, marca, preco, quantidade, foto, data_cadastro, status):
        self.id = id
        self.id_seller = id_seller
        self.nome = nome
        self.marca = marca
        self.preco = preco
        self.quantidade = quantidade
        self.foto = foto
        self.data_cadastro = data_cadastro
        self.status = status

    def to_dict_create(nome, marca, preco, quantidade, categoria, descricao, foto, data_cadastro, status):
        return {
            "nome": nome,
            "marca": marca,
            "preco": preco,
            "quantidade": quantidade,
            "categoria": categoria,
            "descricao": descricao,
            "foto": foto,
            "data_cadastro": data_cadastro,
            "status": status
        }
    
    def to_dict_edit(nome, marca, preco, quantidade, foto):
        return {
            "nome": nome,
            "marca": marca,
            "preco": preco,
            "quantidade": quantidade,
            "foto": foto
        }