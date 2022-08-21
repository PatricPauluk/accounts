// modulos externos "npm install chalk inquirer"
const chalk = require('chalk')
const inquirer = require('inquirer')

// modulos internos
const fs = require('fs')

operation() 

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [  'Criar conta',
                        'Consultar saldo',
                        'Depositar',
                        'Sacar',
                        'Sair',
            ],
        },
    ]).then((answer) => {

        const action = answer['action']

        if (action === 'Criar conta') {
            createAccount()
        } else if (action === 'Consultar saldo') {

        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Sacar') {

        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }

    }).catch((err) => console.log(err))
}

// create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}
function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        // cria a pasta accounts se não existir
        if(!fs.existsSync('accounts')) { 
            fs.mkdirSync('accounts')
        }

        // verifica se o nome esta vazio
        if(accountName === ''){ 
            console.log(chalk.bgRed.black('Por favor, forneça um nome valido!'))
            buildAccount()
            return
        }

        // verifica se já existe uma conta com o nome informado
        if(fs.existsSync(`accounts/${accountName}.json`)) { 
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        // cria a conta com saldo 0 como um arquivo .json
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) { 
            console.log(err)
        })

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()
    }).catch(err => console.log(err))
}

// add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        // verify if account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar',
            },
        ]).then((answer) => {
            const amount = answer['amount']

            // add an amount
            addAmount(accountName, amount)
            operation()

        }).catch(err => console.log(err))

    })
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const account = getAccount(accountName)
    console.log(account)
}

// busca a conta
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r', // read (leitura)
    })

    return JSON.parse(accountJSON) // converte o arquivo em json novamente
}