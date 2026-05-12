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
    
    @staticmethod
    def pode_vender(status, quantidade_pedida, quantidade_estoque):
        if status != 1:
            raise ValueError("Produto inativo não pode ser vendido.")
        if quantidade_pedida > quantidade_estoque:
            raise ValueError("Quantidade pedida maior que o estoque disponível.")
        
    
    @staticmethod
    def pode_inativar(status):
        if status == 0:
            raise ValueError("Produto já está inativo!")