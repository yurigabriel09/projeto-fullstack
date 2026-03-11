from twilio.rest import Client

account_sid = 'AC8b21e5601f64f5cccbd1589d46c25ea9'
auth_token = '7812014608a2e41315b6856a05950ce5'
client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp:+14155238886',
  content_sid='HXb5b62575e6e4ff6129ad7c8efe1f983e',
  content_variables='{"1":"12/1","2":"3pm"}',
  to='whatsapp:+5511993081879'
)

print(message.sid)