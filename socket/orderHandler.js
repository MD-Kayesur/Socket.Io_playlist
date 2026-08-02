import { getCollection } from '../config/database.js';
import { 
    validateOrder, 
    generateOrderId, 
    calculateTotals, 
    createOrderDocument 
} from '../utils/helper.js';

export const orderHandler = (io, socket) => {
    console.log("Order handler connected", socket.id);

    // Place Order
    socket.on("placeOrder", async (data, callback) => {
        try {
            console.log(`Placed order from ${socket.id}`);
            const validation = validateOrder(data);
            if (!validation.valid) {
                return callback({ success: false, message: validation.message });
            }
            const totals = calculateTotals(data.items);
            const orderId = generateOrderId();
            const order = createOrderDocument(data, orderId, totals);
            const ordersCollection = getCollection("orders");
            const result = await ordersCollection.insertOne(order);
            
            socket.join(`order-${orderId}`);
            socket.join(`customers`);
            io.to(`admins`).emit("neworder", { order });

return callback({success:true ,message:"Order placed successfully",orderId,order })
}catch(error){
    console.log(error)
    return callback({success:false , message:"Failed to place order"})
}
})


socket.on("trackOrder",async(data ,callback)=>{
    try{
        const {orderId}=data
        const ordersCollection=getCollection("orders")
        const order=await ordersCollection.findOne({orderId})
        if(!order){
            return callback({success:false , message:"Order not found"})
        }
        socket.join(`order-${orderId}`)
        return callback({success:true ,message:"Order tracked successfully",order })
    }catch(error){
        console.log(error)
        return callback({success:false , message:"Failed to track order"})
    }

    socket.on("cancelOrder" ,async(data,callback)=>{
        try{
            const {orderId} = data
            const ordersCollection=getCollection("orders")
            const order=await ordersCollection.findOne({orderId})
            if(!order){
                return callback({success:false , message:"Order not found"})
            }
            if (!['pending','confirmed'].includes(order.status)) {
                return callback({success:false , message:"Order cannot be cancelled because order is in "+order.status})
            }
            await ordersCollection.updateOne({orderId},{$set:{status:"cancelled", updatedAta:new Date()}})
            io.to(`order-${orderId}`).emit("orderStatusUpdated",{orderId,status:"cancelled"})
            return callback({success:true ,message:"Order cancelled successfully"})
        }catch(error){
            console.log(error)
            return callback({success:false , message:"Failed to cancel order"})
        }
    })
})




//admin event
socket.on("adminOrder", async(data,callback)=>{
    try{
        const {orderId,action}=data
        const ordersCollection=getCollection("orders")
        const order=await ordersCollection.findOne({orderId})
        if(!order){
            return callback({success:false , message:"Order not found"})
        }
        if(action==="confirm"){
            await ordersCollection.updateOne({orderId},{$set:{status:"confirmed", updatedAta:new Date()}})
            io.to(`order-${orderId}`).emit("orderStatusUpdated",{orderId,status:"confirmed"})
            return callback({success:true ,message:"Order confirmed successfully"})
        }
    }catch(error){
        console.log(error)
        return callback({success:false , message:"Failed to confirm order"})
    }
})

//admin login

socket.on("adminLogin",(data,callback)=>{
    const {username,password}=data
    if(username===process.env.ADMIN_USERNAME && password===process.env.ADMIN_PASSWORD){
        socket.join(`admins`)
        return callback({success:true ,message:"Admin logged in successfully"})
    }
    return callback({success:false , message:"Invalid admin credentials"})
})

}
