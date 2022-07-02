# Teste Ewally

O teste consiste em gerar uma API que seja responsável por validar um código de barras, seja ele pagamento de boletos bancários ou contas de consumo

# Instruções

# Executando a API localmente

Antes de executar a API, você precisa configurar o arquivo .env. Use o exemplo disponível, fornecido neste projeto, para criar o seu.

Você pode copiá-lo executando o seguinte comando no diretório raiz deste projeto:

`$ cp .env.example .env`

Depois de concluir, você precisará definir as chaves no seu arquivo .env

Agora instalar todas as dependências necessárias listadas no arquivo package.json pelo comando 

`$ npm i`

Depois de concluir as etapas. Você estará pronto para começar a usar a API. Inicie o aplicativo executando o seguinte comando:

`$ npm start`

Caso deseje executar os testes automatizados utilizar o comando:

`$ npm test`

Caso deseje utilizar o serviço via biblioteca **nodemon** utilizar comando:

`$ npm run dev`

_A API usa a porta 3333 como padrão, podendo ser alterada nas variáveis de ambiente._

# Executando a API localmente com Docker

Antes de executar a API, você precisa configurar o arquivo .env. Use o exemplo disponível, fornecido neste projeto, para criar o seu.

Você pode copiá-lo executando o seguinte comando no diretório raiz deste projeto:

`$ cp .env.example .env`

OBS: É necessario ter intalado o docker e o docker-compose na maquina.

Apos isso, executar o comando:

`$ docker-compose up`

# </br>Acesso a API em produção
Para acessar, realizar uma requisição do tipo GET conforme abaixo, onde o código de barras é representado pela variável {Codigo_De_Barras}:</br>

>`GET/ https://ewally-barcode.herokuapp.com/boleto/{Codigo_De_Barras}'`

##  Requisição 
A API aceitara quaisquer sequência numérica que tenha 47 ou 48 posições. Não sera desconsiderado qualquer outro caractere fora do intervalo de 0 a 9.
>São considerador codigo de barras validos: </br>
>00190500954014481606906809350314337370000000100 </br>
>00190 5009-5 40144.81606-9 06809.35031-4 3 37370000000100


## Resposta
A API retorna os seguintes Status:
### Sucesso
> Em caso de sucesso, será enviado o **STATUS** igual a **200**, junto com um body contendo os dados do boleto. Exemplo:</br>
> `{  "barCode": "10491900700000091460161330000100040494643800",  "amount": "91.46",  expirationDate": "2022-06-05"	}`
> * Barcode: Retorna um sequencia de 44 caracteres
> * Amount: Retorna o valor do boleto, no caso de código de barras sem valor o retorno será "0.00"
> * ExpirationDate: Retorna a data do vencimento no padrão aaaa-mm-dd, caso nao possua data de vencimento o valor null

### Erro
> Em caso de Erro, será enviado o **STATUS** igual a **400** ou **500**,  junto a uma mensagem com mais informações.  
> * **Status - 500** :  Caso tenha algum erro interno será retornado uma 'message' no body </br>
> Exemplo: `{  "message": {Mensagem de erro aqui}	}`
> * **Status - 400** :  Caso tenha algum erro na validação do código de barras, será retornado uma 'message' no body</br>
> Exemplo: `{  "message": "Err-10DV: O digito verificador apresenta erro na validação \n"`}


## </br> Código de Erros 
Sempre que a API retornar um erro de status 400, a 'message'  terá um ou mais códigos de erros concatenados, junto com uma frase do local onde esta o erro.

### </br> Lista de código de erros:

|Código de Erro| Mensagem     								        |Motivo do Erro	  			    |
|--------------|----------------------------------------------------|-------------------------------|
|Err-101  |A primeira parte do seu código apresenta erro na validação | Digito de validação invalido  | 
|Err-102  |A segunda parte do seu código apresenta erro na validação 	| Digito de validação invalido  |
|Err-103  |A terceira parte do seu código apresenta erro na validação | Digito de validação invalido  |
|Err-104  |A quarta parte do seu código apresenta erro na validação 	| Digito de validação invalido  |
|Err-10DV |O digito verificador apresenta erro na validação 	        | Digito de validação invalido  |
|Err-101.2|A primeira parte do seu código apresenta erro na validação 	| Campo 2 só pode ser de 1 a 9   |
|Err-101.3|A primeira parte do seu código apresenta erro na validação 	| Campo 3 só pode ser de 6 a 9  |

> Obs: Os códigos podem vir concatenados  como o exemplo abaixo.</br>
`{  "message": "Err-103: A terceira parte do seu código apresenta erro na validação \nErr-10DV: O digito verificador apresenta erro na validação \n"}`

Autor: Moises Darlison </br>
Email: moisesdarlison91@gmail.com
