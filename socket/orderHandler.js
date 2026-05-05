export const orderHandler = (io, socket) => {
console.log("Order handler connected",socket.id)
//emit -> trigger-> on -> listen

//place order -> 
socket.on("placeOrder", async(data,callback)=>{
try{
    console.log(`placed orider from ${socket.id} ` )
    const vlaidation= validateOrder(data)
    if(!validation.valid){
        return callback({success:false , message:validation.error.details[0].message})
    }
const totals = calculateTotals(data.items)
const orderId=generateOrderId()
const order=createOrderDocument(data,orderId,totals)
const ordersCollection=getCollection("orders")
const result = await ordersCollection.insertOne(order)
socket.join(`order-${orderId}`)
socket.join(`customers`)
io.to(`admins`).emit("neworder",{order})

return callback({success:true ,message:"Order placed successfully",orderId,order })
}catch(error){
    console.log(error)
    return callback({success:false , message:"Failed to place order"})
}
})
}