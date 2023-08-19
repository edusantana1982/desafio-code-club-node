const express = require('express')
const uuid = require('uuid')
const port = 3001 //inserimos essa variavel para que lancemos a porta de forma automatica

const server = express()//como nome dessa variavel é comum app ou server aqui usamos server
server.use(express.json()) //precisamos informar como será enviado os dados, qual padrao.

const orders = []

//para verificar se existe o pedido

const checkOrderId = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({error: "User not found"})
    }
    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMetUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}



server.get('/order', checkMetUrl, (request, response)=>{
    //console.log(request.method)
    //console.log(request.url)
    /*const name = request.query.name 
    const age = request.query.age//para economizar codigo podemos fazer conforme a seguir*/
    //const {name, age} = request.query

    /*return response.json({name:name, age:age}) //quando temos o mesmo noma da chave e o valor podemos omitir o valor o javascript entende.*/
    //return respeonse.json({name, age})
    return response.json(orders)
})



server.post('/order', checkMetUrl, (request, response) => {
    const {orde, clientName, price, status} = request.body //a desitruturação pega os dados enviados pelo json.

    const order = {id:uuid.v4(), orde, clientName, price, status} 
    
    orders.push(order)

    return response.status(201).json(order)
  })

  server.get('/order/:id', checkMetUrl, checkOrderId,  (request, response)=>{
    //const {id} = request.params
    const index = request.orderIndex
    const id = request.orderId

    //const index = orders.findIndex(order => order.id === id)

    //console.log(index)

    /*if (index <0 ){
        return response.status(404).json({message: "Order not found"})
    }*/

    return response.status(201).json(orders[index])
})

  server.put('/order/:id', checkMetUrl, checkOrderId, (request, response) => {
    //const {id} = request.params
    const {orde, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, orde, clientName, price, status}

    //const index = orders.findIndex(order => order.id === id)

    //console.log(index)

    /*if (index < 0){
        return response.status(404).json({message:"Order not found"})
    }*/
    orders[index] = updateOrder

    return response.json(updateOrder)
  })

  server.patch('/order/:id', checkMetUrl, checkOrderId, (request, response) => {
    //const {id} = request.params
    const {orde, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateStatus = {id, orde:orders[index].orde, clientName:orders[index].clientName, price:orders[index].price, status:"Pronto"}

    //console.log(updateStatus)
    
    //const index = orders.findIndex(order => order.id === id)

    /*if (index < 0) {
        return response.status(404).json({message:"Order not found"})
    }*/
    
    orders[index] = updateStatus
  
    return response.json(updateStatus)

  })

  server.delete('/order/:id', checkMetUrl, checkOrderId, (request, response) => {
    //const {id} = request.params
    //const {orde, clientName, price, status} = request.body
    const index = request.orderIndex
    //const index = orders.findIndex(order => order.id === id)
    //console.log(index)
    /*if (index < 0) {
        return response.status(404).json({message:"User not found"})
    }*/
    orders.splice(index, 1)

    return response.status(204).json({message:"Order deleted!"})

  })

server.listen(port, () => {
    console.log(`Server start on port ${port}`)
}) /*para que possamos acessar a nossa aplicação atraves desta porta, ele aceita um segundo parametro para que possamos sinalizar que a nossa rota esta ativa no nodemon.*/