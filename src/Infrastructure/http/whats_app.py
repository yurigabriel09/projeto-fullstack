from twilio.rest import Client

# Criar uma conta no Twilio e preencher os campos em branco: account_sid, auth_token, content_sid e numero do whatsapp

account_sid = ''
auth_token = ''
client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp:+14155238886',
  content_sid='',
  content_variables='{"1":"12/1","2":"3pm"}',
  to='whatsapp:'
)

print(message.sid)