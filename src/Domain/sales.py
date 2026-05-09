class SalesDomain:
    def __init__(self, id_venda, id_seller, id_produto, quantidade, valor, data_venda):
        self.id_venda = id_venda
        self.id_seller = id_seller
        self.id_produto = id_produto
        self.quantidade = quantidade
        self.valor = valor
        self.data_venda = data_venda


    def to_dict_list(id_venda, nome_produto, foto_produto, quantidade, valor, data_venda):
        return {
            "id_venda": id_venda,
            "nome_produto": nome_produto,
            "foto_produto": foto_produto,
            "quantidade": quantidade,
            "valor": valor,
            "data_venda": data_venda.strftime("%d/%m/%Y %H:%M")
        }


    def to_dict_detail(id_venda, nome_produto, foto_produto, quantidade, valor, preco_unitario, data_venda):
        return {
            "id_venda": id_venda,
            "nome_produto": nome_produto,
            "foto_produto": foto_produto,
            "quantidade": quantidade,
            "valor": valor,
            "preco_unitario": preco_unitario,
            "data_venda": data_venda.strftime("%d/%m/%Y %H:%M")
        }