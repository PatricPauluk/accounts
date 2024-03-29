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
            getAccountBalance()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Sacar') {
            withdraw()
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
            return operation()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar? (em R$)',
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
        console.log(chalk.bgRed.black('Esta conta não existe.'))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) { // verifica se o campo de deposito esta vazio
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente.'))
        return
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) // soma o valor informado + o valor na conta

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), // acrescenta o valor na conta
    function (err) {
        console.log(err)
    })

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

// busca a conta
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r', // read (leitura)
    })

    return JSON.parse(accountJSON) // converte o arquivo em json novamente
}

// show account balance
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ]).then((answer) => {
        
        const accountName = answer['accountName']

        // verify if account exists
        if (!checkAccount(accountName)) {
            return operation()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance}`))
        operation()

    }).catch(err => console.log(err))
}

// withdraw an amount from user account
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return operation()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {

            const amount = answer['amount']
            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

// remove amount from account
function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente.'))
        return withdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível.'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData),
    function (err) {
        console.log(err)
    })

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta.`))
    operation()
}