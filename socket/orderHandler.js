const orderHandler = (io, socket) => {
console.log("Order handler connected",socket.id)
//emit -> trigger-> on -> listen

//place order -> 
socket.on("placeOrder", async(data,callback)=>{
try{
    console.log(`placed orider from ${socket.id} ` )
    const vlaidation= validateOrder(data)
    if(validation.error){
        return callback({success:false , message:validation.error.details[0].message})
    }
}catch(error){
    console.log(error)
}
})
}