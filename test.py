import bcrypt

senha = '12345'
senha_bytes = senha.encode('utf-8')

print(f'A senha em bytes é: {senha_bytes}')

hash = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())

print(f'O hash gerado foi: {hash}')

if bcrypt.checkpw(senha_bytes, hash):
    print('A senha é válida')
else:
    print('A senha é inválida')