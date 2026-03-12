from twilio.rest import Client

# Criar uma conta no Twilio e preencher os campos em branco: account_sid, auth_token, content_sid e numero do whatsapp

class Twilio:

    @staticmethod
    def send_code(codigo):
        account_sid = 'AC8b21e5601f64f5cccbd1589d46c25ea9'
        auth_token = 'd166f486520c3f839092d76534093e90'
        client = Client(account_sid, auth_token)

        message = client.messages.create(
        from_='whatsapp:+14155238886',
        content_sid='HX229f5a04fd0510ce1b071852155d3e75',
        content_variables=f'{{"1":"{codigo}"}}',
        to='whatsapp:+5511993081879'
        )

        print(message.sid)